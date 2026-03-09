import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import useAxios from "../../../../Hooks/useAxios";

const ViewProject = () => {
  const { api } = useAxios();
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLineData, setTimelineData] = useState([]);

  // fetch project via react-query
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await api.get(`/admin-api/projects/${projectId}`);
      setTimelineData(res.data.timeline);
      return res.data;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // derive header fields with fallback while loading
  const projectData = {
    name: project?.projectName || "Loading...",
    client: project?.clientName || "Loading...",
    status: project?.status || "Pending",
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

  // Redirect to overview on mount/projectId change
  useEffect(() => {
    const parts = location.pathname.split("/");
    const last = parts[parts.length - 1];

    if (!["overview", "timeline", "team", "documents"].includes(last)) {
      navigate("overview", { replace: true });
    }
  }, [projectId, navigate, location.pathname]);

  // handle loading / error states
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-toiral-primary mb-4"></div>
          <p className="text-toiral-secondary font-medium">Loading project…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 font-semibold mb-2">
            Error Loading Project
          </p>
          <p className="text-red-500 text-sm">
            {error?.message || "Failed to load project"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5 font-[\'Outfit\',sans-serif] min-h-full">
      {/* ================= TOP PART (HEADER) ================= */}
      <div className="shrink-0 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-toiral-bg flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        {/* Left Info */}
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

        {/* Right Actions */}
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
      <div className="shrink-0 bg-white p-2 rounded-xl shadow-sm border border-toiral-bg overflow-x-auto custom-scrollbar">
        <div className="flex gap-2 justify-start max-[590px]:justify-around w-full min-w-max">
          <NavLink
            to="overview"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer relative whitespace-nowrap ${
                isActive
                  ? "bg-toiral-bg-light text-toiral-primary shadow-sm after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-toiral-primary"
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
              `flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer relative whitespace-nowrap ${
                isActive
                  ? "bg-toiral-bg-light text-toiral-primary shadow-sm after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-toiral-primary"
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
              `flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer relative whitespace-nowrap ${
                isActive
                  ? "bg-toiral-bg-light text-toiral-primary shadow-sm after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-toiral-primary"
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
              `flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer relative whitespace-nowrap ${
                isActive
                  ? "bg-toiral-bg-light text-toiral-primary shadow-sm after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-toiral-primary"
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
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-toiral-bg custom-scrollbar">
        <Outlet context={{ project, timelineData: timeLineData }} />
      </div>
    </div>
  );
};

export default ViewProject;