// File path__
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useState, useEffect, useRef } from "react";

// Package__
import Swal from "sweetalert2";
import { FiTrash2 } from "react-icons/fi";
import { PiBagBold } from "react-icons/pi";
import { RiEditLine } from "react-icons/ri";
import { FaLightbulb } from "react-icons/fa";

const ExperienceModal = () => {
  const { profile, updateProfile } = useUserData();
  const [expUpdateLoading, setExpUpdateLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // State for form fields__
  const [formData, setFormData] = useState({
    position: "",
    company: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    isCurrent: false,
  });

  // State for experiences and editing__
  const [experiences, setExperiences] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Store original data__
  const originalExperiencesRef = useRef([]);

  // Initial data__
  useEffect(() => {
    if (profile?.experience) {
      setExperiences(profile.experience || []);
      originalExperiencesRef.current = profile.experience || [];
      setHasChanges(false);
    }
  }, [profile]);

  // Check for changes__
  useEffect(() => {
    const hasExperiencesChanged =
      JSON.stringify(experiences) !==
      JSON.stringify(originalExperiencesRef.current);
    setHasChanges(hasExperiencesChanged);
  }, [experiences]);

  // Handle form input changes__
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle adding/updating experience__
  const handleAddExperience = () => {
    if (!formData.position || !formData.company || !formData.startDate) {
      return;
    }

    const newExperience = {
      position: formData.position,
      company: formData.company,
      startDate: formData.startDate,
      endDate: formData.isCurrent ? "Present" : formData.endDate,
      location: formData.location,
      description: formData.description,
      isCurrent: formData.isCurrent,
      status: formData.isCurrent ? "Current company" : "Previous company",
    };

    if (editingIndex !== null) {
      // Update existing experience__
      const updatedExperiences = [...experiences];
      updatedExperiences[editingIndex] = newExperience;
      setExperiences(updatedExperiences);
      setEditingIndex(null);
    } else {
      // Add new experience__
      setExperiences([...experiences, newExperience]);
    }

    // Reset form
    resetForm();
  };

  // Handle editing an experience__
  const handleEditExperience = (index) => {
    const experience = experiences[index];
    setFormData({
      position: experience.position,
      company: experience.company,
      startDate: experience.startDate,
      endDate: experience.endDate === "Present" ? "" : experience.endDate,
      location: experience.location,
      description: experience.description,
      isCurrent: experience.isCurrent,
    });
    setEditingIndex(index);
  };

  // Handle deleting an experience__
  const handleDeleteExperience = (index) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  // Reset form fields__
  const resetForm = () => {
    setFormData({
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
      isCurrent: false,
    });
    setEditingIndex(null);
  };

  // Prepare the final object for database__
  const prepareExperiencesForDB = () => {
    return experiences.map((exp) => ({
      ...exp,
    }));
  };

  // Handle form submission__
  const handleSubmit = (e) => {
    e.preventDefault();

    const expData = {
      experience: prepareExperiencesForDB(),
    };

    setExpUpdateLoading(true);
    updateProfile(expData, {
      onSuccess: () => {
        handleCloseModal();

        // Update original data after successful save__
        originalExperiencesRef.current = experiences;

        Swal.fire({
          title: "Success!",
          text: "Experience updated successfully.",
          icon: "success",
        });
        setExpUpdateLoading(false);
        setHasChanges(false);
      },

      onError: () => {
        handleCloseModal();

        Swal.fire({
          title: "Oops!",
          text: "Something went wrong while updating.",
          icon: "error",
        });

        setExpUpdateLoading(false);
      },
    });
  };

  const handleCancel = () => {
    handleCloseModal();

    // Reset to original data__
    setExperiences(originalExperiencesRef.current);
    resetForm();
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("experience_update_modal");
    modal.close();
  };

  return (
    <section>
      <dialog id="experience_update_modal" className="modal">
        <div className="modal-box max-w-[1024px] max-h-[95vh] lg:p-0 p-0">
          <div className="experience_update_main_content_container">
            {/* Header - Same as other modals */}
            <SeekerModalHeader
              title={"Edit your experience"}
              handleCloseModal={handleCloseModal}
            ></SeekerModalHeader>

            {/* Main Content - Same structure as other modals */}
            <div className="space-y-8 px-5">
              {/* Existing Experience Items */}
              {experiences?.map((experience, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-300 rounded-lg p-6 transition-colors hover:border-gray-400"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex-1">
                      <h3 className="flex items-center gap-2 text-xl mb-2 font-semibold text-gray-900">
                        <PiBagBold />
                        {experience.position}
                      </h3>
                      <p className="text-gray-600 text-lg">
                        {experience.company} · {experience.startDate} -{" "}
                        {experience.endDate}
                      </p>
                      <p className="text-gray-600 text-lg">
                        {experience.location}
                      </p>
                      <p className="mt-4 text-gray-700 text-base">
                        {experience.description}
                      </p>
                      {experience.status && (
                        <span className="inline-block mt-2 px-3 py-1 bg-[#eef5f1] text-[#3C8F63] text-sm rounded-lg">
                          {experience.status}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4">
                      <button
                        onClick={() => handleEditExperience(index)}
                        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        <RiEditLine
                          size={22}
                          className="hover:text-green-600"
                          title="Edit"
                        />
                      </button>

                      <button
                        onClick={() => handleDeleteExperience(index)}
                        className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      >
                        <FiTrash2
                          size={22}
                          className="hover:text-red-500"
                          title="Delete"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add/Edit Experience Form */}
              <form className="space-y-6 pt-8 border-t-2 border-gray-300">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {editingIndex !== null
                    ? "Edit Experience"
                    : "Add New Experience"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-control">
                    <label className="label mb-2">
                      <span className="label-text text-gray-700 font-medium text-xl">
                        Position name
                      </span>
                    </label>
                    <input
                      required
                      name="position"
                      className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                      placeholder="e.g., Senior Product Designer"
                      type="text"
                      value={formData.position}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label mb-2">
                      <span className="label-text text-gray-700 font-medium text-xl">
                        Company
                      </span>
                    </label>
                    <input
                      required
                      name="company"
                      className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                      placeholder="e.g., Slack"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-control">
                    <label className="label mb-2">
                      <span className="label-text text-gray-700 font-medium text-xl">
                        Start date
                      </span>
                    </label>
                    <input
                      required
                      name="startDate"
                      className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                      placeholder="e.g., 2020"
                      type="text"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label mb-2">
                      <span className="label-text text-gray-700 font-medium text-xl">
                        End date
                      </span>
                    </label>
                    <input
                      name="endDate"
                      disabled={formData.isCurrent}
                      className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                      placeholder={
                        formData.isCurrent ? "Present" : "e.g., 2023"
                      }
                      type="text"
                      value={formData.isCurrent ? "Present" : formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    name="isCurrent"
                    className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 text-[#3C8F63] focus:ring-[#3C8F63] transition-colors duration-200"
                    id="current-role"
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={handleInputChange}
                  />
                  <label
                    className="ml-3 block text-lg text-gray-700 font-medium"
                    htmlFor="current-role"
                  >
                    I'm currently working in this role
                  </label>
                </div>

                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 font-medium text-xl">
                      Location
                    </span>
                  </label>
                  <input
                    required
                    name="location"
                    className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                    placeholder="e.g., San Francisco, CA"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-gray-700 font-medium text-xl">
                      Description
                    </span>
                  </label>
                  <textarea
                    name="description"
                    disabled={formData.isCurrent}
                    className="textarea textarea-bordered w-full text-lg p-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors min-h-32 resize-y disabled:bg-gray-100 disabled:text-gray-400"
                    maxLength={200}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={
                      formData.isCurrent
                        ? "Description hidden for current role"
                        : "Describe your role and accomplishments."
                    }
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.description.length}/200 characters
                  </p>
                </div>

                {/* Add/Update Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    disabled={
                      !formData.position ||
                      !formData.company ||
                      !formData.startDate
                    }
                    className={`btn h-[45px] text-lg px-6 ${
                      formData.position &&
                      formData.company &&
                      formData.startDate
                        ? "bg-[#3C8F63] text-white hover:bg-[#337954]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {editingIndex !== null
                      ? "Update Experience"
                      : "Add Experience"}
                  </button>
                </div>

                {formData.isCurrent && (
                  <div className="bg-[#F0FDF4] border border-[#3C8F63] p-5 rounded-lg">
                    <div className="flex items-start">
                      <FaLightbulb className="text-green-600 text-xl mr-4" />
                      <div>
                        <div className="text-[#276043] text-base">
                          <b>
                            <i>Tip:</i>
                          </b>{" "}
                          Your description will be hidden for your current role
                          to maintain privacy.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Action Buttons - Same as other modals */}
            <div className="flex justify-end gap-4 bg-[#eef1f4] px-5 py-6 mt-6">
              <button
                type="button"
                disabled={expUpdateLoading || !hasChanges}
                onClick={handleCancel}
                className={`btn btn-outline px-8 py-3 text-lg border-2 ${
                  expUpdateLoading || !hasChanges
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={expUpdateLoading || !hasChanges}
                className={`btn px-8 py-3 text-lg ${
                  expUpdateLoading || !hasChanges
                    ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#337954] text-white"
                }`}
              >
                {expUpdateLoading ? "Working...." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default ExperienceModal;
