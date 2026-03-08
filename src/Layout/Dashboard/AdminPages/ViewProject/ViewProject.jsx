import React, { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  Edit2,
  User,
  LayoutGrid,
  Clock,
  Users,
  FileText,
  Briefcase,
} from "lucide-react";

const ViewProject = () => {
  // --- Static Dummy Data for the Top Header ---
  const projectData = {
    name: "E-commerce Redesign",
    client: "Mojibur Rahman",
    status: "In Progress",
  };

  // Helper function for the status badge color
  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-toiral-bg text-toiral-primary border-toiral-light";
      case "Complete":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  // when user lands directly on /view-project/:id, redirect into overview tab
  useEffect(() => {
    const parts = location.pathname.split("/");
    const last = parts[parts.length - 1];
    // if the last segment is the projectId (no sub-route)
    if (!["overview", "timeline", "team", "documents"].includes(last)) {
      navigate("overview", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    // 1. ROOT WRAPPER: Takes exact height of the dashboard pane. Scrolling happens here
    <div className="h-full flex flex-col gap-4 md:gap-5 font-['Outfit',sans-serif] overflow-y-auto">
      {/* ================= TOP PART (HEADER) ================= */}
      {/* shrink-0 ensures this header never gets squished */}
      <div className="shrink-0 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-toiral-bg flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        {/* Left Info - min-w-0 prevents text from pushing the layout wide */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-toiral-dark flex items-center gap-3 leading-tight truncate">
              <div className="p-2 bg-toiral-bg-light rounded-xl hidden sm:block shrink-0">
                <Briefcase className="text-toiral-primary" size={20} />
              </div>
              <span className="truncate">{projectData.name}</span>
            </h1>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold border w-fit shrink-0 ${getStatusStyle(projectData.status)}`}
            >
              {projectData.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-toiral-secondary font-medium text-sm md:text-base truncate">
            <User size={16} className="shrink-0" />
            <span className="shrink-0">Client:</span>
            <span className="text-toiral-primary font-bold truncate">
              {projectData.client}
            </span>
          </div>
        </div>

        {/* Right Actions - shrink-0 ensures buttons don't resize weirdly */}
        {/* 100% width on mobile, side-by-side on tablet, auto-width on desktop */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 mt-1 lg:mt-0">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-toiral-bg-light hover:bg-toiral-bg text-toiral-dark font-semibold rounded-xl transition-colors cursor-pointer text-sm border border-transparent hover:border-toiral-light whitespace-nowrap">
            <Eye size={18} />
            View Profile
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-toiral-primary hover:bg-toiral-dark text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm shadow-md shadow-toiral-primary/20 whitespace-nowrap">
            <Edit2 size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* ================= MIDDLE PART (TABS) ================= */}
      {/*
        shrink-0 keeps the tabs small; make this wrapper sticky so it stays
        visible when scrolling long content. z-10 ensures it sits above with
        a light backdrop.
      */}
      <div className="shrink-0 bg-white p-2 rounded-2xl shadow-sm border border-toiral-bg overflow-x-auto custom-scrollbar sticky top-0 z-10">
        <div className="flex gap-2 justify-start max-[590px]:justify-around w-full min-w-max">
          <NavLink
            to="overview"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer relative ${
                isActive
                  ? "bg-toiral-bg-light text-toiral-primary shadow-sm after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-toiral-primary"
                  : "text-toiral-secondary hover:text-toiral-dark hover:bg-toiral-bg"
              }`
            }
          >
            <LayoutGrid size={18} />
            <span className="max-[590px]:hidden">Overview</span>
          </NavLink>

          <NavLink
            to="timeline"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer relative ${
                isActive
                  ? "bg-toiral-bg-light text-toiral-primary shadow-sm after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-toiral-primary"
                  : "text-toiral-secondary hover:text-toiral-dark hover:bg-toiral-bg"
              }`
            }
          >
            <Clock size={18} />
            <span className="max-[590px]:hidden">Timeline</span>
          </NavLink>

          <NavLink
            to="team"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer relative ${
                isActive
                  ? "bg-toiral-bg-light text-toiral-primary shadow-sm after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-toiral-primary"
                  : "text-toiral-secondary hover:text-toiral-dark hover:bg-toiral-bg"
              }`
            }
          >
            <Users size={18} />
            <span className="max-[590px]:hidden">Team</span>
          </NavLink>

          <NavLink
            to="documents"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer relative ${
                isActive
                  ? "bg-toiral-bg-light text-toiral-primary shadow-sm after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-toiral-primary"
                  : "text-toiral-secondary hover:text-toiral-dark hover:bg-toiral-bg"
              }`
            }
          >
            <FileText size={18} />
            <span className="max-[590px]:hidden">Documents</span>
          </NavLink>
        </div>
      </div>

      {/* ================= BOTTOM PART (OUTLET CONTAINER) ================= */}
      {/* flex-1 keeps this section stretching, but scroll occurs on the root wrapper */}
      <div className="flex-1 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-toiral-bg custom-scrollbar relative">
        <Outlet />
      </div>
    </div>
  );
};

export default ViewProject;