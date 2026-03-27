import { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaBriefcase,
  FaUserTie,
  FaSort,
  FaEye,
  FaUser,
  FaEye as FaEyeIcon,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import AdminTableSkeleton from "../../../../Components/AdminTableSkeleton/AdminTableSkeleton";
import useAxios from "../../../../Hooks/Axios";
import { useNavigate } from "react-router";

const UserList = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");

  // Fetch users from API
  useEffect(() => {
    const userData = async () => {
      try {
        const res = await api.get(
          `/admin-api/all-user-list?search=${searchTerm}&role=${roleFilter}`
        );
        setUsers(res?.data || []);
        setFilteredUsers(res?.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
      }
    };

    userData();
  }, [api, searchTerm, roleFilter]);

  // Handle responsive view mode__
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setViewMode("grid");
      } else {
        setViewMode("table");
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Safe date formatting with optional chaining
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      const options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return "Date error";
    }
  };

  // Filter users with optional chaining
  useEffect(() => {
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }

    let results = [...users];

    if (searchTerm) {
      results = results.filter(
        (user) =>
          user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      results = results.filter((user) => user?.userRole === roleFilter);
    }

    setFilteredUsers(results);
  }, [searchTerm, roleFilter, users]);

  // Safe fallback image
  const getImageUrl = (user) => {
    return (
      user?.profilePhoto ||
      user?.companyLogo ||
      "https://via.placeholder.com/40"
    );
  };

  // Safe status check
  const getUserStatus = (user) => {
    return user?.status || "active"; // Default to active if not specified
  };

  // Calculate stats
  const calculateStats = () => {
    if (!Array.isArray(users)) {
      return {
        total: 0,
        jobSeekers: 0,
        recruiters: 0,
        activeToday: 0,
        activeRate: "0%",
      };
    }

    const jobSeekers = users.filter(
      (user) => user?.userRole === "Job Seeker"
    ).length;
    const recruiters = users.filter(
      (user) => user?.userRole === "Recruiter"
    ).length;
    const activeUsers = users.filter(
      (user) => user?.status === "active"
    ).length;
    const activeRate =
      users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0;

    // For "Active Today" - you might want to adjust this based on your backend data
    // This is a simple example - you might have a lastLogin field
    const activeToday = users.filter((user) => {
      const today = new Date().toISOString().split("T")[0];
      return user?.lastLogin?.includes(today);
    }).length;

    return {
      total: users.length,
      jobSeekers,
      recruiters,
      activeToday,
      activeRate: `${activeRate}%`,
    };
  };

  const stats = calculateStats();

  // Loading skeleton component
  const LoadingSkeleton = () => {
    if (viewMode === "table") {
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    User
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Joined
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AdminTableSkeleton />
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="border rounded-xl p-4 bg-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="h-8 bg-gray-300 rounded w-16"></div>
                <div className="h-8 bg-gray-300 rounded w-8"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Check if filteredUsers is an array before mapping
  const userList = Array.isArray(filteredUsers) ? filteredUsers : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage all registered users, recruiters, and job seekers
          </p>
        </div>

        {/* Stats Cards - With Optional Chaining */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaUser className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-green-600 font-medium">
              All registered users
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Job Seekers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.jobSeekers}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <FaBriefcase className="text-[#3c8f63] text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-green-600 font-medium">
              Active job seekers
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Recruiters</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.recruiters}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FaUserTie className="text-purple-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-green-600 font-medium">
              Company recruiters
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeRate}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FaEyeIcon className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              {stats.activeToday} active today
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c8f63] focus:border-transparent outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select
                  className="appearance-none w-full sm:w-48 pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c8f63] focus:border-transparent outline-none bg-white"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="Recruiter">Recruiters Only</option>
                  <option value="Job Seeker">Job Seekers Only</option>
                </select>
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{userList.length}</span>{" "}
              users
              {searchTerm && ` for "${searchTerm}"`}
              {roleFilter !== "all" && ` • ${roleFilter}s only`}
            </p>
          </div>
        </div>

        {/* Loading or User Table/Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {userList.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
                <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No users found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || roleFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No users registered yet"}
                </p>
              </div>
            ) : viewMode === "table" ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          User
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          Role
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          Joined
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {userList.map((user) => {
                        const status = getUserStatus(user);
                        const userRole = user?.userRole || "Unknown";

                        return (
                          <tr
                            key={user?._id || Math.random()}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                  <img
                                    src={getImageUrl(user)}
                                    alt={user?.userName || "User"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/40";
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {user?.userName ||
                                      user?.companyName ||
                                      "Unknown User"}
                                  </p>
                                  <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MdEmail className="text-xs" />
                                    {user?.userEmail || "No email"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                {userRole === "Recruiter" ? (
                                  <>
                                    <FaUserTie className="text-purple-600" />
                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                      {userRole}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <FaBriefcase className="text-[#3c8f63]" />
                                    <span className="px-3 py-1 bg-emerald-50 text-[#3c8f63] rounded-full text-sm font-medium">
                                      {userRole}
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div
                                  className={`w-2 h-2 rounded-full mr-2 ${
                                    status === "active"
                                      ? "bg-green-500"
                                      : "bg-gray-400"
                                  }`}
                                ></div>
                                <span
                                  className={`font-medium ${
                                    status === "active"
                                      ? "text-green-700"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {status?.charAt(0)?.toUpperCase() +
                                    status?.slice(1) || "Unknown"}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-gray-600">
                              {formatDate(user?.joinDate)}
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    navigate("/dashboard/admin-chat", {
                                      state: {
                                        selectedUser: {
                                          email: user.userEmail,
                                          name:
                                            user.userName ||
                                            user.companyName ||
                                            "User",
                                          role: user.userRole,
                                          image:
                                            user.profilePhoto ||
                                            user.companyLogo ||
                                            "",
                                          _id: user._id,
                                        },
                                      },
                                    })
                                  }
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <FaEnvelope className="text-lg" />
                                </button>

                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                  <FaEye className="text-lg" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {userList.map((user) => {
                  const status = getUserStatus(user);
                  const userRole = user?.userRole || "Unknown";

                  return (
                    <div
                      key={user?._id || Math.random()}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={getImageUrl(user)}
                              alt={user?.userName || "User"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/48";
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">
                              {user?.userName || "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-500">{userRole}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MdEmail className="mr-1" />
                          <span className="truncate">
                            {user?.userEmail || "No email"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              status === "active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <span className="text-xs font-medium">
                            {status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              navigate("/dashboard/admin-chat", {
                                state: {
                                  selectedUser: {
                                    email: user.userEmail,
                                    name:
                                      user.userName ||
                                      user.companyName ||
                                      "User",
                                    role: user.userRole,
                                    image:
                                      user.profilePhoto ||
                                      user.companyLogo ||
                                      "",
                                    _id: user._id,
                                  },
                                },
                              })
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <FaEnvelope />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
