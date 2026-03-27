import { FiHome, FiBriefcase, FiSettings, FiUsers, FiX } from "react-icons/fi";
import { MdOutlineContactPage } from "react-icons/md";
import { NavLink } from "react-router";

const SidebarNav = ({
  user,
  profile,
  userLoading,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const userRoleChecker = () => {
    const defaultRoutes = [
      {
        id: "overview",
        label: "Overview",
        icon: <FiHome size={20} />,
        path: "/dashboard",
      },
    ];

    if (!user || !profile) {
      return defaultRoutes;
    }

    const roleRoutes = {
      Admin: [
        {
          id: "admin-overview",
          path: "/dashboard/admin-overview",
          label: "Overview",
          icon: <FiHome size={20} />,
        },
        {
          id: "company-verify",
          path: "/dashboard/verify-company",
          label: "Verify Company",
          icon: <FiUsers size={20} />,
        },
        {
          id: "user-list",
          path: "/dashboard/user-list",
          label: "User List",
          icon: <FiUsers size={20} />,
        },
      ],
      Recruiter: [
        {
          id: "rec-overview",
          path: "/dashboard/recruiter-overview",
          label: "Overview",
          icon: <FiHome size={20} />,
        },
        {
          id: "job-postings",
          path: "/dashboard/recruiter-post-job",
          label: "Post A Job",
          icon: <FiBriefcase size={20} />,
        },
        {
          id: "job-applications",
          path: "/dashboard/recruiter-job-applications",
          label: "Application",
          icon: <MdOutlineContactPage size={22} />,
        },
      ],
      "Job Seeker": [
        {
          id: "user-overview",
          path: "/dashboard/user-overview",
          label: "Overview",
          icon: <FiHome size={20} />,
        },
        {
          id: "my-application",
          path: "/dashboard/user-my-applications",
          label: "My Applications",
          icon: <FiHome size={20} />,
        },
      ],
    };

    return roleRoutes[profile.userRole] || defaultRoutes;
  };

  const routes = userRoleChecker();

  // Skeleton loader items
  const skeletonItems = Array.from({ length: 4 }, (_, index) => ({
    id: `skeleton-${index}`,
    isSkeleton: true,
  }));

  return (
    <>
      {/* SIDEBAR - Visually Separated */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r-2 border-gray-200 shadow-lg rounded-r-2xl m-2`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section with Skeleton */}
          <div className="flex items-center justify-between h-20 px-6 border-b-2 border-gray-100">
            {userLoading ? (
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-end space-x-3">
                <img
                  src={profile?.companyLogo || profile?.profilePhoto|| null}
                  className="w-10 h-10 bg-[#3C8F63] rounded-xl flex items-center justify-center shadow-md"
                ></img>
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Navigation Menu with Skeleton Loader */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {userLoading ? (
              <>
                {skeletonItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center w-full px-4 py-3 rounded-xl border-2 border-transparent animate-pulse"
                  >
                    {/* Icon Skeleton */}
                    <div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
                    {/* Text Skeleton */}
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </>
            ) : (
              routes.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.id}
                  className={({ isActive }) =>
                    `flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-200 border-2 ${
                      isActive
                        ? "bg-[#3C8F63] text-white border-[#3C8F63] shadow-lg shadow-[#3C8F63]/20"
                        : "text-gray-600 border-transparent hover:border-gray-200 hover:bg-gray-50 hover:text-[#3C8F63]"
                    }`
                  }
                  end // Add this for exact matching
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))
            )}
          </nav>

          {/* Settings Section with Skeleton */}
          <div className="p-4 border-t-2 border-gray-100">
            {userLoading ? (
              <div className="flex items-center w-full px-4 py-3 rounded-xl border-2 border-transparent animate-pulse">
                {/* Icon Skeleton */}
                <div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
                {/* Text Skeleton */}
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
            ) : (
              <button
                className={"flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-200 border-2 text-gray-600 border-transparent hover:border-gray-200 hover:bg-gray-50 hover:text-[#3C8F63]"}
              >
                <FiSettings size={20} className="mr-3" />
                <span className="font-medium">Settings</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarNav;
