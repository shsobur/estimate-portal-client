import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CircleDashed,
  Clock,
  ChevronRight,
  CreditCard,
  CheckCircle2,
  Pencil,
  X,
  CalendarPlus,
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

  // States for our new Inline Date Editor
  const [editingDateStep, setEditingDateStep] = useState(null);
  const [tempDate, setTempDate] = useState("");

  // ==========================================
  // PROGRESS UPDATE FUNCTION (Auto-move)
  // ==========================================
  const handleAdvanceProgress = () => {
    setTimelineData((prevData) => {
      const currentIndex = prevData.findIndex(
        (item) => item.status === "current",
      );
      if (currentIndex === -1) return prevData;

      const today = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return prevData.map((item, index) => {
        if (index === currentIndex)
          return { ...item, status: "completed", date: today };
        if (index === currentIndex + 1) return { ...item, status: "current" };
        return item;
      });
    });
  };

  // ==========================================
  // MANUAL DATE UPDATE FUNCTIONS
  // ==========================================

  // 1. Convert "Mar 10, 2026" to "2026-03-10" for the HTML date input
  const parseToInputFormat = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toISOString().split("T")[0];
  };

  // 2. Convert "2026-03-10" back to "Mar 10, 2026" for UI display
  const formatToDisplayDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-");
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // 3. Open the editor
  const openDateEditor = (item) => {
    setEditingDateStep(item.step);
    setTempDate(item.date ? parseToInputFormat(item.date) : "");
  };

  // 4. Save the manual date
  const saveManualDate = (step) => {
    setTimelineData((prev) =>
      prev.map((item) => {
        if (item.step === step) {
          return { ...item, date: formatToDisplayDate(tempDate) };
        }
        return item;
      }),
    );
    setEditingDateStep(null); // Close editor
  };

  const completedSteps = timelineData.filter(
    (t) => t.status === "completed",
  ).length;
  const progressPercentage = Math.round(
    (completedSteps / timelineData.length) * 100,
  );

  return (
    <div
      className="min-h-screen bg-toiral-bg p-4 md:p-8 lg:p-12 flex justify-center"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <div className="w-full max-w-3xl">
        {/* Header Section */}
        <div className="bg-toiral-bg-light p-6 md:p-8 rounded-2xl shadow-sm border border-toiral-light/50 mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-toiral-dark mb-2">
            Project Timeline
          </h1>
          <p className="text-toiral-dark/70 mb-6">
            Track and manage the exact status of your project.
          </p>

          <div className="w-full bg-toiral-light h-2.5 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-toiral-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm font-bold text-toiral-primary">
            {progressPercentage}% Completed
          </p>
        </div>

        {/* Timeline Section */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-5 md:left-7 top-4 bottom-12 w-0.75 bg-toiral-light/60 rounded-full" />

          <div className="space-y-6">
            {timelineData.map((item, index) => {
              const isCompleted = item.status === "completed";
              const isCurrent = item.status === "current";
              const isPending = item.status === "pending";
              const isEditingDate = editingDateStep === item.step;

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
                    className={`absolute left-0 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 border-toiral-bg z-10 transition-all duration-500
                    ${isCompleted ? "bg-toiral-primary text-white" : ""}
                    ${isCurrent ? "bg-toiral-secondary text-white shadow-[0_0_15px_rgba(103,168,169,0.5)] scale-110" : ""}
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
                    ${isCurrent ? "bg-white border-toiral-secondary shadow-lg scale-[1.02]" : ""}
                    ${isCompleted ? "bg-toiral-bg-light border-toiral-light/50 opacity-80 hover:opacity-100" : ""}
                    ${isPending ? "bg-white/40 border-transparent opacity-60 hover:opacity-100 transition-opacity" : ""}
                  `}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
                      <h3
                        className={`text-lg md:text-xl font-bold 
                        ${isCurrent ? "text-toiral-dark" : ""}
                        ${isCompleted ? "text-toiral-primary" : ""}
                        ${isPending ? "text-toiral-dark/60" : ""}
                      `}
                      >
                        {item.step}. {item.title}
                      </h3>

                      {/* ================================== */}
                      {/* INLINE DATE EDITOR SYSTEM          */}
                      {/* ================================== */}
                      <div className="flex items-center">
                        <AnimatePresence mode="wait">
                          {isEditingDate ? (
                            <motion.div
                              key="editor"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center gap-1 bg-white border border-toiral-light rounded-lg p-1 shadow-sm"
                            >
                              <input
                                type="date"
                                value={tempDate}
                                onChange={(e) => setTempDate(e.target.value)}
                                className="text-xs md:text-sm p-1 outline-none bg-transparent text-toiral-dark font-medium"
                              />
                              <button
                                onClick={() => saveManualDate(item.step)}
                                className="p-1.5 bg-toiral-primary text-white rounded-md hover:bg-toiral-dark transition-colors"
                                title="Save Date"
                              >
                                <Check size={14} strokeWidth={3} />
                              </button>
                              <button
                                onClick={() => setEditingDateStep(null)}
                                className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                                title="Cancel"
                              >
                                <X size={14} strokeWidth={3} />
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="display"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center group"
                            >
                              {item.date ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-toiral-light/40 text-toiral-dark">
                                  <CheckCircle2
                                    size={12}
                                    className="text-toiral-primary"
                                  />
                                  {item.date}
                                  <button
                                    onClick={() => openDateEditor(item)}
                                    className="ml-1 opacity-40 hover:opacity-100 hover:text-toiral-primary transition-all"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                </span>
                              ) : (
                                <button
                                  onClick={() => openDateEditor(item)}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-dashed border-toiral-light text-toiral-dark/50 hover:text-toiral-primary hover:border-toiral-primary hover:bg-toiral-light/20 transition-all"
                                >
                                  <CalendarPlus size={12} /> Set Date
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* ================================== */}
                    </div>

                    <p
                      className={`text-sm md:text-base leading-relaxed mb-4
                      ${isCurrent ? "text-toiral-dark/80" : "text-toiral-dark/60"}
                    `}
                    >
                      {item.description}
                    </p>

                    {item.payment && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fff8e6] border border-[#f0d699] text-[#b38210] text-xs md:text-sm font-bold rounded-lg mb-2">
                        <CreditCard size={14} />
                        Requires {item.payment}% Payment
                      </div>
                    )}

                    {isCurrent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-toiral-light/30 flex flex-col sm:flex-row justify-between items-center gap-3"
                      >
                        <span className="text-xs font-bold text-toiral-secondary uppercase tracking-wider flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-toiral-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-toiral-secondary"></span>
                          </span>
                          Waiting for Action
                        </span>

                        <button
                          onClick={handleAdvanceProgress}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-toiral-dark hover:bg-toiral-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
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
              className="mt-8 p-6 bg-linear-to-r from-toiral-primary to-toiral-secondary text-white rounded-2xl text-center shadow-lg"
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
