import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import ClientProfilePanel from "../Components/ClientProfilePanel/ClientProfilePanel";

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isClient = role === "client";

  const user = {
    name: isClient ? "Sobur Hossen" : "John Doe",
    role: isClient ? "Client" : "Product Director",
    avatar: "https://via.placeholder.com/150",
    email: isClient ? "sobur@example.com" : "john@toiral.com",
  };

  const sidebarLinks = isClient
    ? [
        { icon: "🏠", label: "Overview", path: "/dashboard/client/overview" },
        {
          icon: "📁",
          label: "My Projects",
          path: "/dashboard/client/projects",
        },
        { icon: "💬", label: "Messages", path: "/dashboard/client/messages" },
        { icon: "⚙️", label: "Settings", path: "/dashboard/client/settings" },
      ]
    : [
        { icon: "🏠", label: "Overview", path: "/dashboard/admin/overview" },
        {
          icon: "📁",
          label: "All Projects",
          path: "/dashboard/admin/projects",
        },
        { icon: "👥", label: "Clients", path: "/dashboard/admin/clients" },
        { icon: "👥", label: "Team", path: "/dashboard/admin/team" },
        { icon: "⚙️", label: "Settings", path: "/dashboard/admin/settings" },
      ];

  return (
    <div className="h-screen bg-toiral-bg p-3 md:p-4 flex gap-4 overflow-hidden">
      {/* ==================== SIDEBAR ==================== */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white rounded-xl shadow-soft overflow-hidden flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 border-b px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-toiral-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="font-bold text-2xl text-toiral-dark">Toiral</span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-toiral-light rounded-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {sidebarLinks.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-toiral-light rounded-xl mb-1 text-toiral-dark transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl">
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* ==================== MAIN AREA ==================== */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* ==================== TOP BAR ==================== */}
        <div className="h-20 bg-white rounded-xl shadow-soft flex items-center px-4 md:px-8">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-toiral-light rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search projects, clients..."
                className="w-full bg-toiral-light border border-transparent focus:border-toiral-primary rounded-xl py-3 pl-11 text-sm"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Profile */}
          <button
            onClick={() => isClient && setProfileOpen(true)}
            className="flex items-center gap-3 hover:bg-toiral-light px-4 py-2 rounded-xl"
          >
            <img
              src={user.avatar}
              alt="profile"
              className="w-9 h-9 rounded-xl object-cover"
            />
            <div className="text-left hidden md:block">
              <p className="font-semibold text-toiral-dark text-sm">
                {user.name}
              </p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </button>
        </div>

        {/* ==================== CONTENT AREA ==================== */}
        <div className="flex-1 bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="h-full overflow-auto p-6 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>

      {/* ==================== CLIENT PROFILE PANEL ==================== */}
      {isClient && profileOpen && (
        <ClientProfilePanel user={user} onClose={() => setProfileOpen(false)} />
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
        />
      )}
    </div>
  );
};

export default DashboardLayout;