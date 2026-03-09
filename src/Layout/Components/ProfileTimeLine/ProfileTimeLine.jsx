import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Check,
  CircleDashed,
  Clock,
  ChevronRight,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

const initialTimeline = [
  {
    step: 1,
    title: "Discovery",
    description: "Initial meeting to understand project goals.",
    status: "completed",
    date: "Mar 8, 2026",
  },
  {
    step: 2,
    title: "Project Planning",
    description: "Define features, timeline, and tech stack.",
    status: "completed",
    date: "Mar 10, 2026",
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

const ProjectTimeline = () => {
  const [timelineData, setTimelineData] = useState(initialTimeline);

  // ==========================================
  // FIXED UPDATE FUNCTION
  // ==========================================
  const handleAdvanceProgress = () => {
    setTimelineData((prevData) => {
      // Find where we currently are
      const currentIndex = prevData.findIndex(
        (item) => item.status === "current",
      );

      // If nothing is current, just return the data as is
      if (currentIndex === -1) return prevData;

      const today = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Create a deeply fresh array using .map() to prevent React Strict Mode double-jumping
      const newData = prevData.map((item, index) => {
        // 1. Update the item we just completed
        if (index === currentIndex) {
          return { ...item, status: "completed", date: today };
        }
        // 2. Update the very next item to be the new 'current' one
        if (index === currentIndex + 1) {
          return { ...item, status: "current" };
        }
        // 3. Leave all other items exactly as they are
        return item;
      });

      // TODO: API Call goes here (e.g., axios.post('/api/timeline/update', { timeline: newData }))

      return newData;
    });
  };

  const completedSteps = timelineData.filter(
    (t) => t.status === "completed",
  ).length;
  const progressPercentage = Math.round(
    (completedSteps / timelineData.length) * 100,
  );

  return (
    <div
      className="min-h-screen bg-[var(--color-toiral-bg)] p-4 md:p-8 lg:p-12 flex justify-center"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="w-full max-w-3xl">
        {/* Header Section */}
        <div className="bg-[var(--color-toiral-bg-light)] p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--color-toiral-light)]/50 mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-toiral-dark)] mb-2">
            Project Timeline
          </h1>
          <p className="text-[var(--color-toiral-dark)]/70 mb-6">
            Track the exact status of your project in real-time.
          </p>

          {/* Top Progress Bar */}
          <div className="w-full bg-[var(--color-toiral-light)] h-2.5 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-[var(--color-toiral-primary)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm font-bold text-[var(--color-toiral-primary)]">
            {progressPercentage}% Completed
          </p>
        </div>

        {/* Timeline Section */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-[28px] top-4 bottom-12 w-[3px] bg-[var(--color-toiral-light)]/60 rounded-full" />

          <div className="space-y-6">
            {timelineData.map((item, index) => {
              const isCompleted = item.status === "completed";
              const isCurrent = item.status === "current";
              const isPending = item.status === "pending";

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4 md:gap-6 pl-12 md:pl-16"
                >
                  {/* Timeline Dot/Icon */}
                  <div
                    className={`absolute left-0 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 border-[var(--color-toiral-bg)] z-10 transition-all duration-500
                    ${isCompleted ? "bg-[var(--color-toiral-primary)] text-white" : ""}
                    ${isCurrent ? "bg-[var(--color-toiral-secondary)] text-white shadow-[0_0_15px_rgba(103,168,169,0.5)] scale-110" : ""}
                    ${isPending ? "bg-[var(--color-toiral-light)] text-[var(--color-toiral-dark)]/40" : ""}
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
                    ${isCurrent ? "bg-white border-[var(--color-toiral-secondary)] shadow-lg scale-[1.02]" : ""}
                    ${isCompleted ? "bg-[var(--color-toiral-bg-light)] border-[var(--color-toiral-light)]/50 opacity-80 hover:opacity-100" : ""}
                    ${isPending ? "bg-white/40 border-transparent opacity-60" : ""}
                  `}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                      <h3
                        className={`text-lg md:text-xl font-bold 
                        ${isCurrent ? "text-[var(--color-toiral-dark)]" : ""}
                        ${isCompleted ? "text-[var(--color-toiral-primary)]" : ""}
                        ${isPending ? "text-[var(--color-toiral-dark)]/60" : ""}
                      `}
                      >
                        {item.step}. {item.title}
                      </h3>

                      {/* Date Badge */}
                      {item.date && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--color-toiral-light)]/40 text-[var(--color-toiral-dark)] w-fit">
                          <CheckCircle2
                            size={12}
                            className="text-[var(--color-toiral-primary)]"
                          />{" "}
                          {item.date}
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm md:text-base leading-relaxed mb-4
                      ${isCurrent ? "text-[var(--color-toiral-dark)]/80" : "text-[var(--color-toiral-dark)]/60"}
                    `}
                    >
                      {item.description}
                    </p>

                    {/* Payment Badge */}
                    {item.payment && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fff8e6] border border-[#f0d699] text-[#b38210] text-xs md:text-sm font-bold rounded-lg mb-4">
                        <CreditCard size={14} />
                        Requires {item.payment}% Payment
                      </div>
                    )}

                    {/* ACTION AREA */}
                    {isCurrent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-[var(--color-toiral-light)]/30 flex flex-col sm:flex-row justify-between items-center gap-3"
                      >
                        <span className="text-xs font-bold text-[var(--color-toiral-secondary)] uppercase tracking-wider flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-toiral-secondary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-toiral-secondary)]"></span>
                          </span>
                          Waiting for Action
                        </span>

                        <button
                          onClick={handleAdvanceProgress}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--color-toiral-dark)] hover:bg-[var(--color-toiral-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
                        >
                          Mark Completed <ChevronRight size={16} />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {progressPercentage === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-[var(--color-toiral-primary)] to-[var(--color-toiral-secondary)] text-white rounded-2xl text-center shadow-lg"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-1">
                Project Fully Completed! 🎉
              </h3>
              <p className="text-white/90 text-sm md:text-base">
                All steps in the timeline have been successfully achieved.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
