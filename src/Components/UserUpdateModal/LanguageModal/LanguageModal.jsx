// File path__
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useState, useEffect, useRef } from "react";

// Package__
import Swal from "sweetalert2";
import {
  FaRegLightbulb,
  FaPlus,
  FaTrash,
  FaRegSave,
  FaTimes,
} from "react-icons/fa";

const LanguageModal = () => {
  const { profile, updateProfile } = useUserData();
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [languageLoading, setLanguageLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data to compare changes__
  const originalLanguagesRef = useRef([]);

  // Initialize languages from profile data__
  useEffect(() => {
    if (profile?.languages && Array.isArray(profile.languages)) {
      const languagesWithIds = profile.languages.map((lang, index) => ({
        ...lang,
        id: index + 1,
      }));
      setLanguages(languagesWithIds);
      originalLanguagesRef.current = languagesWithIds;
    } else {
      setLanguages([]);
      originalLanguagesRef.current = [];
    }
    setHasChanges(false);
  }, [profile]);

  // Check if current languages are different from original__
  const checkForChanges = (currentLangs) => {
    const original = originalLanguagesRef.current;

    if (currentLangs.length !== original.length) return true;

    // Check if any language is different
    for (let i = 0; i < currentLangs.length; i++) {
      const current = currentLangs[i];
      const originalLang = original[i];

      if (
        !originalLang ||
        current.name !== originalLang.name ||
        current.proficiency !== originalLang.proficiency
      ) {
        return true;
      }
    }

    return false;
  };

  const handleAddLanguage = () => {
    if (newLanguage && proficiency) {
      const exists = languages.some(
        (lang) =>
          lang.name.toLowerCase().trim() === newLanguage.toLowerCase().trim()
      );
      if (exists) {
        const modal = document.getElementById("language_update_modal");
        modal.close();

        Swal.fire({
          title: "Duplicate!",
          text: `${newLanguage} is already added.`,
          icon: "warning",
        }).then(() => modal.showModal());
        return;
      }

      const newLang = {
        id: Date.now(),
        name: newLanguage,
        proficiency,
      };

      const updatedLanguages = [...languages, newLang];
      setLanguages(updatedLanguages);
      setHasChanges(checkForChanges(updatedLanguages));
      setNewLanguage("");
      setProficiency("");
    }
  };

  const handleDeleteLanguage = (id) => {
    const updatedLanguages = languages.filter((lang) => lang.id !== id);
    setLanguages(updatedLanguages);
    setHasChanges(checkForChanges(updatedLanguages));
  };

  // Handle input changes for new language__
  const handleNewLanguageChange = (e) => {
    setNewLanguage(e.target.value);
  };

  // Handle proficiency changes__
  const handleProficiencyChange = (e) => {
    setProficiency(e.target.value);
  };

  const handleSubmit = () => {
    const languagesForBackend = languages.map(({ ...rest }) => rest);

    const languageData = {
      languages: languagesForBackend,
    };

    setLanguageLoading(true);
    updateProfile(languageData, {
      onSuccess: () => {
        document.getElementById("language_update_modal").close();

        // Update original reference after successful save__
        originalLanguagesRef.current = languages;

        Swal.fire({
          title: "Success!",
          text: "Language updated successfully.",
          icon: "success",
        });

        setLanguageLoading(false);
        setHasChanges(false);
      },
      onError: () => {
        document.getElementById("language_update_modal").close();

        Swal.fire({
          title: "Oops!",
          text: "Something went wrong while updating.",
          icon: "error",
        });

        setLanguageLoading(false);
      },
    });
  };

  const handleCancel = () => {
    const modal = document.getElementById("language_update_modal");
    modal.close();

    // Reset form to original data__
    if (profile?.languages && Array.isArray(profile.languages)) {
      const languagesWithIds = profile.languages.map((lang, index) => ({
        ...lang,
        id: index + 1,
      }));
      setLanguages(languagesWithIds);
    } else {
      setLanguages([]);
    }
    setNewLanguage("");
    setProficiency("");
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("language_update_modal");
    modal.close();
  };

  return (
    <dialog id="language_update_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title={"Edit language info"}
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Add Language Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                Add New Language
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaPlus className="text-gray-500" />
                    Language
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Spanish, French, German"
                    className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                    value={newLanguage}
                    onChange={handleNewLanguageChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaPlus className="text-gray-500" />
                    Proficiency Level
                  </label>
                  <select
                    className="select select-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                    value={proficiency}
                    onChange={handleProficiencyChange}
                  >
                    <option value="">Select proficiency</option>
                    <option value="Elementary proficiency">
                      Elementary proficiency
                    </option>
                    <option value="Limited working proficiency">
                      Limited working proficiency
                    </option>
                    <option value="Professional working proficiency">
                      Professional working proficiency
                    </option>
                    <option value="Full professional proficiency">
                      Full professional proficiency
                    </option>
                    <option value="Native or bilingual proficiency">
                      Native or bilingual proficiency
                    </option>
                  </select>
                </div>
              </div>

              {/* Add Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleAddLanguage}
                  disabled={!newLanguage || !proficiency}
                  className={`btn h-[55px] px-6 text-base ${
                    newLanguage && proficiency
                      ? "bg-[#3C8F63] text-white hover:bg-[#2d7a52]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaPlus className="mr-2" />
                  Add Language
                </button>
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FaRegLightbulb className="text-green-600 text-xl mt-0.5" />
                <div className="text-green-800 text-base">
                  <span className="font-semibold italic">Tip:</span> You can add
                  multiple languages and indicate your{" "}
                  <strong>proficiency</strong> level for each to showcase your
                  linguistic skills to potential employers.
                </div>
              </div>
            </div>

            {/* Your Languages List */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                Your Languages
              </h3>

              {languages.length > 0 ? (
                <div className="space-y-3">
                  {languages.map((language) => (
                    <div
                      key={language.id}
                      className="flex justify-between items-center p-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {language.name}
                        </h3>
                        <p className="text-gray-600 text-base">
                          {language.proficiency}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteLanguage(language.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-lg">
                    No languages added yet.
                  </p>
                  <p className="text-gray-400 text-base mt-1">
                    Add your first language above
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={languageLoading || !hasChanges}
              onClick={handleCancel}
              className={`btn btn-outline h-[50px] sm:px-6 px-2 text-base ${
                languageLoading || !hasChanges
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={languageLoading || !hasChanges}
              className={`btn h-[50px] px-6 text-base ${
                languageLoading || !hasChanges
                  ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#2d7a52] text-white"
              }`}
            >
              <FaRegSave className="mr-2" />
              {languageLoading ? "Saving..." : "Save Changes"}
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

export default LanguageModal;
