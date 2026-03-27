// File path__
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useEffect, useState, useRef } from "react";

// Package__
import Swal from "sweetalert2";
import { FaLightbulb } from "react-icons/fa";

const AboutModal = () => {
  const { profile, updateProfile } = useUserData();
  const [aboutUpdateLoading, setAboutUpdateLoading] = useState(false);
  const [headline, setHeadline] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data__
  const originalHeadlineRef = useRef("");

  // Initialize data from profile__
  useEffect(() => {
    if (profile) {
      const currentHeadline = profile?.headline || "";
      setHeadline(currentHeadline);
      originalHeadlineRef.current = currentHeadline;
      setHasChanges(false);
    }
  }, [profile]);

  // Check for changes__
  useEffect(() => {
    setHasChanges(headline !== originalHeadlineRef.current);
  }, [headline]);

  const handleHeadlineChange = (e) => {
    setHeadline(e.target.value);
  };

  const handleSave = () => {
    setAboutUpdateLoading(true);

    updateProfile(
      { headline },
      {
        onSuccess: () => {
          handleCloseModal()

          // Update original data after successful save__
          originalHeadlineRef.current = headline;

          Swal.fire({
            title: "Success!",
            text: "About updated successfully.",
            icon: "success",
          });
          setAboutUpdateLoading(false);
          setHasChanges(false);
        },
        onError: () => {
          handleCloseModal()

          Swal.fire({
            title: "Update failed",
            text: "There might be some issue. Please try again!",
            icon: "error",
          });

          setAboutUpdateLoading(false);
        },
      }
    );
  };

  const handleCancel = () => {
    handleCloseModal();

    // Reset to original data__
    setHeadline(originalHeadlineRef.current);
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("about_update_modal");
    modal.close();
  };

  return (
    <section>
      <dialog id="about_update_modal" className="modal">
        <div className="modal-box max-w-[1024px] max-h-[95vh] lg:p-0 p-0">
          <div className="about_update_main_content_container">
            {/* Header - Same as other modals */}
            <SeekerModalHeader
              title={"Edit about info"}
              handleCloseModal={handleCloseModal}
            ></SeekerModalHeader>

            {/* Form - Using same structure as other modals */}
            <div className="space-y-8 px-5">
              {/* About Section */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  About
                </h3>

                <div className="form-control">
                  <textarea
                    className="w-full min-h-96 p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors resize-y"
                    placeholder="Tell us about yourself..."
                    value={headline}
                    maxLength={650}
                    onChange={handleHeadlineChange}
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-2">
                    {headline?.length || 0}/650 characters
                  </p>
                </div>
              </div>

              {/* Tip Box - Same as other modals */}
              <div className="bg-[#F0FDF4] border border-[#3C8F63] p-5 rounded-lg">
                <div className="flex items-start">
                  <FaLightbulb className="text-green-600 text-xl mr-4" />
                  <div>
                    <h3 className="text-[#276043] text-lg font-semibold mb-2">
                      Tips for a great bio
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-[#276043] text-base">
                      <li>Start with a strong opening that grabs attention.</li>
                      <li>Highlight your key skills and accomplishments.</li>
                      <li>Keep it concise and easy to read.</li>
                      <li>Show your personality!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Same as other modals with enable/disable */}
            <div className="flex justify-end gap-4 bg-[#eef1f4] px-5 py-6 mt-6">
              <button
                type="button"
                disabled={aboutUpdateLoading || !hasChanges}
                onClick={handleCancel}
                className={`btn btn-outline px-8 py-3 text-lg border-2 ${
                  aboutUpdateLoading || !hasChanges
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={aboutUpdateLoading || !hasChanges}
                className={`btn px-8 py-3 text-lg ${
                  aboutUpdateLoading || !hasChanges
                    ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#337954] text-white"
                }`}
              >
                {aboutUpdateLoading ? "Working...." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default AboutModal;
