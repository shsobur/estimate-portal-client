import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  CircleDashed,
  Lock,
  Check,
  Clock,
  CreditCard,
  ChevronRight,
  Loader2,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";

const ProjectTimeline = () => {
  const { api } = useAxios();
  const { timeline, projectId, clientCode } = useOutletContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // ==========================================
  // FUNCTIONALITY: KEPT 100% EXACTLY AS YOURS
  // ==========================================

  // Get formatted date (today)
  const getFormattedDate = () => {
    const today = new Date();
    const options = { year: "numeric", month: "short", day: "numeric" };
    return today.toLocaleDateString("en-US", options);
  };

  // Handle step completion
  const handleCompleteStep = async (stepNumber) => {
    const result = await Swal.fire({
      title: "Complete This Step?",
      text: `Are you sure you want to mark this step as completed?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#149499",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Complete",
      cancelButtonText: "Cancel",
      background: "#f2fbfa",
      color: "#16384b",
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsUpdating(true);

    try {
      const updatedTimeline = timeline.map((step) => {
        if (step.step === stepNumber) {
          return {
            ...step,
            status: "completed",
            date: getFormattedDate(),
          };
        }
        if (step.step === stepNumber + 1) {
          return {
            ...step,
            status: "current",
          };
        }
        return step;
      });

      await api.patch(`/admin-api/projects/${projectId}`, {
        timeline: updatedTimeline,
      });

      const step4IsCurrent =
        updatedTimeline.find((step) => step.step === 4)?.status === "current";

      const allStepsCompleted = updatedTimeline.every(
        (step) => step.status === "completed",
      );

      if (step4IsCurrent) {
        await api.patch(`/admin-api/clients/complete`, {
          clientCode,
          status: "In Progress",
        });
      }

      if (allStepsCompleted) {
        await api.patch(`/admin-api/clients/complete`, {
          clientCode,
          status: "Complete",
        });

        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["clients"] });

        await Swal.fire({
          icon: "success",
          title: "🎉 Congratulations!",
          html: `
            <div>
              <p className="text-lg font-bold mb-2">Project Completed!</p>
              <p className="text-gray-600">All steps have been finished successfully.</p>
              <p className="text-gray-600 mt-2">Client status has been updated to "Complete".</p>
            </div>
          `,
          timer: 3000,
          showConfirmButton: false,
          background: "#f2fbfa",
          color: "#16384b",
          iconColor: "#149499",
        });
      } else if (step4IsCurrent) {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["clients"] });

        await Swal.fire({
          icon: "success",
          title: "Great Progress!",
          text: "Project Start initiated. Client status updated to 'In Progress'.",
          timer: 2000,
          showConfirmButton: false,
          background: "#f2fbfa",
          color: "#16384b",
          iconColor: "#149499",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });

        await Swal.fire({
          icon: "success",
          title: "Step Completed!",
          text: "Timeline has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
          background: "#f2fbfa",
          color: "#16384b",
          iconColor: "#149499",
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Failed to update timeline.",
        confirmButtonColor: "#16384b",
        background: "#f2fbfa",
        color: "#16384b",
      });
      console.error("Error updating timeline:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // ==========================================
  // DESIGN & LAYOUT UPDATES BELOW
  // ==========================================

  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-toiral-light/50 text-center">
        <p className="text-toiral-dark/60 font-medium">
          No timeline data available.
        </p>
      </div>
    );
  }

  // Calculate stats for the gorgeous top header
  const completedCount = timeline.filter(
    (s) => s.status === "completed",
  ).length;
  const currentCount = timeline.filter((s) => s.status === "current").length;
  const pendingCount = timeline.filter((s) => s.status === "pending").length;
  const progressPercent = Math.round((completedCount / timeline.length) * 100);

  return (
    <div
      className="w-full flex flex-col items-center p-3 md:p-4"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="w-full space-y-6 md:space-y-8">
        {/* ========================================== */}
        {/* NEW DASHBOARD HEADER & PROGRESS SUMMARY    */}
        {/* ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-toiral-bg-light p-6 md:p-8 rounded-2xl shadow-sm border border-toiral-light/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,148,153,0.15)] hover:border-toiral-primary/40"
        >
          <div className="text-center md:text-left mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-toiral-dark mb-2">
              Project Timeline
            </h2>
            <p className="text-toiral-dark/70 text-sm md:text-base">
              Track live progress and manage project milestones.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-toiral-dark/80 uppercase tracking-wider">
                Overall Progress
              </span>
              <span className="text-2xl font-bold text-toiral-primary">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-toiral-light/50 h-2.5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-toiral-primary rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/20" />
              </motion.div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 border-t border-toiral-light/40">
            <div className="text-center p-2 rounded-xl bg-green-50/50">
              <span className="block text-xs md:text-sm text-toiral-dark/60 font-semibold mb-1">
                Completed
              </span>
              <span className="text-lg md:text-xl font-bold text-toiral-primary">
                {completedCount}
              </span>
            </div>
            <div className="text-center p-2 rounded-xl bg-blue-50/50">
              <span className="block text-xs md:text-sm text-toiral-dark/60 font-semibold mb-1">
                In Progress
              </span>
              <span className="text-lg md:text-xl font-bold text-blue-600">
                {currentCount}
              </span>
            </div>
            <div className="text-center p-2 rounded-xl bg-gray-50/50">
              <span className="block text-xs md:text-sm text-toiral-dark/60 font-semibold mb-1">
                Pending
              </span>
              <span className="text-lg md:text-xl font-bold text-toiral-dark/40">
                {pendingCount}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ========================================== */}
        {/* TIMELINE LIST                              */}
        {/* ========================================== */}
        <div className="relative mt-8 md:mt-12 pl-2">
          {/* The Vertical Line */}
          <div className="absolute left-5 md:left-7 top-4 bottom-12 w-0.75 bg-toiral-light/60 rounded-full" />

          <div className="space-y-6 md:space-y-8">
            {timeline.map((step, index) => {
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";
              const isPending = step.status === "pending";

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4 md:gap-6 pl-12 md:pl-16 group"
                >
                  {/* Timeline Dot/Icon */}
                  <div
                    className={`absolute left-0 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 border-toiral-bg z-10 transition-all duration-500
                    ${isCompleted ? "bg-toiral-primary text-white" : ""}
                    ${isCurrent ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110" : ""}
                    ${isPending ? "bg-toiral-light text-toiral-dark/40" : ""}
                  `}
                  >
                    {isCompleted && (
                      <Check size={20} className="md:w-6 md:h-6" />
                    )}
                    {isCurrent && (
                      <CircleDashed
                        size={20}
                        className="animate-spin-slow md:w-6 md:h-6"
                      />
                    )}
                    {isPending && <Clock size={20} className="md:w-6 md:h-6" />}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-full p-5 md:p-6 rounded-2xl border transition-all duration-300
                    ${isCurrent ? "bg-white border-blue-400 shadow-lg scale-[1.02]" : ""}
                    ${isCompleted ? "bg-toiral-bg-light border-toiral-light/50 hover:shadow-[0_0_15px_rgba(20,148,153,0.15)] hover:border-toiral-primary/40" : ""}
                    ${isPending ? "bg-white/40 border-transparent opacity-70 hover:opacity-100" : ""}
                  `}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                      <h3
                        className={`text-lg md:text-xl font-bold 
                        ${isCurrent ? "text-toiral-dark" : ""}
                        ${isCompleted ? "text-toiral-primary" : ""}
                        ${isPending ? "text-toiral-dark/60" : ""}
                      `}
                      >
                        {step.step}. {step.title}
                      </h3>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit
                        ${isCompleted ? "bg-toiral-primary/10 text-toiral-primary" : ""}
                        ${isCurrent ? "bg-blue-100 text-blue-700" : ""}
                        ${isPending ? "bg-gray-100 text-gray-500" : ""}
                      `}
                      >
                        {step.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className={`text-sm md:text-base leading-relaxed mb-4
                      ${isCurrent ? "text-toiral-dark/80" : "text-toiral-dark/60"}
                    `}
                    >
                      {step.description}
                    </p>

                    {/* Badges Row (Date & Payment) */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {step.date && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-toiral-light/30 text-toiral-dark text-xs md:text-sm font-semibold rounded-lg">
                          <CheckCircle2
                            size={14}
                            className="text-toiral-primary"
                          />
                          Completed: {step.date}
                        </span>
                      )}

                      {step.payment && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fff8e6] border border-[#f0d699] text-[#b38210] text-xs md:text-sm font-bold rounded-lg">
                          <CreditCard size={14} />
                          Payment: {step.payment}%
                        </span>
                      )}
                    </div>

                    {/* Footer / Actions Area */}
                    <div className="mt-2">
                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="pt-4 border-t border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-4"
                        >
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Action Required
                          </span>

                          <button
                            onClick={() => handleCompleteStep(step.step)}
                            disabled={isUpdating}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-toiral-dark hover:bg-toiral-primary text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isUpdating ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />{" "}
                                Updating...
                              </>
                            ) : (
                              <>
                                Complete This Step <ChevronRight size={16} />
                              </>
                            )}
                          </button>
                        </motion.div>
                      )}

                      {isPending && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-toiral-dark/40 pt-2 border-t border-transparent">
                          <Lock size={14} />
                          Locked until previous steps finish
                        </div>
                      )}

                      {isCompleted && (
                        <div className="flex items-center gap-2 text-xs font-bold text-toiral-primary pt-2 border-t border-transparent">
                          <Check size={14} strokeWidth={3} />
                          Step successfully completed
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
