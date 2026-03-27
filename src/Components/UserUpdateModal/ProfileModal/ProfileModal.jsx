// File path__
import useAxios from "../../../Hooks/Axios";
import { getCroppedImg, jhError, jhSuccess } from "../../../utils";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useState, useCallback, useRef, useEffect } from "react";

// Package__
import Cropper from "react-easy-crop";
import { Slider } from "@mui/material";
import { MdUpload, MdPerson, MdDescription, MdWork } from "react-icons/md";
import {
  FaTimes,
  FaEye,
  FaRegSave,
  FaRegImage,
  FaCheck,
  FaTimes as FaClose,
} from "react-icons/fa";
import useUserData from "../../../Hooks/userData";

const ProfileUpdateModal = () => {
  const api = useAxios();
  const { profile, updateProfile } = useUserData();

  // Profile data states
  const [profileData, setProfileData] = useState({
    profilePhoto: "",
    userName: "",
    bio: "",
    openToWork: false,
  });

  // Image cropping states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data
  const originalDataRef = useRef({});

  // Load initial profile data
  useEffect(() => {
    if (profile) {
      const initialData = {
        profilePhoto: profile.profilePhoto || "",
        userName: profile.userName || "",
        bio: profile.bio || "",
        openToWork: profile.openToWork || false,
      };

      setProfileData(initialData);
      originalDataRef.current = initialData;
      setHasChanges(false);
    }
  }, [profile]);

  // Check for changes
  useEffect(() => {
    const hasPhotoChanged =
      profileData.profilePhoto !== originalDataRef.current.profilePhoto;
    const hasNameChanged =
      profileData.userName !== originalDataRef.current.userName;
    const hasBioChanged = profileData.bio !== originalDataRef.current.bio;
    const hasWorkChanged =
      profileData.openToWork !== originalDataRef.current.openToWork;

    setHasChanges(
      hasPhotoChanged || hasNameChanged || hasBioChanged || hasWorkChanged
    );
  }, [profileData]);

  // Handle text/checkbox changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Crop complete
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setCroppedImage(null);
      setCroppedFile(null);
      setMessage("");
      setErrorMessage("");
    }
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setCroppedFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setMessage("");
    setErrorMessage("");
  };

  // Preview cropped image
  const handlePreview = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    try {
      const { file, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(url);
      setCroppedFile(file);
      setMessage("Image cropped! Click 'Save Cropped Image' to upload.");
    } catch {
      setErrorMessage("Error cropping image. Please try again later.");
    }
  };

  // Upload cropped image to backend
  const handleUploadToBackend = async () => {
    if (!croppedFile) {
      setErrorMessage("Please crop an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", croppedFile);

    try {
      setPhotoUploadLoading(true);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.url) {
        setProfileData((prev) => ({
          ...prev,
          profilePhoto: res.data.url,
        }));
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setMessage("Profile photo uploaded successfully!");
      } else {
        setErrorMessage("Photo upload failed! Try again.");
      }
    } catch {
      setErrorMessage("Upload failed! Something went wrong.");
    } finally {
      setPhotoUploadLoading(false);
    }
  };

  // Final save changes
  const handleSaveChanges = () => {
    const submissionData = {
      userName: profileData.userName.trim(),
      bio: profileData.bio.trim(),
      openToWork: profileData.openToWork,
      profilePhoto: profileData.profilePhoto,
    };

    setIsLoading(true);
    updateProfile(submissionData, {
      onSuccess: () => {
        handleCloseModal();

        jhSuccess({
          title: "Success!",
          text: "Profile updated successfully.",
        });

        setIsLoading(false);
      },
      onError: () => {
        handleCloseModal();

        jhError({
          title: "Oops!",
          text: "Something went wrong while updating.",
        });

        setIsLoading(false);
      },
    });
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData(originalDataRef.current);
    setImageSrc(null);
    setCroppedImage(null);
    setCroppedFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setMessage("");
    setErrorMessage("");
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("profile_update_modal");
    modal.close();
  };

  return (
    <dialog id="profile_update_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title="Update Your Profile"
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Profile Photo Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <FaRegImage className="text-[#3C8F63] text-lg" />
                Profile Photo
              </h3>

              {/* Current Photo */}
              {profileData.profilePhoto && !imageSrc && (
                <div className="flex flex-col items-center space-y-4 p-4 border-2 border-gray-300 rounded-lg">
                  <p className="font-medium text-gray-700 text-lg">
                    Current Photo:
                  </p>
                  <img
                    src={profileData.profilePhoto}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                  />
                  {profileData.profilePhoto !== profile?.profilePhoto && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <div className="text-green-800 text-sm">
                        <span className="font-semibold">Note:</span> Click "Save
                        Changes" below to update your profile photo.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Section */}
              {!imageSrc && (
                <label className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <MdUpload className="text-4xl text-gray-500 mb-3" />
                  <p className="text-gray-600 font-medium text-lg">
                    Upload New Photo
                  </p>
                  <p className="text-gray-400 text-base mt-1">
                    PNG, JPG, WEBP (max 5MB)
                  </p>
                </label>
              )}

              {/* Cropper Section */}
              {imageSrc && (
                <div className="space-y-6 p-4 border-2 border-gray-300 rounded-lg">
                  <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-lg">
                    <FaRegImage className="text-[#3C8F63]" />
                    Crop Your Photo
                  </h4>

                  <div className="space-y-4">
                    {/* Cropper Container */}
                    <div className="relative w-full h-[300px] rounded-lg overflow-hidden border-2 border-gray-300">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // Square aspect ratio for profile photo
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>

                    {/* Zoom Controls */}
                    <div className="space-y-2">
                      <label className="font-medium text-gray-700 text-lg">
                        Zoom Level
                      </label>
                      <div className="px-4">
                        <Slider
                          value={zoom}
                          min={1}
                          max={3}
                          step={0.1}
                          onChange={(e, newZoom) => setZoom(newZoom)}
                          disabled={isLoading}
                          sx={{
                            color: "#3C8F63",
                            "& .MuiSlider-thumb": {
                              backgroundColor: "#3C8F63",
                            },
                            "& .MuiSlider-track": {
                              backgroundColor: "#3C8F63",
                            },
                          }}
                        />
                      </div>
                    </div>

                    {/* Crop Action Buttons */}
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={handleCancelCrop}
                        disabled={photoUploadLoading || isLoading}
                        className="btn btn-outline h-[50px] px-6 text-base border-2 border-gray-300 hover:bg-gray-50"
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </button>

                      <button
                        onClick={handlePreview}
                        disabled={
                          photoUploadLoading || isLoading || !croppedAreaPixels
                        }
                        className={`btn h-[50px] px-6 text-base ${
                          photoUploadLoading || !croppedAreaPixels
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#3C8F63] hover:bg-[#2d7a52] text-white"
                        }`}
                      >
                        <FaEye className="mr-2" />
                        Preview
                      </button>
                    </div>
                  </div>

                  {/* Cropped Preview */}
                  {croppedImage && (
                    <div className="space-y-4 p-4 border-2 border-[#3C8F63] rounded-xl bg-[#f8fbf9]">
                      <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-lg">
                        <FaRegImage className="text-[#3C8F63]" />
                        Cropped Preview
                      </h4>

                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-32 h-32 border-2 border-gray-300 rounded-full overflow-hidden">
                          <img
                            src={croppedImage}
                            alt="Cropped Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-gray-600 text-sm">Profile Photo</p>
                      </div>

                      <button
                        onClick={handleUploadToBackend}
                        disabled={isLoading || photoUploadLoading}
                        className={`btn h-[50px] px-6 text-base ${
                          photoUploadLoading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#3C8F63] hover:bg-[#2d7a52] text-white"
                        }`}
                      >
                        <FaRegSave className="mr-2" />
                        {photoUploadLoading
                          ? "Uploading..."
                          : "Save Cropped Photo"}
                      </button>
                    </div>
                  )}

                  {/* Messages */}
                  {message && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="text-green-800 text-base">{message}</div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="text-red-800 text-base">
                        {errorMessage}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <MdPerson className="text-[#3C8F63] text-lg" />
                Personal Information
              </h3>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <MdPerson className="text-gray-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="userName"
                  value={profileData.userName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  maxLength={30}
                />
                <p className="text-sm text-gray-500">
                  {profileData.userName.length}/30 characters
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <MdDescription className="text-gray-500" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself, your skills, and experience..."
                  rows="4"
                  className="textarea textarea-bordered w-full text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg resize-none"
                  maxLength={100}
                />
                <p className="text-sm text-gray-500">
                  {profileData.bio.length}/100 characters
                </p>
              </div>

              {/* Open to Work Toggle */}
              <div className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <MdWork className="text-gray-500" />
                    Open to Work
                  </label>
                  <p className="text-gray-600 text-base">
                    {profileData.openToWork
                      ? "You're currently open to new opportunities"
                      : "You're not actively looking for new opportunities"}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="openToWork"
                    checked={profileData.openToWork}
                    onChange={handleChange}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#3C8F63]"></div>
                </label>
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FaCheck className="text-green-600 text-xl mt-0.5" />
                <div className="text-green-800 text-base">
                  <span className="font-semibold">Tip:</span> Keep your profile
                  information up-to-date to attract the best opportunities. A
                  professional photo and detailed bio help employers understand
                  your skills and experience.
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
              <FaClose className="mr-2" />
              Cancel
            </button>

            <button
              onClick={handleSaveChanges}
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

export default ProfileUpdateModal;