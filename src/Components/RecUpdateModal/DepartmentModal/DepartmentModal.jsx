import { useEffect, useState, useRef } from "react";
import useUserData from "../../../Hooks/userData";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";
import { jhSuccess, jhError } from "../../../utils";
import { MdBusinessCenter, MdSearch, MdAdd, MdClose } from "react-icons/md";
import { FaRegSave, FaTimes } from "react-icons/fa";

const DepartmentModal = () => {
  const { profile, updateProfile } = useUserData();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dpUpdateLoading, setDpUpdateLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Store original data
  const originalDataRef = useRef([]);

  // Sorted departments A-Z
  const departments = [
    "Administration",
    "Business Development",
    "Content / Editorial",
    "Customer Support / Service",
    "Data & Analytics",
    "Design / Creative",
    "Digital Strategy / Innovation",
    "Engineering / Development",
    "Facilities / Maintenance",
    "Finance / Accounting",
    "Human Resources (HR)",
    "IT / Information Technology",
    "Legal / Compliance",
    "Marketing",
    "Media & Communications",
    "Operations",
    "Procurement / Purchasing",
    "Product Management",
    "Production / Manufacturing",
    "Project Management",
    "Public Relations (PR)",
    "Quality Assurance (QA)",
    "Research & Development (R&D)",
    "Sales",
    "Security / Risk Management",
    "Social Media / Community Management",
    "Supply Chain / Logistics",
    "Training / Learning & Development",
    "UX / UI Design",
  ].sort();

  useEffect(() => {
    const initialDepartments = profile?.departments || [];
    setSelectedDepartments(initialDepartments);
    originalDataRef.current = initialDepartments;
    setHasChanges(false);
  }, [profile]);

  // Check for changes
  useEffect(() => {
    const hasChanged =
      JSON.stringify(selectedDepartments) !==
      JSON.stringify(originalDataRef.current);
    setHasChanges(hasChanged);
  }, [selectedDepartments]);

  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = (department) => {
    if (!selectedDepartments.includes(department)) {
      setSelectedDepartments([...selectedDepartments, department]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleRemoveDepartment = (departmentToRemove) => {
    setSelectedDepartments(
      selectedDepartments.filter((dept) => dept !== departmentToRemove)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const departmentData = {
      departments: selectedDepartments,
    };

    setDpUpdateLoading(true);
    updateProfile(departmentData, {
      onSuccess: () => {
        handleCloseModal();

        jhSuccess({
          title: "Success!",
          text: "Departments updated successfully.",
        });

        // Update original data after successful save
        originalDataRef.current = [...selectedDepartments];
        setDpUpdateLoading(false);
        setHasChanges(false);
      },

      onError: () => {
        handleCloseModal();

        jhError({
          title: "Oops!",
          text: "Something went wrong while updating.",
        });

        setDpUpdateLoading(false);
      },
    });
  };

  const handleCancel = () => {
    // Reset to original data
    setSelectedDepartments(originalDataRef.current);
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("rec_department_update_modal");
    modal.close();
  };

  return (
    <dialog id="rec_department_update_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title="Update Company Departments"
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Department Selection Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                Company Departments
              </h3>

              {/* Search and Selection */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg mb-2">
                    <MdSearch className="text-gray-500" />
                    Search and Add Departments
                  </label>

                  <div className="flex items-center border-2 border-gray-300 rounded-lg focus-within:border-[#3C8F63] transition-colors">
                    <input
                      disabled={dpUpdateLoading}
                      type="text"
                      placeholder="Type to search departments..."
                      className="flex-grow p-4 h-[55px] text-base focus:outline-none rounded-l-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      disabled={dpUpdateLoading}
                      className="p-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {isDropdownOpen ? "▲" : "▼"}
                    </button>
                  </div>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredDepartments.length > 0 ? (
                        filteredDepartments.map((department) => (
                          <div
                            key={department}
                            className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            onClick={() => handleAddDepartment(department)}
                          >
                            <div className="flex items-center gap-3">
                              <MdAdd className="text-[#3C8F63] flex-shrink-0" />
                              <span className="text-gray-700">
                                {department}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-500 text-center">
                          No departments found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Departments */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <MdBusinessCenter className="text-gray-500" />
                    Selected Departments ({selectedDepartments.length})
                  </label>

                  {selectedDepartments?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {selectedDepartments.map((department) => (
                        <div
                          key={department}
                          className="bg-[#3C8F63] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
                        >
                          <span className="text-base">{department}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDepartment(department)}
                            disabled={dpUpdateLoading}
                            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-[#2d7a52]"
                          >
                            <MdClose size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <MdBusinessCenter className="text-gray-400 text-4xl mx-auto mb-3" />
                      <p className="text-gray-500 text-lg">
                        No departments selected yet
                      </p>
                      <p className="text-gray-400 text-base mt-1">
                        Search and add departments from the list above
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MdBusinessCenter className="text-green-600 text-xl mt-0.5" />
                <div className="text-green-800 text-base">
                  <span className="font-semibold">Tip:</span> Select the
                  departments that exist in your company. This helps candidates
                  find relevant job opportunities and understand your
                  organizational structure better.
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
              disabled={dpUpdateLoading || !hasChanges}
              onClick={handleCancel}
              className={`btn btn-outline h-[50px] sm:px-6 px-2 text-base ${
                dpUpdateLoading || !hasChanges
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={dpUpdateLoading || !hasChanges}
              className={`btn h-[50px] px-6 text-base ${
                dpUpdateLoading || !hasChanges
                  ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#2d7a52] text-white"
              }`}
            >
              <FaRegSave className="mr-2" />
              {dpUpdateLoading ? "Saving..." : "Save Changes"}
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

export default DepartmentModal;