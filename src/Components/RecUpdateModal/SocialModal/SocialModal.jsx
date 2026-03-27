import { useState, useEffect, useRef } from "react";
import { RiFacebookCircleLine, RiTelegramLine } from "react-icons/ri";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitterSquare,
  FaRegSave,
  FaTimes,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { TbBrandDiscord } from "react-icons/tb";
import { FcDribbble } from "react-icons/fc";
import { BsReddit } from "react-icons/bs";
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";
import { jhSuccess, jhError } from "../../../utils";

const SocialLinksModal = () => {
  const { profile, updateProfile } = useUserData();
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    x: "",
    additionalLinks: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data
  const originalDataRef = useRef({});

  // Common social media platforms
  const socialPlatforms = [
    {
      key: "facebook",
      name: "Facebook",
      icon: <RiFacebookCircleLine color="#1877f2" size={24} />,
      placeholder: "https://facebook.com/username",
    },
    {
      key: "instagram",
      name: "Instagram",
      icon: <FaInstagram color="#C13584" size={24} />,
      placeholder: "https://instagram.com/username",
    },
    {
      key: "telegram",
      name: "Telegram",
      icon: <RiTelegramLine color="#0088cc" size={24} />,
      placeholder: "https://t.me/username",
    },
    {
      key: "youtube",
      name: "YouTube",
      icon: <FiYoutube color="#ff0000" size={24} />,
      placeholder: "https://youtube.com/username",
    },
    {
      key: "github",
      name: "GitHub",
      icon: <FaGithub size={24} />,
      placeholder: "https://github.com/username",
    },
    {
      key: "dribbble",
      name: "Dribbble",
      icon: <FcDribbble size={24} />,
      placeholder: "https://dribbble.com/username",
    },
    {
      key: "discord",
      name: "Discord",
      icon: <TbBrandDiscord color="#7289DA" size={24} />,
      placeholder: "https://discord.gg/invite-code",
    },
    {
      key: "reddit",
      name: "Reddit",
      icon: <BsReddit color="#ff5700" size={24} />,
      placeholder: "https://reddit.com/user/username",
    },
  ];

  // Initialize form data with profile data
  useEffect(() => {
    if (profile?.socialLinks) {
      const initialData = {
        linkedin: profile.socialLinks.linkedin || "",
        x: profile.socialLinks.x || "",
        additionalLinks: profile.socialLinks.additionalLinks || {},
      };

      setSocialLinks(initialData);
      originalDataRef.current = initialData;
      setHasChanges(false);
    }
  }, [profile]);

  // Check for changes
  useEffect(() => {
    const hasChanged =
      JSON.stringify(socialLinks) !== JSON.stringify(originalDataRef.current);
    setHasChanges(hasChanged);
  }, [socialLinks]);

  const handleMainLinkChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdditionalLinkChange = (platformKey, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      additionalLinks: {
        ...prev.additionalLinks,
        [platformKey]: value,
      },
    }));
  };

  const addSocialPlatform = (platformKey) => {
    if (!socialLinks.additionalLinks[platformKey]) {
      setSocialLinks((prev) => ({
        ...prev,
        additionalLinks: {
          ...prev.additionalLinks,
          [platformKey]: "",
        },
      }));
    }
  };

  const removeSocialPlatform = (platformKey) => {
    const updatedLinks = { ...socialLinks.additionalLinks };
    delete updatedLinks[platformKey];
    setSocialLinks((prev) => ({
      ...prev,
      additionalLinks: updatedLinks,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data for submission
      const social = {
        linkedin: socialLinks.linkedin,
        x: socialLinks.x,
        additionalLinks: Object.fromEntries(
          Object.entries(socialLinks.additionalLinks).filter(
            ([, value]) => value.trim() !== ""
          )
        ),
      };

      updateProfile(
        { social },
        {
          onSuccess: () => {
            handleCloseModal();
            jhSuccess({
              title: "Success!",
              text: "Social links updated successfully.",
            });
            // Update original data after successful save
            originalDataRef.current = { ...socialLinks };
            setHasChanges(false);
          },
          onError: () => {
            handleCloseModal();
            jhError({
              title: "Oops!",
              text: "Something went wrong while updating.",
            });
          },
        }
      );
    } catch (error) {
      console.error("Error updating social links:", error);
      jhError({
        title: "Error!",
        text: "Failed to update social links.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setSocialLinks(originalDataRef.current);
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("res_social_links_modal");
    modal.close();
  };

  // Get platforms that are not currently added
  const availablePlatforms = socialPlatforms.filter(
    (platform) => !socialLinks.additionalLinks[platform.key]
  );

  return (
    <dialog id="res_social_links_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title={
            profile?.socialLinks ? "Update Social Links" : "Add Social Links"
          }
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Main Social Links Section */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                Professional Networks
              </h3>

              {/* LinkedIn */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <FaLinkedin className="text-[#0077b5]" />
                  LinkedIn Profile
                </label>
                <input
                  disabled={isLoading}
                  type="url"
                  className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  name="linkedin"
                  value={socialLinks.linkedin}
                  onChange={handleMainLinkChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              {/* X (Twitter) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <FaTwitterSquare className="text-[#1da1f2]" />X (Twitter)
                  Profile
                </label>
                <input
                  disabled={isLoading}
                  type="url"
                  className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  name="x"
                  value={socialLinks.x}
                  onChange={handleMainLinkChange}
                  placeholder="https://x.com/username"
                />
              </div>
            </div>

            {/* Additional Social Links Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                  Additional Social Links
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {Object.keys(socialLinks.additionalLinks).length} added
                </span>
              </div>

              {/* Display added social links */}
              {Object.entries(socialLinks.additionalLinks).map(
                ([platformKey, value]) => {
                  const platform = socialPlatforms.find(
                    (p) => p.key === platformKey
                  );
                  return (
                    <div
                      key={platformKey}
                      className="p-4 border-2 border-gray-300 rounded-lg relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeSocialPlatform(platformKey)}
                        disabled={isLoading}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <FaTrash size={16} />
                      </button>

                      <label className="flex items-center gap-2 font-medium text-gray-700 text-lg mb-3">
                        {platform?.icon}
                        {platform?.name}
                      </label>
                      <input
                        disabled={isLoading}
                        type="url"
                        className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                        value={value}
                        onChange={(e) =>
                          handleAdditionalLinkChange(
                            platformKey,
                            e.target.value
                          )
                        }
                        placeholder={platform?.placeholder}
                      />
                    </div>
                  );
                }
              )}

              {/* Available platforms to add */}
              {availablePlatforms.length > 0 && (
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaPlus className="text-gray-500" />
                    Add More Platforms
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availablePlatforms.map((platform) => (
                      <button
                        key={platform.key}
                        type="button"
                        onClick={() => addSocialPlatform(platform.key)}
                        disabled={isLoading}
                        className="flex flex-col items-center justify-center p-4 border-2 border-gray-300 rounded-lg hover:border-[#3C8F63] hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                          {platform.icon}
                        </span>
                        <span className="text-sm text-gray-700 font-medium text-center">
                          {platform.name}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          Click to add
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(socialLinks.additionalLinks).length === 0 &&
                availablePlatforms.length > 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <FaPlus className="text-gray-400 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500 text-lg">
                      Click on any platform above to add it
                    </p>
                  </div>
                )}
            </div>

            {/* Tip Box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FaLinkedin className="text-green-600 text-xl mt-0.5" />
                <div className="text-green-800 text-base">
                  <span className="font-semibold">Tip:</span> Adding your social
                  links helps candidates connect with your company and learn
                  more about your culture. Professional networks like LinkedIn
                  are especially valuable for recruitment.
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
              disabled={isLoading || !hasChanges}
              onClick={handleCancel}
              className={`btn btn-outline h-[50px] sm:px-6 px-2 text-base ${
                isLoading || !hasChanges
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !hasChanges}
              className={`btn h-[50px] px-6 text-base ${
                isLoading || !hasChanges
                  ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#2d7a52] text-white"
              }`}
            >
              <FaRegSave className="mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* DaisyUI Modal Backdrop - Click to Close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SocialLinksModal;