import "./UserProfile.css";
import useUserData from "../../../Hooks/userData";
import placeholderImage from "../../../assets/place_banner.png";
import ScrollToTop from "../../../Components/ScrollToTop/ScrollToTop";
import AboutModal from "../../../Components/UserUpdateModal/AboutModal/AboutModal";
import SkillModal from "../../../Components/UserUpdateModal/SkillModal/SkillModal";
import BannerModal from "../../../Components/UserUpdateModal/BannerModal/BannerModal";
import ContactModal from "../../../Components/UserUpdateModal/ContactModal/ContactModal";
import ProfileModal from "../../../Components/UserUpdateModal/ProfileModal/ProfileModal";
import ProjectModal from "../../../Components/UserUpdateModal/ProjectModal/ProjectModal";
import LanguageModal from "../../../Components/UserUpdateModal/LanguageModal/LanguageModal";
import EducationModal from "../../../Components/UserUpdateModal/EducationModal/EducationModal";
import ExperienceModal from "../../../Components/UserUpdateModal/ExperienceModal/ExperienceModal";
import CertificateModal from "../../../Components/UserUpdateModal/CertificateModal/CertificateModal";

// Package__
import { FaLinkedin, FaGithub, FaReact } from "react-icons/fa";
import {
  FiEdit,
  FiPhone,
  FiMapPin,
  FiLink,
  FiAward,
  FiMail,
} from "react-icons/fi";
import { SiGraphql } from "react-icons/si";
import { IoSchoolOutline } from "react-icons/io5";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { PiBuildingApartmentBold } from "react-icons/pi";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

