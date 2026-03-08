import { useState } from "react";
// eslint-disable-next-line no-unused-vars
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
  DollarSign,
  Layers,
  ListTodo,
  Calendar,
  AlignLeft,
  Building2,
  Mail,
  Phone,
  UserCircle2,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";

// ====== Step Configuration (5 Steps) ======
const steps = [
  { number: 1, title: "Verify Client" },
  { number: 2, title: "Project Info" },
  { number: 3, title: "Review" },
  { number: 4, title: "Submit" },
  { number: 5, title: "Success" },
];

// ====== Timeline Structure Generator ======
const generateTimeline = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return [
    {
      step: 1,
      title: "Discovery",
      description: "Initial meeting to understand project goals.",
      status: "completed",
      date: formattedDate,
    },
    {
      step: 2,
      title: "Project Planning",
      description: "Define features, timeline, and tech stack.",
      status: "completed",
      date: null,
    },
    {
      step: 3,
      title: "Design Preview",
      description: "UI/UX preview shared with client.",
      status: "current",
      date: null,
    },
    {
      step: 4,
      title: "Project Start",
      description: "Development begins. 30% advance payment required.",
      status: "pending",
      payment: 30,
      date: null,
    },
    {
      step: 5,
      title: "Progress Review",
      description: "Client reviews progress and provides feedback.",
      status: "pending",
      payment: 30,
      date: null,
    },
    {
      step: 6,
      title: "Final Delivery",
      description: "Website completed and prepared for launch.",
      status: "pending",
      payment: 30,
      date: null,
    },
    {
      step: 7,
      title: "Support & Completion",
      description: "1 month free support after launch.",
      status: "pending",
      payment: 10,
      date: null,
    },
  ];
};

// ====== SweetAlert2 Theme Configuration Helper ======
// helper to read CSS variables defined on :root (index.css)
const getColorVar = (name, fallback = "") => {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
};

const showSuccessAlert = (title, text) => {
  const primary = getColorVar("--color-toiral-primary", "#149499");
  const dark = getColorVar("--color-toiral-dark", "#16384b");
  const bgLight = getColorVar("--color-toiral-bg-light", "#f2fbfa");

  Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: primary,
    confirmButtonText: "Continue",
    background: bgLight,
    color: dark,
    customClass: {
      popup: "rounded-2xl shadow-2xl",
      title: "font-bold text-toiral-dark",
      confirmButton: "font-semibold rounded-xl px-6 py-3",
    },
  });
};

const showErrorAlert = (title, text) => {
  const dark = getColorVar("--color-toiral-dark", "#16384b");
  const bgLight = getColorVar("--color-toiral-bg-light", "#f2fbfa");

  Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: dark,
    confirmButtonText: "Try Again",
    background: bgLight,
    color: dark,
    customClass: {
      popup: "rounded-2xl shadow-2xl",
      title: "font-bold text-toiral-dark",
      confirmButton: "font-semibold rounded-xl px-6 py-3",
    },
  });
};

