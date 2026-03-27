import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaLinkedin,
  FaGithub,
  FaCalendar,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronUp,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaFilePdf,
  FaLink,
} from "react-icons/fa";
import { MdLanguage, MdVerified } from "react-icons/md";

const DigitalResumeContent = ({ clickedApp, resumeLink }) => {
  // State for expandable sections__
  const [expandedAbout, setExpandedAbout] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});

  // Helper functions__
  const hasData = (data) => {
    if (Array.isArray(data)) return data && data.length > 0;
    if (typeof data === "object") return data && Object.keys(data).length > 0;
    if (typeof data === "string") return data && data.trim().length > 0;
    return !!data;
  };

  const toggleProject = (index) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // If no data passed, show empty state__
  if (!clickedApp || !clickedApp._id) {
    return (
      <div className="digital-resume p-2 max-w-4xl mx-auto">
        <div className="text-center py-16">
          <MdVerified className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Resume Data Available
          </h3>
          <p className="text-gray-500">Candidate data could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Map the JSON data to our component structure
  const userData = clickedApp;

  // Extract and transform data
  const resumeData = {
    // Personal Info
    name: userData.userName || "Not Provided",
    title: userData.bio || userData.headline?.split("\n")[0] || "Job Seeker",
    image: userData.profilePhoto || "https://via.placeholder.com/150",
    about: userData.headline || userData.bio || "",

    // Contact Info
    location: userData.location
      ? `${userData.location.city || ""}, ${userData.location.country || ""}`
          .trim()
          .replace(/^, |, $/g, "")
      : "Location not specified",
    email: userData.userEmail || "Email not provided",
    phone: userData.number || "Phone not provided",

    // Social Links
    social: userData.social || {},

    // Languages - Transform array of objects to display strings
    languages: userData.languages
      ? userData.languages.map((lang) =>
          `${lang.name || ""} (${lang.proficiency || ""})`.trim()
        )
      : [],

    // Experience - Use experience array if available
    experience: userData.experience || userData.expData || [],

    // Education
    education: userData.education || [],

    // Skills
    skills: userData.skills || [],

    // Projects
    projects: userData.projects
      ? userData.projects.map((proj) => ({
          name: proj.title || "Untitled Project",
          description: proj.description || "",
          fullDescription: proj.description || "",
          techStack: proj.skills || [],
          projectLink: proj.projectLink || "",
        }))
      : [],

    // Certifications
    certifications: userData.certifications || [],

    // Custom Resume Link (if any - you might need to add this field)
    customResumeLink: resumeLink === "No link provide" ? "" : resumeLink,
  };

  // Calculate experience years
  const calculateExperienceYears = () => {
    if (!hasData(resumeData.experience)) return "0";

    try {
      const years = resumeData.experience
        .map((exp) => {
          const start = parseInt(exp.startDate) || new Date().getFullYear();
          const end =
            exp.endDate === "Present"
              ? new Date().getFullYear()
              : parseInt(exp.endDate) || new Date().getFullYear();
          return end - start;
        })
        .reduce((acc, val) => acc + val, 0);

      return Math.max(1, years);
    } catch {
      return "several";
    }
  };

  // Format date range
  const formatDateRange = (start, end) => {
    if (!start && !end) return "Date not specified";
    if (end === "Present") return `${start || ""} - Present`;
    return `${start || ""} - ${end || ""}`;
  };

  return (
    <div className="digital-resume p-2 max-w-4xl mx-auto">
      {/* Header Section with Bigger Image */}
      <div className="resume-header text-center mb-8 pb-8 border-b border-gray-200">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 bg-gray-100">
            <img
              src={resumeData.image}
              alt={resumeData.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          </div>

          {/* Name and Title */}
          <h1 className="text-3xl font-bold text-gray-900">
            {resumeData.name}
          </h1>
          <p className="text-xl text-[#3c8f63] font-semibold mt-2">
            {resumeData.title}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {calculateExperienceYears()}+ years experience
          </p>

          {/* Contact Info Row */}
          <div className="flex flex-wrap justify-center gap-8 mt-4">
            {/* Location */}
            {hasData(resumeData.location) &&
              resumeData.location !== "Location not specified" && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-[#3c8f63]" />
                  <span>{resumeData.location}</span>
                </div>
              )}

            {/* Email */}
            {hasData(resumeData.email) &&
              resumeData.email !== "Email not provided" && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-[#3c8f63]" />
                  <span>{resumeData.email}</span>
                </div>
              )}

            {/* Phone */}
            {hasData(resumeData.phone) &&
              resumeData.phone !== "Phone not provided" && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-[#3c8f63]" />
                  <span>{resumeData.phone}</span>
                </div>
              )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {resumeData.social.linkedin && (
              <a
                href={resumeData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaLinkedin className="text-blue-600" />
                <span>LinkedIn</span>
              </a>
            )}
            {resumeData.social.github && (
              <a
                href={resumeData.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
            )}
            {resumeData.social.portfolio && (
              <a
                href={resumeData.social.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaGlobe className="text-[#3c8f63]" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Single Column Content */}
      <div className="space-y-8">
        {/* About/Summary Section */}
        <section className="bg-gray-100 rounded-xl p-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MdVerified className="text-[#3c8f63]" />
              Professional Summary
            </h2>
            {hasData(resumeData.about) && resumeData.about.length > 200 && (
              <button
                onClick={() => setExpandedAbout(!expandedAbout)}
                className="text-sm text-[#3c8f63] hover:text-[#2a6b4a] flex items-center gap-1"
              >
                {expandedAbout ? "Show Less" : "Show More"}
                {expandedAbout ? (
                  <FaChevronUp className="text-xs" />
                ) : (
                  <FaChevronDown className="text-xs" />
                )}
              </button>
            )}
          </div>
          {hasData(resumeData.about) ? (
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {expandedAbout || resumeData.about.length <= 200
                ? resumeData.about
                : `${resumeData.about.substring(0, 200)}...`}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 italic">
                No professional summary provided.
              </p>
            </div>
          )}
        </section>

        {/* Experience Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <FaBriefcase className="text-[#3c8f63]" />
            Work Experience
          </h2>

          {hasData(resumeData.experience) ? (
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 border-[#3c8f63] pl-5 py-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exp.position || "Position not specified"}
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {exp.company || "Company not specified"}
                      </p>
                    </div>
                    {exp.isCurrent !== undefined && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
                          exp.isCurrent
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {exp.isCurrent ? "Current" : "Previous"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <FaCalendar className="text-xs" />
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-xs" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {hasData(exp.description) && (
                    <p className="text-gray-600 mt-4 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
              <FaBriefcase className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No work experience information provided.
              </p>
            </div>
          )}
        </section>

        {/* Skills & Languages Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills Section */}
          <section className="bg-gray-100 rounded-xl p-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <FaCode className="text-[#3c8f63]" />
              Skills
            </h2>
            {hasData(resumeData.skills) ? (
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 italic">
                  No skills information provided.
                </p>
              </div>
            )}
          </section>

          {/* Languages & Education Column */}
          <div className="space-y-6">
            {/* Languages Section */}
            <section className="bg-gray-100 rounded-xl p-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <MdLanguage className="text-[#3c8f63]" />
                Languages
              </h2>
              {hasData(resumeData.languages) ? (
                <div className="space-y-2">
                  {resumeData.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700">
                        {lang.split("(")[0].trim() || "Language"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {lang.match(/\(([^)]+)\)/)?.[1] || ""}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 italic">
                    No languages information provided.
                  </p>
                </div>
              )}
            </section>

            {/* Education Section */}
            <section className="bg-gray-100 rounded-xl p-3">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FaGraduationCap className="text-[#3c8f63]" />
                Education
              </h2>
              {hasData(resumeData.education) ? (
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900">
                        {edu.institute || "Institution not specified"}
                      </h3>
                      <p className="text-gray-700">
                        {edu.department || "Field of study not specified"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <FaCalendar className="text-xs" />
                        <span>
                          {formatDateRange(edu.startYear, edu.endYear)}
                        </span>
                        {edu.level && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-xs">
                            {edu.level}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 italic">
                    No education information provided.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Projects Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <FaCode className="text-[#3c8f63]" />
            Projects
          </h2>

          {hasData(resumeData.projects) ? (
            <div className="space-y-6">
              {resumeData.projects.map((project, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-3 hover:border-[#3c8f63] transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    {hasData(project.description) &&
                      project.description.length > 150 && (
                        <button
                          onClick={() => toggleProject(index)}
                          className="text-sm text-[#3c8f63] hover:text-[#2a6b4a] flex items-center gap-1"
                        >
                          {expandedProjects[index]
                            ? "Show Less"
                            : "Show Details"}
                          {expandedProjects[index] ? (
                            <FaChevronUp className="text-xs" />
                          ) : (
                            <FaChevronDown className="text-xs" />
                          )}
                        </button>
                      )}
                  </div>

                  {hasData(project.description) && (
                    <div className="text-gray-700 mb-4 whitespace-pre-line">
                      {expandedProjects[index] ||
                      project.description.length <= 150
                        ? project.description
                        : `${project.description.substring(0, 150)}...`}
                    </div>
                  )}

                  {hasData(project.techStack) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.techStack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-[#3c8f63] bg-opacity-10 text-[#3c8f63] rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.projectLink && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-2 text-[#3c8f63] hover:text-[#2a6b4a] cursor-pointer"
                    >
                      <FaLink className="text-sm" />
                      <span className="underline">Live Link</span>
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
              <FaCode className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No projects information provided.</p>
            </div>
          )}
        </section>

        {/* Certifications Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <MdVerified className="text-[#3c8f63]" />
            Certifications
          </h2>

          {hasData(resumeData.certifications) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-[#3c8f63] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdVerified className="text-[#3c8f63] text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {cert.name || "Certification"}
                    </h4>
                    {cert.issuer && (
                      <p className="text-gray-600">{cert.issuer}</p>
                    )}
                    {cert.year && (
                      <p className="text-sm text-gray-500 mt-1">
                        Issued {cert.year}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
              <MdVerified className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No certifications provided.</p>
            </div>
          )}
        </section>

        {/* Custom Resume Link Section */}
        <section className="mt-10 pt-8 border-t border-gray-300">
          <div className="bg-gradient-to-r from-[#3c8f63] to-[#2a6b4a] rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">
                  View Full Custom Resume
                </h3>
                <p className="text-white text-opacity-90">
                  The candidate has uploaded a custom-designed resume with
                  additional details and formatting.
                </p>
              </div>

              {hasData(resumeData.customResumeLink) ? (
                <a
                  href={resumeData.customResumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[#3c8f63] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <FaFilePdf />
                  View Custom Resume
                  <FaExternalLinkAlt className="text-sm" />
                </a>
              ) : (
                <div className="text-center py-3">
                  <p className="text-white text-opacity-80 italic">
                    No custom resume uploaded
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DigitalResumeContent;