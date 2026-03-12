import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Save, Loader2, LayoutDashboard } from "lucide-react";
import { useForm } from "react-hook-form";

// Helper to format date strings for the HTML date input
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0];
};

const ProjectOverviewEditModal = ({
  isOpen,
  onClose,
  projectData,
  onSubmitApi,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      projectDescription: projectData?.projectDescription || "",
      totalTasks: projectData?.totalTasks || 0,
      issues: projectData?.issues || 0,
      createdAt: formatDateForInput(projectData?.createdAt),
      deadline: formatDateForInput(projectData?.deadline),
      projectCost: projectData?.projectCost || 0,
    },
  });

  // Watch values for the custom +/- buttons
  const currentTasks = watch("totalTasks");
  const currentIssues = watch("issues");

  // Custom handler for +/- buttons to ensure React Hook Form marks them as "dirty"
  const handleNumberChange = (field, currentValue, increment) => {
    const newValue = Math.max(0, parseInt(currentValue || 0) + increment); // Prevent negative numbers
    setValue(field, newValue, { shouldValidate: true, shouldDirty: true });
  };

  const processSubmit = async (data) => {
    setIsSubmitting(true);

    // Extract only fields that were actually modified by the user
    const changedData = {};
    Object.keys(dirtyFields).forEach((key) => {
      changedData[key] = data[key];
    });

    try {
      if (Object.keys(changedData).length > 0) {
        await onSubmitApi(changedData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 z-40 bg-toiral-dark/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              // Here is the fix: max-w-[1024px] instead of min-w, keeping it 100% responsive!
              // Changed background to pure white as requested.
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col border border-toiral-light/30"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {/* Header (Sticky at top) */}
              <div className="flex justify-between items-center p-5 md:p-6 lg:px-8 border-b border-toiral-light/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-toiral-primary/10 rounded-lg text-toiral-primary hidden sm:block">
                    <LayoutDashboard size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-toiral-dark leading-tight">
                      Edit Project Details
                    </h2>
                    <p className="text-xs md:text-sm text-toiral-dark/60 font-medium mt-0.5">
                      Update the core information of your project
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-2.5 text-toiral-dark/50 hover:text-toiral-primary hover:bg-toiral-primary/10 rounded-full transition-all cursor-pointer active:scale-90 disabled:opacity-50"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Form Body - Inner Scrollable Area */}
              <div className="p-5 md:p-6 lg:p-8 overflow-y-auto flex-1 custom-scrollbar">
                <form
                  id="edit-project-form"
                  onSubmit={handleSubmit(processSubmit)}
                  className="space-y-6 md:space-y-8"
                >
                  {/* 1. Description */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-toiral-dark mb-2 transition-colors group-focus-within:text-toiral-primary">
                      Project Overview
                    </label>
                    <textarea
                      {...register("projectDescription", {
                        required: "Description is required",
                      })}
                      rows={4}
                      className="w-full p-4 rounded-xl bg-toiral-bg-light/50 border border-toiral-light/60 focus:bg-white focus:border-toiral-primary focus:ring-4 focus:ring-toiral-primary/10 outline-none transition-all resize-none text-toiral-dark text-sm md:text-base leading-relaxed cursor-text"
                      placeholder="Enter a comprehensive project description..."
                    />
                    {errors.projectDescription && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">
                        {errors.projectDescription.message}
                      </p>
                    )}
                  </div>

                  {/* 2 & 3. Tasks and Issues Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Tasks */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-toiral-dark mb-2 transition-colors group-focus-within:text-toiral-primary">
                        Total Tasks
                      </label>
                      <div className="flex items-center bg-toiral-bg-light/50 border border-toiral-light/60 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-toiral-primary focus-within:ring-4 focus-within:ring-toiral-primary/10 transition-all h-13">
                        <button
                          type="button"
                          onClick={() =>
                            handleNumberChange("totalTasks", currentTasks, -1)
                          }
                          className="px-5 h-full flex items-center justify-center text-toiral-dark/70 hover:text-toiral-primary hover:bg-toiral-light/30 transition-colors cursor-pointer active:bg-toiral-light"
                        >
                          <Minus size={18} />
                        </button>
                        <input
                          type="number"
                          {...register("totalTasks", {
                            min: { value: 0, message: "Cannot be negative" },
                          })}
                          className="w-full h-full text-center font-bold text-lg text-toiral-dark outline-none bg-transparent appearance-none cursor-text"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleNumberChange("totalTasks", currentTasks, 1)
                          }
                          className="px-5 h-full flex items-center justify-center text-toiral-dark/70 hover:text-toiral-primary hover:bg-toiral-light/30 transition-colors cursor-pointer active:bg-toiral-light"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      {errors.totalTasks && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium">
                          {errors.totalTasks.message}
                        </p>
                      )}
                    </div>

                    {/* Issues */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-toiral-dark mb-2 transition-colors group-focus-within:text-toiral-primary">
                        Active Issues
                      </label>
                      <div className="flex items-center bg-toiral-bg-light/50 border border-toiral-light/60 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-toiral-primary focus-within:ring-4 focus-within:ring-toiral-primary/10 transition-all h-13">
                        <button
                          type="button"
                          onClick={() =>
                            handleNumberChange("issues", currentIssues, -1)
                          }
                          className="px-5 h-full flex items-center justify-center text-toiral-dark/70 hover:text-toiral-primary hover:bg-toiral-light/30 transition-colors cursor-pointer active:bg-toiral-light"
                        >
                          <Minus size={18} />
                        </button>
                        <input
                          type="number"
                          {...register("issues", {
                            min: { value: 0, message: "Cannot be negative" },
                          })}
                          className="w-full h-full text-center font-bold text-lg text-toiral-dark outline-none bg-transparent appearance-none cursor-text"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleNumberChange("issues", currentIssues, 1)
                          }
                          className="px-5 h-full flex items-center justify-center text-toiral-dark/70 hover:text-toiral-primary hover:bg-toiral-light/30 transition-colors cursor-pointer active:bg-toiral-light"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      {errors.issues && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium">
                          {errors.issues.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 4 & 5. Dates Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="group">
                      <label className="block text-sm font-semibold text-toiral-dark mb-2 transition-colors group-focus-within:text-toiral-primary">
                        Project Start Date
                      </label>
                      <input
                        type="date"
                        {...register("createdAt", {
                          required: "Start date is required",
                        })}
                        className="w-full p-4 h-13 rounded-xl bg-toiral-bg-light/50 border border-toiral-light/60 focus:bg-white focus:border-toiral-primary focus:ring-4 focus:ring-toiral-primary/10 outline-none transition-all cursor-pointer text-toiral-dark font-medium"
                      />
                      {errors.createdAt && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium">
                          {errors.createdAt.message}
                        </p>
                      )}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-toiral-dark mb-2 transition-colors group-focus-within:text-toiral-primary">
                        Project End Date
                      </label>
                      <input
                        type="date"
                        {...register("deadline", {
                          required: "End date is required",
                        })}
                        className="w-full p-4 h-13 rounded-xl bg-toiral-bg-light/50 border border-toiral-light/60 focus:bg-white focus:border-toiral-primary focus:ring-4 focus:ring-toiral-primary/10 outline-none transition-all cursor-pointer text-toiral-dark font-medium"
                      />
                      {errors.deadline && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium">
                          {errors.deadline.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 6. Cost */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-toiral-dark mb-2 transition-colors group-focus-within:text-toiral-primary">
                      Project Cost (TK)
                    </label>
                    <div className="relative h-13">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-toiral-dark/50 text-lg group-focus-within:text-toiral-primary transition-colors">
                        ৳
                      </span>
                      <input
                        type="number"
                        {...register("projectCost", {
                          min: { value: 0, message: "Cost cannot be negative" },
                        })}
                        className="w-full h-full pl-12 pr-4 rounded-xl bg-toiral-bg-light/50 border border-toiral-light/60 focus:bg-white focus:border-toiral-primary focus:ring-4 focus:ring-toiral-primary/10 outline-none transition-all cursor-text text-toiral-dark font-medium text-lg"
                        placeholder="50000"
                      />
                    </div>
                    {errors.projectCost && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium">
                        {errors.projectCost.message}
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {/* Footer / Actions (Sticky at bottom) */}
              <div className="p-5 md:p-6 lg:px-8 border-t border-toiral-light/40 shrink-0 bg-gray-50/50 flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 md:py-3.5 rounded-xl font-semibold text-toiral-dark bg-white border border-toiral-light/80 hover:bg-toiral-light/30 hover:border-toiral-light transition-all cursor-pointer active:scale-95 disabled:opacity-50 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-project-form"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 md:py-3.5 rounded-xl font-bold text-white bg-toiral-dark hover:bg-toiral-primary hover:shadow-[0_0_20px_rgba(20,148,153,0.3)] transition-all cursor-pointer active:scale-95 disabled:opacity-80 min-w-40"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={20} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectOverviewEditModal;
