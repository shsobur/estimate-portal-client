import "./RecruiterProfile.css";
import {
  FaRocket,
  FaCheckCircle,
  FaFlag,
  FaEye,
  FaLinkedin,
  FaTwitter,
  FaWrench,
  FaCode,
  FaChartLine,
  FaBullhorn,
  FaBuilding,
  FaHeadset,
  FaGlobe,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendar,
  FaLink,
} from "react-icons/fa";
import { FaCodeBranch } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import AboutModal from "../../../Components/RecUpdateModal/AboutModal/AboutModal";
import DepartmentModal from "../../../Components/RecUpdateModal/DepartmentModal/DepartmentModal";
import CompanyDetailsModal from "../../../Components/RecUpdateModal/CompanyInfo/CompanyInfo";
import SocialLinksModal from "../../../Components/RecUpdateModal/SocialModal/SocialModal";
import ProfileModal from "../../../Components/RecUpdateModal/ProfileModal/ProfileModal";
import useUserData from "../../../Hooks/userData";
import placeholderImage from "../../../assets/place_banner.png";
import People from "../../../Components/RecUpdateModal/People/People";
import VerifyMessage from "../../../Components/VerifyMessage/VerifyMessage";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { useLoaderData, useParams } from "react-router";

const RecruiterProfile = () => {
  const { user } = useContext(AuthContext);
  const { email } = useParams();
  const profileData = useLoaderData();
  const { profile } = useUserData();
  const [dynamicData, setDynamicData] = useState(null);

  useEffect(() => {
    if (user?.email !== email) {
      setDynamicData(profileData);
    }
  }, [profileData, user, email]);

  // Use dynamicData if available, otherwise use profile__
  const data = dynamicData || profile;

  // Check if current user can edit this profile__
  const canEdit = user?.email === data?.userEmail;

  // Department icons mapping__
  const departmentIcons = {
    "Engineering / Development": <FaCode className="department-icon" />,
    "Human Resources (HR)": <FaHeadset className="department-icon" />,
    "Business Development": <FaChartLine className="department-icon" />,
    "Media & Communications": <FaBullhorn className="department-icon" />,
    "UX / UI Design": <FaWrench className="department-icon" />,
    "Data & Analytics": <FaChartLine className="department-icon" />,
    Sales: <FaChartLine className="department-icon" />,
    Marketing: <FaBullhorn className="department-icon" />,
    Finance: <FaBuilding className="department-icon" />,
    Administration: <FaBuilding className="department-icon" />,
    "Content / Editorial": <FaBullhorn className="department-icon" />,
    "Customer Support / Service": <FaHeadset className="department-icon" />,
    "Design / Creative": <FaWrench className="department-icon" />,
    "Digital Strategy / Innovation": (
      <FaChartLine className="department-icon" />
    ),
    "Facilities / Maintenance": <FaBuilding className="department-icon" />,
    "Finance / Accounting": <FaBuilding className="department-icon" />,
    "IT / Information Technology": <FaCode className="department-icon" />,
    "Legal / Compliance": <FaBuilding className="department-icon" />,
    Operations: <FaBuilding className="department-icon" />,
    "Procurement / Purchasing": <FaBuilding className="department-icon" />,
    "Product Management": <FaChartLine className="department-icon" />,
    "Production / Manufacturing": <FaWrench className="department-icon" />,
    "Project Management": <FaChartLine className="department-icon" />,
    "Public Relations (PR)": <FaBullhorn className="department-icon" />,
    "Quality Assurance (QA)": <FaWrench className="department-icon" />,
    "Research & Development (R&D)": <FaWrench className="department-icon" />,
    "Security / Risk Management": <FaBuilding className="department-icon" />,
    "Social Media / Community Management": (
      <FaBullhorn className="department-icon" />
    ),
    "Supply Chain / Logistics": <FaBuilding className="department-icon" />,
    "Training / Learning & Development": (
      <FaHeadset className="department-icon" />
    ),
  };

  // Get department icon or default__
  const getDepartmentIcon = (departmentName) => {
    return (
      departmentIcons[departmentName] || (
        <FaBuilding className="department-icon" />
      )
    );
  };

  // Check if social links exist__
  const hasSocialLinks =
    data?.social?.linkedin ||
    data?.social?.x ||
    Object.keys(data?.social?.additionalLinks || {}).length > 0;

  return (
    <>
      {/* All update modal components */}
      <ProfileModal />
      <AboutModal />
      <DepartmentModal />
      <CompanyDetailsModal />
      <People />
      <SocialLinksModal />
      <VerifyMessage />

      <section id="rp_recruiter_profile_container">
        <div className="rp_recruiter-container">
          <div className="rp_recruiter-content">
            {/* Header Section */}
            <div className="rp_profile-header">
              <div className="rp_header-content">
                <div className="rp_company-avatar-container">
                  <div
                    className="rp_company-avatar"
                    style={{
                      backgroundImage: `url("${
                        data?.companyLogo || placeholderImage
                      }")`,
                    }}
                  ></div>
                </div>

                <div className="rp_company-info">
                  <h1 className="rp_company-name">
                    {data?.companyName || "Your Company Name"}
                  </h1>
                  <p className="rp_company-meta">
                    {data?.bio || "Add a compelling bio about your company"}
                  </p>

                  <div className="rp_status-badges">
                    {data?.activeHire && (
                      <span className="rp_status-badge">
                        <FaRocket className="rp_badge-icon" />
                        Active Hiring
                      </span>
                    )}

                    <span
                      className={`rp_status-badge ${
                        data?.verified === "Pending" ||
                        data?.verified === "Unverified"
                          ? "rp_status-badge-unverified"
                          : ""
                      }`}
                    >
                      <FaCheckCircle className="rp_badge-icon" />
                      {data?.verified || "Not Verified"}
                    </span>

                    {data?.verified === "Unverified" && (
                      <span
                        onClick={() =>
                          document
                            .getElementById("verify_message_modal")
                            .showModal()
                        }
                        className="rp_profile_verify_btn"
                      >
                        Verify now
                      </span>
                    )}
                  </div>
                </div>

                {canEdit && (
                  <button
                    title={
                      data?.verified === "Pending" &&
                      "You can't edit now. You profile will be check by admin"
                    }
                    disabled={data?.verified === "Pending"}
                    onClick={() =>
                      document
                        .getElementById("rec_profile_update_modal")
                        .showModal()
                    }
                    className={`rp_rec-profile-edit-btn ${
                      data?.verified === "Pending" ? "rp_pending" : ""
                    }`}
                  >
                    <FiEdit className="rp_edit-icon" />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="rp_profile-navigation">
              <nav className="rp_nav-tabs">
                <a href="#" className="rp_nav-tab rp_active">
                  Overview
                </a>
                <a href="#" className="rp_nav-tab">
                  Jobs
                </a>
                <a href="#" className="rp_nav-tab">
                  Candidates
                </a>
                <a href="#" className="rp_nav-tab">
                  Analytics
                </a>
              </nav>
            </div>

            {/* Main Content Grid */}
            <div className="rp_profile-main-grid">
              {/* Left Column - Main Content */}
              <main className="rp_profile-main-content">
                {/* About Us Section */}
                <section className="rp_profile-section">
                  <div className="rp_section-header">
                    <h2 className="rp_section-title">About Us</h2>
                    {canEdit && (
                      <button
                        title={
                          data?.verified === "Pending" &&
                          "You can't edit now. You profile will be check by admin"
                        }
                        disabled={data?.verified === "Pending"}
                        onClick={() =>
                          document
                            .getElementById("rec_about_update_modal")
                            .showModal()
                        }
                        className={`rp_rec-profile-edit-btn ${
                          data?.verified === "Pending" ? "rp_pending" : ""
                        }`}
                      >
                        <FiEdit className="rp_edit-icon" />
                      </button>
                    )}
                  </div>

                  <div className="rp_about-content">
                    <p className="rp_about-description">
                      {data?.description || (
                        <span className="rp_text-gray-500 rp_italic">
                          Tell us about your company's history, values, and what
                          makes it unique. This helps candidates understand your
                          culture and mission.
                        </span>
                      )}
                    </p>

                    <div className="rp_mission-vision-grid">
                      <div className="rp_mission-card">
                        <div className="rp_card-icon-container">
                          <FaFlag className="rp_card-icon" />
                        </div>
                        <h3 className="rp_card-title">Mission</h3>
                        <p className="rp_card-description">
                          {data?.mission || (
                            <span className="rp_text-gray-500 rp_italic">
                              What's your company's core purpose and what it
                              aims to achieve?
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="rp_vision-card">
                        <div className="rp_card-icon-container">
                          <FaEye className="rp_card-icon" />
                        </div>
                        <h3 className="rp_card-title">Vision</h3>
                        <p className="rp_card-description">
                          {data?.vision || (
                            <span className="rp_text-gray-500 rp_italic">
                              Describe the future your company aspires to
                              create.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Departments Section */}
                <section className="rp_profile-section">
                  <div className="rp_section-header">
                    <h2 className="rp_section-title">
                      Departments{" "}
                      {data?.departments?.length
                        ? `(${data.departments.length})`
                        : ""}
                    </h2>

                    {canEdit && (
                      <button
                        title={
                          data?.verified === "Pending" &&
                          "You can't edit now. You profile will be check by admin"
                        }
                        disabled={data?.verified === "Pending"}
                        onClick={() =>
                          document
                            .getElementById("rec_department_update_modal")
                            .showModal()
                        }
                        className={`rp_rec-profile-edit-btn ${
                          data?.verified === "Pending" ? "rp_pending" : ""
                        }`}
                      >
                        <FiEdit className="rp_edit-icon" />
                      </button>
                    )}
                  </div>

                  {data?.departments?.length > 0 ? (
                    <div className="rp_departments-grid">
                      {data.departments.map((department, index) => (
                        <div key={index} className="rp_department-card">
                          {getDepartmentIcon(department)}
                          <span className="rp_department-name">
                            {department}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rp_empty-state">
                      <FaBuilding className="rp_empty-state-icon rp_w-full" />
                      <p className="rp_empty-state-text">
                        No departments added yet
                      </p>
                      <p className="rp_empty-state-subtext">
                        Add your company departments to show candidates your
                        organizational structure
                      </p>
                    </div>
                  )}
                </section>

                {/* Gallery Section */}
                <section className="rp_profile-section">
                  <div className="rp_section-header">
                    <h2 className="rp_section-title">Company Gallery</h2>
                    {canEdit && (
                      <button
                        title={
                          data?.verified === "Pending" &&
                          "You can't edit now. You profile will be check by admin"
                        }
                        disabled={data?.verified === "Pending"}
                        onClick={() =>
                          document
                            .getElementById("rec_picture_update_modal")
                            .showModal()
                        }
                        className={`rp_rec-profile-edit-btn ${
                          data?.verified === "Pending" ? "rp_pending" : ""
                        }`}
                      >
                        <FiEdit className="rp_edit-icon" />
                      </button>
                    )}
                  </div>

                  <div className="rp_empty-state">
                    <FaEye className="rp_empty-state-icon rp_w-full" />
                    <p className="rp_empty-state-text">Gallery coming soon</p>
                    <p className="rp_empty-state-subtext">
                      Showcase your workplace and company culture through photos
                    </p>
                  </div>
                </section>
              </main>

              {/* Right Column - Sidebar */}
              <aside className="rp_profile-sidebar">
                {/* Company Details Card */}
                <div className="rp_sidebar-card">
                  <div className="rp_card-header">
                    <h3 className="rp_card-title">Company Details</h3>
                    {canEdit && (
                      <button
                        title={
                          data?.verified === "Pending" &&
                          "You can't edit now. You profile will be check by admin"
                        }
                        disabled={data?.verified === "Pending"}
                        onClick={() =>
                          document
                            .getElementById("res_company_details_modal")
                            .showModal()
                        }
                        className={`rp_rec-profile-edit-btn ${
                          data?.verified === "Pending" ? "rp_pending" : ""
                        }`}
                      >
                        <FiEdit className="rp_edit-icon" />
                      </button>
                    )}
                  </div>

                  <div className="rp_details-list">
                    <div className="rp_detail-item">
                      <span className="rp_detail-label">
                        <FaGlobe className="rp_detail-icon" />
                        Website
                      </span>
                      {data?.companyWebsite ? (
                        <a
                          href={data.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rp_detail-value rp_link"
                        >
                          {data.companyWebsite.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="rp_detail-value rp_text-gray-500">
                          Not added
                        </span>
                      )}
                    </div>

                    <div className="rp_detail-item">
                      <span className="rp_detail-label">
                        <FaBuilding className="rp_detail-icon" />
                        Industry
                      </span>
                      <span className="rp_detail-value">
                        {data?.industry || "Not specified"}
                      </span>
                    </div>

                    <div className="rp_detail-item">
                      <span className="rp_detail-label">
                        <FaUsers className="rp_detail-icon" />
                        Company size
                      </span>
                      <span className="rp_detail-value">
                        {data?.companySize?.currentEmployees || "0"} /{" "}
                        {data?.companySize?.sizeRange || "0"}
                      </span>
                    </div>

                    <div className="rp_detail-item">
                      <span className="rp_detail-label">
                        <FaCalendar className="rp_detail-icon" />
                        Founded
                      </span>
                      <span className="rp_detail-value">
                        {data?.foundedYear || "Not specified"}
                      </span>
                    </div>

                    <div className="rp_detail-item">
                      <span className="rp_detail-label">
                        <FaMapMarkerAlt className="rp_detail-icon" />
                        Headquarters
                      </span>
                      <span className="rp_detail-value">
                        {data?.headquarters ? (
                          <>
                            {data.headquarters.country} /{" "}
                            {data.headquarters.city} / {data.headquarters.area}
                          </>
                        ) : (
                          "Not specified"
                        )}
                      </span>
                    </div>

                    <div className="rp_detail-item">
                      <span className="rp_detail-label">
                        <FaCodeBranch className="rp_detail-icon" />
                        Branches
                      </span>
                      <span className="rp_detail-value">No Branch</span>
                    </div>
                  </div>
                </div>

                {/* Key People Card */}
                <div className="rp_sidebar-card">
                  <div className="rp_card-header">
                    <h3 className="rp_card-title">
                      Key People{" "}
                      {data?.keyPeople?.length
                        ? `(${data.keyPeople.length})`
                        : ""}
                    </h3>

                    {canEdit && (
                      <button
                        title={
                          data?.verified === "Pending" &&
                          "You can't edit now. You profile will be check by admin"
                        }
                        disabled={data?.verified === "Pending"}
                        onClick={() =>
                          document
                            .getElementById("rec_key_people_modal")
                            .showModal()
                        }
                        className={`rp_rec-profile-edit-btn ${
                          data?.verified === "Pending" ? "rp_pending" : ""
                        }`}
                      >
                        <FiEdit className="rp_edit-icon" />
                      </button>
                    )}
                  </div>

                  {data?.keyPeople?.length > 0 ? (
                    <div className="rp_people-list">
                      {data.keyPeople.map((person, index) => (
                        <div key={index} className="rp_person-card">
                          <div
                            className="rp_person-avatar"
                            style={{
                              backgroundImage: `url("${
                                person?.image || placeholderImage
                              }")`,
                            }}
                          ></div>
                          <div className="rp_person-info">
                            <h4 className="rp_person-name">
                              {person?.name || "Unknown"}
                            </h4>
                            <p className="rp_person-role">
                              {person?.position || "No position"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rp_empty-state-small">
                      <FaUsers className="rp_empty-state-icon rp_w-full" />
                      <p className="rp_empty-state-text">No key people added</p>
                      <p className="rp_empty-state-subtext">
                        Add your leadership team members
                      </p>
                    </div>
                  )}
                </div>

                {/* Social Links Card */}
                <div className="rp_sidebar-card">
                  <div className="rp_card-header">
                    <h3 className="rp_card-title">Social Links</h3>

                    {canEdit && (
                      <button
                        title={
                          data?.verified === "Pending" &&
                          "You can't edit now. You profile will be check by admin"
                        }
                        disabled={data?.verified === "Pending"}
                        onClick={() =>
                          document
                            .getElementById("res_social_links_modal")
                            .showModal()
                        }
                        className={`rp_rec-profile-edit-btn ${
                          data?.verified === "Pending" ? "rp_pending" : ""
                        }`}
                      >
                        <FiEdit className="rp_edit-icon" />
                      </button>
                    )}
                  </div>

                  {hasSocialLinks ? (
                    <div className="rp_social-links">
                      {data?.social?.linkedin && (
                        <a
                          href={data.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rp_social-link"
                          aria-label="LinkedIn"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                      {data?.social?.x && (
                        <a
                          href={data.social.x}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rp_social-link"
                          aria-label="Twitter"
                        >
                          <FaTwitter />
                        </a>
                      )}
                      {Object.entries(data?.social?.additionalLinks || {}).map(
                        ([platform, url]) =>
                          url && (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rp_social-link"
                              aria-label={platform}
                            >
                              <FaLink />
                            </a>
                          )
                      )}
                    </div>
                  ) : (
                    <div className="rp_empty-state-small">
                      <FaLinkedin className="rp_empty-state-icon rp_w-full" />
                      <p className="rp_empty-state-text">No social links</p>
                      <p className="rp_empty-state-subtext">
                        Add your social media profiles
                      </p>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RecruiterProfile;