import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, Lock, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import useAxios from "../../../Hooks/useAxios";

const ProjectTimeline = () => {
  const { api } = useAxios();
  const { timeline, projectId, clientCode } = useOutletContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Get formatted date (today)
  const getFormattedDate = () => {
    const today = new Date();
    const options = { year: "numeric", month: "short", day: "numeric" };
    return today.toLocaleDateString("en-US", options);
  };

  // Handle step completion
  const handleCompleteStep = async (stepNumber) => {
    // Show confirmation dialog
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
      return; // User cancelled
    }

    setIsUpdating(true);

    try {
      // Create updated timeline
      const updatedTimeline = timeline.map((step) => {
        // Complete the current step
        if (step.step === stepNumber) {
          return {
            ...step,
            status: "completed",
            date: getFormattedDate(),
          };
        }
        // Move next step to current
        if (step.step === stepNumber + 1) {
          return {
            ...step,
            status: "current",
          };
        }
        // Keep other steps as is
        return step;
      });

      // Call PATCH API to update project timeline
      await api.patch(`/admin-api/projects/${projectId}`, {
        timeline: updatedTimeline,
      });

      // Check if Step 4 is now the current step
      const step4IsCurrent =
        updatedTimeline.find((step) => step.step === 4)?.status === "current";

      // Check if ALL steps are now completed
      const allStepsCompleted = updatedTimeline.every(
        (step) => step.status === "completed",
      );

      // If Step 4 becomes current, update client status to "In Progress"
      if (step4IsCurrent) {
        await api.patch(`/admin-api/clients/complete`, {
          clientCode,
          status: "In Progress",
        });
      }

      // If all steps completed, update client status to "Complete"
      if (allStepsCompleted) {
        await api.patch(`/admin-api/clients/complete`, {
          clientCode,
          status: "Complete",
        });

        // Invalidate both caches
        queryClient.invalidateQueries({
          queryKey: ["project", projectId],
        });
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        });

        // Show special success message for project completion
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
        // Show success message when Step 4 becomes current
        queryClient.invalidateQueries({
          queryKey: ["project", projectId],
        });
        queryClient.invalidateQueries({
          queryKey: ["clients"],
        });

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
        // Show regular success message for step completion
        queryClient.invalidateQueries({
          queryKey: ["project", projectId],
        });

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
      // Error alert
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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case "current":
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
      case "pending":
        return <Circle className="w-6 h-6 text-gray-400" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "current":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No timeline data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Project Timeline
      </h2>

      {/* Timeline Container */}
      <div className="space-y-6">
        {timeline.map((step, index) => (
          <div key={step.step} className="flex gap-4">
            {/* Left side - Status Icon and connector */}
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className="shrink-0">{getStatusIcon(step.status)}</div>

              {/* Connector line */}
              {index < timeline.length - 1 && (
                <div
                  className={`w-1 h-20 mt-2 ${
                    step.status === "completed" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>

            {/* Right side - Content */}
            <div className="flex-1 pb-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Step {step.step}: {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {step.description}
                  </p>
                </div>
                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                    step.status,
                  )} whitespace-nowrap ml-4`}
                >
                  {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                </span>
              </div>

              {/* Details */}
              <div className="mt-3 space-y-2">
                {/* Date */}
                {step.date && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Completed:</span>{" "}
                    {step.date}
                  </p>
                )}

                {/* Payment Info */}
                {step.payment && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Payment:</span>{" "}
                    {step.payment}%
                  </p>
                )}

                {/* Complete Button - Only show for current step */}
                {step.status === "current" && (
                  <button
                    onClick={() => handleCompleteStep(step.step)}
                    disabled={isUpdating}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Complete This Step"}
                  </button>
                )}

                {/* Disabled message for pending steps */}
                {step.status === "pending" && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-3">
                    <Lock className="w-4 h-4" />
                    Locked - Complete previous steps first
                  </p>
                )}

                {/* Completed message */}
                {step.status === "completed" && (
                  <p className="text-xs text-green-600 font-semibold mt-3">
                    ✓ This step is completed
                  </p>
                )}
              </div>

              {/* Divider */}
              {index < timeline.length - 1 && (
                <div className="mt-4 border-b border-gray-200" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-10 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Progress Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Completed:</span>
            <p className="text-lg font-bold text-green-600">
              {timeline.filter((s) => s.status === "completed").length}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Current:</span>
            <p className="text-lg font-bold text-blue-600">
              {timeline.filter((s) => s.status === "current").length}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Pending:</span>
            <p className="text-lg font-bold text-gray-600">
              {timeline.filter((s) => s.status === "pending").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
