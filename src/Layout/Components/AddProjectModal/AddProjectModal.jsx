import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  Users,
  CheckSquare,
  Square,
} from "lucide-react";

// ====== Step Configuration ======
const steps = [
  { number: 1, title: "Verification" },
  { number: 2, title: "Project Info", },
  { number: 3, title: "Team" },
  { number: 4, title: "Review" },
  { number: 5, title: "Success" },
];

// ====== Static Team List (All 5 Members) ======
const allTeamMembers = [
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

// ====== Static Dummy Data ======
const dummyClients = [
  {
    _id: "69a6b09257b82cf0096c5086",
    clientName: "Abir Hosain",
    companyName: "Moiral",
    email: "abir@test.com",
    phone: "3453434534534",
    status: "Pending",
    clientCode: "CL-5612yd",
    assignedTeam: [
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
    ],
  },
  {
    _id: "69a7f7447d30b214071cd07f",
    clientName: "Amin",
    companyName: "Koiral",
    email: "amin@test.com",
    phone: "2342342343",
    status: "Complete",
    clientCode: "CL-4274ww",
    assignedTeam: [
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
        name: "Alif Shahriar Jihad",
        projectRole: "UI/UX Designer",
        companyPosition: "UI UX Designer",
      },
    ],
  },
];

// ====== Main Component ======
const AddProjectModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      assignedTeam: [],
    },
  });

  const formData = watch();

  // --- State Management ---
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Verification State
  const [codeInput, setCodeInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("idle");
  const [verifiedClient, setVerifiedClient] = useState(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ====== Step 1: Verification Logic ======
  const handleVerify = () => {
    if (codeInput.length !== 9) return;

    setIsVerifying(true);
    setVerificationStatus("idle");

    // Simulate API delay
    setTimeout(() => {
      const match = dummyClients.find((c) => c.clientCode === codeInput);

      if (match) {
        setVerifiedClient(match);
        setVerificationStatus("success");

        // Auto-fill form data including pre-assigned team
        setValue("clientName", match.clientName);
        setValue("companyName", match.companyName);
        setValue("email", match.email);
        setValue("phone", match.phone);
        setValue("status", match.status);
        setValue("assignedTeam", match.assignedTeam || []);
      } else {
        setVerifiedClient(null);
        setVerificationStatus("error");
      }
      setIsVerifying(false);
    }, 1200);
  };

  const handleCodeChange = (e) => {
    const val = e.target.value;
    if (val.length <= 9) {
      setCodeInput(val);
      if (verifiedClient) {
        setVerifiedClient(null);
        setVerificationStatus("idle");
      }
    }
  };

  // ====== Navigation ======
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!verifiedClient) return;
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await trigger();
      if (isValid) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(4);
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

  // ====== Form Submission ======
  const onSubmit = (data) => {
    setIsSubmitting(true);

    // Simulate API Post request
    setTimeout(() => {
      // THIS IS THE FINAL OBJECT YOU REQUESTED
      const finalProjectData = {
        ...data,
        clientCode: verifiedClient.clientCode,
      };
      console.log("Submitted Project Data:", finalProjectData);

      setIsSubmitting(false);
      setCompletedSteps((prev) => new Set([...prev, 4, 5]));
      setCurrentStep(5);
    }, 1500);
  };

  const handleAddProject = () => {
    handleSubmit(onSubmit)();
  };

  return (
    // FULL SCREEN on mobile, ROUNDED MODAL on desktop
    <div className="bg-white w-full h-dvh md:h-auto md:max-h-[84vh] md:max-w-4xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="shrink-0 bg-white z-10 flex justify-between items-center p-5 md:p-6 border-b border-toiral-bg">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-toiral-dark leading-tight">
            Add New Project
          </h2>
          <p className="text-sm md:text-base text-toiral-secondary mt-1">
            Verify client and set up project details.
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={isSubmitting || isVerifying}
          className="p-2.5 bg-toiral-bg-light hover:bg-toiral-bg text-toiral-secondary hover:text-toiral-primary rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* Responsive Step Indicator */}
      <div className="shrink-0 px-5 pt-3 md:px-8 md:pt-4 bg-white overflow-x-auto custom-scrollbar pb-2 md:pb-0">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Form Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 md:px-8 md:pb-6 custom-scrollbar">
        <form id="add-project-form" className="h-full pt-4 md:pt-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <VerificationStep
                key="step1"
                codeInput={codeInput}
                handleCodeChange={handleCodeChange}
                handleVerify={handleVerify}
                isVerifying={isVerifying}
                verificationStatus={verificationStatus}
                verifiedClient={verifiedClient}
              />
            )}

            {currentStep === 2 && (
              <ProjectInfoStep
                key="step2"
                register={register}
                errors={errors}
              />
            )}

            {currentStep === 3 && (
              <TeamStep key="step3" formData={formData} setValue={setValue} />
            )}

            {currentStep === 4 && (
              <ReviewStep
                key="step4"
                formData={formData}
                verifiedClient={verifiedClient}
              />
            )}

            {currentStep === 5 && <SuccessStep key="step5" onClose={onClose} />}
          </AnimatePresence>
        </form>
      </div>

      {/* Sticky Navigation Footer */}
      {currentStep < 5 && (
        <div className="shrink-0 bg-white border-t border-toiral-bg p-4 md:p-6 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col-reverse md:flex-row md:justify-between items-stretch md:items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isVerifying}
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

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    isSubmitting ||
                    isVerifying ||
                    (currentStep === 1 && !verifiedClient)
                  }
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-toiral-primary/20 text-base"
                >
                  Next Step
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddProject}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-toiral-primary/20 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      Add Project
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
    <div className="md:hidden flex items-center gap-4 bg-toiral-bg-light p-4 rounded-xl border border-toiral-bg min-w-max w-full">
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
    <div className="hidden md:flex items-center justify-between relative w-full">
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

