import { useState } from "react";
import { useForm } from "react-hook-form";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";

const steps = [
  { title: "Client Details", subtitle: "Basic information" },
  { title: "Assign Team", subtitle: "Select members" },
  { title: "Review", subtitle: "Verify details" },
  { title: "Success", subtitle: "Client added" },
];

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

const generateCode = () => {
  const digits = Math.floor(1000 + Math.random() * 9000); // 4 random digits
  const letters =
    String.fromCharCode(97 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(97 + Math.floor(Math.random() * 26)); // 2 lowercase letters
  return `CL-${digits}${letters}`;
};

const AddClientModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set([1]));
  const [formError, setFormError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formData = watch();

  const handleNext = async () => {
    setFormError(null);
    const valid = await trigger(); // Validate current step

    if (valid) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      setFormError("Please fill all required fields correctly.");
    }
  };

  const handleBack = () => {
    setFormError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step) => {
    if (completedSteps.has(step) && step < currentStep) {
      setCurrentStep(step);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);

    setIsSubmitting(true);
    setFormError(null);

    // Fake submit delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate code and go to step 4
    setGeneratedCode(generateCode());
    setCompletedSteps((prev) => new Set([...prev, 3, 4]));
    setCurrentStep(4);
    setIsSubmitting(false);
  };

  const toggleTeamMember = (index) => {
    setSelectedTeam((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto shadow-2xl flex flex-col">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-toiral-dark">Add New Client</h2>
        <p className="text-sm text-gray-600 mt-1">
          Provide client details and assign team
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-between mb-12">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = completedSteps.has(stepNum);
          const isCurrent = currentStep === stepNum;

          return (
            <div
              key={stepNum}
              onClick={() => handleStepClick(stepNum)}
              className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${
                isCompleted || isCurrent
                  ? "text-toiral-primary"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? "bg-toiral-primary text-white border-toiral-primary"
                    : isCurrent
                      ? "border-toiral-primary text-toiral-primary"
                      : "border-gray-300"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </div>
              <p className="text-xs text-center">{step.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-toiral-dark">
                Client Information
              </h3>
              <input
                type="text"
                placeholder="Client Name"
                {...register("clientName", { required: true })}
                className="w-full bg-toiral-light border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toiral-primary"
              />
              <input
                type="text"
                placeholder="Company Name"
                {...register("companyName", { required: true })}
                className="w-full bg-toiral-light border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toiral-primary"
              />
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                className="w-full bg-toiral-light border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toiral-primary"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                {...register("phone", { required: true })}
                className="w-full bg-toiral-light border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toiral-primary"
              />
              <input
                type="text"
                placeholder="Project Name"
                {...register("projectName", { required: true })}
                className="w-full bg-toiral-light border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toiral-primary"
              />
              <select
                {...register("status", { required: true })}
                className="w-full bg-toiral-light border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toiral-primary"
              >
                <option value="">Select Project Status</option>
                <option value="Pending">Pending</option>
                <option value="On progress">On progress</option>
                <option value="Stop">Stop</option>
                <option value="Complete">Complete</option>
              </select>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-toiral-dark">
                Assign Team
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    onClick={() => toggleTeamMember(index)}
                    className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      selectedTeam.includes(index)
                        ? "border-toiral-primary bg-toiral-light"
                        : "border-gray-200 hover:border-toiral-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-toiral-dark">
                          {member.name}
                        </h4>
                        <p className="text-sm text-toiral-primary">
                          {member.projectRole}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.companyPosition}
                        </p>
                      </div>
                      {selectedTeam.includes(index) && (
                        <Check className="w-5 h-5 text-toiral-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-toiral-dark">
                Review Details
              </h3>
              <div className="space-y-4">
                <p>
                  <strong>Client Name:</strong> {formData.clientName}
                </p>
                <p>
                  <strong>Company Name:</strong> {formData.companyName}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.phone}
                </p>
                <p>
                  <strong>Project Name:</strong> {formData.projectName}
                </p>
                <p>
                  <strong>Status:</strong> {formData.status}
                </p>
                <p>
                  <strong>Assigned Team:</strong>{" "}
                  {selectedTeam.map((i) => teamMembers[i].name).join(", ") ||
                    "None"}
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <h3 className="text-2xl font-bold text-toiral-dark">
                Congratulations!
              </h3>
              <p className="text-gray-600">Client added successfully.</p>
              <div className="bg-toiral-light p-4 rounded-2xl inline-block">
                <p className="text-sm text-gray-500">Client Access Code</p>
                <p className="text-2xl font-mono text-toiral-primary">
                  {generatedCode}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Share this code with the client for access.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="bg-toiral-primary text-white px-6 py-3 rounded-2xl hover:bg-toiral-primary/90 transition-all"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message Area */}
        {formError && <p className="text-red-500 text-sm mt-4">{formError}</p>}

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && currentStep < 4 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-toiral-dark"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          {currentStep < 3 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="ml-auto flex items-center gap-2 bg-toiral-primary hover:bg-toiral-primary/90 text-white font-semibold px-6 py-3 rounded-2xl transition-all disabled:opacity-70"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          {currentStep === 3 && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto flex items-center gap-2 bg-toiral-primary hover:bg-toiral-primary/90 text-white font-semibold px-6 py-3 rounded-2xl transition-all disabled:opacity-70"
            >
              {isSubmitting ? "Adding..." : "Add Client"}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddClientModal;