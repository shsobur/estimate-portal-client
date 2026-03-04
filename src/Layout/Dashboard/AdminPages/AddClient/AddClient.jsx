import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
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

// ====== Status Color Helper ======
const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-600";
    case "On progress":
      return "bg-toiral-light text-toiral-primary";
    case "Stop":
      return "bg-red-100 text-red-600";
    case "Complete":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// ====== Main Component ======
const AddClient = () => {
  const { api } = useAxios();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortStatus, setSortStatus] = useState("All");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const menuRef = useRef(null);

  // ====== Fetch Clients with TanStack Query ======
  // Search goes to backend, status filter is client-side__
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

      // Default sort: newest first__
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

  // ====== Refresh Handler ======
  const handleRefresh = () => {
    refetch();
  };

  // ====== Menu Toggle ======
  const handleToggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  // Close menu on outside click__
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full bg-toiral-bg px-2.5 md:px-5 py-6 flex flex-col gap-6 rounded-xl">
      {/* Top Part: Title + Button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-toiral-dark">Clients</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and add new clients to your projects
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-toiral-primary hover:bg-toiral-primary/90 text-white font-semibold px-4 py-2.5 rounded-2xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {/* Search + Sort + Refresh */}
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:border-toiral-primary rounded-2xl py-3 pl-10 pr-4 text-sm shadow-sm transition-all"
          />
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>

        {/* Status Filter + Refresh */}
        <div className="flex gap-4">
          <select
            value={sortStatus}
            onChange={(e) => setSortStatus(e.target.value)}
            className="flex-1 md:flex-none md:w-45 bg-white border border-gray-200 focus:border-toiral-primary rounded-2xl py-3 px-4 text-sm shadow-sm transition-all"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="On progress">On Progress</option>
            <option value="Stop">Stop</option>
            <option value="Complete">Complete</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-toiral-primary px-4 py-2.5 rounded-2xl transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="col-span-full py-12 text-center text-gray-500">
          Loading clients...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <motion.div
                key={client._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-5 shadow-soft relative flex flex-col justify-between"
              >
                {/* Three Dot Menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => handleToggleMenu(client._id)}
                    className="p-1 hover:bg-toiral-light rounded-full cursor-pointer transition-all"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>

                  {menuOpenId === client._id && (
                    <motion.div
                      ref={menuRef}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-0 top-full mt-2 w-32 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-10"
                    >
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-toiral-light">
                        <Edit className="w-4 h-4 text-toiral-primary" />
                        Edit
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Client Info */}
                <div>
                  <h3 className="text-lg font-semibold text-toiral-dark">
                    {client.clientName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{client.email}</p>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      client.status,
                    )}`}
                  >
                    {client.status}
                  </span>

                  <p className="text-xs text-gray-400 mt-3">
                    Added on {formatDate(client.createdAt)} at{" "}
                    {formatTime(client.createdAt)}
                  </p>
                </div>

                {/* View Button (non-functional for now) */}
                <div className="flex items-center justify-start mt-4">
                  <button className="px-4 py-1.5 bg-toiral-light hover:bg-toiral-primary/20 text-toiral-primary font-medium rounded-2xl flex items-center gap-1 cursor-pointer transition-all">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No clients found. Try adjusting your search or filters.
            </div>
          )}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <AddClientModal
            onClose={() => {
              setShowAddModal(false);
              queryClient.invalidateQueries({ queryKey: ["clients"] }); // auto refresh after add__
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default AddClient;