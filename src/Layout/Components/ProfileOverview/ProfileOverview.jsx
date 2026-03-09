import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Clock,
  CheckSquare,
  AlertCircle,
  Users,
  Calendar,
  Coins,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

const ProfileOverview = () => {
  // context is provided as { project } from ViewProject
  const { project: projectData } = useOutletContext();

  // derive dynamic values from projectData
  const today = new Date();
  const deadlineDate = projectData?.deadline
    ? new Date(projectData.deadline)
    : null;
  const daysLeft = deadlineDate
    ? Math.max(0, Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)))
    : "-";

  const completeTasks = projectData?.completeTask ?? 0;
  const totalTasks = projectData?.totalTasks ?? 0;

  const timeline = projectData?.timeline || [];
  const completedSteps = timeline.filter(
    (t) => t.status === "completed",
  ).length;
  const progressPercent = timeline.length
    ? Math.round((completedSteps / timeline.length) * 100)
    : 0;

  const issuesCount = projectData?.issues ?? 0;
  const teamCount = projectData?.assignedTeam?.length ?? 0;

  const formattedStart = projectData?.createdAt
    ? new Date(projectData.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";
  const formattedEnd = deadlineDate
    ? deadlineDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  // Framer Motion animation variants for smooth staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    // Wrapper using your background color and Outfit font
    <div
      className="min-h-screen p-3 flex justify-center rounded-xl"
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      <motion.div
        className="w-full space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ============================== */}
        {/* PART 1: DESCRIPTION OVERVIEW   */}
        {/* ============================== */}
        <motion.div
          variants={itemVariants}
          className="bg-toiral-bg-light p-6 md:p-8 rounded-2xl shadow-sm border border-toiral-light/50"
        >
          <h2 className="text-xl md:text-2xl font-bold text-toiral-dark mb-3">
            Project Overview
          </h2>
          <p className="text-toiral-dark/80 leading-relaxed text-sm md:text-base text-justify">
            {projectData?.projectDescription || "No description provided."}
          </p>
        </motion.div>

        {/* ============================== */}
        {/* PART 2: PROGRESS & STATS       */}
        {/* ============================== */}
        <motion.div
          variants={itemVariants}
          className="bg-toiral-bg-light p-6 md:p-8 rounded-2xl shadow-sm border border-toiral-light/50"
        >
          <h2 className="text-xl md:text-2xl font-bold text-toiral-dark mb-6">
            Current Progress
          </h2>

          {/* Progress Bar Section */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-toiral-dark/80 uppercase tracking-wider">
                Completion Rate
              </span>
              <span className="text-2xl font-bold text-toiral-primary">
                {progressPercent}%
              </span>
            </div>
            {/* Bar Background */}
            <div className="h-3 md:h-4 w-full bg-toiral-light rounded-full overflow-hidden">
              {/* Bar Fill */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="h-full bg-toiral-primary rounded-full relative"
              >
                {/* Subtle shine effect on progress bar */}
                <div className="absolute top-0 left-0 w-full h-full bg-white/20" />
              </motion.div>
            </div>
          </div>

          {/* 4 Stats Grid (2 columns on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Clock />} title="Days Left" value={daysLeft} />
            <StatCard
              icon={<CheckSquare />}
              title="Tasks Done"
              value={`${completeTasks}/${totalTasks}`}
            />
            <StatCard
              icon={<AlertCircle />}
              title="Issues"
              value={issuesCount}
            />
            <StatCard icon={<Users />} title="Team" value={teamCount} />
          </div>
        </motion.div>

        {/* ============================== */}
        {/* PART 3: KEY DETAILS            */}
        {/* ============================== */}
        <motion.div
          variants={itemVariants}
          className="bg-toiral-bg-light p-6 md:p-8 rounded-2xl shadow-sm border border-toiral-light/50"
        >
          <h2 className="text-xl md:text-2xl font-bold text-toiral-dark mb-6">
            Key Details
          </h2>

          {/* 3 Detail Cards (1 column mobile, 3 on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailCard
              icon={<Calendar />}
              label="Project Start"
              value={formattedStart}
            />
            <DetailCard
              icon={<Calendar />}
              label="Project End"
              value={formattedEnd}
            />
            <DetailCard
              icon={<Coins />}
              label="Project Cost"
              value={
                projectData?.projectCost
                  ? `${projectData.projectCost.toLocaleString()} TK`
                  : "-"
              }
              highlight
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ==========================================
// Reusable Sub-components for cleaner code
// ==========================================

const StatCard = ({ icon, title, value }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-white/60 rounded-xl border border-toiral-light/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
    <div className="text-toiral-secondary mb-2">
      {React.cloneElement(icon, { size: 28, strokeWidth: 1.5 })}
    </div>
    <h3 className="text-2xl font-bold text-toiral-dark mb-1">{value}</h3>
    <p className="text-xs md:text-sm font-medium text-toiral-dark/60 uppercase tracking-wide text-center">
      {title}
    </p>
  </div>
);

const DetailCard = ({ icon, label, value, highlight }) => (
  <div
    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
      highlight
        ? "bg-toiral-primary/10 border-toiral-primary/30"
        : "bg-white/60 border-toiral-light/30"
    }`}
  >
    <div
      className={`p-3 rounded-lg ${
        highlight
          ? "bg-toiral-primary text-white"
          : "bg-toiral-bg text-toiral-secondary"
      }`}
    >
      {React.cloneElement(icon, { size: 24, strokeWidth: 1.5 })}
    </div>
    <div>
      <p className="text-xs font-semibold text-toiral-dark/60 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className={`text-base md:text-lg font-bold ${highlight ? "text-toiral-primary" : "text-toiral-dark"}`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default ProfileOverview;
