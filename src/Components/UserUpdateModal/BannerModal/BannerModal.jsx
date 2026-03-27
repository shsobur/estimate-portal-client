// File path__
import useAxios from "../../../Hooks/Axios";
import { getCroppedImg } from "../../../utils";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useState, useCallback, useRef, useEffect } from "react";

// Package__
import Swal from "sweetalert2";
import Cropper from "react-easy-crop";
import { Slider } from "@mui/material";
import { MdUpload } from "react-icons/md";
import { FaTimes, FaEye, FaRegSave, FaRegImage } from "react-icons/fa";
import useUserData from "../../../Hooks/userData";

const BannerModal = () => {
  const api = useAxios();
  const { profile, updateProfile } = useUserData();

  // States__
  const [bannerUrl, setBannerUrl] = useState(profile?.profileBanner || "");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data
  const originalBannerUrlRef = useRef("");

  // Initialize data
  useEffect(() => {
    if (profile) {
      const currentBanner = profile?.profileBanner || "";
      setBannerUrl(currentBanner);
      originalBannerUrlRef.current = currentBanner;
      setHasChanges(false);
    }
  }, [profile]);

  // Check for changes
  useEffect(() => {
    setHasChanges(bannerUrl !== originalBannerUrlRef.current);
  }, [bannerUrl]);

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

  // Upload cropped image to backend (Cloudinary)__
  const handleUploadToBackend = async () => {
    if (!croppedFile) {
      setErrorMessage("Please crop an image first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", croppedFile);

    try {
      setIsLoading(true);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setBannerUrl(res.data.url);
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setMessage("Banner uploaded successfully!");
      } else {
        setErrorMessage("Image upload failed! Try again.");
      }
    } catch {
      setErrorMessage("Upload failed! Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Final save changes (you handle DB update outside)__
  const handleSaveChanges = () => {
    const submissionData = {
      profileBanner: bannerUrl,
    };

    setIsLoading(true);
    updateProfile(submissionData, {
      onSuccess: () => {
        // Update original data after successful save
        originalBannerUrlRef.current = bannerUrl;

        handleCloseModal();

        Swal.fire({
          title: "Success!",
          text: "Banner updated successfully.",
          icon: "success",
        });

        setIsLoading(false);
        setHasChanges(false);
      },
      onError: () => {
        handleCloseModal();

        Swal.fire({
          title: "Oops!",
          text: "Something went wrong while updating.",
          icon: "error",
        });

        setIsLoading(false);
      },
    });
  };

  const handleCancel = () => {
    // Reset to original data
    setBannerUrl(originalBannerUrlRef.current);
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
    const modal = document.getElementById("banner_update_modal");
    modal.close();
  };

  return (
    <dialog id="banner_update_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title="Update Profile Banner"
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Current Banner Section */}
            {bannerUrl && !imageSrc && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                  <FaRegImage className="text-[#3C8F63] text-lg" />
                  Current Banner
                </h3>

                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={bannerUrl}
                    alt="Current Banner"
                    className="w-full h-[200px] object-cover"
                  />
                </div>

                {bannerUrl !== profile?.profileBanner && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="text-green-800 text-base">
                      <span className="font-semibold">Important:</span> Click
                      "Save Changes" below to update your banner, or your
                      changes will be lost.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload Section */}
            {!imageSrc && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                  <MdUpload className="text-[#3C8F63] text-xl mt-1" />
                  Upload New Banner
                </h3>

                <label className=" w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <MdUpload className="text-4xl text-gray-500 mb-3" />
                  <p className="text-gray-600 font-medium text-lg">
                    Click to upload banner image
                  </p>
                  <p className="text-gray-400 text-base mt-1">
                    PNG, JPG, WEBP (max 5MB)
                  </p>
                </label>
              </div>
            )}

            {/* Cropper Section */}
            {imageSrc && (
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                  <FaRegImage className="text-[#3C8F63] text-lg" />
                  Crop Your Banner
                </h3>

                <div className="space-y-4">
                  {/* Cropper Container */}
                  <div className="relative w-full h-[300px] rounded-lg overflow-hidden border-2 border-gray-300">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1200 / 300}
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
                      disabled={isLoading}
                      className="btn btn-outline h-[50px] px-6 text-base border-2 border-gray-300 hover:bg-gray-50"
                    >
                      <FaTimes className="mr-2" />
                      Cancel Crop
                    </button>

                    <button
                      onClick={handlePreview}
                      disabled={isLoading || !croppedAreaPixels}
                      className={`btn h-[50px] px-6 text-base ${
                        isLoading || !croppedAreaPixels
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#3C8F63] hover:bg-[#2d7a52] text-white"
                      }`}
                    >
                      <FaEye className="mr-2" />
                      Preview Crop
                    </button>
                  </div>
                </div>

                {/* Cropped Preview */}
                {croppedImage && (
                  <div className="space-y-4 p-4 border-2 border-[#3C8F63] rounded-xl bg-green-50">
                    <h4 className="flex items-center gap-2 font-semibold text-gray-800 text-lg">
                      <FaRegImage className="text-[#3C8F63]" />
                      Cropped Preview
                    </h4>

                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={croppedImage}
                        alt="Cropped Banner"
                        className="w-full h-[150px] object-cover"
                      />
                    </div>

                    <button
                      onClick={handleUploadToBackend}
                      disabled={isLoading}
                      className={`btn h-[50px] px-6 text-base ${
                        isLoading
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#3C8F63] hover:bg-[#2d7a52] text-white"
                      }`}
                    >
                      <FaRegSave className="mr-2" />
                      {isLoading ? "Uploading..." : "Save Cropped Image"}
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
                    <div className="text-red-800 text-base">{errorMessage}</div>
                  </div>
                )}
              </div>
            )}
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

export default BannerModal;
