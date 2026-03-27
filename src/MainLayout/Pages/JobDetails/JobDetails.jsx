// File path__
import "./JobDetails.css";

// Package__
import { TfiWorld } from "react-icons/tfi";
import { FcMindMap } from "react-icons/fc";
import { RiProfileLine } from "react-icons/ri";
import { Link, useLoaderData } from "react-router";
import { IoLocationOutline } from "react-icons/io5";
import JobApply from "../../../Components/JobApply/JobApply";
import useUserData from "../../../Hooks/userData";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

const JobDetails = () => {
  const jobData = useLoaderData();
  const { profile } = useUserData();
  const { user } = useContext(AuthContext);

  // Format total apply count__
  const formatTotalApply = (count) => {
    if (!count && count !== 0) return "0";
    if (count >= 100) return "100+";
    if (count >= 50) return `${Math.floor(count / 5) * 5}+`;
    return count.toString();
  };

  // Format salary range__
  const formatSalary = (salaryRange) => {
    if (!salaryRange?.min || !salaryRange?.max) return "Salary not specified";

    const min = salaryRange.min?.toLocaleString() || "";
    const max = salaryRange.max?.toLocaleString() || "";
    const currency = salaryRange.currency || "";
    const period = salaryRange.period || "year";

    return `${min} - ${max} ${currency} / ${period}`;
  };

  // Format date__
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Format location__
  const formatLocation = (job) => {
    const locationParts = [job?.area, job?.city, job?.country].filter(
      (part) => part && part.trim() !== "",
    );

    return locationParts.length > 0
      ? locationParts.join(", ")
      : "Location not specified";
  };

  return (
    <>
      <JobApply jobData={jobData}></JobApply>
      <section className="jd_job-details-section">
        <div className="jd_job-details-container">
          {/* Breadcrumb */}
          <div className="jd_job-breadcrumb">
            <Link to="/jobs" className="jd_breadcrumb-link">
              Jobs
            </Link>
            <span className="jd_breadcrumb-separator">/</span>
            <span className="jd_breadcrumb-current">
              {jobData?.jobTitle || "Job Details"}
            </span>
          </div>

          {/* Main Job Card */}
          <div className="jd_job-main-card">
            <div className="jd_job-header">
              <div className="jd_company-info">
                <div className="jd_company-logo">
                  <img
                    src={jobData?.companyLogo || "/default-company-logo.png"}
                    alt={jobData?.companyName || "Company Logo"}
                    onError={(e) => {
                      e.target.src = "/default-company-logo.png";
                    }}
                  />
                </div>
                <div className="jd_company-details">
                  <h1 className="jd_job-title">
                    {jobData?.jobTitle || "Job Title Not Available"}
                  </h1>
                  <div className="jd_company-name">
                    {jobData?.companyName || "Company Name Not Available"}
                  </div>
                  <div className="jd_job-location">
                    <span className="jd_location-icon">
                      <IoLocationOutline size={25} />
                    </span>
                    {formatLocation(jobData)}
                  </div>
                </div>
              </div>

              <div className="jd_job-actions">
                <button
                  disabled={profile?.userRole !== "Job Seeker"}
                  onClick={() =>
                    document.getElementById("job_apply_modal").showModal()
                  }
                  className="jd_apply-btn jd_primary-btn"
                >
                  <span className="jd_btn-text">
                    {" "}
                    {profile?.userRole !== "Job Seeker"
                      ? "Not Allowed"
                      : "Apply Now"}
                  </span>
                  <span className="jd_btn-icon">→</span>
                </button>

                {!user && (
                  <span className="text-red-500">
                    You have to{" "}
                    <u className="text-blue-500 cursor-pointer">
                      <Link to="/sign-in">Sign In</Link>
                    </u>{" "}
                    first for apply!
                  </span>
                )}

                <div className="jd_secondary-actions">
                  <Link to={`/recruiter-profile/${jobData.companyEmail}`}>
                    <button className="jd_action-btn jd_company-profile-btn">
                      <span className="jd_action-icon">
                        <RiProfileLine />
                      </span>
                      <span className="jd_action-text">Company Profile</span>
                    </button>
                  </Link>
                  <a
                    href={jobData?.companyWebsite || "#"}
                    className="jd_action-btn jd_website-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="jd_action-icon">
                      <TfiWorld />
                    </span>
                    <span className="jd_action-text">Visit Website</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Job Meta Info */}
            <div className="jd_job-meta-grid">
              <div className="jd_meta-item">
                <div className="jd_meta-label">Job Type</div>
                <div className="jd_meta-value jd_badge">
                  {jobData?.jobType || "Not specified"}
                </div>
              </div>
              <div className="jd_meta-item">
                <div className="jd_meta-label">Workplace</div>
                <div className="jd_meta-value jd_badge">
                  {jobData?.workplaceType || "Not specified"}
                </div>
              </div>
              <div className="jd_meta-item">
                <div className="jd_meta-label">Experience</div>
                <div className="jd_meta-value">
                  {jobData?.experienceLevel || "Experience not specified"}
                </div>
              </div>
              <div className="jd_meta-item">
                <div className="jd_meta-label">Salary</div>
                <div className="jd_meta-value jd_salary">
                  {formatSalary(jobData?.salaryRange)}
                </div>
              </div>
              <div className="jd_meta-item">
                <div className="jd_meta-label">Deadline</div>
                <div className="jd_meta-value jd_deadline">
                  {formatDate(jobData?.applicationDeadline)}
                </div>
              </div>
              <div className="jd_meta-item">
                <div className="jd_meta-label">Open Positions</div>
                <div className="jd_meta-value">
                  {jobData?.openPositions || 0} Position
                  {jobData?.openPositions !== 1 ? "s" : ""}
                </div>
              </div>
              {/* Total Apply - New Section */}
              <div className="jd_meta-item">
                <div className="jd_meta-label">Total Applications</div>
                <div className="jd_meta-value jd_apply-count">
                  {formatTotalApply(jobData?.totalApply)}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="jd_job-content">
              <div className="jd_content-section">
                <h3 className="jd_section-title">Job Description</h3>
                <p className="jd_section-text">
                  {jobData?.jobDescription || "No job description available."}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="jd_content-section">
                <h3 className="jd_section-title">Key Responsibilities</h3>
                {jobData?.responsibilities?.length > 0 ? (
                  <ul className="jd_section-list">
                    {jobData.responsibilities.map((item, index) => (
                      <li key={index} className="jd_list-item">
                        <span className="jd_list-icon">✓</span>
                        {item || "Responsibility not specified"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="jd_section-text">No responsibilities listed.</p>
                )}
              </div>

              {/* Requirements */}
              <div className="jd_content-section">
                <h3 className="jd_section-title">Required Skills</h3>
                <div className="jd_skills-container">
                  <div className="jd_skills-header">
                    <p className="jd_skills-description">
                      Essential technical and professional skills required for
                      this position
                    </p>
                  </div>
                  {jobData?.requirementSkills?.length > 0 ? (
                    <div className="jd_skills-grid">
                      {jobData.requirementSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="jd_skill-badge jd_primary-skill"
                        >
                          {skill || "Skill not specified"}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="jd_section-text">
                      No required skills listed.
                    </p>
                  )}
                </div>
              </div>

              {/* Nice to Have */}
              <div className="jd_content-section">
                <h3 className="jd_section-title">Nice to Have</h3>
                {jobData?.niceToHave?.length > 0 ? (
                  <div className="jd_skills-grid">
                    {jobData.niceToHave.map((skill, index) => (
                      <div
                        key={index}
                        className="jd_skill-badge jd_secondary-skill"
                      >
                        {skill || "Skill not specified"}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="jd_section-text">
                    No additional skills listed.
                  </p>
                )}
              </div>

              {/* Who Can Apply */}
              <div className="jd_content-section">
                <h3 className="jd_section-title">Who Can Apply</h3>
                {jobData?.whoCanApply?.length > 0 ? (
                  <ul className="jd_section-list">
                    {jobData.whoCanApply.map((item, index) => (
                      <li key={index} className="jd_list-item">
                        <span className="jd_list-icon">•</span>
                        {item || "Requirement not specified"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="jd_section-text">
                    No specific requirements listed.
                  </p>
                )}
              </div>

              {/* Benefits */}
              <div className="jd_content-section">
                <h3 className="jd_section-title">Benefits & Perks</h3>
                {jobData?.benefits?.length > 0 ? (
                  <div className="jd_benefits-grid">
                    {jobData.benefits.map((benefit, index) => (
                      <div key={index} className="jd_benefit-item">
                        <div>
                          <FcMindMap size={25} />
                        </div>
                        <span className="jd_benefit-text">
                          {benefit || "Benefit not specified"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="jd_section-text">No benefits listed.</p>
                )}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="jd_job-cta">
              <div className="jd_cta-content">
                <h3 className="jd_cta-title">Ready to Apply?</h3>
                <p className="jd_cta-description">
                  {jobData?.openPositions > 0
                    ? `Don't miss this opportunity to join ${
                        jobData?.companyName || "this company"
                      } as ${jobData?.jobTitle || "their team member"}.`
                    : "This position is currently not accepting applications."}
                </p>
              </div>
              <button
                onClick={() =>
                  document.getElementById("job_apply_modal").showModal()
                }
                className="jd_apply-btn-large jd_primary-btn"
                disabled={
                  !jobData?.openPositions ||
                  jobData?.openPositions === 0 ||
                  profile?.userRole !== "Job Seeker"
                }
              >
                <span className="jd_btn-text">
                  {jobData?.openPositions > 0
                    ? "Apply for This Position"
                    : "No Open Positions"}
                </span>
                <span className="jd_btn-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobDetails;
