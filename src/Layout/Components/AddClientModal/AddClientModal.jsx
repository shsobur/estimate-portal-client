import { useState } from "react";
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, X, Copy } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";

// ================== Step Configuration ==================
const steps = [
  { number: 1, title: "Client Details", subtitle: "Basic information" },
  { number: 2, title: "Assign Team", subtitle: "Select members" },
  { number: 3, title: "Review", subtitle: "Verify details" },
  { number: 4, title: "Success", subtitle: "Client added" },
];

// ================== Mock Team Members (replace with API later) ==================
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

// ================== Helper: Generate Unique Client Code ==================
const generateCode = () => {
  const digits = Math.floor(1000 + Math.random() * 9000);
  const letters =
    String.fromCharCode(97 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return `CL-${digits}${letters}`;
};

// ================== Main Component ==================
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

  // TanStack Query Mutation – handles POST + code generation + PATCH
  const mutation = useMutation({
    mutationFn: async (finalData) => {
      // 1. Create client
      const postResponse = await api.post("/admin-api/add-client", finalData);
      console.log(postResponse);
      const clientId = postResponse.data.result.insertedId;

      // 2. Get existing codes
      const codesResponse = await api.get("/admin-api/clients-codes");
      const existingCodes = codesResponse.data.map((item) => item.clientCode);

      // 3. Generate unique code
      let newCode;
      let attempts = 0;
      const maxAttempts = 10;
      do {
        newCode = generateCode();
        attempts++;
        if (attempts > maxAttempts) {
          throw new Error("Unable to generate unique client code.");
        }
      } while (existingCodes.includes(newCode));

      // 4. Update client with code
      await api.patch(`/admin-api/clients/${clientId}`, {
        clientCode: newCode,
      });

      return newCode;
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

  // ========== Navigation ==========
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

  // ========== Team Selection ==========
  const toggleTeamMember = (index) => {
    setSelectedTeam((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  // ========== Form Submission (now properly connected) ==========
  const onSubmit = (data) => {
    // Prevent submission without team
    if (selectedTeam.length === 0) {
      alert("Please select at least one team member.");
      return;
    }

    const finalData = {
      ...data,
      assignedTeam: selectedTeam.map((i) => teamMembers[i]),
    };

    mutation.mutate(finalData);
  };

  // ========== Copy Code ==========
  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const isSubmitting = mutation.isPending;

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 h-[80vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-toiral-light">
        <div>
          <h2 className="text-3xl font-bold text-toiral-dark">
            Add New Client
          </h2>
          <p className="text-base text-gray-600 mt-1">
            Provide client details and assign team members
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="p-2 hover:bg-toiral-bg rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-toiral-dark" />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="px-6 pt-6">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <form
          id="add-client-form"
          onSubmit={handleSubmit(onSubmit)}
          className="h-full"
        >
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

          {/* Mutation Error (shown only on review step) */}
          {currentStep === 3 && mutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                {mutation.error?.response?.data?.message ||
                  mutation.error?.message ||
                  "Failed to add client. Please try again."}
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Sticky Navigation – Button stays visually outside form but is connected via form attribute */}
      {currentStep < 4 && (
        <div className="sticky bottom-0 bg-white border-t border-toiral-light p-4 md:p-6">
          <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full md:w-auto px-6 py-3 border-2 border-toiral-primary text-toiral-primary hover:bg-toiral-primary hover:text-white font-medium rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <div className="flex justify-between md:justify-end gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-toiral-dark bg-toiral-bg hover:bg-toiral-light rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="add-client-form"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-35"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      Add Client
                      <ArrowRight className="w-5 h-5" />
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

// ================== Sub-Components (Clean & Reusable) ==================
const StepIndicator = ({ steps, currentStep, completedSteps, onStepClick }) => (
  <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 mb-8">
    {steps.map((step, index) => {
      const isCompleted = completedSteps.has(step.number);
      const isCurrent = currentStep === step.number;
      const isClickable = isCompleted && step.number < currentStep;

      return (
        <div key={step.number} className="flex items-center">
          <div
            onClick={() => isClickable && onStepClick(step.number)}
            className={`flex flex-col items-center ${isClickable ? "cursor-pointer" : "cursor-default"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all text-base ${
                isCompleted
                  ? "bg-toiral-primary border-toiral-primary text-white"
                  : isCurrent
                    ? "border-toiral-primary text-toiral-primary"
                    : "border-gray-300 text-gray-400"
              }`}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : step.number}
            </div>
            <p
              className={`text-sm mt-2 text-center ${
                isCompleted || isCurrent
                  ? "text-toiral-dark font-medium"
                  : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
            <p className="text-xs text-gray-500">{step.subtitle}</p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`hidden md:block w-12 h-0.5 mx-2 ${
                completedSteps.has(step.number + 1) ||
                (completedSteps.has(step.number) && currentStep > step.number)
                  ? "bg-toiral-primary"
                  : "bg-gray-200"
              }`}
            />
          )}
        </div>
      );
    })}
  </div>
);

const ClientDetailsStep = ({ register, errors }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="space-y-6"
  >
    <h3 className="text-xl font-semibold text-toiral-dark mb-4">
      Client Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* All input fields remain exactly the same – only cleaned up */}
      <div>
        <label className="block text-base font-medium text-toiral-dark mb-1">
          Client Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., John Doe"
          {...register("clientName", { required: "Client name is required" })}
          className={`w-full px-4 py-3 rounded-xl border text-base ${
            errors.clientName ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-toiral-primary/50 bg-white`}
        />
        {errors.clientName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.clientName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-base font-medium text-toiral-dark mb-1">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Acme Inc."
          {...register("companyName", { required: "Company name is required" })}
          className={`w-full px-4 py-3 rounded-xl border text-base ${
            errors.companyName ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-toiral-primary/50 bg-white`}
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-base font-medium text-toiral-dark mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="john@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
          })}
          className={`w-full px-4 py-3 rounded-xl border text-base ${
            errors.email ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-toiral-primary/50 bg-white`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-base font-medium text-toiral-dark mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder="+1 234 567 890"
          {...register("phone", { required: "Phone number is required" })}
          className={`w-full px-4 py-3 rounded-xl border text-base ${
            errors.phone ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-toiral-primary/50 bg-white`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-base font-medium text-toiral-dark mb-1">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Website Redesign"
          {...register("projectName", { required: "Project name is required" })}
          className={`w-full px-4 py-3 rounded-xl border text-base ${
            errors.projectName ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-toiral-primary/50 bg-white`}
        />
        {errors.projectName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.projectName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-base font-medium text-toiral-dark mb-1">
          Project Status <span className="text-red-500">*</span>
        </label>
        <select
          {...register("status", { required: "Status is required" })}
          className={`w-full px-4 py-3 rounded-xl border text-base ${
            errors.status ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-toiral-primary/50 bg-white`}
        >
          <option value="">Select status</option>
          <option value="Pending">Pending</option>
          <option value="On progress">On progress</option>
          <option value="Stop">Stop</option>
          <option value="Complete">Complete</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
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
    className="space-y-6"
  >
    <h3 className="text-xl font-semibold text-toiral-dark mb-4">Assign Team</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teamMembers.map((member, index) => {
        const isSelected = selectedTeam.includes(index);
        return (
          <div
            key={index}
            onClick={() => onToggle(index)}
            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? "border-toiral-primary bg-toiral-bg-light"
                : "border-gray-200 hover:border-toiral-primary/50 bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-toiral-dark text-base">
                  {member.name}
                </h4>
                <p className="text-sm text-toiral-primary">
                  {member.projectRole}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {member.companyPosition}
                </p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-toiral-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
    {selectedTeam.length === 0 && (
      <p className="text-sm text-gray-500 italic">
        No team members selected yet
      </p>
    )}
  </motion.div>
);

const ReviewStep = ({ formData, selectedTeam, teamMembers }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="space-y-6"
  >
    <h3 className="text-xl font-semibold text-toiral-dark mb-4">
      Review Details
    </h3>
    <div className="bg-toiral-bg-light rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Client Name</p>
          <p className="font-medium text-toiral-dark text-base">
            {formData.clientName || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Company Name</p>
          <p className="font-medium text-toiral-dark text-base">
            {formData.companyName || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-toiral-dark text-base">
            {formData.email || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium text-toiral-dark text-base">
            {formData.phone || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Project Name</p>
          <p className="font-medium text-toiral-dark text-base">
            {formData.projectName || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium text-toiral-dark text-base">
            {formData.status || "—"}
          </p>
        </div>
      </div>

      <div className="border-t border-toiral-light pt-4">
        <p className="text-sm text-gray-500 mb-2">Assigned Team</p>
        {selectedTeam.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedTeam.map((index) => (
              <span
                key={index}
                className="px-3 py-1 bg-toiral-primary/10 text-toiral-dark rounded-full text-sm"
              >
                {teamMembers[index].name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No team members assigned
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

const SuccessStep = ({ generatedCode, onClose, onCopy, copySuccess }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="text-center py-8 space-y-6"
  >
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
      <Check className="w-10 h-10 text-green-600" />
    </div>
    <h3 className="text-2xl font-bold text-toiral-dark">Congratulations!</h3>
    <p className="text-base text-gray-600">
      Client has been added successfully.
    </p>

    <div className="bg-toiral-bg-light p-6 rounded-xl max-w-sm mx-auto relative">
      <p className="text-sm text-gray-500 mb-2">Client Access Code</p>
      <p className="text-3xl font-mono text-toiral-primary font-bold tracking-wider">
        {generatedCode}
      </p>
      <button
        onClick={onCopy}
        className="absolute top-2 right-2 p-2 hover:bg-toiral-light rounded-full transition-colors cursor-pointer"
        title="Copy to clipboard"
      >
        <Copy className="w-5 h-5 text-toiral-dark" />
      </button>
      {copySuccess && (
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-600">
          Copied!
        </span>
      )}
    </div>

    <p className="text-sm text-gray-500">
      Share this code with the client for portal access.
    </p>

    <button
      type="button"
      onClick={onClose}
      className="mt-4 px-8 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors cursor-pointer"
    >
      Close
    </button>
  </motion.div>
);

export default AddClientModal;
