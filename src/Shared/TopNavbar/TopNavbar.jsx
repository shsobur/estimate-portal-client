import {
  FiUser,
  FiMenu,
  FiLogOut,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { NavLink } from "react-router";
import { TbMessage } from "react-icons/tb";

const TopNavbar = ({
  profile,
  userLoading,
  dropdownRef,
  sidebarOpen,
  setSidebarOpen,
  profileDropdownOpen,
  setProfileDropdownOpen,
}) => {
  const role = profile?.userRole;
  const recTo = "/dashboard/recruiter-chat";
  const adminTo = "/dashboard/admin-chat";
  const userTo = "/dashboard/user-chat";

  return (
    <>
      {/* TOP NAVBAR - Like your main site navbar */}
      <header className="bg-white border-b-2 border-gray-200 z-40 shadow-sm rounded-b-2xl m-2 mt-2 mb-0">
        <div className="flex items-start justify-between h-16 px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden border-2 border-gray-200 transition-all duration-200"
          >
            <FiMenu size={20} />
          </button>

          {/* Navigation Routes - Exact same design but all links always active */}
          <div className="hidden md:flex items-center">
            {userLoading ? (
              // Skeleton for navigation routes
              <>
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-8 bg-gray-200 rounded-lg animate-pulse w-20 mx-1"
                  ></div>
                ))}
              </>
            ) : (
              // Actual navigation routes - ALL ACTIVE STYLE
              <ul className="flex items-center gap-3 list-none m-0 bg-[#3c8f6308] rounded-[16px] p-[5px] border border-[#3c8f631a]">
                <NavLink
                  to="/"
                  className="text-[#3C8F63] no-underline inline-block px-4 py-2 text-[15px] font-semibold rounded-[12px] bg-white border border-[#3c8f636f] shadow-[0_2px_10px_#3c8f631a] transform -translate-y-[1px]"
                >
                  <li>Home</li>
                </NavLink>

                <NavLink
                  to="/jobs"
                  className="text-[#3C8F63] no-underline inline-block px-4 py-2 text-[15px] font-semibold rounded-[12px] bg-white border border-[#3c8f636f] shadow-[0_2px_10px_#3c8f631a] transform -translate-y-[1px]"
                >
                  <li>Jobs</li>
                </NavLink>

                <NavLink
                  to="/community"
                  className="text-[#3C8F63] no-underline inline-block px-4 py-2 text-[15px] font-semibold rounded-[12px] bg-white border border-[#3c8f636f] shadow-[0_2px_10px_#3c8f631a] transform -translate-y-[1px]"
                >
                  <li>Community</li>
                </NavLink>

                <NavLink
                  to="/about"
                  className="text-[#3C8F63] no-underline inline-block px-4 py-2 text-[15px] font-semibold rounded-[12px] bg-white border border-[#3c8f636f] shadow-[0_2px_10px_#3c8f631a] transform -translate-y-[1px]"
                >
                  <li>About Us</li>
                </NavLink>
              </ul>
            )}
          </div>

          {/* Right Section - Search, Notifications & User Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Notification Dropdown */}
            <div className="relative">
              {userLoading ? (
                // Skeleton for notification button
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              ) : (
                <NavLink
                  to={
                    role === "Admin"
                      ? adminTo
                      : role === "Recruiter"
                      ? recTo
                      : role === "Job Seeker"
                      ? userTo
                      : ""
                  }
                >
                  {({ isActive }) => (
                    <button
                      className={`
      p-2 rounded-xl relative transition-all duration-200 border-2 ease-in-out
      flex items-center justify-center
      ${
        isActive
          ? "text-white bg-[#3C8F63] border-[#3C8F63] shadow-md"
          : "text-gray-600 border-gray-200 hover:text-[#3C8F63] hover:border-[#3C8F63] hover:bg-gray-50"
      }
    `}
                    >
                      <TbMessage size={20} />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                  )}
                </NavLink>
              )}
            </div>

            {/* User Profile Dropdown - Like your main navbar */}
            <div className="relative" ref={dropdownRef}>
              {userLoading ? (
                // Skeleton for user profile button
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl border-2 border-transparent">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="hidden sm:block">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 border border-[#3c8f6333] rounded-xl bg-[#3c8f630d] text-[#3C8F63] cursor-pointer transition-all duration-300 hover:bg-[#3c8f631a] hover:border-[#3c8f634d] hover:-translate-y-[1px] text-sm font-medium"
                  >
                    <div className="flex items-center gap-2">
                      {profile?.companyLogo || profile?.profilePhoto ? (
                        <img
                          src={profile?.companyLogo || profile?.profilePhoto}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          alt="Company Logo"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#3C8F63] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            JH
                          </span>
                        </div>
                      )}

                      <span className="text-gray-700 font-semibold hidden sm:block">
                        {profile?.companyName || profile?.userName}
                      </span>
                    </div>
                    {profileDropdownOpen ? (
                      <FiChevronUp size={18} />
                    ) : (
                      <FiChevronDown size={18} />
                    )}
                  </button>

                  {/* Dropdown Menu - Fixed with proper conditional classes */}
                  <div
                    className={`absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl border border-[#3c8f6326] rounded-2xl shadow-2xl min-w-[280px] overflow-hidden z-50 transition-all duration-300 transform ${
                      profileDropdownOpen
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                    }`}
                  >
                    {/* User Profile Section */}
                    <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-[#3c8f630d] to-[#3c8f6302] border-b border-[#3c8f631a]">
                      {profile?.companyLogo || profile?.profilePhoto ? (
                        <img
                          src={profile?.companyLogo || profile?.profilePhoto}
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          alt="Company Logo"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#3C8F63] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-base">
                            JH
                          </span>
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="text-[15px] font-semibold text-gray-800 mb-1">
                          {profile?.companyName || profile?.userName}
                        </div>
                        <div className="text-[13px] text-gray-600 font-normal">
                          {profile?.userEmail}
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-[#3c8f631a] my-1"></div>

                    {/* Dropdown Items */}
                    <NavLink
                      to={
                        profile?.userRole === "Recruiter"
                          ? "/recruiter-profile"
                          : "/user-profile"
                      }
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-gray-600 text-sm font-medium transition-all duration-200 hover:bg-[#3c8f6314] hover:text-[#3C8F63]"
                    >
                      <FiUser size={16} />
                      My Profile
                    </NavLink>

                    <button
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-gray-500 text-sm font-medium transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 border-t border-[#3c8f631a] mt-1 w-full text-left"
                    >
                      <FiLogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopNavbar;
