import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Home,
  Folder,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import ClientProfilePanel from "../Components/ClientProfilePanel/ClientProfilePanel";

const Dashboard = ({ role }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const isClient = role === "client";

  const user = {
    name: isClient ? "Sobur Hossen" : "John Doe",
    role: isClient ? "Client" : "Product Director",
    avatar:
      "https://ui-avatars.com/api/?name=Sobur+Hossen&background=14B8A6&color=fff&size=150",
    email: isClient ? "sobur@example.com" : "john@toiral.com",
    initials: isClient ? "SH" : "JD",
  };

  const sidebarLinks = isClient
    ? [
        {
          icon: <Home className="w-5 h-5" />,
          label: "Overview",
          path: "/dashboard/client/overview",
        },
        {
          icon: <Folder className="w-5 h-5" />,
          label: "My Projects",
          path: "/dashboard/client/projects",
        },
        {
          icon: <MessageSquare className="w-5 h-5" />,
          label: "Messages",
          path: "/dashboard/client/messages",
        },
        {
          icon: <Settings className="w-5 h-5" />,
          label: "Settings",
          path: "/dashboard/client/settings",
        },
      ]
    : [
        {
          icon: <LayoutDashboard className="w-5 h-5" />,
          label: "Overview",
          path: "/dashboard/admin/overview",
        },
        {
          icon: <Folder className="w-5 h-5" />,
          label: "Add Client",
          path: "/dashboard/admin/add-client",
        },
        {
          icon: <Users className="w-5 h-5" />,
          label: "Add Project",
          path: "/dashboard/admin/add-project",
        },
        {
          icon: <Users className="w-5 h-5" />,
          label: "Invoice",
          path: "/dashboard/admin/invoice",
        },
        {
          icon: <Settings className="w-5 h-5" />,
          label: "Settings",
          path: "/dashboard/admin/settings",
        },
      ];

  return (
    <div className="min-h-screen bg-[#DEEDEC] p-3 md:p-5 flex gap-5 overflow-hidden">
      {/* ==================== SIDEBAR with Framer Motion ==================== */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <div
            className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden flex flex-col border border-white/50`}
          >
            {/* Logo Section */}
            <div className="h-20 px-6 flex items-center justify-between bg-linear-to-r from-teal-600 to-teal-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">T</span>
                </div>
                <div>
                  <span className="font-bold text-2xl text-white">Toiral</span>
                  <p className="text-xs text-teal-100">Project Management</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-white/20 rounded-xl text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="mx-4 mt-6 p-4 bg-linear-to-br from-teal-50 to-teal-100/50 rounded-xl border border-teal-200/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {user.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-sm text-teal-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">
                Menu
              </p>
              {sidebarLinks.map((item, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-linear-to-r hover:from-teal-50 hover:to-teal-100/50 rounded-xl mb-1 text-slate-600 hover:text-teal-600 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 group-hover:text-teal-500 transition-colors">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MAIN AREA ==================== */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        {/* ==================== TOP BAR - Responsive ==================== */}
        <div className="relative h-20 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 flex items-center justify-between px-3 sm:px-6 min-[640px]:px-2.5">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 hover:bg-teal-50 rounded-xl text-slate-600 hover:text-teal-600 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Responsive Search Bar */}
            <div className="relative flex-1 max-w-md">
              {/* Desktop/Tablet Search (above 475px) */}
              <div className="hidden min-[475px]:block">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500 rounded-xl py-3 pl-12 pr-4 text-sm placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* Mobile Search (below 475px) - FIXED PERFECT CENTERING */}
              <div className="min-[475px]:hidden">
                <AnimatePresence>
                  {!searchExpanded ? (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSearchExpanded(true)}
                      className="p-2.5 hover:bg-teal-50 rounded-xl text-slate-600 hover:text-teal-600 transition-all"
                    >
                      <Search className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "calc(100vw - 24px)", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 200,
                      }}
                      className="fixed left-3 right-3 z-50 flex items-center"
                      style={{ top: "calc(0.75rem + 1.75rem)" }}
                    >
                      <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          autoFocus
                          onBlur={() => setSearchExpanded(false)}
                          className="w-full bg-white border-2 border-teal-500 rounded-xl py-3 pl-12 pr-4 text-sm placeholder-slate-400 outline-none shadow-xl"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Profile Section - Hidden when search is expanded on mobile */}
          <AnimatePresence>
            {!searchExpanded && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => isClient && setProfileOpen(true)}
                  className="flex items-center gap-2 sm:gap-3 hover:bg-teal-50 px-2 sm:px-3 py-2 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 min-[640px]:w-9 min-[640px]:h-9 sm:w-10 sm:h-10 bg-linear-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user.initials}
                  </div>
                  <div className="text-left hidden min-[640px]:block">
                    <p className="font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-teal-600 transition-colors truncate max-w-25">
                      {user.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 hidden min-[640px]:block group-hover:text-teal-500 transition-colors" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ==================== CONTENT AREA ==================== */}
        <div className="flex-1 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="h-full overflow-auto p-2 md:p-3">
            {/* Content goes here - Outlet will render child routes */}
            <Outlet />
          </div>
        </div>
      </div>

      {/* Client Profile Panel - FIXED SMOOTH ANIMATION WITH PROPER SPACING */}
      <AnimatePresence>
        {isClient && profileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-60"
            />

            {/* Profile Panel - Same spacing as sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-3 pl-5 pr-5 right-0 md:top-5 md:right-2 bottom-3 md:bottom-5 w-full md:w-120 z-70"
            >
              <ClientProfilePanel
                user={user}
                onClose={() => setProfileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
