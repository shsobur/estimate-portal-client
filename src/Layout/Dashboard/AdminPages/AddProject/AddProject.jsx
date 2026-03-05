import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  RefreshCw,
  Calendar,
  User,
  ChevronDown,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import AddProjectModal from "../../../Components/AddProjectModal/AddProjectModal";

// --- DUMMY DATA ---
const dummyProjects = [
  {
    id: 1,
    name: "E-commerce Redesign",
    client: "Mojibur",
    progress: 75,
    status: "In Progress",
    dueDate: "Oct 24, 2024",
  },
  {
    id: 2,
    name: "Brand Identity",
    client: "Sarah Jenkins",
    progress: 20,
    status: "Pending",
    dueDate: "Nov 02, 2024",
  },
  {
    id: 3,
    name: "Mobile App MVP",
    client: "TechCorp Inc.",
    progress: 100,
    status: "Continue",
    dueDate: "Sep 15, 2024",
  },
  {
    id: 4,
    name: "Marketing Website",
    client: "Alice Wonderland",
    progress: 45,
    status: "Stopped",
    dueDate: "Dec 10, 2024",
  },
  {
    id: 5,
    name: "SEO Optimization",
    client: "Mojibur",
    progress: 90,
    status: "In Progress",
    dueDate: "Oct 28, 2024",
  },
  {
    id: 6,
    name: "Cloud Migration",
    client: "TechCorp Inc.",
    progress: 10,
    status: "Pending",
    dueDate: "Jan 15, 2025",
  },
  {
    id: 7,
    name: "System Update",
    client: "TechCorp Inc.",
    progress: 10,
    status: "Pending",
    dueDate: "Jan 15, 2025",
  },
  {
    id: 8,
    name: "API Integration",
    client: "TechCorp Inc.",
    progress: 10,
    status: "Pending",
    dueDate: "Jan 15, 2025",
  },
];

const AddProject = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [projects, setProjects] = useState(dummyProjects);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // ====== Modal State ======
  const [showAddModal, setShowAddModal] = useState(false);

  // Trigger refresh animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "In Progress":
        return "bg-[#e4f0ef] text-[#149499] border-[#bbdad9]";
      case "Stopped":
        return "bg-red-100 text-red-600 border-red-200";
      case "Continue":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    // 1. FIXED OVERALL LAYOUT
    <div className="fixed inset-0 w-full h-screen bg-toiral-bg-light overflow-hidden">
      {/* 2. INNER SCROLLABLE AREA (Scrollbar handled by index.css globally) */}
      <div className="w-full h-full overflow-y-auto pt-10 pb-48 px-4 md:px-6 flex flex-col gap-6">
        {/* ================= TOP PART ================= */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-toiral-bg"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-toiral-dark tracking-tight leading-none">
              Projects Overview
            </h1>
            <p className="text-toiral-secondary text-sm md:text-base mt-2">
              Manage, track, and add latest projects.
            </p>
          </div>

          <motion.button
            onClick={() => setShowAddModal(true)} // <-- Added onClick to open modal
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="bg-toiral-primary hover:bg-toiral-dark text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-toiral-primary/20 cursor-pointer text-base"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span className="hidden md:inline">Add Project</span>
            <span className="inline md:hidden">Add</span>
          </motion.button>
        </motion.div>

        {/* ================= MIDDLE PART ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-5 w-full"
        >
          {/* Search Bar */}
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-toiral-secondary group-focus-within:text-toiral-primary transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-white border border-toiral-bg hover:border-toiral-light focus:border-toiral-primary rounded-xl pl-12 pr-5 py-3 text-toiral-dark text-base font-medium outline-none transition-all shadow-sm"
            />
          </div>

          {/* Filters and Refresh */}
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-52 group">
              <select className="w-full bg-white border border-toiral-bg hover:border-toiral-light focus:border-toiral-primary rounded-xl pl-5 pr-12 py-3 text-toiral-dark text-base font-medium appearance-none outline-none transition-all shadow-sm cursor-pointer">
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Stopped">Stopped</option>
                <option value="Continue">Continue</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-toiral-secondary pointer-events-none group-focus-within:text-toiral-primary transition-colors"
                size={20}
              />
            </div>

            <motion.button
              onClick={handleRefresh}
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="bg-white border border-toiral-bg p-3 rounded-xl text-toiral-primary shadow-sm hover:border-toiral-primary hover:bg-toiral-bg transition-colors flex items-center justify-center cursor-pointer aspect-square"
            >
              <RefreshCw size={20} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>

        {/* ================= BOTTOM PART (CARDS) ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-toiral-bg hover:shadow-lg hover:shadow-toiral-light/30 hover:border-toiral-light/80 transition-all flex flex-col gap-4 group cursor-pointer relative"
            >
              {/* Top Row: Title, Client, Status & Dots */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-lg text-toiral-dark leading-tight group-hover:text-toiral-primary transition-colors truncate">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 text-toiral-secondary text-sm font-medium mt-2">
                    <User size={16} />
                    <span className="truncate">{project.client}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border ${getStatusStyle(project.status)}`}
                  >
                    {project.status}
                  </span>

                  {/* 3-Dot Menu Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(
                        openDropdownId === project.id ? null : project.id,
                      );
                    }}
                    className="p-1.5 text-toiral-secondary hover:text-toiral-primary hover:bg-toiral-bg rounded-xl transition-colors cursor-pointer"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {openDropdownId === project.id && (
                  <>
                    {/* Invisible overlay to handle click-outside */}
                    <div
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(null);
                      }}
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-5 top-14 w-40 bg-white border border-toiral-bg shadow-xl rounded-2xl p-2 z-20 flex flex-col gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-base font-medium text-toiral-dark hover:bg-toiral-bg-light hover:text-toiral-primary rounded-xl transition-colors cursor-pointer">
                        <Eye size={18} /> View
                      </button>
                      <button className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-base font-medium text-toiral-dark hover:bg-toiral-bg-light hover:text-toiral-primary rounded-xl transition-colors cursor-pointer">
                        <Edit2 size={18} /> Edit
                      </button>
                      <button className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                        <Trash2 size={18} /> Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Progress Bar Component */}
              <div className="mt-auto flex flex-col gap-2.5 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-toiral-dark text-sm">
                    Progress
                  </span>
                  <span className="font-bold text-toiral-primary text-sm">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-toiral-bg h-2.5 rounded-xl overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${project.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                    className="bg-linear-to-r from-toiral-primary to-toiral-secondary h-full rounded-xl relative"
                  />
                </div>
              </div>

              {/* Footer: Due Date */}
              <div className="pt-3.5 border-t border-toiral-bg flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-toiral-secondary">
                  <Calendar size={16} />
                  <span className="font-medium text-sm">Due Date</span>
                </div>
                <span className="font-bold text-toiral-dark text-sm">
                  {project.dueDate}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ================= ADD PROJECT MODAL ================= */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-toiral-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <AddProjectModal
              onClose={() => {
                setShowAddModal(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProject;