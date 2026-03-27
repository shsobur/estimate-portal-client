import "./Navbar.css";
import logo from "/fab.png";
import { Link, NavLink } from "react-router-dom";
import useUserData from "../../Hooks/userData";
import { AuthContext } from "../../Context/AuthContext";
import { jhConfirm, jhError, jhSuccess } from "../../utils";

// From react__
import { useContext, useEffect, useRef, useState } from "react";

// Package(REACT ICONS, SWEET ALERT)__
import { RxCross1 } from "react-icons/rx";
import { ImProfile } from "react-icons/im";
import { IoIosMenu } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { HiMiniUserCircle } from "react-icons/hi2";
import { AiOutlineShopping } from "react-icons/ai";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiSignIn, PiSignOut } from "react-icons/pi";
import { IoChevronDown, IoChevronUp, IoHomeOutline } from "react-icons/io5";

const Navbar = () => {
  const menuRef = useRef();
  const { profile } = useUserData();
  const { user, logOut, userLoading } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle Close Dropdown__
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Scrolling__
  useEffect(() => {
    let lastScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        setIsScrollingDown(true);
      } else if (scrollTop < lastScrollTop) {
        setIsScrollingDown(false);
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Stop Scroll__
  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "auto";
      return;
    }
    document.body.style.overflow = "hidden";
  }, [menuOpen]);

  // User logout__
  const handleSignOut = () => {
    jhConfirm({
      title: "Are you sure?",
      text: "You're about to log out from your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Log out",
      cancelButtonText: "Stay logged in",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            jhSuccess({
              title: "Success",
              text: "You have been logged out successfully",
            });
          })
          .catch(() => {
            jhError({
              title: "Error!",
              text: "Failed to log out. Please try again.",
            });
          });
      }
    });
    setOpen(!open);
  };

  return (
    <>
      <nav className="mn_main_nav">
        {/* Desktop layout__ */}
        <div
          id={isScrollingDown ? "mn_navbar_close" : "mn_navbar_open"}
          className="mn_main_navbar_container"
        >
          <div className="mn_navbar_content_container">
            {userLoading ? (
              <div className="h-10 w-60 rounded-lg bg-gray-200 round-lg"></div>
            ) : (
              <div className="mn_navbar_logo">
                <img src={logo} alt="JobHunting Logo" />
                <h1>JobHunting</h1>
              </div>
            )}

            <ul className="mn_navbar_routes_container">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "mn_route_active_style"
                    : "mn_router_none_active_style"
                }
              >
                {userLoading ? (
                  <div className="h-8 w-14 bg-gray-200 rounded-lg"></div>
                ) : (
                  <li>Home</li>
                )}
              </NavLink>

              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  isActive
                    ? "mn_route_active_style"
                    : "mn_router_none_active_style"
                }
              >
                {userLoading ? (
                  <div className="h-8 w-14 bg-gray-200 rounded-lg"></div>
                ) : (
                  <li>Find Jobs</li>
                )}
              </NavLink>

              <NavLink
                to="/community"
                className={({ isActive }) =>
                  isActive
                    ? "mn_route_active_style"
                    : "mn_router_none_active_style"
                }
              >
                {userLoading ? (
                  <div className="h-8 w-14 bg-gray-200 rounded-lg"></div>
                ) : (
                  <li>Community</li>
                )}
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "mn_route_active_style"
                    : "mn_router_none_active_style"
                }
              >
                {userLoading ? (
                  <div className="h-8 w-14 bg-gray-200 rounded-lg"></div>
                ) : (
                  <li>About Us</li>
                )}
              </NavLink>
            </ul>

            {userLoading ? (
              <span className="h-10 w-10 mr-5 rounded-full bg-gray-200"></span>
            ) : (
              <>
                {user ? (
                  <div className="mn_dropdown_wrapper" ref={menuRef}>
                    <button
                      className="mn_dropdown_button"
                      onClick={() => setOpen(!open)}
                    >
                      <div className="mn_user_info">
                        {profile?.profilePhoto || profile?.companyLogo ? (
                          <img
                            src={profile?.profilePhoto || profile?.companyLogo}
                            alt="Profile"
                            className="mn_user_avatar"
                          />
                        ) : (
                          <div className="mn_user_avatar_default">
                            <HiMiniUserCircle />
                          </div>
                        )}
                        <span className="mn_user_name">
                          {profile?.userName || profile?.companyName || "User"}
                        </span>
                      </div>
                      {open ? (
                        <IoChevronUp size={18} />
                      ) : (
                        <IoChevronDown size={18} />
                      )}
                    </button>

                    <div
                      id="mn_dropdown_item_parent_container"
                      className={`mn_dropdown_menu ${open ? "mn_open" : ""}`}
                    >
                      {/* User Info Section */}
                      <div className="mn_user_profile_section">
                        {profile?.profilePhoto || profile?.companyLogo ? (
                          <img
                            src={profile?.profilePhoto || profile?.companyLogo}
                            alt="Profile"
                            className="mn_profile_image"
                          />
                        ) : (
                          <div className="mn_profile_image_default">
                            <HiMiniUserCircle />
                          </div>
                        )}
                        <div className="mn_profile_info">
                          <div className="mn_profile_name">
                            {profile?.userName ||
                              profile?.companyName ||
                              "Welcome User"}
                          </div>
                          <div className="mn_profile_email">
                            {user?.email || "User"}
                          </div>
                        </div>
                      </div>

                      <div className="mn_dropdown_divider"></div>

                      <NavLink
                        to={
                          profile?.userRole === "Recruiter"
                            ? "/recruiter-profile"
                            : "/user-profile"
                        }
                      >
                        <span
                          onClick={() => setOpen(!open)}
                          className="mn_dropdown_item"
                        >
                          <ImProfile />
                          My Profile
                        </span>
                      </NavLink>

                      <NavLink
                        to={
                          profile?.userRole === "Recruiter"
                            ? "/dashboard/recruiter-overview"
                            : profile?.userRole === "Admin"
                            ? "/dashboard/admin-overview"
                            : "/dashboard/user-overview"
                        }
                      >
                        <span
                          onClick={() => setOpen(!open)}
                          className="mn_dropdown_item"
                        >
                          <LuLayoutDashboard />
                          Dashboard
                        </span>
                      </NavLink>

                      <span
                        onClick={handleSignOut}
                        className="mn_dropdown_item mn_logout_item"
                      >
                        <MdOutlineLogout />
                        Sign Out
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link to="/sign-in">
                    <button className="mn_desktop_signIn_btn">Sign In</button>
                  </Link>
                )}
              </>
            )}

            <div className="mn_mobile_menu_container">
              <span onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <RxCross1 /> : <IoIosMenu />}
              </span>
            </div>
          </div>

          {/* Mobile layout__ */}
          <div
            id={menuOpen ? "" : "mn_menu_close"}
            className="mn_main_mobile_menu_container"
          >
            <div className="mn_mobile_menu_routes">
              <ul>
                <li onClick={() => setMenuOpen(!menuOpen)}>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "mn_mobile_menu_active_style"
                        : "mn_mobile_menu_non_active_style"
                    }
                  >
                    <IoHomeOutline /> Home
                  </NavLink>
                </li>

                <li onClick={() => setMenuOpen(!menuOpen)}>
                  <NavLink
                    to="/jobs"
                    className={({ isActive }) =>
                      isActive
                        ? "mn_mobile_menu_active_style"
                        : "mn_mobile_menu_non_active_style"
                    }
                  >
                    <IoHomeOutline /> Find Jobs
                  </NavLink>
                </li>

                <li onClick={() => setMenuOpen(!menuOpen)}>
                  <NavLink
                    to="/community"
                    className={({ isActive }) =>
                      isActive
                        ? "mn_mobile_menu_active_style"
                        : "mn_mobile_menu_non_active_style"
                    }
                  >
                    <AiOutlineShopping /> Community
                  </NavLink>
                </li>

                <li onClick={() => setMenuOpen(!menuOpen)}>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      isActive
                        ? "mn_mobile_menu_active_style"
                        : "mn_mobile_menu_non_active_style"
                    }
                  >
                    <ImProfile /> About Us
                  </NavLink>
                </li>
              </ul>

              <div className="mn_others_routes_container">
                <ul>
                  {user ? (
                    <>
                      <li
                        className="mt-3"
                        onClick={() => setMenuOpen(!menuOpen)}
                      >
                        <NavLink
                          to={
                            profile?.userRole === "Recruiter"
                              ? "/recruiter-profile"
                              : "/user-profile"
                          }
                          className={({ isActive }) =>
                            isActive
                              ? "mn_mobile_menu_active_style"
                              : "mn_mobile_menu_non_active_style"
                          }
                        >
                          <ImProfile /> Profile
                        </NavLink>
                      </li>
                      <li
                        onClick={handleSignOut}
                        className="mn_mobile_menu_non_active_style"
                      >
                        <PiSignOut />
                        Sign Out
                      </li>
                    </>
                  ) : (
                    <li onClick={() => setMenuOpen(!menuOpen)}>
                      <NavLink
                        to="/sign-in"
                        className={({ isActive }) =>
                          isActive
                            ? "mn_mobile_menu_active_style"
                            : "mn_mobile_menu_non_active_style"
                        }
                      >
                        <PiSignIn />
                        Sign In
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;