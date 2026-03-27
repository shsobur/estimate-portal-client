import { useEffect, useState, useRef } from "react";
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";
import { jhSuccess, jhError } from "../../../utils";
import { MdDescription, MdFlag, MdVisibility } from "react-icons/md";
import { FaRegSave, FaTimes } from "react-icons/fa";

const AboutModal = () => {
  const { profile, updateProfile } = useUserData();
  const [aboutUpdateLoading, setAboutUpdateLoading] = useState(false);
  const [aboutInfo, setAboutInfo] = useState({
    description: "",
    mission: "",
    vision: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data
  const originalDataRef = useRef({});

  useEffect(() => {
    const initialData = {
      description: profile?.description || "",
      mission: profile?.mission || "",
      vision: profile?.vision || "",
    };

    setAboutInfo(initialData);
    originalDataRef.current = initialData;
    setHasChanges(false);
  }, [profile]);

  // Check for changes
  useEffect(() => {
    const hasDescriptionChanged =
      aboutInfo.description !== originalDataRef.current.description;
    const hasMissionChanged =
      aboutInfo.mission !== originalDataRef.current.mission;
    const hasVisionChanged =
      aboutInfo.vision !== originalDataRef.current.vision;

    setHasChanges(
      hasDescriptionChanged || hasMissionChanged || hasVisionChanged
    );
  }, [aboutInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setAboutUpdateLoading(true);
    updateProfile(aboutInfo, {
      onSuccess: () => {
        handleCloseModal();

        jhSuccess({
          title: "Success!",
          text: "About us updated successfully.",
        });

        // Update original data after successful save
        originalDataRef.current = { ...aboutInfo };
        setAboutUpdateLoading(false);
        setHasChanges(false);
      },
      onError: (err) => {
        console.log(err);
        handleCloseModal();

        jhError({
          title: "Oops!",
          text: "Something went wrong while updating.",
        });

        setAboutUpdateLoading(false);
      },
    });
  };

  const handleCancel = () => {
    // Reset to original data
    setAboutInfo(originalDataRef.current);
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("rec_about_update_modal");
    modal.close();
  };

  return (
    <dialog id="rec_about_update_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title="Update About Information"
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* About Us Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                About Your Company
              </h3>

              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <MdDescription className="text-gray-500" />
                  Company Description
                </label>
                <textarea
                  disabled={aboutUpdateLoading}
                  name="description"
                  value={aboutInfo.description}
                  onChange={handleChange}
                  placeholder="Describe your company's history, values, and what makes it unique..."
                  rows="9"
                  className="textarea textarea-bordered w-full text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg resize-none"
                  maxLength={650}
                />
                <p className="text-sm text-gray-500">
                  {aboutInfo.description.length}/650 characters
                </p>
              </div>
            </div>

            {/* Mission Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <MdFlag className="text-gray-500" />
                  Company Mission
                </label>
                <textarea
                  disabled={aboutUpdateLoading}
                  name="mission"
                  value={aboutInfo.mission}
                  onChange={handleChange}
                  placeholder="State your company's core purpose and what it aims to achieve..."
                  rows="3"
                  className="textarea textarea-bordered w-full text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg resize-none"
                  maxLength={300}
                />
                <p className="text-sm text-gray-500">
                  {aboutInfo.mission.length}/300 characters
                </p>
              </div>
            </div>

            {/* Vision Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <MdVisibility className="text-gray-500" />
                  Company Vision
                </label>
                <textarea
                  disabled={aboutUpdateLoading}
                  name="vision"
                  value={aboutInfo.vision}
                  onChange={handleChange}
                  placeholder="Describe the future your company aspires to create..."
                  rows="3"
                  className="textarea textarea-bordered w-full text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg resize-none"
                  maxLength={300}
                />
                <p className="text-sm text-gray-500">
                  {aboutInfo.vision.length}/300 characters
                </p>
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MdDescription className="text-green-600 text-xl mt-0.5" />
                <div className="text-green-800 text-base">
                  <span className="font-semibold">Tip:</span> A compelling about
                  section helps candidates understand your company culture and
                  values. Keep it authentic and focused on what makes your
                  company unique.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={aboutUpdateLoading || !hasChanges}
              onClick={handleCancel}
              className={`btn btn-outline h-[50px] sm:px-6 px-2 text-base ${
                aboutUpdateLoading || !hasChanges
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={aboutUpdateLoading || !hasChanges}
              className={`btn h-[50px] px-6 text-base ${
                aboutUpdateLoading || !hasChanges
                  ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#2d7a52] text-white"
              }`}
            >
              <FaRegSave className="mr-2" />
              {aboutUpdateLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* DaisyUI Modal Backdrop - Click to Close */}
      <form method="dialog">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AboutModal;