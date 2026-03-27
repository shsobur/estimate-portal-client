// File path__
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useEffect, useState, useRef } from "react";

// Package__
import Swal from "sweetalert2";
import { FiTrash2 } from "react-icons/fi";
import { FaLightbulb } from "react-icons/fa";

const SkillModal = () => {
  const { profile, updateProfile } = useUserData();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [skillUpdateLoading, setSkillUpdateLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data__
  const originalSkillsRef = useRef([]);

  useEffect(() => {
    if (profile?.skills) {
      setSkills(profile.skills || []);
      originalSkillsRef.current = profile.skills || [];
      setHasChanges(false);
    }
  }, [profile]);

  // Check for changes__
  useEffect(() => {
    const hasSkillsChanged =
      JSON.stringify(skills) !== JSON.stringify(originalSkillsRef.current);
    setHasChanges(hasSkillsChanged);
  }, [skills]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSaveChanges = () => {
    setSkillUpdateLoading(true);
    updateProfile(
      { skills },
      {
        onSuccess: () => {
          handleCloseModal()

          // Update original data after successful save__
          originalSkillsRef.current = skills;

          Swal.fire({
            title: "Success!",
            text: "Skills updated successfully.",
            icon: "success",
          });

          setSkillUpdateLoading(false);
          setHasChanges(false);
        },
        onError: () => {
          handleCloseModal()

          Swal.fire({
            title: "Oops!",
            text: "Something went wrong while updating.",
            icon: "error",
          });

          setSkillUpdateLoading(false);
        },
      }
    );
  };

  const handleCancel = () => {
    handleCloseModal();

    // Reset to original data__
    setSkills(originalSkillsRef.current);
    setNewSkill("");
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("skill_update_modal");
    modal.close();
  };

  return (
    <section>
      <dialog id="skill_update_modal" className="modal">
        <div className="modal-box max-w-[1024px] max-h-[95vh] lg:p-0 p-0">
          <div className="skill_update_main_content_container">
            {/* Header - Same as other modals */}
            <SeekerModalHeader
              title={"Edit Your Skills"}
              handleCloseModal={handleCloseModal}
            ></SeekerModalHeader>

            {/* Main Content - Same structure as other modals */}
            <div className="space-y-8 px-5">
              {/* Add Skill Section */}
              <div className="form-control">
                <label className="label mb-2">
                  <span className="label-text text-gray-700 font-medium text-xl">
                    Skill name
                  </span>
                </label>
                <div className="flex gap-4">
                  <input
                    disabled={skillUpdateLoading}
                    className="input input-bordered flex-1 w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                    placeholder="e.g., Project Management"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="button"
                    disabled={skillUpdateLoading || !newSkill.trim()}
                    onClick={handleAddSkill}
                    className={`btn h-[45px] text-lg px-6 min-w-[120px] ${
                      newSkill.trim()
                        ? "bg-[#3C8F63] text-white hover:bg-[#337954]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Your Skills Section */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Your Skills
                </h3>
                <div className="space-y-4">
                  {skills?.length > 0 ? (
                    skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 border-2 border-gray-300 rounded-lg transition-colors hover:border-gray-400"
                      >
                        <p className="text-lg font-medium text-gray-800">
                          {skill}
                        </p>
                        <button
                          disabled={skillUpdateLoading}
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8 text-lg">
                      No skills added yet
                    </p>
                  )}
                </div>
              </div>

              {/* Tip Box - Same as other modals */}
              <div className="bg-[#F0FDF4] border border-[#3C8F63] p-5 rounded-lg">
                <div className="flex items-start">
                  <FaLightbulb className="text-green-600 text-xl mr-4" />
                  <div>
                    <div className="text-[#276043] text-base">
                      <b>
                        <i>Tip:</i>
                      </b>{" "}
                      Adding at least <b>5 relevant skills</b> can significantly
                      increase your visibility to recruiters and potential
                      collaborators.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Same as other modals */}
            <div className="flex justify-end gap-4 bg-[#eef1f4] px-5 py-6 mt-6">
              <button
                type="button"
                disabled={skillUpdateLoading || !hasChanges}
                onClick={handleCancel}
                className={`btn btn-outline px-8 py-3 text-lg border-2 ${
                  skillUpdateLoading || !hasChanges
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                }`}
              >
                Cancel
              </button>

              <button
                disabled={skillUpdateLoading || !hasChanges}
                onClick={handleSaveChanges}
                className={`btn px-8 py-3 text-lg ${
                  skillUpdateLoading || !hasChanges
                    ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#337954] text-white"
                }`}
              >
                {skillUpdateLoading ? "Working...." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default SkillModal;