const VerificationStep = ({
  codeInput,
  handleCodeChange,
  handleVerify,
  isVerifying,
  verificationStatus,
  verifiedClient,
}) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="max-w-xl mx-auto space-y-6 pt-4"
  >
    <div className="bg-toiral-bg-light border border-toiral-bg p-6 rounded-2xl flex gap-4 items-start">
      <div className="bg-white p-3 rounded-full border border-toiral-bg shadow-sm shrink-0">
        <ShieldCheck className="text-toiral-primary" size={28} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-toiral-dark leading-tight">
          Client Verification Required
        </h3>
        <p className="text-sm text-toiral-secondary mt-1">
          To create a new project, a valid Client Code is required. Please enter
          the exactly 9-character code provided during client registration.
        </p>
      </div>
    </div>

    <div className="space-y-3">
      <label className="block text-sm font-bold text-toiral-dark ml-1">
        Enter 9-Character Client Code
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={codeInput}
          onChange={handleCodeChange}
          placeholder="e.g. CL-4274ww"
          maxLength={9}
          className={`flex-1 px-5 py-4 rounded-xl border-2 text-lg font-mono tracking-wider outline-none transition-all placeholder:text-toiral-secondary/50 placeholder:font-sans placeholder:tracking-normal ${
            verificationStatus === "error"
              ? "border-red-400 focus:border-red-500 bg-red-50 text-red-700"
              : verificationStatus === "success"
                ? "border-green-400 bg-green-50 text-green-700"
                : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary bg-white text-toiral-dark"
          }`}
        />
        <button
          type="button"
          onClick={handleVerify}
          disabled={
            codeInput.length !== 9 ||
            isVerifying ||
            verificationStatus === "success"
          }
          className="px-8 py-4 bg-toiral-dark hover:bg-toiral-primary text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-toiral-dark/20 flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify Code"
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {verificationStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 ml-1"
          >
            <AlertCircle size={18} />
            <span className="text-sm font-semibold">
              Invalid client code. Please check and try again.
            </span>
          </motion.div>
        )}
        {verificationStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl border border-green-200 ml-1"
          >
            <Check size={18} />
            <span className="text-sm font-semibold">
              Client verified successfully! Click Next to proceed.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

const ProjectInfoStep = ({ register, errors }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="space-y-6"
  >
    <div className="bg-toiral-bg-light border border-toiral-bg p-4 rounded-xl mb-2">
      <p className="text-sm font-medium text-toiral-secondary flex items-center gap-2">
        <Check className="text-toiral-primary" size={18} />
        <span className="text-toiral-dark font-bold">
          Auto-filled via Client Code.
        </span>{" "}
        You may edit these details if needed, then fill out the remaining
        fields.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
      {[
        {
          id: "clientName",
          label: "Client Name",
          type: "text",
          req: "Client name is required",
        },
        {
          id: "companyName",
          label: "Company Name",
          type: "text",
          req: "Company name is required",
        },
        {
          id: "email",
          label: "Email Address",
          type: "email",
          req: "Email is required",
          pattern: /^\S+@\S+$/i,
        },
        {
          id: "phone",
          label: "Phone Number",
          type: "tel",
          req: "Phone number is required",
        },
      ].map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-bold text-toiral-dark mb-2">
            {field.label} <span className="text-red-500">*</span>
          </label>
          <input
            type={field.type}
            {...register(field.id, {
              required: field.req,
              ...(field.pattern && {
                pattern: { value: field.pattern, message: "Invalid format" },
              }),
            })}
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-all ${
              errors[field.id]
                ? "border-red-400 focus:border-red-500 bg-red-50"
                : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary bg-white"
            }`}
          />
          {errors[field.id] && (
            <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">
              {errors[field.id].message}
            </p>
          )}
        </div>
      ))}

      <div>
        <label className="block text-sm font-bold text-toiral-dark mb-2">
          Project Status <span className="text-red-500">*</span>
        </label>
        <select
          {...register("status", { required: "Status is required" })}
          className={`w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-all cursor-pointer ${
            errors.status
              ? "border-red-400 focus:border-red-500 bg-red-50"
              : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary bg-white"
          }`}
        >
          <option value="">Select status</option>
          <option value="Pending">Pending</option>
          <option value="On progress">On progress</option>
          <option value="Stop">Stop</option>
          <option value="Complete">Complete</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">
            {errors.status.message}
          </p>
        )}
      </div>

      {/* NEW DUE DATE FIELD */}
      <div>
        <label className="block text-sm font-bold text-toiral-dark mb-2">
          Due Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("dueDate", { required: "Due date is required" })}
          className={`w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-all cursor-pointer ${
            errors.dueDate
              ? "border-red-400 focus:border-red-500 bg-red-50"
              : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary bg-white text-toiral-dark"
          }`}
        />
        {errors.dueDate && (
          <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">
            {errors.dueDate.message}
          </p>
        )}
      </div>

      <div className="col-span-1 md:col-span-2 pt-4 border-t border-toiral-bg grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-2">
        <div>
          <label className="block text-sm font-bold text-toiral-dark mb-2">
            Project Cost ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 5000"
            {...register("projectCost", {
              required: "Project cost is required",
            })}
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-all ${
              errors.projectCost
                ? "border-red-400 focus:border-red-500 bg-red-50"
                : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary bg-white"
            }`}
          />
          {errors.projectCost && (
            <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">
              {errors.projectCost.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-toiral-dark mb-2">
            Project Stack Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. MERN Stack, Next.js"
            {...register("projectStack", {
              required: "Project stack is required",
            })}
            className={`w-full px-4 py-3.5 rounded-xl border-2 text-base outline-none transition-all ${
              errors.projectStack
                ? "border-red-400 focus:border-red-500 bg-red-50"
                : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary bg-white"
            }`}
          />
          {errors.projectStack && (
            <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">
              {errors.projectStack.message}
            </p>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// ====== NEW Team Step Component ======
const TeamStep = ({ formData, setValue }) => {
  const currentTeam = formData.assignedTeam || [];

  const handleToggleMember = (member) => {
    const isSelected = currentTeam.some((m) => m.name === member.name);
    let newTeam;

    if (isSelected) {
      newTeam = currentTeam.filter((m) => m.name !== member.name);
    } else {
      newTeam = [...currentTeam, member];
    }

    setValue("assignedTeam", newTeam, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="bg-toiral-bg-light border border-toiral-bg p-5 rounded-xl mb-4 flex gap-4 items-start">
        <div className="bg-white p-2.5 rounded-full border border-toiral-bg shadow-sm shrink-0">
          <Users className="text-toiral-primary" size={24} />
        </div>
        <div>
          <h3 className="text-base font-bold text-toiral-dark leading-tight">
            Assign Team Members
          </h3>
          <p className="text-sm text-toiral-secondary mt-1">
            We pre-selected team members based on the client code data. You can
            add or remove members by checking the boxes below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allTeamMembers.map((member, idx) => {
          const isSelected = currentTeam.some((m) => m.name === member.name);
          return (
            <div
              key={idx}
              onClick={() => handleToggleMember(member)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                isSelected
                  ? "border-toiral-primary bg-toiral-bg-light shadow-sm"
                  : "border-toiral-bg bg-white hover:border-toiral-light"
              }`}
            >
              <div className="shrink-0 text-toiral-primary">
                {isSelected ? (
                  <CheckSquare size={24} className="text-toiral-primary" />
                ) : (
                  <Square size={24} className="text-toiral-secondary/40" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-toiral-dark text-base">
                  {member.name}
                </h4>
                <p className="text-sm font-medium text-toiral-primary">
                  {member.projectRole}
                </p>
                <p className="text-xs text-toiral-secondary mt-0.5">
                  {member.companyPosition}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const ReviewStep = ({ formData, verifiedClient }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <div className="bg-toiral-bg-light rounded-2xl p-5 md:p-6 border border-toiral-bg space-y-6">
      <div className="flex justify-between items-center border-b border-toiral-light pb-4">
        <h4 className="text-lg font-bold text-toiral-dark">Final Review</h4>
        <span className="bg-white border border-toiral-light px-3 py-1 rounded-lg text-xs font-mono font-bold text-toiral-primary shadow-sm">
          CODE: {verifiedClient?.clientCode}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
        {[
          { label: "Client Name", value: formData.clientName },
          { label: "Company", value: formData.companyName },
          { label: "Email", value: formData.email },
          { label: "Phone", value: formData.phone },
          { label: "Status", value: formData.status },
          { label: "Due Date", value: formData.dueDate },
          {
            label: "Project Cost",
            value: formData.projectCost ? `$${formData.projectCost}` : "—",
          },
          { label: "Tech Stack", value: formData.projectStack },
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

      {/* Team Review Section */}
      <div className="pt-4 border-t border-toiral-light">
        <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-3">
          Assigned Team ({formData.assignedTeam?.length || 0} Members)
        </p>
        {formData.assignedTeam?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.assignedTeam.map((member, i) => (
              <span
                key={i}
                className="bg-white border border-toiral-bg text-toiral-dark text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm"
              >
                {member.name}{" "}
                <span className="text-toiral-primary font-normal text-xs ml-1">
                  ({member.projectRole})
                </span>
              </span>
            ))}
          </div>
        ) : (
          <p className="font-semibold text-toiral-dark text-base">
            No team members assigned.
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

const SuccessStep = ({ onClose }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="text-center py-8 md:py-12 flex flex-col items-center"
  >
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
        <Briefcase size={32} strokeWidth={2.5} className="text-white" />
      </div>
    </div>
    <h3 className="text-2xl md:text-3xl font-bold text-toiral-dark">
      Project Created!
    </h3>
    <p className="text-base text-toiral-secondary mt-2 max-w-sm">
      The project has been successfully securely tied to the verified client.
    </p>

    <button
      type="button"
      onClick={onClose}
      className="mt-10 w-full max-w-sm px-6 py-4 bg-toiral-dark hover:bg-toiral-primary text-white font-bold rounded-xl transition-colors cursor-pointer text-lg shadow-lg shadow-toiral-dark/20"
    >
      Return to Dashboard
    </button>
  </motion.div>
);

export default AddProjectModal;
