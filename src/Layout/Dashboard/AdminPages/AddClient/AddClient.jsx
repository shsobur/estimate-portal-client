import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  RefreshCw,
  Calendar,
  Mail,
  ChevronDown,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import AddClientModal from "../../../Components/AddClientModal/AddClientModal";
import useAxios from "../../../../Hooks/useAxios";

// ====== Date Formatting Helpers ======
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const AddClient = () => {
  const { api } = useAxios();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortStatus, setSortStatus] = useState("All");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // ====== Fetch Clients with TanStack Query ======
  const {
    data: clients = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["clients", searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      // Default sort: newest first
      params.append("sort", "createdAt");
      params.append("order", "desc");

      const res = await api.get(`/admin-api/clients?${params.toString()}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  // ====== Apply Status Filter (client-side) ======
  const filteredClients =
    sortStatus === "All"
      ? clients
      : clients.filter((client) => client.status === sortStatus);

  // ====== Status Color Helper (Using strict theme classes) ======
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "On progress":
        return "bg-toiral-bg text-toiral-primary border-toiral-light";
      case "Stop":
        return "bg-red-100 text-red-600 border-red-200";
      case "Complete":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    // 1. FIXED OVERALL LAYOUT
    <div className="fixed inset-0 w-full h-screen bg-toiral-bg-light overflow-hidden">
      {/* 2. INNER SCROLLABLE AREA */}
      <div className="w-full h-full overflow-y-auto pt-10 pb-48 px-4 md:px-6 flex flex-col gap-6">
        {/* ================= TOP PART ================= */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-toiral-bg"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-toiral-dark tracking-tight leading-none">
              Clients
            </h1>
            <p className="text-toiral-secondary text-sm md:text-base mt-2">
              Manage and add new clients to your projects.
            </p>
          </div>

          <motion.button
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="bg-toiral-primary hover:bg-toiral-dark text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-toiral-primary/20 cursor-pointer text-base"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span className="hidden md:inline">Add Client</span>
            <span className="inline md:hidden">Add</span>
          </motion.button>
        </motion.div>

        {/* ================= MIDDLE PART ================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-toiral-bg hover:border-toiral-light focus:border-toiral-primary rounded-xl pl-12 pr-5 py-3 text-toiral-dark text-base font-medium outline-none transition-all shadow-sm"
            />
          </div>

          {/* Filters and Refresh */}
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-52 group">
              <select
                value={sortStatus}
                onChange={(e) => setSortStatus(e.target.value)}
                className="w-full bg-white border border-toiral-bg hover:border-toiral-light focus:border-toiral-primary rounded-xl pl-5 pr-12 py-3 text-toiral-dark text-base font-medium appearance-none outline-none transition-all shadow-sm cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="On progress">On Progress</option>
                <option value="Stop">Stop</option>
                <option value="Complete">Complete</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-toiral-secondary pointer-events-none group-focus-within:text-toiral-primary transition-colors"
                size={20}
              />
            </div>

            {/* FIXED: Standard button with standard css animation for flawless fetching status */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-white border border-toiral-bg p-3 rounded-xl text-toiral-primary shadow-sm hover:border-toiral-primary hover:bg-toiral-bg transition-colors flex items-center justify-center cursor-pointer aspect-square disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={20}
                strokeWidth={2.5}
                className={isFetching ? "animate-spin" : ""}
              />
            </button>
          </div>
        </motion.div>

        {/* ================= BOTTOM PART (CARDS) ================= */}
        {isLoading ? (
          <div className="w-full py-16 text-center text-toiral-secondary font-medium text-lg">
            Loading clients...
          </div>
        ) : (
          // FIXED: Removed container variants. Using a standard grid to prevent stagger delays
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <motion.div
                  key={client._id}
                  layout // Smoothly repositions cards when filtering/sorting
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-toiral-bg hover:shadow-lg hover:shadow-toiral-light/30 hover:border-toiral-light/80 transition-all flex flex-col gap-4 group cursor-pointer relative"
                >
                  {/* Top Row: Title, Email, Status & Dots */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-bold text-lg text-toiral-dark leading-tight group-hover:text-toiral-primary transition-colors truncate">
                        {client.clientName}
                      </h3>
                      <div className="flex items-center gap-2 text-toiral-secondary text-sm font-medium mt-2">
                        <Mail size={16} />
                        <span className="truncate">{client.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border ${getStatusStyle(client.status)}`}
                      >
                        {client.status}
                      </span>

                      {/* 3-Dot Menu Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(
                            openDropdownId === client._id ? null : client._id,
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
                    {openDropdownId === client._id && (
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

                  {/* Empty spacer to push footer to the bottom seamlessly */}
                  <div className="mt-auto" />

                  {/* Footer: Date Added */}
                  <div className="pt-3.5 border-t border-toiral-bg flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-toiral-secondary">
                      <Calendar size={16} />
                      <span className="font-medium text-sm">Added on</span>
                    </div>
                    <span className="font-bold text-toiral-dark text-sm text-right">
                      {formatDate(client.createdAt)}{" "}
                      <br className="hidden md:block lg:hidden" />
                      <span className="text-xs text-toiral-secondary font-medium ml-1">
                        {formatTime(client.createdAt)}
                      </span>
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full w-full py-16 text-center text-toiral-secondary font-medium text-2xl">
                No clients found. Try adjusting your search or filters.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-toiral-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <AddClientModal
              onClose={() => {
                setShowAddModal(false);
                queryClient.invalidateQueries({ queryKey: ["clients"] });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddClient;