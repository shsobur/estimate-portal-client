import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Clock,
  CheckSquare,
  AlertCircle,
  Users,
  Calendar,
  Coins,
  PencilLine,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import ProjectOverviewEditModal from "../ProjectOverviewEditModal/ProjectOverviewEditModal";

const ProjectOverview = () => {
  const { project: projectData } = useOutletContext();

  // State to control our new modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Derive dynamic values
  const today = new Date();
  const deadlineDate = projectData?.deadline
    ? new Date(projectData.deadline)
    : null;
  const daysLeft = deadlineDate
    ? Math.max(0, Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)))
    : "-";

  const completeTasks = projectData?.completeTask ?? 0;
  const totalTasks = projectData?.totalTasks ?? 0;

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

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // The function that the Modal will call when it has the changed data ready
  const handleApiUpdate = async (changedData) => {
    // Fake API delay so you can see the professional loading spinner on the button
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("SENDING THIS TO BACKEND API:", changedData);

    // TODO: Put your actual axios/fetch call here:
    // await axios.patch(`/api/projects/${projectData._id}`, changedData);
  };

  return (
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
        {/* PART 1: HEADER & OVERVIEW      */}
        {/* ============================== */}
        <motion.div
          variants={itemVariants}
          className="bg-toiral-bg-light p-6 md:p-8 rounded-2xl shadow-sm border border-toiral-light/50 transition-all duration-300 hover:border-toiral-primary/40 hover:shadow-[0_0_20px_rgba(20,148,153,0.15)] cursor-pointer group"
        >
          {/* Header Row with Edit Button */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-toiral-dark">
              Project Overview
            </h2>

            {/* The Professional Edit Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-white border border-toiral-light text-toiral-dark px-4 py-2 rounded-xl text-sm font-semibold hover:bg-toiral-primary hover:text-white hover:border-toiral-primary transition-all duration-300 cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
            >
              <PencilLine size={16} />
              <span>Edit Details</span>
            </button>
          </div>

          <p className="text-toiral-dark/80 leading-relaxed text-sm md:text-base text-justify">
            {projectData?.projectDescription || "No description provided."}
          </p>
        </motion.div>

        {/* ============================== */}
        {/* PART 2: PROGRESS & STATS       */}
        {/* ============================== */}
        <motion.div
          variants={itemVariants}
          className="bg-toiral-bg-light p-6 md:p-8 rounded-2xl shadow-sm border border-toiral-light/50 transition-all duration-300 hover:border-toiral-primary/40 hover:shadow-[0_0_20px_rgba(20,148,153,0.15)] cursor-pointer"
        >
          <h2 className="text-xl md:text-2xl font-bold text-toiral-dark mb-6">
            Current Progress
          </h2>

          <div className="mb-8 cursor-pointer">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-toiral-dark/80 uppercase tracking-wider">
                Completion Rate
              </span>
              <span className="text-2xl font-bold text-toiral-primary">
                {Math.ceil(projectData?.progress || 0)}%
              </span>
            </div>
            <div className="h-3 md:h-4 w-full bg-toiral-light rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.ceil(projectData?.progress || 0)}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="h-full bg-toiral-primary rounded-full relative"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/20" />
              </motion.div>
            </div>
          </div>

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
          className="bg-toiral-bg-light p-6 md:p-8 rounded-2xl shadow-sm border border-toiral-light/50 transition-all duration-300 hover:border-toiral-primary/40 hover:shadow-[0_0_20px_rgba(20,148,153,0.15)] cursor-pointer"
        >
          <h2 className="text-xl md:text-2xl font-bold text-toiral-dark mb-6">
            Key Details
          </h2>

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

      {/* Render the Modal */}
      <ProjectOverviewEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={projectData._id}
        projectData={projectData}
        onSubmitApi={handleApiUpdate}
      />
    </div>
  );
};

// ==========================================
// Reusable Sub-components (Updated with Glow Hover)
// ==========================================

const StatCard = ({ icon, title, value }) => (
  // Removed translate-y, added cursor-pointer and glow effect
  <div className="flex flex-col items-center justify-center p-4 bg-white/60 rounded-xl border border-toiral-light/30 transition-all duration-300 hover:border-toiral-primary/50 hover:shadow-[0_0_15px_rgba(20,148,153,0.2)] cursor-pointer">
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
  // Added cursor-pointer and glow effect
  <div
    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(20,148,153,0.2)] hover:border-toiral-primary/50 ${
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

export default ProjectOverview;