// ====== Main Component ======
const AddProjectModal = ({ onClose }) => {
  const {api} = useAxios();

  // --- Step Navigation State ---
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // --- Step 1: Client Verification State ---
  const [codeInput, setCodeInput] = useState("");
  const [verifiedClientData, setVerifiedClientData] = useState(null);

  // --- Step 5: Submission State ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- React Hook Form for Step 2 ---
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
    // setValue not needed in this component
  } = useForm({
    mode: "onChange",
    defaultValues: {
      projectCost: "",
      stackName: "",
      totalTasks: "",
      deadline: "",
      projectDescription: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const formData = watch();

  // --- TanStack Query: Client Verification Mutation ---
  const verifyClientMutation = useMutation({
    mutationFn: async (clientCode) => {
      console.log(clientCode)
      const response = await api.post("/admin-api/client-by-code", {
        clientCode: clientCode,
      });
      console.log(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      setVerifiedClientData(data);
      setCompletedSteps((prev) => new Set([...prev, 1]));
      setCurrentStep(2); // Auto-advance to Step 2__
      showSuccessAlert("Client Verified!", `Welcome, ${data.clientName}`);
    },
    onError: (error) => {
      const message =
        error.response?.status === 404
          ? "Client not found. Please check the code and try again."
          : error.response?.data?.message ||
            "Verification failed. Please try again.";
      showErrorAlert("Verification Failed", message);
      // verificationStatus state was removed since it was unused
    },
  });

  // --- TanStack Query: Project Submission Mutation ---
  const submitProjectMutation = useMutation({
    mutationFn: async (projectData) => {
      const response = await api.post("/admin-api/add-project", projectData);
      return response.data;
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setCompletedSteps((prev) => new Set([...prev, 4, 5]));
      setCurrentStep(5);
      showSuccessAlert(
        "Project Created!",
        "The project has been successfully initialized.",
      );
    },
    onError: (error) => {
      setIsSubmitting(false);
      const message =
        error.response?.data?.message ||
        "Failed to create project. Please try again.";
      showErrorAlert("Submission Failed", message);
    },
  });

  // ====== Step 1: Verify Client Handler ======
  const handleVerify = () => {
    const cleaned = codeInput.trim();
    if (cleaned.length !== 9) {
      showErrorAlert(
        "Invalid Code",
        "Client code must be exactly 9 characters.",
      );
      return;
    }
    verifyClientMutation.mutate(cleaned);
  };

  // ====== Step 2 → 3: Navigate to Review ======
  const handleNextToReview = () => {
    setCompletedSteps((prev) => new Set([...prev, 2]));
    setCurrentStep(3);
  };

  // ====== Step 3 → 2: Go Back to Edit ======
  const handleBackToProjectInfo = () => {
    setCurrentStep(2);
  };

  // ====== Step 3 → 4: Navigate to Submit ======
  const handleNextToSubmit = () => {
    setCompletedSteps((prev) => new Set([...prev, 3]));
    setCurrentStep(4);
  };

  // ====== Step 4 → 3: Go Back to Review ======
  const handleBackToReview = () => {
    setCurrentStep(3);
  };

  // ====== Step 4: Final Submission ======
  const onSubmitProject = () => {
    setIsSubmitting(true);

    const projectPayload = {
      clientCode: codeInput,
      projectCost: Number(formData.projectCost),
      stackName: formData.stackName,
      totalTasks: Number(formData.totalTasks),
      deadline: formData.deadline,
      projectDescription: formData.projectDescription,
      timeline: generateTimeline(),
    };

    submitProjectMutation.mutate(projectPayload);
  };

  // ====== Step Navigation: Click on Completed Steps ======
  const handleStepClick = (stepNumber) => {
    if (completedSteps.has(stepNumber) && stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  // ====== Render Helper: Get Form Data for Review ======
  const getReviewFormData = () => ({
    projectCost: formData.projectCost || "—",
    stackName: formData.stackName || "—",
    totalTasks: formData.totalTasks || "—",
    deadline: formData.deadline || "—",
    projectDescription:
      formData.projectDescription || "No description provided.",
  });

  return (
    // FULL SCREEN on mobile, ROUNDED MODAL on desktop
    <div className="bg-white w-full h-[82vh] md:h-auto md:max-h-[80vh] md:max-w-4xl rounded-xl shadow-2xl flex flex-col overflow-hidden relative font-['Outfit',sans-serif]">
      {/* Header */}
      <div className="shrink-0 bg-white z-10 flex justify-between items-center p-5 md:p-6 border-b border-toiral-bg">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-toiral-dark leading-tight">
            Add New Project
          </h2>
          <p className="text-sm md:text-base text-toiral-secondary mt-1">
            Initialize a new project environment.
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={isSubmitting || verifyClientMutation.isPending}
          className="p-2.5 bg-toiral-bg-light hover:bg-toiral-bg text-toiral-secondary hover:text-toiral-primary rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="shrink-0 px-5 pt-5 md:px-8 md:pt-6 bg-white overflow-x-auto custom-scrollbar pb-2 md:pb-0">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 md:px-8 md:pb-6 custom-scrollbar">
        <div className="h-full pt-4 md:pt-6">
          <AnimatePresence mode="wait">
            {/* ========== STEP 1: VERIFY CLIENT ========== */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
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
                      Please enter the exactly 9-character code provided during
                      client registration to link this project.
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
                      onChange={(e) => {
                        // keep raw value but show uppercase via styling
                        setCodeInput(e.target.value);
                      }}
                      placeholder="e.g. CL-4274ww"
                      maxLength={9}
                      className={`flex-1 px-5 py-4 rounded-xl border-2 text-lg font-mono tracking-wider outline-none transition-all placeholder:text-toiral-light placeholder:font-sans placeholder:tracking-normal uppercase ${
                        verifyClientMutation.isSuccess
                          ? "border-green-400 bg-green-50 text-green-700"
                          : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary bg-white text-toiral-dark"
                      }`}
                      onKeyDown={(e) => {
                        const cleaned = codeInput.trim();
                        if (e.key === "Enter" && cleaned.length === 9) {
                          handleVerify();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={
                        codeInput.length !== 9 ||
                        verifyClientMutation.isPending ||
                        verifyClientMutation.isSuccess
                      }
                      className="px-8 py-4 bg-toiral-dark hover:bg-toiral-primary text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                    >
                      {verifyClientMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {verifyClientMutation.isPending && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-toiral-primary bg-toiral-bg-light p-3 rounded-xl border border-toiral-bg ml-1"
                  >
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm font-semibold">
                      Verifying client code...
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ========== STEP 2: PROJECT INFO ========== */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  {/* Project Cost */}
                  <div>
                    <label className="block text-sm font-bold text-toiral-dark mb-2">
                      Project Cost <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <DollarSign
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-toiral-secondary group-focus-within:text-toiral-primary transition-colors"
                        size={20}
                      />
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        {...register("projectCost", {
                          required: "Project cost is required",
                          min: { value: 1, message: "Cost must be at least 1" },
                        })}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-white text-toiral-dark text-base outline-none transition-all shadow-sm ${
                          errors.projectCost
                            ? "border-red-400 focus:border-red-500"
                            : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary"
                        }`}
                      />
                    </div>
                    {errors.projectCost && (
                      <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.projectCost.message}
                      </p>
                    )}
                  </div>

                  {/* Stack Name */}
                  <div>
                    <label className="block text-sm font-bold text-toiral-dark mb-2">
                      Stack Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <Layers
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-toiral-secondary group-focus-within:text-toiral-primary transition-colors"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="e.g. MERN, Next.js"
                        {...register("stackName", {
                          required: "Stack name is required",
                          minLength: {
                            value: 2,
                            message: "Stack name must be at least 2 characters",
                          },
                        })}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-white text-toiral-dark text-base outline-none transition-all shadow-sm ${
                          errors.stackName
                            ? "border-red-400 focus:border-red-500"
                            : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary"
                        }`}
                      />
                    </div>
                    {errors.stackName && (
                      <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.stackName.message}
                      </p>
                    )}
                  </div>

                  {/* Total Tasks */}
                  <div>
                    <label className="block text-sm font-bold text-toiral-dark mb-2">
                      Total Tasks <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <ListTodo
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-toiral-secondary group-focus-within:text-toiral-primary transition-colors"
                        size={20}
                      />
                      <input
                        type="number"
                        placeholder="e.g. 24"
                        {...register("totalTasks", {
                          required: "Total tasks is required",
                          min: { value: 1, message: "Must be at least 1 task" },
                        })}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-white text-toiral-dark text-base outline-none transition-all shadow-sm ${
                          errors.totalTasks
                            ? "border-red-400 focus:border-red-500"
                            : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary"
                        }`}
                      />
                    </div>
                    {errors.totalTasks && (
                      <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.totalTasks.message}
                      </p>
                    )}
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-bold text-toiral-dark mb-2">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <Calendar
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-toiral-secondary group-focus-within:text-toiral-primary transition-colors pointer-events-none"
                        size={20}
                      />
                      <input
                        type="date"
                        {...register("deadline", {
                          required: "Deadline is required",
                        })}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-white text-toiral-dark text-base outline-none transition-all shadow-sm cursor-pointer ${
                          errors.deadline
                            ? "border-red-400 focus:border-red-500"
                            : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary"
                        }`}
                      />
                    </div>
                    {errors.deadline && (
                      <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.deadline.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-toiral-dark mb-2">
                      Project Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <AlignLeft
                        className="absolute left-4 top-4 text-toiral-secondary group-focus-within:text-toiral-primary transition-colors"
                        size={20}
                      />
                      <textarea
                        rows={4}
                        placeholder="Briefly describe the project goals..."
                        {...register("projectDescription", {
                          required: "Project description is required",
                          minLength: {
                            value: 10,
                            message:
                              "Description must be at least 10 characters",
                          },
                        })}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-white text-toiral-dark text-base outline-none transition-all shadow-sm resize-none custom-scrollbar ${
                          errors.projectDescription
                            ? "border-red-400 focus:border-red-500"
                            : "border-toiral-bg hover:border-toiral-light focus:border-toiral-primary"
                        }`}
                      />
                    </div>
                    {errors.projectDescription && (
                      <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.projectDescription.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== STEP 3: REVIEW ========== */}
            {currentStep === 3 && verifiedClientData && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. Client & Team Data Card */}
                <div className="bg-toiral-bg-light rounded-2xl p-5 md:p-6 border border-toiral-bg shadow-sm">
                  <div className="flex justify-between items-center border-b border-toiral-light pb-4 mb-4">
                    <h4 className="text-lg font-bold text-toiral-dark flex items-center gap-2">
                      <Building2 size={20} className="text-toiral-primary" />
                      Pre-Verified Client Details
                    </h4>
                    <span className="bg-white border border-toiral-light px-3 py-1 rounded-lg text-xs font-mono font-bold text-toiral-primary shadow-sm">
                      {verifiedClientData.status?.toUpperCase() || "N/A"}
                    </span>
                  </div>

                  {/* Client Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4 mb-6">
                    <div>
                      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1">
                        Client Name
                      </p>
                      <p className="font-semibold text-toiral-dark text-base">
                        {verifiedClientData.clientName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1">
                        Company
                      </p>
                      <p className="font-semibold text-toiral-dark text-base">
                        {verifiedClientData.companyName}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Mail size={12} /> Email
                      </p>
                      <p className="font-semibold text-toiral-dark text-sm break-all">
                        {verifiedClientData.email}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Phone size={12} /> Phone
                      </p>
                      <p className="font-semibold text-toiral-dark text-sm">
                        {verifiedClientData.phone}
                      </p>
                    </div>
                  </div>

                  {/* Assigned Team Section */}
                  {verifiedClientData.assignedTeam &&
                    verifiedClientData.assignedTeam.length > 0 && (
                      <div className="bg-white rounded-xl p-4 border border-toiral-bg">
                        <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <UserCircle2 size={16} /> Assigned Team (
                          {verifiedClientData.assignedTeam.length})
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {verifiedClientData.assignedTeam.map((member, i) => (
                            <div
                              key={i}
                              className="flex flex-col p-3 rounded-lg border border-toiral-bg bg-toiral-bg-light"
                            >
                              <span className="font-bold text-toiral-dark text-sm">
                                {member.name}
                              </span>
                              <span className="text-toiral-primary text-xs font-medium">
                                {member.projectRole}
                              </span>
                              <span className="text-toiral-secondary text-[11px] mt-0.5">
                                {member.companyPosition}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* 2. New Project Info Card */}
                <div className="bg-white rounded-2xl p-5 md:p-6 border border-toiral-bg shadow-sm">
                  <h4 className="text-lg font-bold text-toiral-dark flex items-center gap-2 border-b border-toiral-bg pb-4 mb-4">
                    <Layers size={20} className="text-toiral-primary" />
                    New Project Info
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4">
                    <div>
                      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1">
                        Cost
                      </p>
                      <p className="font-semibold text-toiral-dark text-base">
                        ${getReviewFormData().projectCost}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1">
                        Stack
                      </p>
                      <p className="font-semibold text-toiral-dark text-base">
                        {getReviewFormData().stackName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1">
                        Tasks
                      </p>
                      <p className="font-semibold text-toiral-dark text-base">
                        {getReviewFormData().totalTasks}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1">
                        Deadline
                      </p>
                      <p className="font-semibold text-toiral-dark text-base">
                        {getReviewFormData().deadline}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-4 mt-2">
                      <p className="text-xs font-bold text-toiral-secondary uppercase tracking-wider mb-1">
                        Description
                      </p>
                      <p className="font-medium text-toiral-dark text-sm bg-toiral-bg-light p-3 rounded-lg border border-toiral-bg">
                        {getReviewFormData().projectDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== STEP 4: SUBMIT CONFIRMATION ========== */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto space-y-6 pt-4"
              >
                <div className="bg-toiral-bg-light border-2 border-toiral-primary/30 p-6 rounded-2xl text-center">
                  <div className="w-20 h-20 bg-toiral-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="text-toiral-primary" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-toiral-dark mb-2">
                    Ready to Submit?
                  </h3>
                  <p className="text-toiral-secondary text-sm mb-6">
                    This will create a new project linked to client code:{" "}
                    <span className="font-mono font-bold text-toiral-dark">
                      {codeInput}
                    </span>
                  </p>

                  <div className="bg-white rounded-xl p-4 border border-toiral-bg text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-toiral-secondary">
                        Project Cost:
                      </span>
                      <span className="font-semibold text-toiral-dark">
                        ${formData.projectCost}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-toiral-secondary">Stack:</span>
                      <span className="font-semibold text-toiral-dark">
                        {formData.stackName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-toiral-secondary">
                        Total Tasks:
                      </span>
                      <span className="font-semibold text-toiral-dark">
                        {formData.totalTasks}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-toiral-secondary">Deadline:</span>
                      <span className="font-semibold text-toiral-dark">
                        {formData.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== STEP 5: SUCCESS ========== */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-10 md:py-16 flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                  >
                    <CheckCircle2
                      size={36}
                      strokeWidth={2.5}
                      className="text-white"
                    />
                  </motion.div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-toiral-dark">
                  Project Initialized!
                </h3>
                <p className="text-base text-toiral-secondary mt-2 max-w-sm">
                  The project has been successfully tied to the verified client
                  and team.
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-10 w-full max-w-sm px-6 py-4 bg-toiral-dark hover:bg-toiral-primary text-white font-bold rounded-xl transition-colors cursor-pointer text-lg shadow-lg"
                >
                  Close & Return
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========== Sticky Navigation Footer ========== */}
      {currentStep < 5 && (
        <div className="shrink-0 bg-white border-t border-toiral-bg p-4 md:p-6 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col-reverse md:flex-row md:justify-between items-stretch md:items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || verifyClientMutation.isPending}
              className="w-full md:w-auto px-6 py-3 border-2 border-toiral-bg text-toiral-secondary hover:text-toiral-dark hover:bg-toiral-bg-light font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 text-base"
            >
              Cancel
            </button>

            <div className="flex flex-col md:flex-row justify-between md:justify-end gap-3 w-full md:w-auto">
              {/* Back Button - Show on Steps 2, 3, 4 */}
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={
                    currentStep === 2
                      ? handleBackToProjectInfo
                      : currentStep === 3
                        ? handleBackToProjectInfo
                        : handleBackToReview
                  }
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-toiral-dark bg-toiral-bg-light hover:bg-toiral-bg font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 text-base"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
              )}

              {/* Next/Submit Button */}
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleFormSubmit(handleNextToReview)}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-base"
                >
                  Next Step
                  <ArrowRight size={20} />
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="button"
                  onClick={handleNextToSubmit}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-base"
                >
                  Continue to Submit
                  <ArrowRight size={20} />
                </button>
              )}

              {currentStep === 4 && (
                <button
                  type="button"
                  onClick={onSubmitProject}
                  disabled={isSubmitting || submitProjectMutation.isPending}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-md text-base"
                >
                  {isSubmitting || submitProjectMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Creating Project...</span>
                    </>
                  ) : (
                    <>
                      Confirm & Submit <Check size={20} />
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

// ====== Sub-Component: Step Indicator ======
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
              className={`text-base mt-3 text-center transition-colors ${
                isCompleted || isCurrent
                  ? "text-toiral-dark font-bold"
                  : "text-toiral-secondary font-medium"
              }`}
            >
              {step.title}
            </p>
          </div>
        );
      })}
    </div>
  </>
);

export default AddProjectModal;
