import { useState, useEffect, useRef } from "react";
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";
import { jhSuccess, jhError } from "../../../utils";
import {
  MdLanguage,
  MdBusiness,
  MdGroups,
  MdCalendarToday,
  MdLocationOn,
  MdAddLocation,
  MdAdd,
  MdRemove,
} from "react-icons/md";
import { FaRegSave, FaTimes, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";

const CompanyDetailsModal = () => {
  const { profile, updateProfile } = useUserData();
  const [companyData, setCompanyData] = useState({
    companyWebsite: "",
    industry: "",
    companySize: {
      currentEmployees: "",
      sizeRange: "",
    },
    foundedYear: "",
    headquarters: {
      country: "",
      city: "",
      area: "",
    },
    branchLocations: [{ country: "", city: "", area: "" }],
  });

  const [haveBranch, setHaveBranch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data
  const originalDataRef = useRef({});

  // Initialize form data with profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      const initialData = {
        companyWebsite: profile.companyWebsite || "",
        industry: profile.industry || "",
        companySize: profile.companySize || {
          currentEmployees: "",
          sizeRange: "",
        },
        foundedYear: profile.foundedYear || "",
        headquarters: profile.headquarters || {
          country: "",
          city: "",
          area: "",
        },
        branchLocations:
          profile.branchLocations && profile.branchLocations.length > 0
            ? profile.branchLocations
            : [{ country: "", city: "", area: "" }],
      };

      setCompanyData(initialData);
      originalDataRef.current = initialData;
      setHasChanges(false);

      // Set haveBranch based on existing branch data
      setHaveBranch(
        profile.branchLocations &&
          profile.branchLocations.length > 0 &&
          profile.branchLocations[0].country !== ""
      );
    }
  }, [profile]);

  // Check for changes
  useEffect(() => {
    const hasChanged =
      JSON.stringify(companyData) !== JSON.stringify(originalDataRef.current);
    setHasChanges(hasChanged);
  }, [companyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompanySizeChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      companySize: {
        ...prev.companySize,
        [name]: value,
      },
    }));
  };

  const handleHeadquartersChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      headquarters: {
        ...prev.headquarters,
        [name]: value,
      },
    }));
  };

  const handleBranchChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBranches = [...companyData.branchLocations];
    updatedBranches[index] = {
      ...updatedBranches[index],
      [name]: value,
    };
    setCompanyData((prev) => ({
      ...prev,
      branchLocations: updatedBranches,
    }));
  };

  const addBranch = () => {
    setCompanyData((prev) => ({
      ...prev,
      branchLocations: [
        ...prev.branchLocations,
        { country: "", city: "", area: "" },
      ],
    }));
  };

  const removeBranch = (index) => {
    if (companyData.branchLocations.length > 1) {
      const updatedBranches = [...companyData.branchLocations];
      updatedBranches.splice(index, 1);
      setCompanyData((prev) => ({
        ...prev,
        branchLocations: updatedBranches,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data for submission
      const submissionData = {
        companyWebsite: companyData.companyWebsite,
        industry: companyData.industry,
        companySize: {
          currentEmployees: companyData.companySize.currentEmployees,
          sizeRange: companyData.companySize.sizeRange,
        },
        foundedYear: companyData.foundedYear,
        headquarters: {
          country: companyData.headquarters.country,
          city: companyData.headquarters.city,
          area: companyData.headquarters.area,
        },
        branchLocations: haveBranch
          ? companyData.branchLocations.filter(
              (branch) => branch.country && branch.city
            )
          : [],
      };

      updateProfile(submissionData, {
        onSuccess: () => {
          handleCloseModal();
          jhSuccess({
            title: "Success!",
            text: "Company details updated successfully.",
          });
          // Update original data after successful save
          originalDataRef.current = { ...companyData };
          setHasChanges(false);
        },
        onError: () => {
          handleCloseModal();
          jhError({
            title: "Oops!",
            text: "Something went wrong while updating.",
          });
        },
      });
    } catch (error) {
      console.error("Error updating company details:", error);
      jhError({
        title: "Error!",
        text: "Failed to update company details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setCompanyData(originalDataRef.current);
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("res_company_details_modal");
    modal.close();
  };

  // Get current year for founded year validation
  const currentYear = new Date().getFullYear();

  return (
    <dialog id="res_company_details_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title={
            profile?.companyWebsite
              ? "Update Company Details"
              : "Add Company Details"
          }
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <MdBusiness className="text-[#3C8F63] text-lg" />
                Basic Information
              </h3>

              {/* Website */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <FaGlobe className="text-gray-500" />
                  Company Website
                </label>
                <input
                  disabled={isLoading}
                  type="url"
                  className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  name="companyWebsite"
                  value={companyData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  required
                />
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <MdBusiness className="text-gray-500" />
                  Industry
                </label>
                <input
                  disabled={isLoading}
                  type="text"
                  className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  name="industry"
                  value={companyData.industry}
                  onChange={handleChange}
                  placeholder="e.g. Technology, Healthcare, Finance"
                  required
                />
              </div>

              {/* Company Size */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <MdGroups className="text-gray-500" />
                  Company Size
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-medium text-gray-700 text-base">
                      Current Employees
                    </label>
                    <input
                      disabled={isLoading}
                      type="number"
                      min="0"
                      max="1000000"
                      className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                      name="currentEmployees"
                      value={companyData.companySize.currentEmployees}
                      onChange={handleCompanySizeChange}
                      placeholder="e.g. 250"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium text-gray-700 text-base">
                      Size Range
                    </label>
                    <input
                      disabled={isLoading}
                      type="text"
                      className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                      name="sizeRange"
                      value={companyData.companySize.sizeRange}
                      onChange={handleCompanySizeChange}
                      placeholder="e.g. 201-500 employees"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Enter the current number of employees and the typical size
                  range
                </p>
              </div>

              {/* Founded Year */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                  <MdCalendarToday className="text-gray-500" />
                  Founded Year
                </label>
                <input
                  disabled={isLoading}
                  type="number"
                  min="1800"
                  max={currentYear}
                  className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                  name="foundedYear"
                  value={companyData.foundedYear}
                  onChange={handleChange}
                  placeholder="Enter founding year (e.g. 1999)"
                  required
                />
              </div>
            </div>

            {/* Headquarters Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <FaMapMarkerAlt className="text-[#3C8F63] text-lg" />
                Headquarters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="font-medium text-gray-700 text-base">
                    Country
                  </label>
                  <input
                    disabled={isLoading}
                    type="text"
                    className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                    name="country"
                    value={companyData.headquarters.country}
                    onChange={handleHeadquartersChange}
                    placeholder="Country name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium text-gray-700 text-base">
                    City
                  </label>
                  <input
                    disabled={isLoading}
                    type="text"
                    className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                    name="city"
                    value={companyData.headquarters.city}
                    onChange={handleHeadquartersChange}
                    placeholder="City name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium text-gray-700 text-base">
                    Area Name
                  </label>
                  <input
                    disabled={isLoading}
                    type="text"
                    className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                    name="area"
                    value={companyData.headquarters.area}
                    onChange={handleHeadquartersChange}
                    placeholder="Area name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Branch Locations Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                  <MdAddLocation className="text-[#3C8F63] text-lg" />
                  Branch Locations
                </h3>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={haveBranch}
                    onChange={(e) => setHaveBranch(e.target.checked)}
                    className="checkbox checkbox-sm border-2 border-gray-300 checked:border-[#3C8F63]"
                  />
                  <span className="font-medium text-gray-700">
                    We have branches
                  </span>
                </label>
              </div>

              {haveBranch &&
                companyData.branchLocations.map((branch, index) => (
                  <div
                    key={index}
                    className="p-4 border-2 border-gray-300 rounded-lg relative"
                  >
                    {companyData.branchLocations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBranch(index)}
                        disabled={isLoading}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      >
                        <MdRemove size={20} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="font-medium text-gray-700 text-base">
                          Country
                        </label>
                        <input
                          disabled={isLoading}
                          type="text"
                          className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                          value={branch.country}
                          onChange={(e) => handleBranchChange(index, e)}
                          placeholder="Country name"
                          name="country"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium text-gray-700 text-base">
                          City
                        </label>
                        <input
                          disabled={isLoading}
                          type="text"
                          className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                          value={branch.city}
                          onChange={(e) => handleBranchChange(index, e)}
                          placeholder="City name"
                          name="city"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium text-gray-700 text-base">
                          Area Name (Optional)
                        </label>
                        <input
                          disabled={isLoading}
                          type="text"
                          className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                          value={branch.area}
                          onChange={(e) => handleBranchChange(index, e)}
                          placeholder="Area name"
                          name="area"
                        />
                      </div>
                    </div>
                  </div>
                ))}

              {haveBranch && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addBranch}
                    disabled={isLoading}
                    className="btn btn-outline h-[50px] px-6 text-base border-2 border-gray-300 hover:bg-gray-50"
                  >
                    <MdAdd className="mr-2" />
                    Add Branch Location
                  </button>
                </div>
              )}
            </div>

            {/* Tip Box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MdLocationOn className="text-green-600 text-xl mt-0.5" />
                <div className="text-green-800 text-base">
                  <span className="font-semibold">Tip:</span> Complete company
                  details help candidates understand your organization better.
                  Accurate location information makes it easier for potential
                  employees to find opportunities near them.
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
      <form method="dialog">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default CompanyDetailsModal;