// Packages
import Swal from "sweetalert2";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Copy,
  Loader2,
  Users,
} from "lucide-react";

// File path
import useAxios from "../../../Hooks/useAxios";

// ====== Step Configuration ======
const steps = [
  { number: 1, title: "Client Details", subtitle: "Basic information" },
  { number: 2, title: "Assign Team", subtitle: "Select members" },
  { number: 3, title: "Review", subtitle: "Verify details" },
  { number: 4, title: "Success", subtitle: "Client added" },
];

// ====== Mock Team Members (replace with API later) ======
const teamMembers = [
  {
    name: "Sobur Hossen",
    projectRole: "Lead Developer",
    companyPosition: "Chief Operating Officer",
  },
  {
    name: "Md. Nafis fuad Abir",
    projectRole: "Project Manager",
    companyPosition: "Chief Executive Officer",
  },
  {
    name: "Aminul Islam",
    projectRole: "Video Editor",
    companyPosition: "Co-Founder",
  },
  {
    name: "Alif Shahriar Jihad",
    projectRole: "UI/UX Designer",
    companyPosition: "UI UX Designer",
  },
  {
    name: "Marufur Rahman",
    projectRole: "Operations",
    companyPosition: "Operations Manager",
  },
];

// ====== Main Component ======
const AddClientModal = ({ onClose }) => {
  const { api } = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({ mode: "onChange" });

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // eslint-disable-next-line react-hooks/incompatible-library
  const formData = watch();

  // ====== Mutation – POST ======
  const mutation = useMutation({
    mutationFn: async (finalData) => {
      const res = await api.post("/admin-api/add-client", finalData);
      return res.data.clientCode;
    },
    onSuccess: (code) => {
      setGeneratedCode(code);
      setCompletedSteps((prev) => new Set([...prev, 3, 4]));
      setCurrentStep(4);
    },
    onError: (error) => {
      console.error("Failed to add client:", error);
    },
  });

  // ====== Navigation ======
  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step) => {
    if (completedSteps.has(step) && step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handleAddClient = () => {
    handleSubmit(onSubmit)();
  };

  // ====== Team Selection ======
  const toggleTeamMember = (index) => {
    setSelectedTeam((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  // ====== Form Submission ======
  const onSubmit = (data) => {
    if (selectedTeam.length === 0) {
      Swal.fire({
        title: "Team Required",
        text: "Please select at least one team member for this project.",
        icon: "warning",
        confirmButtonText: "Got it",
        background: "var(--color-toiral-bg-light)",
        color: "var(--color-toiral-dark)",
        confirmButtonColor: "var(--color-toiral-primary)",
        customClass: { popup: "rounded-2xl" },
      });
      return;
    }

    const finalData = {
      ...data,
      assignedTeam: selectedTeam.map((i) => teamMembers[i]),
    };

    mutation.mutate(finalData);
  };

  // ====== Copy Code ======
  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopySuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000); // Small delay to let user see "Copied!"__
    }
  };

  const isSubmitting = mutation.isPending;

  return (
    // FULL SCREEN on mobile, ROUNDED MODAL on desktop
    <div className="bg-white w-full max-h-[83vh] md:h-auto md:max-h-[80vh] md:max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="shrink-0 bg-white z-10 flex justify-between items-center p-5 md:p-6 border-b border-toiral-bg">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-toiral-dark leading-tight">
            Add New Client
          </h2>
          <p className="text-sm md:text-base text-toiral-secondary mt-1">
            Provide details and assign a team.
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="p-2.5 bg-toiral-bg-light hover:bg-toiral-bg text-toiral-secondary hover:text-toiral-primary rounded-xl transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* Responsive Step Indicator */}
      <div className="shrink-0 px-5 pt-5 md:px-8 md:pt-6 bg-white">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Form Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 md:px-8 md:pb-6 custom-scrollbar">
        <form id="add-client-form" className="h-full pt-4 md:pt-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <ClientDetailsStep
                key="step1"
                register={register}
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <AssignTeamStep
                key="step2"
                teamMembers={teamMembers}
                selectedTeam={selectedTeam}
                onToggle={toggleTeamMember}
              />
            )}
            {currentStep === 3 && (
              <ReviewStep
                key="step3"
                formData={formData}
                selectedTeam={selectedTeam}
                teamMembers={teamMembers}
              />
            )}
            {currentStep === 4 && (
              <SuccessStep
                key="step4"
                generatedCode={generatedCode}
                onClose={onClose}
                onCopy={copyToClipboard}
                copySuccess={copySuccess}
              />
            )}
          </AnimatePresence>

          {/* Mutation Error */}
          {currentStep === 3 && mutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-600 text-sm font-medium">
                {mutation.error?.response?.data?.message ||
                  mutation.error?.message ||
                  "Failed to add client. Please try again."}
              </p>
            </motion.div>
          )}
        </form>
      </div>

      {/* Sticky Navigation Footer */}
      {currentStep < 4 && (
        <div className="shrink-0 bg-white border-t border-toiral-bg p-4 md:p-6 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col-reverse md:flex-row md:justify-between items-stretch md:items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full md:w-auto px-6 py-3 border-2 border-toiral-bg text-toiral-secondary hover:text-toiral-dark hover:bg-toiral-bg-light font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 text-base"
            >
              Cancel
            </button>

            <div className="flex flex-col md:flex-row justify-between md:justify-end gap-3 w-full md:w-auto">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-toiral-dark bg-toiral-bg-light hover:bg-toiral-bg font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 text-base"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-toiral-primary/20 text-base"
                >
                  Next Step
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddClient}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-toiral-primary/20 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      Confirm & Add
                      <Check size={20} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ====== Sub-Components ======

const StepIndicator = ({ steps, currentStep, completedSteps, onStepClick }) => (
  <>
    {/* MOBILE COMPACT VIEW */}
    <div className="md:hidden flex items-center gap-4 bg-toiral-bg-light p-4 rounded-xl border border-toiral-bg">
      <div className="flex-1">
        <p className="text-xs text-toiral-secondary font-bold uppercase tracking-wider mb-1">
          Step {currentStep} of {steps.length}
        </p>
        <p className="text-base font-bold text-toiral-dark leading-none">
          {steps[currentStep - 1].title}
        </p>
      </div>
      <div className="w-12 h-12 rounded-full border-4 border-white bg-toiral-primary flex items-center justify-center shadow-sm">
        <span className="text-white font-bold">{currentStep}</span>
      </div>
    </div>

    {/* DESKTOP FULL VIEW */}
    <div className="hidden md:flex items-center justify-between relative">
      <div className="absolute left-0 top-6 w-full h-1 bg-toiral-bg -z-10 rounded-full"></div>
      {steps.map((step) => {
        const isCompleted = completedSteps.has(step.number);
        const isCurrent = currentStep === step.number;
        const isClickable = isCompleted && step.number < currentStep;

        return (
          <div
            key={step.number}
            className="flex flex-col items-center bg-white px-2"
          >
            <div
              onClick={() => isClickable && onStepClick(step.number)}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-all text-base shadow-sm ${
                isClickable
                  ? "cursor-pointer hover:scale-105"
                  : "cursor-default"
              } ${
                isCompleted
                  ? "bg-toiral-primary text-white"
                  : isCurrent
                    ? "bg-toiral-dark text-white shadow-md shadow-toiral-dark/20"
                    : "bg-toiral-bg text-toiral-secondary"
              }`}
            >
              {isCompleted ? (
                <Check size={20} strokeWidth={3} />
              ) : (
                <span className="font-bold">{step.number}</span>
              )}
            </div>
            <p
              className={`text-base mt-3 text-center transition-colors ${isCompleted || isCurrent ? "text-toiral-dark font-bold" : "text-toiral-secondary font-medium"}`}
            >
              {step.title}
            </p>
            <p className="text-xs text-toiral-secondary mt-0.5">
              {step.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  </>
);

const ClientDetailsStep = ({ register, errors }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="space-y-5"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pb-3">
      {/* Input Group Template */}
      {[
        {
          id: "clientName",
          label: "Client Name",
          type: "text",
          placeholder: "e.g., John Doe",
          req: "Client name is required",
        },
        {
          id: "companyName",
          label: "Company Name",
          type: "text",
          placeholder: "e.g., Acme Inc.",
          req: "Company name is required",
        },
        {
          id: "email",
          label: "Email Address",
          type: "email",
          placeholder: "john@example.com",
          req: "Email is required",
          pattern: /^\S+@\S+$/i,
        },
        {
          id: "phone",
          label: "Phone Number",
          type: "tel",
          placeholder: "+880 13456-78900",
          req: "Phone number is required",
        },
        {
          id: "projectName",
          label: "Project Name",
          type: "text",
          placeholder: "e.g., Website Redesign",
          req: "Project name is required",
        },
      ].map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-bold text-toiral-dark mb-2">
            {field.label} <span className="text-red-400">*</span>
          </label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.id, {
              required: field.req,
              ...(field.pattern && {
                pattern: { value: field.pattern, message: "Invalid format" },
              }),
            })}
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-all placeholder:text-toiral-secondary/70 ${
              errors[field.id]
                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50"
                : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary focus:ring-4 focus:ring-toiral-primary/10 bg-white"
            }`}
          />
          {errors[field.id] && (
            <p className="text-red-400 text-xs font-semibold mt-1.5 ml-1">
              {errors[field.id].message}
            </p>
          )}
        </div>
      ))}

      {/* Select Field */}
      <div>
        <label className="block text-sm font-bold text-toiral-dark mb-2">
          Project Status <span className="text-red-400">*</span>
        </label>
        <select
          {...register("status", { required: "Status is required" })}
          className={`w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-all cursor-pointer ${
            errors.status
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50"
              : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary focus:ring-4 focus:ring-toiral-primary/10 bg-white"
          }`}
        >
          <option value="">Select status</option>
          <option value="Pending">Pending</option>
          <option value="On progress">On progress</option>
          <option value="Stop">Stop</option>
          <option value="Complete">Complete</option>
        </select>
        {errors.status && (
          <p className="text-red-400 text-xs font-semibold mt-1.5 ml-1">
            {errors.status.message}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

const AssignTeamStep = ({ teamMembers, selectedTeam, onToggle }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-bold text-toiral-secondary">
        Select team members to assign:
      </p>
      <span className="text-xs font-bold bg-toiral-bg-light text-toiral-primary px-3 py-1 rounded-full">
        {selectedTeam.length} Selected
      </span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {teamMembers.map((member, index) => {
        const isSelected = selectedTeam.includes(index);
        return (
          <div
            key={index}
            onClick={() => onToggle(index)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
              isSelected
                ? "border-toiral-primary bg-toiral-bg-light shadow-sm"
                : "border-toiral-bg hover:border-toiral-light hover:bg-toiral-bg-light/30 bg-white"
            }`}
          >
            <div
              className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-toiral-primary text-white" : "bg-toiral-bg text-toiral-secondary"}`}
            >
              {isSelected ? (
                <Check size={20} strokeWidth={3} />
              ) : (
                <Users size={20} />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="font-bold text-toiral-dark text-base truncate">
                {member.name}
              </h4>
              <p className="text-sm text-toiral-primary font-medium truncate">
                {member.projectRole}
              </p>
              <p className="text-xs text-toiral-secondary truncate mt-0.5">
                {member.companyPosition}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </motion.div>
);

const ReviewStep = ({ formData, selectedTeam, teamMembers }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <div className="bg-toiral-bg-light rounded-2xl p-5 md:p-6 border border-toiral-bg">
      <h4 className="text-lg font-bold text-toiral-dark mb-4 border-b border-toiral-light pb-3">
        Client Overview
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
        {[
          { label: "Client Name", value: formData.clientName },
          { label: "Company", value: formData.companyName },
          { label: "Email", value: formData.email },
          { label: "Phone", value: formData.phone },
          { label: "Project", value: formData.projectName },
          { label: "Status", value: formData.status },
        ].map((item, i) => (
          <div key={i}>
            <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1">
              {item.label}
            </p>
            <p className="font-semibold text-toiral-dark text-base wrap-break-word">
              {item.value || "—"}
            </p>
          </div>
        ))}
      </div>

      <h4 className="text-lg font-bold text-toiral-dark mt-6 mb-4 border-b border-toiral-light pb-3">
        Assigned Team
      </h4>
      {selectedTeam.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedTeam.map((index) => (
            <span
              key={index}
              className="px-3.5 py-1.5 bg-white border border-toiral-light text-toiral-dark font-semibold rounded-xl text-sm shadow-sm flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-toiral-primary"></span>
              {teamMembers[index].name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm font-medium text-red-400 bg-red-50 p-3 rounded-xl border border-red-100">
          No team members assigned
        </p>
      )}
    </div>
  </motion.div>
);

const SuccessStep = ({ generatedCode, onClose, onCopy, copySuccess }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="text-center py-6 md:py-10 flex flex-col items-center"
  >
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
        <Check size={36} strokeWidth={3} className="text-white" />
      </div>
    </div>
    <h3 className="text-2xl md:text-3xl font-bold text-toiral-dark">
      Success!
    </h3>
    <p className="text-base text-toiral-secondary mt-2 max-w-sm">
      Client has been securely added to the system and is ready to go.
    </p>

    <div className="bg-toiral-bg-light p-5 md:p-6 rounded-2xl w-full max-w-sm mt-8 border-2 border-toiral-bg relative group">
      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-2">
        Unique Access Code
      </p>
      <p className="text-2xl md:text-3xl font-mono text-toiral-primary font-bold tracking-widest bg-white py-3 rounded-xl border border-toiral-bg shadow-sm">
        {generatedCode}
      </p>
      <button
        onClick={onCopy}
        className="absolute top-4 right-4 p-2 bg-white border border-toiral-bg hover:border-toiral-primary hover:text-toiral-primary rounded-xl transition-all shadow-sm cursor-pointer"
        title="Copy code"
      >
        <Copy size={20} />
      </button>
      <AnimatePresence>
        {copySuccess && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-200"
          >
            Copied successfully!
          </motion.span>
        )}
      </AnimatePresence>
    </div>

    <button
      type="button"
      onClick={onClose}
      className="mt-12 w-full max-w-sm px-6 py-4 bg-toiral-dark hover:bg-toiral-primary text-white font-bold rounded-xl transition-colors cursor-pointer text-lg shadow-lg shadow-toiral-dark/20"
    >
      Return to Dashboard
    </button>
  </motion.div>
);

export default AddClientModal;