const UserProfile = () => {
  const { profile, isLoading } = useUserData();
  const { userLoading } = useContext(AuthContext);

  if (userLoading || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop></ScrollToTop>
      <section id="main_profile_container">
        {/* All modals__ */}
        <ContactModal></ContactModal>
        <LanguageModal></LanguageModal>
        <BannerModal></BannerModal>
        <ProfileModal></ProfileModal>
        <AboutModal></AboutModal>
        <ExperienceModal></ExperienceModal>
        <EducationModal></EducationModal>
        <SkillModal></SkillModal>
        <ProjectModal></ProjectModal>
        <CertificateModal></CertificateModal>

        {/* Main container with max width and padding */}
        <div className="up_profile-container">
          {/* Grid layout for sidebar and main content */}
          <div className="up_profile-grid">
            {/* Sidebar - hidden on mobile, visible on large screens */}
            <aside className="up_profile-sidebar">
              {/* Quick Stats section without edit button */}
              <div className="up_profile-card up_desktop-view-only">
                <h3 className="up_profile-card-title up_section-title-line">
                  Quick Stats
                </h3>
                <div className="up_stats-container">
                  <div className="up_stat-item">
                    <p className="up_stat-number">
                      {profile?.projects?.length || 0}
                    </p>
                    <p className="up_stat-label">Projects</p>
                  </div>
                  <div className="up_stat-item">
                    <p className="up_stat-number">
                      {profile?.skills?.length || 0}
                    </p>
                    <p className="up_stat-label">Skills</p>
                  </div>
                  <div className="up_stat-item">
                    <p className="up_stat-number">
                      {profile?.certifications?.length || 0}
                    </p>
                    <p className="up_stat-label">Certifications</p>
                  </div>
                </div>
              </div>

              {/* Open to Work status badge */}
              <div className="up_profile-card up_tab-view-only">
                <div className="up_status-section">
                  <h3 className="up_profile-card-title up_section-title-line">
                    Availability
                  </h3>
                  {profile?.openToWork === true ? (
                    <span className="up_status-badge up_open-status">
                      <span className="up_status-dot"></span>
                      Open to Work
                    </span>
                  ) : (
                    <span className="up_status-badge up_closed-status">
                      <span className="up_status-dot up_closed"></span>
                      Not Available
                    </span>
                  )}
                </div>
              </div>

              {/* Contact information with edit button */}
              <div className="up_profile-card up_desktop-view-only">
                <button
                  onClick={() =>
                    document.getElementById("contact_update_modal").showModal()
                  }
                  className="up_card-edit-button"
                >
                  <FiEdit className="up_edit-icon" />
                </button>
                <h3 className="up_profile-card-title up_section-title-line">
                  Contact Info
                </h3>
                <div className="up_contact-info">
                  <div className="up_contact-item">
                    <FiMapPin className="up_contact-icon" />
                    <span className="up_contact-text">
                      {!profile?.location?.city && !profile?.location?.country
                        ? "Location not set"
                        : `${profile?.location?.city || ""}${
                            profile?.location?.city &&
                            profile?.location?.country
                              ? ", "
                              : ""
                          }${profile?.location?.country || ""}`}
                    </span>
                  </div>
                  <div className="up_contact-item">
                    <FiMail className="up_contact-icon" />
                    <a
                      className="up_contact-link"
                      href={`mailto:${profile?.userEmail}`}
                    >
                      {profile?.userEmail || "Email not set"}
                    </a>
                  </div>
                  <div className="up_contact-item">
                    <FiPhone className="up_contact-icon" />
                    <span className="up_contact-text">
                      {profile?.number || "Phone not set"}
                    </span>
                  </div>
                </div>

                {/* Social media links */}
                <div className="up_social-links">
                  <a
                    className={`up_social-link ${
                      !profile?.social?.linkedin ? "up_disabled" : ""
                    }`}
                    href={profile?.social?.linkedin || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin size={24} className="up_social-icon" />
                  </a>

                  <a
                    className={`up_social-link ${
                      !profile?.social?.github ? "up_disabled" : ""
                    }`}
                    href={profile?.social?.github || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub size={24} className="up_social-icon" />
                  </a>

                  <a
                    className={`up_social-link ${
                      !profile?.social?.portfolio ? "up_disabled" : ""
                    }`}
                    href={profile?.social?.portfolio || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiLink size={24} className="up_social-icon" />
                  </a>
                </div>
              </div>

              {/* Languages section with edit button */}
              <div className="up_profile-card up_desktop-view-only">
                <button
                  className="up_card-edit-button"
                  onClick={() =>
                    document.getElementById("language_update_modal").showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>
                <h3 className="up_profile-card-title up_section-title-line">
                  Languages
                </h3>
                <div className="up_language-tags">
                  {!profile?.languages || profile.languages.length === 0 ? (
                    <span className="up_no-data-text">No languages added</span>
                  ) : (
                    profile.languages.map((lang) => (
                      <div key={lang.id} className="up_language-item">
                        <span className="up_language-name">{lang.name}</span>
                        <span className="up_language-proficiency">
                          {lang.proficiency}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>

            {/* Main content area */}
            <main className="up_profile-main">
              {/* Profile header with banner and avatar */}
              <div className="up_profile-header-card">
                <button
                  className="up_header-edit-button"
                  onClick={() =>
                    document.getElementById("banner_update_modal").showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>
                <div
                  className="up_header-banner"
                  style={{
                    backgroundImage: `url("${
                      profile?.profileBanner === ""
                        ? placeholderImage
                        : profile?.profileBanner
                    }")`,
                  }}
                ></div>
                <div className="up_header-content ">
                  <div className="up_profile-info-container up_w-full">
                    <button
                      className="up_mt-[60px] up_card-edit-button"
                      onClick={() =>
                        document
                          .getElementById("profile_update_modal")
                          .showModal()
                      }
                    >
                      <FiEdit className="up_edit-icon" />
                    </button>
                    <div className="up_profile-avatar-container">
                      <div
                        className="up_profile-avatar"
                        style={{
                          backgroundImage: `url("${
                            profile?.profilePhoto === ""
                              ? placeholderImage
                              : profile?.profilePhoto
                          }")`,
                        }}
                      ></div>
                    </div>

                    <div className="up_profile-details">
                      <div className="up_profile-details-content">
                        <div className="up_mobile-status-container">
                          {profile?.openToWork === true ? (
                            <span className="up_status-badge up_open-status">
                              <span className="up_status-dot"></span>
                              Open to Work
                            </span>
                          ) : (
                            <span className="up_status-badge up_closed-status">
                              <span className="up_status-dot up_closed"></span>
                              Not Available
                            </span>
                          )}
                        </div>
                        <h2 className="up_profile-name">
                          {profile?.userName || "Your Name"}
                        </h2>
                        <p className="up_profile-title">
                          {profile?.bio || "Your professional bio"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile contact info (visible only on small screens) */}
              <div className="up_profile-card up_mobile-contact-info">
                <button
                  className="up_card-edit-button"
                  onClick={() =>
                    document.getElementById("contact_update_modal").showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>
                <h3 className="up_card-title-lg">Contact Info</h3>
                <div className="up_contact-info">
                  <div className="up_contact-item">
                    <FiMapPin className="up_contact-icon" />
                    <span className="up_contact-text">
                      {!profile?.location?.city && !profile?.location?.country
                        ? "Location not set"
                        : `${profile?.location?.city || ""}${
                            profile?.location?.city &&
                            profile?.location?.country
                              ? ", "
                              : ""
                          }${profile?.location?.country || ""}`}
                    </span>
                  </div>
                  <div className="up_contact-item">
                    <FiMail className="up_contact-icon" />
                    <a
                      className="up_contact-link"
                      href={`mailto:${profile?.userEmail}`}
                    >
                      {profile?.userEmail || "Email not set"}
                    </a>
                  </div>
                  <div className="up_contact-item">
                    <FiPhone className="up_contact-icon" />
                    <span className="up_contact-text">
                      {profile?.number || "Phone not set"}
                    </span>
                  </div>
                </div>

                <div className="up_social-links">
                  <a
                    className={`up_social-link ${
                      !profile?.social?.linkedin ? "up_disabled" : ""
                    }`}
                    href={profile?.social?.linkedin || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin size={24} className="up_social-icon" />
                  </a>

                  <a
                    className={`up_social-link ${
                      !profile?.social?.github ? "up_disabled" : ""
                    }`}
                    href={profile?.social?.github || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub size={24} className="up_social-icon" />
                  </a>

                  <a
                    className={`up_social-link ${
                      !profile?.social?.portfolio ? "up_disabled" : ""
                    }`}
                    href={profile?.social?.portfolio || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiLink size={24} className="up_social-icon" />
                  </a>
                </div>
              </div>

              {/* About section */}
              <div className="up_profile-card">
                <button
                  className="up_card-edit-button"
                  onClick={() =>
                    document.getElementById("about_update_modal").showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>
                <h3 className="up_card-title-lg  up_section-title-line">
                  About
                </h3>
                <p className="up_about-text">
                  {profile?.headline ||
                    "Tell us about yourself! Share your professional journey, passions, and what drives you in your career."}
                </p>
              </div>

              {/* Experience section with timeline */}
              <div className="up_profile-card">
                <button
                  className="up_card-edit-button"
                  onClick={() =>
                    document
                      .getElementById("experience_update_modal")
                      .showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>

                <h3 className="up_card-title-lg up_section-title-line">
                  Experience
                </h3>

                {!profile?.experience || profile.experience.length === 0 ? (
                  <div className="up_empty-state">
                    <HiOutlineBuildingOffice2
                      size={48}
                      className="up_empty-icon up_w-full"
                    />
                    <p className="up_empty-text">No experience added yet</p>
                    <p className="up_empty-subtext">
                      Share your professional journey to showcase your expertise
                    </p>
                  </div>
                ) : (
                  <div className="up_timeline">
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="up_timeline-item">
                        <div
                          className={
                            exp?.isCurrent
                              ? "up_timeline-dot up_current"
                              : "up_timeline-dot up_past"
                          }
                        ></div>
                        <div className="up_timeline-content">
                          <div className="up_timeline-header">
                            <h4 className="up_timeline-company">
                              <PiBuildingApartmentBold className="up_inline-icon" />
                              {exp?.company}
                            </h4>
                            <span
                              className={`up_timeline-status ${
                                exp?.isCurrent ? "up_current" : "up_past"
                              }`}
                            >
                              {exp?.status}
                            </span>
                          </div>
                          <p className="up_timeline-role">{exp?.position}</p>
                          <div className="up_timeline-meta">
                            <span className="up_timeline-period">
                              {exp?.startDate} - {exp?.endDate}
                            </span>
                            <span className="up_timeline-location">
                              {exp?.location}
                            </span>
                          </div>
                          {exp?.description && (
                            <p className="up_timeline-description">
                              {exp?.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Education section */}
              <div className="up_profile-card">
                <button
                  className="up_card-edit-button"
                  onClick={() =>
                    document
                      .getElementById("education_update_modal")
                      .showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>
                <h3 className="up_card-title-lg up_section-title-line">
                  Education
                </h3>
                <div className="up_education-list">
                  {!profile?.education || profile.education.length === 0 ? (
                    <div className="up_empty-state">
                      <IoSchoolOutline
                        size={48}
                        className="up_empty-icon up_w-full"
                      />
                      <p className="up_empty-text">No education added yet</p>
                      <p className="up_empty-subtext">
                        Add your educational background
                      </p>
                    </div>
                  ) : (
                    profile.education.map((edu, index) => (
                      <div key={index} className="up_education-item">
                        <div className="up_education-header">
                          <IoSchoolOutline className="up_education-icon" />
                          <div>
                            <h4 className="up_education-level">{edu?.level}</h4>
                            <p className="up_education-institution">
                              <HiOutlineBuildingOffice2 className="up_inline-icon" />
                              {edu?.institute}
                            </p>
                          </div>
                        </div>
                        <div className="up_education-details">
                          <p className="up_education-department">
                            {edu?.department}
                          </p>
                          <p className="up_education-period">
                            {edu?.startYear} - {edu?.endYear}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Skills section */}
              <div className="up_profile-card">
                <button
                  className="up_card-edit-button"
                  onClick={() =>
                    document.getElementById("skill_update_modal").showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>

                <h3 className="up_card-title-lg up_section-title-line">
                  Skills
                </h3>

                <div className="up_skill-tags">
                  {!profile?.skills || profile.skills.length === 0 ? (
                    <span className="up_no-data-text">No skills added yet</span>
                  ) : (
                    profile.skills.map((skill, index) => (
                      <span key={index} className="up_skill-tag">
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Mobile languages section (visible only on small screens) */}
              <div className="up_profile-card up_mobile-languages">
                <button
                  className="up_card-edit-button"
                  onClick={() =>
                    document.getElementById("language_update_modal").showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>
                <h3 className="up_card-title-lg up_section-title-line">
                  Languages
                </h3>

                <div className="up_language-tags">
                  {!profile?.languages || profile.languages.length === 0 ? (
                    <span className="up_no-data-text">No languages added</span>
                  ) : (
                    profile.languages.map((lang) => (
                      <div key={lang.id} className="up_language-item">
                        <span className="up_language-name">{lang.name}</span>
                        <span className="up_language-proficiency">
                          {lang.proficiency}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Projects section */}
              <div className="up_profile-card">
                <button
                  className="up_card-edit-button"
                  onClick={() =>
                    document.getElementById("project_update_modal").showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>

                <h3 className="up_card-title-lg up_section-title-line">
                  Projects
                </h3>

                <div className="up_project-grid">
                  {!profile?.projects || profile.projects.length === 0 ? (
                    <>
                      <div className="up_empty-state">
                        <FaReact
                          size={48}
                          className="up_empty-icon up_w-full"
                        />
                        <p className="up_empty-text">No projects added yet</p>
                        <p className="up_empty-subtext">
                          Showcase your work and achievements
                        </p>
                      </div>
                      <div className="up_empty-state">
                        <FaReact
                          size={48}
                          className="up_empty-icon up_w-full"
                        />
                        <p className="up_empty-text">No projects added yet</p>
                        <p className="up_empty-subtext">
                          Showcase your work and achievements
                        </p>
                      </div>
                    </>
                  ) : (
                    profile.projects.map((project, index) => (
                      <div key={index} className="up_project-card">
                        <h4 className="up_project-title">{project?.title}</h4>
                        <p className="up_project-description">
                          {project?.description}
                        </p>
                        <div className="up_project-footer">
                          <div className="up_project-tags">
                            {project?.skills?.map((skill, skillIndex) => (
                              <span key={skillIndex} className="up_project-tag">
                                <SiGraphql className="up_inline-icon" />
                                {skill}
                              </span>
                            ))}
                          </div>
                          <a className="up_project-link" href="#">
                            View Project →
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Certifications section */}
              <div className="up_profile-card">
                <button
                  className="up_card-edit-button"
                  onClick={() =>
                    document
                      .getElementById("certificate_update_modal")
                      .showModal()
                  }
                >
                  <FiEdit className="up_edit-icon" />
                </button>
                <h3 className="up_card-title-lg up_section-title-line">
                  Certifications
                </h3>
                <div className="up_certification-list">
                  {!profile?.certifications ||
                  profile.certifications.length === 0 ? (
                    <div className="up_empty-state">
                      <FiAward size={48} className="up_empty-icon up_w-full" />
                      <p className="up_empty-text">
                        No certifications added yet
                      </p>
                      <p className="up_empty-subtext">
                        Add your professional certifications
                      </p>
                    </div>
                  ) : (
                    profile.certifications.map((cert, index) => (
                      <div key={index} className="up_certification-item">
                        <FiAward className="up_certification-icon" />
                        <div className="up_certification-details">
                          <p className="up_certification-name">{cert.name}</p>
                          <p className="up_certification-issuer">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserProfile;
