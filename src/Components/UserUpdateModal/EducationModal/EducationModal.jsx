import { useState, useEffect, useRef } from "react";
import { FaSchool, FaLightbulb } from "react-icons/fa";
import { FiLock, FiUnlock } from "react-icons/fi";
import useUserData from "../../../Hooks/userData";
import Swal from "sweetalert2";
import SeekerModalHeader from "../../../Shared/SeekerModalHeader/SeekerModalHeader";

const EducationModal = () => {
  const { profile, updateProfile } = useUserData();
  const [eduUpdateLoading, setEduUpdateLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize all states
  const [schoolLock, setSchoolLock] = useState(true);
  const [collegeLock, setCollegeLock] = useState(true);
  const [universityLock, setUniversityLock] = useState(true);

  const [school, setSchool] = useState({
    name: "",
    group: "",
    start: "",
    end: "",
  });
  const [college, setCollege] = useState({
    name: "",
    degree: "",
    start: "",
    end: "",
  });
  const [university, setUni] = useState({
    name: "",
    dept: "",
    start: "",
    end: "",
  });

  // Store original data
  const originalDataRef = useRef({});

  // Initialize data from profile
  useEffect(() => {
    if (profile) {
      const schoolData = profile?.education?.find(
        (edu) => edu.level === "School"
      );
      const collegeData = profile?.education?.find(
        (edu) => edu.level === "College"
      );
      const universityData = profile?.education?.find(
        (edu) => edu.level === "University"
      );

      // Set school data
      if (schoolData) {
        setSchool({
          name: schoolData.institute || "",
          group: schoolData.department || "",
          start: schoolData.startYear || "",
          end: schoolData.endYear || "",
        });
        setSchoolLock(false);
      }

      // Set college data
      if (collegeData) {
        setCollege({
          name: collegeData.institute || "",
          degree: collegeData.department || "",
          start: collegeData.startYear || "",
          end: collegeData.endYear || "",
        });
        setCollegeLock(false);
      }

      // Set university data
      if (universityData) {
        setUni({
          name: universityData.institute || "",
          dept: universityData.department || "",
          start: universityData.startYear || "",
          end: universityData.endYear || "",
        });
        setUniversityLock(false);
      }

      // Store original data for comparison
      originalDataRef.current = {
        school: schoolData
          ? { ...schoolData }
          : { name: "", group: "", start: "", end: "" },
        college: collegeData
          ? { ...collegeData }
          : { name: "", degree: "", start: "", end: "" },
        university: universityData
          ? { ...universityData }
          : { name: "", dept: "", start: "", end: "" },
        schoolLock: !schoolData,
        collegeLock: !collegeData,
        universityLock: !universityData,
      };

      setHasChanges(false);
      setErrorMessage("");
    }
  }, [profile]);

  // Check for changes
  useEffect(() => {
    const currentData = {
      school: {
        name: school.name,
        group: school.group,
        start: school.start,
        end: school.end,
      },
      college: {
        name: college.name,
        degree: college.degree,
        start: college.start,
        end: college.end,
      },
      university: {
        name: university.name,
        dept: university.dept,
        start: university.start,
        end: university.end,
      },
      schoolLock,
      collegeLock,
      universityLock,
    };

    const original = originalDataRef.current;

    const hasDataChanged =
      JSON.stringify(currentData.school) !== JSON.stringify(original.school) ||
      JSON.stringify(currentData.college) !==
        JSON.stringify(original.college) ||
      JSON.stringify(currentData.university) !==
        JSON.stringify(original.university) ||
      currentData.schoolLock !== original.schoolLock ||
      currentData.collegeLock !== original.collegeLock ||
      currentData.universityLock !== original.universityLock;

    setHasChanges(hasDataChanged);
  }, [school, college, university, schoolLock, collegeLock, universityLock]);

  // Validate a single section
  const validateSection = (section, sectionName) => {
    if (!section.name.trim()) return `${sectionName} name is required`;
    if (!section.group.trim()) return `${sectionName} group/degree is required`;
    if (!section.start.trim()) return `${sectionName} start year is required`;
    if (!section.end.trim()) return `${sectionName} end year is required`;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const education = [];
    let error = null;

    // Only validate UNLOCKED sections
    if (!schoolLock) {
      error = validateSection(school, "School");
      if (error) {
        setErrorMessage(error);
        return;
      }
      education.push({
        institute: school.name,
        department: school.group,
        startYear: school.start,
        endYear: school.end,
        level: "School",
      });
    }

    if (!collegeLock) {
      error = validateSection(college, "College");
      if (error) {
        setErrorMessage(error);
        return;
      }
      education.push({
        institute: college.name,
        department: college.degree,
        startYear: college.start,
        endYear: college.end,
        level: "College",
      });
    }

    if (!universityLock) {
      error = validateSection(university, "University");
      if (error) {
        setErrorMessage(error);
        return;
      }
      education.push({
        institute: university.name,
        department: university.dept,
        startYear: university.start,
        endYear: university.end,
        level: "University",
      });
    }

    // Check if at least one section is filled
    if (education.length === 0) {
      setErrorMessage("Please enable and fill at least one education section");
      return;
    }

    const finalData = { education };

    setEduUpdateLoading(true);
    updateProfile(finalData, {
      onSuccess: () => {
        handleCloseModal();

        // Update original data after successful save
        originalDataRef.current = {
          school: { ...school },
          college: { ...college },
          university: { ...university },
          schoolLock,
          collegeLock,
          universityLock,
        };

        Swal.fire({
          title: "Success",
          text: "Education information updated successfully",
          icon: "success",
        });
        setEduUpdateLoading(false);
        setHasChanges(false);
        setErrorMessage("");
      },
      onError: (err) => {
        console.log(err);
        document.getElementById("education_update_modal").close();
        Swal.fire({
          title: "Update Failed",
          text: "There might be some issue. Please try again!",
          icon: "error",
        });
        setEduUpdateLoading(false);
      },
    });
  };

  // Helper function to handle checkbox changes
  const handleLockChange = (
    setLock,
    lockState,
    sectionData,
    sectionSetter,
    defaultValues,
    sectionName
  ) => {
    if (lockState && sectionData) {
      const modal = document.getElementById("education_update_modal");
      modal.close();

      Swal.fire({
        title: "Keep existing data?",
        text: `You already have data for ${sectionName}. Do you want to keep it?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3C8F63",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, keep it",
        cancelButtonText: "No, start fresh",
      }).then((result) => {
        if (result.isConfirmed) {
          setLock(false);
        } else {
          sectionSetter(defaultValues);
          setLock(false);
        }
        setTimeout(() => {
          modal.showModal();
        }, 100);
      });
    } else {
      setLock(!lockState);
    }
  };

  const handleCancel = () => {
    handleCloseModal();

    const original = originalDataRef.current;

    setSchool(original.school);
    setCollege(original.college);
    setUni(original.university);
    setSchoolLock(original.schoolLock);
    setCollegeLock(original.collegeLock);
    setUniversityLock(original.universityLock);

    setHasChanges(false);
    setErrorMessage("");
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("education_update_modal");
    modal.close();
  };

  return (
    <section>
      <dialog id="education_update_modal" className="modal">
        <div className="modal-box max-w-[1024px] max-h-[95vh] lg:p-0 p-0">
          <div className="education_update_main_content_container">
            <SeekerModalHeader
              title={"Update Education Info"}
              handleCloseModal={handleCloseModal}
            ></SeekerModalHeader>

            {errorMessage && (
              <div className="mx-5 mb-4 p-4 bg-red-50 border border-red-300 rounded-lg">
                <p className="text-red-700 text-lg font-medium">
                  {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 px-5">
              {/* School Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-gray-300 pb-4 mb-6">
                  <h3 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
                    School
                    {schoolLock ? (
                      <FiLock color="red" size={20} />
                    ) : (
                      <FiUnlock color="green" size={20} />
                    )}
                  </h3>
                  <div className="flex items-center">
                    <input
                      checked={!schoolLock}
                      onChange={() =>
                        handleLockChange(
                          setSchoolLock,
                          schoolLock,
                          originalDataRef.current.school.name,
                          setSchool,
                          { name: "", group: "", start: "", end: "" },
                          "school"
                        )
                      }
                      className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 text-[#3C8F63] focus:ring-[#3C8F63]"
                      type="checkbox"
                    />
                    <label className="ml-3 text-lg font-medium text-gray-700">
                      I have attended school
                    </label>
                  </div>
                </div>

                {!schoolLock && (
                  <div className="space-y-6">
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text text-gray-700 font-medium text-xl">
                          School Name
                        </span>
                      </label>
                      <div className="flex rounded-lg">
                        <span className="inline-flex items-center rounded-l-lg border-2 border-r-0 border-gray-300 bg-[#F0FDF4] px-4 text-[#3C8F63]">
                          <FaSchool className="text-lg" />
                        </span>
                        <input
                          value={school.name}
                          onChange={(e) =>
                            setSchool({ ...school, name: e.target.value })
                          }
                          className="input input-bordered flex-1 min-w-0 w-full text-lg h-[45px] px-4 rounded-l-none border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          placeholder="Ex: Springfield High School"
                          type="text"
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text text-gray-700 font-medium text-xl">
                          Group
                        </span>
                      </label>
                      <input
                        value={school.group}
                        onChange={(e) =>
                          setSchool({ ...school, group: e.target.value })
                        }
                        className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                        placeholder="Ex: Science"
                        type="text"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="form-control">
                        <label className="label mb-2">
                          <span className="label-text text-gray-700 font-medium text-xl">
                            Start Year
                          </span>
                        </label>
                        <input
                          value={school.start}
                          onChange={(e) =>
                            setSchool({ ...school, start: e.target.value })
                          }
                          className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          placeholder="YYYY"
                          type="text"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label mb-2">
                          <span className="label-text text-gray-700 font-medium text-xl">
                            End Year
                          </span>
                        </label>
                        <input
                          value={school.end}
                          onChange={(e) =>
                            setSchool({ ...school, end: e.target.value })
                          }
                          className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          placeholder="YYYY"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* College Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-gray-300 pb-4 mb-6">
                  <h3 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
                    College
                    {collegeLock ? (
                      <FiLock color="red" size={20} />
                    ) : (
                      <FiUnlock color="green" size={20} />
                    )}
                  </h3>
                  <div className="flex items-center">
                    <input
                      checked={!collegeLock}
                      onChange={() =>
                        handleLockChange(
                          setCollegeLock,
                          collegeLock,
                          originalDataRef.current.college.name,
                          setCollege,
                          { name: "", degree: "", start: "", end: "" },
                          "college"
                        )
                      }
                      className="h-5 w-5 rounded border-2 border-gray-300 text-[#3C8F63] focus:ring-[#3C8F63] cursor-pointer"
                      type="checkbox"
                    />
                    <label className="ml-3 text-lg font-medium text-gray-700">
                      I have attended college
                    </label>
                  </div>
                </div>

                {!collegeLock && (
                  <div className="space-y-6">
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text text-gray-700 font-medium text-xl">
                          Institute Name
                        </span>
                      </label>
                      <div className="flex rounded-lg">
                        <span className="inline-flex items-center rounded-l-lg border-2 border-r-0 border-gray-300 bg-[#F0FDF4] px-4 text-[#3C8F63]">
                          <FaSchool className="text-lg" />
                        </span>
                        <input
                          value={college.name}
                          onChange={(e) =>
                            setCollege({ ...college, name: e.target.value })
                          }
                          className="input input-bordered flex-1 min-w-0 w-full text-lg h-[45px] px-4 rounded-l-none border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          placeholder="Ex: Crestwood Community College"
                          type="text"
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text text-gray-700 font-medium text-xl">
                          Degree
                        </span>
                      </label>
                      <input
                        value={college.degree}
                        onChange={(e) =>
                          setCollege({ ...college, degree: e.target.value })
                        }
                        className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                        placeholder="Ex: Associate of Arts"
                        type="text"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="form-control">
                        <label className="label mb-2">
                          <span className="label-text text-gray-700 font-medium text-xl">
                            Start Year
                          </span>
                        </label>
                        <input
                          value={college.start}
                          onChange={(e) =>
                            setCollege({ ...college, start: e.target.value })
                          }
                          className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          placeholder="YYYY"
                          type="text"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label mb-2">
                          <span className="label-text text-gray-700 font-medium text-xl">
                            End Year
                          </span>
                        </label>
                        <input
                          value={college.end}
                          onChange={(e) =>
                            setCollege({ ...college, end: e.target.value })
                          }
                          className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          placeholder="YYYY"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* University Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-gray-300 pb-4 mb-6">
                  <h3 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
                    University
                    {universityLock ? (
                      <FiLock color="red" size={20} />
                    ) : (
                      <FiUnlock color="green" size={20} />
                    )}
                  </h3>
                  <div className="flex items-center">
                    <input
                      checked={!universityLock}
                      onChange={() =>
                        handleLockChange(
                          setUniversityLock,
                          universityLock,
                          originalDataRef.current.university.name,
                          setUni,
                          { name: "", dept: "", start: "", end: "" },
                          "university"
                        )
                      }
                      className="h-5 w-5 rounded border-2 border-gray-300 text-[#3C8F63] focus:ring-[#3C8F63] cursor-pointer"
                      type="checkbox"
                    />
                    <label className="ml-3 text-lg font-medium text-gray-700">
                      I have attended university
                    </label>
                  </div>
                </div>

                {!universityLock && (
                  <div className="space-y-6">
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text text-gray-700 font-medium text-xl">
                          Institute Name
                        </span>
                      </label>
                      <div className="flex rounded-lg">
                        <span className="inline-flex items-center rounded-l-lg border-2 border-r-0 border-gray-300 bg-[#F0FDF4] px-4 text-[#3C8F63]">
                          <FaSchool className="text-lg" />
                        </span>
                        <input
                          value={university.name}
                          onChange={(e) =>
                            setUni({ ...university, name: e.target.value })
                          }
                          className="input input-bordered flex-1 min-w-0 w-full text-lg h-[45px] px-4 rounded-l-none border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          placeholder="Ex: Stanford University"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label mb-2">
                        <span className="label-text text-gray-700 font-medium text-xl">
                          Department
                        </span>
                      </label>
                      <input
                        value={university.dept}
                        onChange={(e) =>
                          setUni({ ...university, dept: e.target.value })
                        }
                        className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                        placeholder="Ex: Computer Science"
                        type="text"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="form-control">
                        <label className="label mb-2">
                          <span className="label-text text-gray-700 font-medium text-xl">
                            Start Year
                          </span>
                        </label>
                        <input
                          value={university.start}
                          onChange={(e) =>
                            setUni({ ...university, start: e.target.value })
                          }
                          className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          placeholder="YYYY"
                          type="text"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label mb-2">
                          <span className="label-text text-gray-700 font-medium text-xl">
                            End Year
                          </span>
                        </label>
                        <input
                          value={university.end}
                          onChange={(e) =>
                            setUni({ ...university, end: e.target.value })
                          }
                          className="input input-bordered w-full text-lg h-[45px] px-4 border-2 border-gray-300 rounded-lg focus:border-[#3C8F63] focus:outline-none transition-colors"
                          placeholder="YYYY"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips Section */}
              <div className="bg-[#F0FDF4] border border-[#3C8F63] p-5 rounded-lg">
                <div className="flex items-start">
                  <FaLightbulb className="text-green-600 text-xl mr-4" />
                  <div className="text-[#276043] text-base">
                    <b>
                      <i>Tip:</i>
                    </b>{" "}
                    Provide accurate details about your educational background.
                    This helps potential employers and connections understand
                    your qualifications.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 bg-[#eef1f4] px-5 py-6 mt-6">
                <button
                  type="button"
                  disabled={eduUpdateLoading || !hasChanges}
                  onClick={handleCancel}
                  className={`btn btn-outline px-8 py-3 text-lg border-2 ${
                    eduUpdateLoading || !hasChanges
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  }`}
                >
                  Cancel
                </button>
                <button
                  disabled={eduUpdateLoading || !hasChanges}
                  type="submit"
                  className={`btn px-8 py-3 text-lg ${
                    eduUpdateLoading || !hasChanges
                      ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#337954] text-white"
                  }`}
                >
                  {eduUpdateLoading ? "Working...." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </section>
  );
};

export default EducationModal;
