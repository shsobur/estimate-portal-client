// File path__
import useAxios from "../../../Hooks/Axios";
import { getCroppedImg, jhError, jhSuccess } from "../../../utils";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useState, useCallback, useRef, useEffect } from "react";

// Package__
import Cropper from "react-easy-crop";
import { Slider } from "@mui/material";
import { MdUpload, MdBusiness, MdDescription, MdWork } from "react-icons/md";
import {
  FaTimes,
  FaEye,
  FaRegSave,
  FaRegImage,
  FaCheck,
  FaTimes as FaClose,
} from "react-icons/fa";
import useUserData from "../../../Hooks/userData";

const ProfileModal = () => {
  const api = useAxios();
  const { profile, updateProfile } = useUserData();

  // Profile data states
  const [profileData, setProfileData] = useState({
    companyLogo: "",
    companyName: "",
    bio: "",
    activeHire: false,
  });

  // Image cropping states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [logoUploadLoading, setLogoUpLoadLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data__
  const originalDataRef = useRef({});

  useEffect(() => {
    const initialData = {
      companyLogo: profile?.companyLogo || "",
      companyName: profile?.companyName || "",
      bio: profile?.bio || "",
      activeHire: profile?.activeHire,
    };

    setProfileData(initialData);
    originalDataRef.current = initialData;
    setHasChanges(false);
  }, [profile]);

  // Check for changes__
  useEffect(() => {
    const hasLogoChanged =
      profileData.companyLogo !== originalDataRef.current.companyLogo;
    const hasNameChanged =
      profileData.companyName !== originalDataRef.current.companyName;
    const hasBioChanged = profileData.bio !== originalDataRef.current.bio;
    const hasHireChanged =
      profileData.activeHire !== originalDataRef.current.activeHire;

    setHasChanges(
      hasLogoChanged || hasNameChanged || hasBioChanged || hasHireChanged
    );
  }, [profileData]);

  // Handle text/checkbox changes__
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Crop complete__
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Handle file input__
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

  // Cancel cropping__
  const handleCancelCrop = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setCroppedFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setMessage("");
    setErrorMessage("");
  };

  // Preview cropped image__
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

  // Upload cropped image to backend__
  const handleUploadToBackend = async () => {
    if (!croppedFile) {
      setErrorMessage("Please crop an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", croppedFile);

    try {
      setLogoUpLoadLoading(true);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.url) {
        setProfileData((prev) => ({
          ...prev,
          companyLogo: res.data.url,
        }));
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setMessage("Company logo uploaded successfully!");
      } else {
        setErrorMessage("Logo upload failed! Try again.");
      }
    } catch {
      setErrorMessage("Upload failed! Something went wrong.");
    } finally {
      setLogoUpLoadLoading(false);
    }
  };

  // Final save changes__
  const handleSaveChanges = () => {
    const submissionData = {
      companyLogo: profileData.companyLogo,
      companyName: profileData.companyName.trim(),
      bio: profileData.bio.trim(),
      activeHire: profileData.activeHire,
    };

    console.log("Data to send to backend:", submissionData);

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

        handleCancelCrop();
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
    const modal = document.getElementById("rec_profile_update_modal");
    modal.close();
  };

  return (
    <section>
      <dialog id="rec_profile_update_modal" className="modal">
        <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
          {/* Header */}
          <SeekerModalHeader
            title="Update Company Profile"
            handleCloseModal={handleCloseModal}
          />

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 space-y-6">
              {/* Company Logo Section */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                  <FaRegImage className="text-[#3C8F63] text-lg" />
                  Company Logo
                </h3>

                {/* Current Logo */}
                {profileData?.companyLogo && !imageSrc && (
                  <div className="flex flex-col items-center space-y-4 p-4 border-2 border-gray-300 rounded-lg">
                    <p className="font-medium text-gray-700 text-lg">
                      Current Logo:
                    </p>
                    <img
                      src={profileData.companyLogo}
                      alt="Company Logo"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                    {profileData?.companyLogo !== profile?.companyLogo && (
                      <p className="mt-5 p-3 rounded-md bg-green-100 text-green-800">
                        <b>"Save changes"</b> to update your banner, or changes
                        will be{" "}
                        <span className="text-orange-700 font-semibold">
                          lost.
                        </span>
                      </p>
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
                      Upload New Logo
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
                      Crop Your Logo (100×100px)
                    </h4>

                    <div className="space-y-4">
                      {/* Cropper Container */}
                      <div className="relative w-full h-[300px] rounded-lg overflow-hidden border-2 border-gray-300">
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
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
                          disabled={logoUploadLoading || isLoading}
                          className="btn btn-outline h-[50px] px-6 text-base border-2 border-gray-300 hover:bg-gray-50"
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </button>

                        <button
                          onClick={handlePreview}
                          disabled={
                            logoUploadLoading || isLoading || !croppedAreaPixels
                          }
                          className={`btn h-[50px] px-6 text-base ${
                            logoUploadLoading || !croppedAreaPixels
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
                          <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                            <img
                              src={croppedImage}
                              alt="Cropped Logo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-gray-600 text-sm">100×100px</p>
                        </div>

                        <button
                          onClick={handleUploadToBackend}
                          disabled={isLoading || logoUploadLoading}
                          className={`btn h-[50px] px-6 text-base ${
                            logoUploadLoading
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-[#3C8F63] hover:bg-[#2d7a52] text-white"
                          }`}
                        >
                          <FaRegSave className="mr-2" />
                          {logoUploadLoading
                            ? "Uploading..."
                            : "Save Cropped Logo"}
                        </button>
                      </div>
                    )}

                    {/* Messages */}
                    {message && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="text-green-800 text-base">
                          {message}
                        </div>
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

              {/* Company Information Section */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                  <MdBusiness className="text-[#3C8F63] text-lg" />
                  Company Information
                </h3>

                {/* Company Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <MdBusiness className="text-gray-500" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={profileData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                    maxLength={50}
                  />
                  <p className="text-sm text-gray-500">
                    {profileData.companyName.length}/50 characters
                  </p>
                </div>

                {/* Company Bio */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <MdDescription className="text-gray-500" />
                    Company Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your company, mission, and values..."
                    rows="4"
                    className="textarea textarea-bordered w-full text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg resize-none"
                    maxLength={200}
                  />
                  <p className="text-sm text-gray-500">
                    {profileData.bio.length}/200 characters
                  </p>
                </div>

                {/* Active Hire Toggle */}
                <div className="flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                      <MdWork className="text-gray-500" />
                      Active Hiring Status
                    </label>
                    <p className="text-gray-600 text-base">
                      {profileData.activeHire
                        ? "Your company is actively hiring"
                        : "Your company is not currently hiring"}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="activeHire"
                      checked={profileData.activeHire}
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
                    <span className="font-semibold">Tip:</span> Keep your
                    company information up-to-date to attract the best talent. A
                    clear logo and detailed bio help candidates understand your
                    company culture.
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
        <form method="dialog">
          <button>close</button>
        </form>
      </dialog>
    </section>
  );
};

export default ProfileModal;