// File path__
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

// From react__
import { useEffect, useState, useRef } from "react";

// Package__
import Swal from "sweetalert2";

// React Icons - Outline icons for professional look
import {
  FaRegLightbulb,
  FaRegBuilding,
  FaMobileAlt,
  FaKey,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaRegFlag,
  FaRegSave,
  FaTimes,
} from "react-icons/fa";

const ContactModal = () => {
  const { profile, updateProfile } = useUserData();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  // Form state__
  const [countriesList, setCountriesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");

  // Store original data__
  const originalDataRef = useRef({});

  // Load countries.json__
  useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data) => setCountriesList(data))
      .catch((err) => console.error("Error loading countries.json:", err));
  }, []);

  // Pre-fill form with profile data and store original values__
  useEffect(() => {
    if (profile && countriesList.length) {
      const country = profile.location?.country || "";
      const city = profile.location?.city || "";

      setSelectedCountry(country);

      const countryData = countriesList.find((c) => c.country === country);
      if (countryData) {
        setCitiesList(countryData.cities || []);
        setSelectedCity(city);
        setPhoneCode(countryData.phone || "");
      } else {
        setCitiesList([]);
        setSelectedCity("");
        setPhoneCode("");
      }

      // Phone number__
      let currentPhoneCode = phoneCode;
      let currentPhoneNumber = "";

      if (profile.number) {
        if (profile.number.startsWith("+")) {
          const codeLength = profile.number.length - 10;
          currentPhoneCode = profile.number.slice(0, codeLength);
          currentPhoneNumber = profile.number.slice(codeLength);
        } else {
          currentPhoneCode = "";
          currentPhoneNumber = profile.number;
        }
      }

      setPhoneCode(currentPhoneCode);
      setPhoneNumber(currentPhoneNumber || "");
      setLinkedin(profile.social?.linkedin || "");
      setGithub(profile.social?.github || "");
      setPortfolio(profile.social?.portfolio || "");

      // Store original data for comparison__
      originalDataRef.current = {
        country,
        city,
        phoneCode: currentPhoneCode,
        phoneNumber: currentPhoneNumber || "",
        linkedin: profile.social?.linkedin || "",
        github: profile.social?.github || "",
        portfolio: profile.social?.portfolio || "",
      };

      setHasChanges(false);
    }
  }, [profile, countriesList, phoneCode]);

  // Check if form has changes__
  const checkForChanges = () => {
    const original = originalDataRef.current;

    return (
      selectedCountry !== original.country ||
      selectedCity !== original.city ||
      phoneCode !== original.phoneCode ||
      phoneNumber !== original.phoneNumber ||
      linkedin !== original.linkedin ||
      github !== original.github ||
      portfolio !== original.portfolio
    );
  };

  // Update hasChanges when any field changes__
  useEffect(() => {
    setHasChanges(checkForChanges());
  }, [
    selectedCountry,
    selectedCity,
    phoneCode,
    phoneNumber,
    linkedin,
    github,
    portfolio,
  ]);

  // Handle country change__
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);

    const countryData = countriesList.find((c) => c.country === country);
    if (countryData) {
      setCitiesList(countryData.cities || []);
      setPhoneCode(countryData.phone || "");
      setSelectedCity(countryData.cities?.[0] || "");
    } else {
      setCitiesList([]);
      setPhoneCode("");
      setSelectedCity("");
    }
  };

  // Handle social links change
  const handleLinkedinChange = (e) => {
    setLinkedin(e.target.value);
  };

  const handleGithubChange = (e) => {
    setGithub(e.target.value);
  };

  const handlePortfolioChange = (e) => {
    setPortfolio(e.target.value);
  };

  const getFullPhoneNumber = () => {
    if (!phoneCode || !phoneNumber) return "";
    let number = phoneNumber.startsWith("0")
      ? phoneNumber.slice(1)
      : phoneNumber;
    return `${phoneCode}${number}`;
  };

  const sendOtp = () => {
    const modal = document.getElementById("contact_update_modal");
    modal.close();

    Swal.fire({
      title: "Money Problem 💸",
      text: "Sending OTP via SMS is expensive 😅 and I am poor. Just type anything for now or leave it empty.",
      icon: "info",
    }).then(() => modal.showModal());
  };

  // Submit contact form__
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const data = {
      number: getFullPhoneNumber() || profile.number,
      location: {
        city: selectedCity || profile.location?.city,
        country: selectedCountry || profile.location?.country,
      },
      social: {
        linkedin: linkedin || profile.social?.linkedin,
        github: github || profile.social?.github,
        portfolio: portfolio || profile.social?.portfolio,
      },
    };

    setUpdateLoading(true);
    updateProfile(data, {
      onSuccess: () => {
        handleCloseModal();

        Swal.fire({
          title: "Success!",
          text: "Contacts updated successfully.",
          icon: "success",
        });

        // Update original data after successful save
        originalDataRef.current = {
          country: selectedCountry,
          city: selectedCity,
          phoneCode: phoneCode,
          phoneNumber: phoneNumber,
          linkedin: linkedin,
          github: github,
          portfolio: portfolio,
        };

        setHasChanges(false);
        setUpdateLoading(false);
      },
      onError: () => {
        handleCloseModal();

        Swal.fire({
          title: "Oops!",
          text: "Something went wrong while updating.",
          icon: "error",
        });

        setUpdateLoading(false);
      },
    });
  };

  // Cancel / reset form__
  const handleCancel = () => {
    handleCloseModal();

    const original = originalDataRef.current;

    setSelectedCountry(original.country);
    setSelectedCity(original.city);
    setPhoneCode(original.phoneCode);
    setPhoneNumber(original.phoneNumber);
    setLinkedin(original.linkedin);
    setGithub(original.github);
    setPortfolio(original.portfolio);

    setIsPhoneValid(false);
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("contact_update_modal");
    modal.close();
  };

  return (
    <dialog id="contact_update_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title={"Edit contact info"}
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleContactSubmit} className="px-6 py-4 space-y-6">
            {/* Personal Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaRegFlag className="text-gray-500" />
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="select select-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  >
                    <option value="">Select Country</option>
                    {countriesList.map((c) => (
                      <option key={c.country} value={c.country}>
                        {c.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaRegBuilding className="text-gray-500" />
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="select select-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  >
                    <option value="">Select City</option>
                    {citiesList.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Phone Section */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                      <FaMobileAlt className="text-gray-500" />
                      Country Code
                    </label>
                    <input
                      type="text"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                      placeholder="+880"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                      <FaMobileAlt className="text-gray-500" />
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="01787548843"
                      className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex sm:flex-row flex-col gap-4 items-end">
                  <div className="flex-1 space-y-2 w-full">
                    <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                      <FaKey className="text-gray-500" />
                      Verification Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                    />
                  </div>

                  <button
                    onClick={sendOtp}
                    type="button"
                    disabled={!isPhoneValid}
                    className={`btn h-[55px] min-w-[140px] text-base ${
                      isPhoneValid
                        ? "bg-[#3C8F63] text-white hover:bg-[#2d7a52]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Send Code
                  </button>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <FaGlobe className="text-[#3C8F63] text-lg" />
                Social Links
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaLinkedin className="text-[#0077b5]" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={handleLinkedinChange}
                    placeholder="https://linkedin.com/in/yourname"
                    className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaGithub className="text-gray-800" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={handleGithubChange}
                    placeholder="https://github.com/yourname"
                    className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaGlobe className="text-[#3C8F63]" />
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    value={portfolio}
                    onChange={handlePortfolioChange}
                    placeholder="https://yourwebsite.com"
                    className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FaRegLightbulb className="text-green-600 text-xl mt-0.5" />
                <div className="text-green-800 text-base">
                  <span className="font-semibold italic">Tip:</span> Keep your{" "}
                  <strong>phone</strong>, <strong>location</strong>, and
                  professional links{" "}
                  <strong>(LinkedIn, GitHub, portfolio)</strong> up-to-date for
                  better opportunities.
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={updateLoading || !hasChanges}
              onClick={handleCancel}
              className={`btn btn-outline h-[50px] sm:px-6 px-2 text-base ${
                updateLoading || !hasChanges
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateLoading || !hasChanges}
              onClick={handleContactSubmit}
              className={`btn h-[50px] px-6 text-base ${
                updateLoading || !hasChanges
                  ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#2d7a52] text-white"
              }`}
            >
              <FaRegSave className="mr-2" />
              {updateLoading ? "Saving..." : "Save Changes"}
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

export default ContactModal;
