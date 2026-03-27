import "./FeaturedJobs.css";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaArrowRight,
  FaExternalLinkAlt,
} from "react-icons/fa";

const FeaturedJobs = () => {
  const featuredJobs = [
    {
      id: 1,
      company: "TechNova Solutions",
      title: "Senior Frontend Developer",
      type: "Remote",
      location: "Worldwide",
      salary: "$80K - $120K",
      skills: ["React", "TypeScript", "Tailwind", "Node.js"],
      posted: "2 days ago",
      featured: true,
    },
    {
      id: 2,
      company: "GreenLeaf Design",
      title: "UI/UX Designer",
      type: "Hybrid",
      location: "New York, NY",
      salary: "$65K - $90K",
      skills: ["Figma", "Adobe XD", "Prototyping", "Research"],
      posted: "1 day ago",
      featured: true,
    },
    {
      id: 3,
      company: "DataSphere Inc",
      title: "Data Analyst",
      type: "On-site",
      location: "San Francisco, CA",
      salary: "$70K - $95K",
      skills: ["Python", "SQL", "Tableau", "Stats"],
      posted: "3 days ago",
      featured: true,
    },
    {
      id: 4,
      company: "CloudSecure Tech",
      title: "DevOps Engineer",
      type: "Remote",
      location: "United States",
      salary: "$90K - $130K",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      posted: "5 hours ago",
      featured: true,
    },
  ];

  return (
    <section className="fj_section">
      <div className="fj_container">
        {/* Section Header */}
        <div className="fj_header">
          <h2 className="fj_header-title">
            Featured{" "}
            <span className="fj_highlighted-text">Job Opportunities</span>
          </h2>
          <p className="fj_header-description">
            Discover handpicked opportunities from top companies. Start your
            career journey with these exclusive openings.
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="fj_jobs-grid">
          {featuredJobs.map((job) => (
            <div key={job.id} className="fj_job-card">
              {job.featured && (
                <div className="fj_featured-badge">Featured</div>
              )}

              <div className="fj_company-info">
                <div className="fj_company-logo">
                  <FaBriefcase className="fj_logo-icon" />
                </div>
                <div className="fj_company-details">
                  <h3 className="fj_company-name">{job.company}</h3>
                  <span className="fj_job-type">{job.type}</span>
                </div>
              </div>

              <h4 className="fj_job-title">{job.title}</h4>

              <div className="fj_job-meta">
                <div className="fj_meta-item">
                  <FaMapMarkerAlt className="fj_meta-icon" />
                  <span>{job.location}</span>
                </div>
                <div className="fj_meta-item">
                  <FaMoneyBillWave className="fj_meta-icon" />
                  <span>{job.salary}</span>
                </div>
                <div className="fj_meta-item">
                  <FaClock className="fj_meta-icon" />
                  <span>{job.posted}</span>
                </div>
              </div>

              <div className="fj_skills">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="fj_skill-tag">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="fj_skill-tag fj_more-skills">
                    +{job.skills.length - 3}
                  </span>
                )}
              </div>

              <div className="fj_card-footer">
                <button className="fj_apply-btn">
                  Apply Now
                  <FaArrowRight className="fj_btn-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="fj_cta">
          <button className="fj_view-all-btn">
            View All Job Opportunities
            <FaExternalLinkAlt className="fj_btn-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
