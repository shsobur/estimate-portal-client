// File path__
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useState, useEffect, useRef } from "react";

// Package__
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ProjectUpdateModal = () => {
  const { profile, updateProfile } = useUserData();
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    title: "",
    projectLink: "",
    description: "",
    skills: [],
    currentlyWorking: false,
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data__
  const originalProjectsRef = useRef([]);

  // Months for dropdown__
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Years for dropdown (2001 to current year)__
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 },
    (_, i) => currentYear - i
  );

  // Initialize with profile data__
  useEffect(() => {
    if (profile?.projects) {
      setProjects(profile.projects);
      originalProjectsRef.current = profile.projects;
      setHasChanges(false);
    }
  }, [profile]);

  // Check for changes__
  useEffect(() => {
    const hasProjectsChanged =
      JSON.stringify(projects) !== JSON.stringify(originalProjectsRef.current);
    setHasChanges(hasProjectsChanged);
  }, [projects]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProject((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add new skill__
  const handleAddSkill = () => {
    if (newSkill.trim() && currentProject.skills.length < 6) {
      setCurrentProject((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  // Remove skill__
  const handleRemoveSkill = (index) => {
    setCurrentProject((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Add or update project__
  const handleAddProject = () => {
    if (!currentProject.title.trim() || !currentProject.description.trim()) {
      alert("Please fill in title and description");
      return;
    }

    const projectData = {
      ...currentProject,
      id:
        editingIndex !== null
          ? projects[editingIndex].id
          : Date.now().toString(),
    };

    if (editingIndex !== null) {
      // Update existing project__
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = projectData;
      setProjects(updatedProjects);
    } else {
      // Add new project at the top__
      setProjects((prev) => [projectData, ...prev]);
    }

    // Reset form
    resetForm();
  };

  // Edit project__
  const handleEditProject = (index) => {
    const projectToEdit = projects[index];
    setCurrentProject(projectToEdit);
    setEditingIndex(index);
  };

  // Delete project__
  const handleDeleteProject = (index) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);
      if (editingIndex === index) {
        resetForm();
      }
    }
  };

  // Reset form__
  const resetForm = () => {
    setCurrentProject({
      title: "",
      projectLink: "",
      description: "",
      skills: [],
      currentlyWorking: false,
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
    });
    setNewSkill("");
    setEditingIndex(null);
  };

  // Handle final submission__
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data for submission__
    const submissionData = {
      projects: projects.map((project) => ({
        id: project.id,
        title: project.title.trim(),
        projectLink: project.projectLink.trim(),
        description: project.description.trim(),
        skills: project.skills,
        currentlyWorking: project.currentlyWorking,
        startDate:
          project.startYear && project.startMonth
            ? `${project.startMonth} ${project.startYear}`
            : "",
        endDate: project.currentlyWorking
          ? "Present"
          : project.endYear && project.endMonth
          ? `${project.endMonth} ${project.endYear}`
          : "",
      })),
    };

    updateProfile(submissionData, {
      onSuccess: () => {
        handleCloseModal();

        // Update original data after successful save__
        originalProjectsRef.current = projects;

        Swal.fire({
          title: "Success!",
          text: "Project updated successfully.",
          icon: "success",
        });

        setIsSubmitting(false);
        setHasChanges(false);
      },

      onError: () => {
        handleCloseModal();

        Swal.fire({
          title: "Oops!",
          text: "Something went wrong while updating.",
          icon: "error",
        });

        setIsSubmitting(false);
      },
    });
  };

  // Check if form has required fields for adding project__
  const canAddProject =
    currentProject.title.trim() && currentProject.description.trim();

  const handleCancel = () => {
    handleCloseModal();

    // Reset to original data__
    setProjects(originalProjectsRef.current);
    resetForm();
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("project_update_modal");
    modal.close();
  };

  return (
    <section>
      <dialog id="project_update_modal" className="modal">
        <div className="modal-box max-w-[1024px] max-h-[95vh] lg:p-0 p-0">
          <div className="project_update_main_content_container">
            {/* Header - Same as other modals */}
            <SeekerModalHeader
              title={
                profile?.projects?.length ? "Update Projects" : "Add Projects"
              }
              handleCloseModal={handleCloseModal}
            ></SeekerModalHeader>

            {/* Main Content - Same structure as other modals */}
            <div className="space-y-8 px-5">
              {/* Projects List at the Top */}
              {projects.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Your Projects ({projects.length})
                  </h3>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div
                        key={project.id}
                        className="border-2 border-gray-300 rounded-lg p-6 transition-colors hover:border-gray-400"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {project.title}
                            </h3>
                            {project.projectLink && (
                              <a
                                href={project.projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-lg"
                              >
                                {project.projectLink}
                              </a>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleEditProject(index)}
                              disabled={isSubmitting}
                              className="text-[#3C8F63] hover:text-[#337954] transition-colors"
                              title="Edit project"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(index)}
                              disabled={isSubmitting}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete project"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 text-lg mb-4">
                          {project.description}
                        </p>
                        {project.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="bg-[#3C8F63] text-white px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.currentlyWorking && (
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            Currently working
                          </span>
                        )}
                        {!project?.currentlyWorking && (
                          <span className="text-gray-600 bg-gray-200 px-4 py-1 rounded-xl">
                            {project?.startDate} - {project?.endDate}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Form */}
              <form className="space-y-6">
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 font-medium text-xl">
                      Project Title *
                    </span>
                  </label>
                  <input
                    disabled={isSubmitting}
                    type="text"
                    className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                    name="title"
                    value={currentProject.title}
                    onChange={handleChange}
                    placeholder="Enter project title"
                    maxLength={100}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {currentProject.title.length}/100 characters
                  </p>
                </div>

                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 font-medium text-xl">
                      Project Link
                    </span>
                  </label>
                  <input
                    disabled={isSubmitting}
                    type="url"
                    className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                    name="projectLink"
                    value={currentProject.projectLink}
                    onChange={handleChange}
                    placeholder="https://example.com/project"
                  />
                </div>

                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 font-medium text-xl">
                      Project Description *
                    </span>
                  </label>
                  <textarea
                    disabled={isSubmitting}
                    className="textarea textarea-bordered w-full text-lg p-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors resize-y"
                    name="description"
                    value={currentProject.description}
                    onChange={handleChange}
                    placeholder="Describe your project, your role, and key achievements..."
                    rows="4"
                    maxLength={600}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {currentProject.description.length}/600 characters
                  </p>
                </div>

                {/* Skills Section */}
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 font-medium text-xl">
                      Skills Used{" "}
                      {currentProject.skills.length > 0 &&
                        `(${currentProject.skills.length}/6)`}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentProject.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-[#3C8F63] text-white px-3 py-2 rounded-full flex items-center text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          disabled={isSubmitting}
                          className="ml-2 text-white hover:text-gray-200 text-lg"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {currentProject.skills.length < 6 && (
                    <div className="flex gap-4">
                      <input
                        disabled={isSubmitting}
                        type="text"
                        className="input input-bordered flex-1 text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill (max 6)"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddSkill())
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        disabled={isSubmitting || !newSkill.trim()}
                        className={`btn h-[45px] text-lg px-6 ${
                          newSkill.trim()
                            ? "bg-[#3C8F63] text-white hover:bg-[#337954]"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <FaPlus className="mr-2" /> Add Skill
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                <div className="border-t-2 border-gray-300 pt-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Additional Details
                  </h3>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="currentlyWorking"
                      name="currentlyWorking"
                      checked={currentProject.currentlyWorking}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 text-[#3C8F63] focus:ring-[#3C8F63]"
                    />
                    <label
                      htmlFor="currentlyWorking"
                      className="ml-3 text-lg font-medium text-gray-700"
                    >
                      I am currently working on this project
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text text-gray-700 font-medium text-xl">
                          Start Date
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          required
                          disabled={isSubmitting}
                          className="select select-bordered text-lg h-[45px] border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          name="startMonth"
                          value={currentProject.startMonth}
                          onChange={handleChange}
                        >
                          <option value="">Month</option>
                          {months.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          required
                          disabled={isSubmitting}
                          className="select select-bordered text-lg h-[45px] border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          name="startYear"
                          value={currentProject.startYear}
                          onChange={handleChange}
                        >
                          <option value="">Year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text text-gray-700 font-medium text-xl">
                          End Date
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          disabled={
                            isSubmitting || currentProject.currentlyWorking
                          }
                          className="select select-bordered text-lg h-[45px] border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors disabled:bg-gray-100"
                          name="endMonth"
                          value={currentProject.endMonth}
                          onChange={handleChange}
                        >
                          <option value="">Month</option>
                          {months.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          disabled={
                            isSubmitting || currentProject.currentlyWorking
                          }
                          className="select select-bordered text-lg h-[45px] border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors disabled:bg-gray-100"
                          name="endYear"
                          value={currentProject.endYear}
                          onChange={handleChange}
                        >
                          <option value="">Year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      {currentProject.currentlyWorking && (
                        <p className="text-sm text-gray-500 mt-2">
                          End date is disabled for current projects
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add/Update Project Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddProject}
                    disabled={isSubmitting || !canAddProject}
                    className={`btn px-8 py-3 text-lg ${
                      canAddProject
                        ? "bg-[#3C8F63] text-white hover:bg-[#337954]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {editingIndex !== null ? "Update Project" : "Add Project"}
                  </button>
                </div>
              </form>
            </div>

            {/* Action Buttons - Same as other modals */}
            <div className="flex justify-end gap-4 bg-[#eef1f4] px-5 py-6 mt-6">
              <button
                type="button"
                disabled={isSubmitting || !hasChanges}
                onClick={handleCancel}
                className={`btn btn-outline px-8 py-3 text-lg border-2 ${
                  isSubmitting || !hasChanges
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !hasChanges}
                className={`btn px-8 py-3 text-lg ${
                  isSubmitting || !hasChanges
                    ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#337954] text-white"
                }`}
              >
                {isSubmitting ? "Working...." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default ProjectUpdateModal;
