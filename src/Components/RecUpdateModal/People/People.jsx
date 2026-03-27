// File path__
import useAxios from "../../../Hooks/Axios";
import { getCroppedImg, jhSuccess, jhError } from "../../../utils";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useState, useCallback, useRef, useEffect } from "react";

// Package__
import Cropper from "react-easy-crop";
import { Slider } from "@mui/material";
import {
  MdUpload,
  MdPerson,
  MdWork,
  MdAdd,
  MdClose,
  MdPeople,
} from "react-icons/md";
import { FaRegSave, FaTimes, FaRegImage, FaEye, FaTrash } from "react-icons/fa";
import useUserData from "../../../Hooks/userData";

const PeopleModal = () => {
  const api = useAxios();
  const { profile, updateProfile } = useUserData();

  // Key people data states
  const [keyPeople, setKeyPeople] = useState([]);
  const [newPerson, setNewPerson] = useState({
    image: "",
    name: "",
    position: "",
  });

  // Image cropping states (for new person)__
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data
  const originalDataRef = useRef([]);

  // Initialize data from profile__
  useEffect(() => {
    if (profile?.keyPeople) {
      setKeyPeople(profile.keyPeople);
      originalDataRef.current = profile.keyPeople;
      setHasChanges(false);
    }
  }, [profile]);

  // Check for changes__
  useEffect(() => {
    const hasChanged =
      JSON.stringify(keyPeople) !== JSON.stringify(originalDataRef.current);
    setHasChanges(hasChanged);
  }, [keyPeople]);

  // Handle new person text changes__
  const handleNewPersonChange = (e) => {
    const { name, value } = e.target;
    setNewPerson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image cropping functions__
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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

  const handleCancelCrop = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setCroppedFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setMessage("");
    setErrorMessage("");
  };

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
      setImageUploadLoading(true);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.url) {
        setNewPerson((prev) => ({
          ...prev,
          image: res.data.url,
        }));
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setMessage("Person image uploaded successfully!");
      } else {
        setErrorMessage("Image upload failed! Try again.");
      }
    } catch {
      setErrorMessage("Upload failed! Something went wrong.");
    } finally {
      setImageUploadLoading(false);
    }
  };

  // Add new person to the list
  const handleAddPerson = () => {
    if (!newPerson.image || !newPerson.name || !newPerson.position) {
      setErrorMessage("Please complete all fields: image, name, and position.");
      return;
    }

    if (keyPeople.length >= 5) {
      setErrorMessage("Maximum 5 key people allowed.");
      return;
    }

    setKeyPeople((prev) => [...prev, { ...newPerson }]);
    setNewPerson({
      image: "",
      name: "",
      position: "",
    });
    setMessage("Person added successfully!");
    setErrorMessage("");
  };

  // Remove person from the list
  const handleRemovePerson = (index) => {
    setKeyPeople((prev) => prev.filter((_, i) => i !== index));
  };

  // Final save changes
  const handleSaveChanges = () => {
    const submissionData = {
      keyPeople: keyPeople,
    };

    setIsLoading(true);
    updateProfile(submissionData, {
      onSuccess: () => {
        handleCloseModal();

        jhSuccess({
          title: "Success!",
          text: "Key people updated successfully.",
        });

        originalDataRef.current = [...keyPeople];
        setHasChanges(false);
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
    handleCloseModal();

    setKeyPeople(originalDataRef.current);
    setNewPerson({
      image: "",
      name: "",
      position: "",
    });
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
    const modal = document.getElementById("rec_key_people_modal");
    modal.close();
  };

  const canAddPerson = newPerson.image && newPerson.name && newPerson.position;
  const maxPeopleReached = keyPeople.length >= 5;

  return (
    <dialog id="rec_key_people_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title="Manage Key People"
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Current Key People Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <MdPeople className="text-[#3C8F63] text-lg" />
                Key People ({keyPeople.length}/5)
              </h3>

              {keyPeople.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keyPeople.map((person, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-300 rounded-lg relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemovePerson(index)}
                        disabled={isLoading}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <FaTrash size={16} />
                      </button>

                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                          <img
                            src={person.image}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-lg">
                            {person.name}
                          </h4>
                          <p className="text-gray-600 text-base">
                            {person.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <MdPeople className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500 text-lg">
                    No key people added yet
                  </p>
                  <p className="text-gray-400 text-base mt-1">
                    Add your key team members below
                  </p>
                </div>
              )}
            </div>

            {/* Add New Person Section */}
            {!maxPeopleReached && (
              <div className="space-y-6 p-4 border-2 border-gray-300 rounded-lg">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                  <MdAdd className="text-[#3C8F63] text-lg" />
                  Add New Person
                </h3>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaRegImage className="text-gray-500" />
                    Person Image
                  </h4>

                  {/* Current Image Preview */}
                  {newPerson.image && !imageSrc && (
                    <div className="flex flex-col items-center space-y-3 p-4 border-2 border-gray-300 rounded-lg">
                      <p className="font-medium text-gray-700">
                        Current Image:
                      </p>
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                        <img
                          src={newPerson.image}
                          alt="Person"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Section */}
                  {!imageSrc && (
                    <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isLoading || imageUploadLoading}
                      />
                      <MdUpload className="text-3xl text-gray-500 mb-2" />
                      <p className="text-gray-600 font-medium text-base">
                        Upload Person Image
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        PNG, JPG, WEBP (max 5MB)
                      </p>
                    </label>
                  )}

                  {/* Cropper Section */}
                  {imageSrc && (
                    <div className="space-y-4 p-4 border-2 border-gray-300 rounded-lg">
                      <div className="space-y-4">
                        {/* Cropper Container */}
                        <div className="relative w-full h-[250px] rounded-lg overflow-hidden border-2 border-gray-300">
                          <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // Square aspect for profile
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                          />
                        </div>

                        {/* Zoom Controls */}
                        <div className="space-y-2">
                          <label className="font-medium text-gray-700 text-base">
                            Zoom Level
                          </label>
                          <div className="px-4">
                            <Slider
                              value={zoom}
                              min={1}
                              max={3}
                              step={0.1}
                              onChange={(e, newZoom) => setZoom(newZoom)}
                              disabled={isLoading || imageUploadLoading}
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
                            disabled={imageUploadLoading || isLoading}
                            className="btn btn-outline h-[50px] px-6 text-base border-2 border-gray-300 hover:bg-gray-50"
                          >
                            <FaTimes className="mr-2" />
                            Cancel
                          </button>

                          <button
                            onClick={handlePreview}
                            disabled={
                              imageUploadLoading ||
                              isLoading ||
                              !croppedAreaPixels
                            }
                            className={`btn h-[50px] px-6 text-base ${
                              imageUploadLoading || !croppedAreaPixels
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
                            <div className="w-[400px] h-[400px] rounded-full overflow-hidden border-2 border-gray-300">
                              <img
                                src={croppedImage}
                                alt="Cropped Person"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          <button
                            onClick={handleUploadToBackend}
                            disabled={isLoading || imageUploadLoading}
                            className={`btn h-[50px] px-6 text-base ${
                              imageUploadLoading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#3C8F63] hover:bg-[#2d7a52] text-white"
                            }`}
                          >
                            <FaRegSave className="mr-2" />
                            {imageUploadLoading
                              ? "Uploading..."
                              : "Save Cropped Image"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Name and Position Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                      <MdPerson className="text-gray-500" />
                      Full Name
                    </label>
                    <input
                      disabled={isLoading}
                      type="text"
                      name="name"
                      value={newPerson.name}
                      onChange={handleNewPersonChange}
                      placeholder="Enter person's full name"
                      className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                      maxLength={50}
                    />
                    <p className="text-sm text-gray-500">
                      {newPerson.name.length}/50 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                      <MdWork className="text-gray-500" />
                      Position
                    </label>
                    <input
                      disabled={isLoading}
                      type="text"
                      name="position"
                      value={newPerson.position}
                      onChange={handleNewPersonChange}
                      placeholder="e.g., CEO, CTO, Manager"
                      className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                      maxLength={50}
                    />
                    <p className="text-sm text-gray-500">
                      {newPerson.position.length}/50 characters
                    </p>
                  </div>
                </div>

                {/* Add Person Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleAddPerson}
                    disabled={!canAddPerson || isLoading}
                    className={`btn h-[50px] px-6 text-base ${
                      !canAddPerson
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#3C8F63] hover:bg-[#2d7a52] text-white"
                    }`}
                  >
                    <MdAdd className="mr-2" />
                    Add Person
                  </button>
                </div>

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

            {/* Max People Reached Message */}
            {maxPeopleReached && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MdPeople className="text-yellow-600 text-xl mt-0.5" />
                  <div className="text-yellow-800 text-base">
                    <span className="font-semibold">Note:</span> You've reached
                    the maximum limit of 5 key people. Remove someone to add a
                    new person.
                  </div>
                </div>
              </div>
            )}

            {/* Tip Box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MdPeople className="text-green-600 text-xl mt-0.5" />
                <div className="text-green-800 text-base">
                  <span className="font-semibold">Tip:</span> Showcase your key
                  team members to build trust with candidates. Include
                  leadership roles and important decision-makers in your
                  organization.
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
  );
};

export default PeopleModal;
