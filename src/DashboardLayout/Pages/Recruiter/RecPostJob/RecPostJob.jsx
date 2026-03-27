// File path__
import useAxios from "../../../../Hooks/Axios";
import useUserData from "../../../../Hooks/userData";
import { jhError, jhSuccess, jhToastWarning } from "../../../../utils";
import VerifyMessage from "../../../../Components/VerifyMessage/VerifyMessage";

// Form react__
import { useState } from "react";

// Package__
import { useForm } from "react-hook-form";
import { GoAlert } from "react-icons/go";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdElectricBolt, MdOutlineInfo } from "react-icons/md";
import {
  FiBriefcase,
  FiCalendar,
  FiUser,
  FiPlus,
  FiX,
  FiLock,
} from "react-icons/fi";

const RecPostJob = () => {
  const api = useAxios();
  const { profile } = useUserData();
  const [currentStep, setCurrentStep] = useState(1);
  const [postLoading, setPostLoading] = useState(false);
  const currencies = [
    "AED",
    "AUD",
    "BHD",
    "BDT",
    "BRL",
    "CAD",
    "CHF",
    "CNY",
    "CZK",
    "DKK",
    "EGP",
    "EUR",
    "GBP",
    "HKD",
    "HUF",
    "IDR",
    "INR",
    "IRR",
    "JPY",
    "KRW",
    "KWD",
    "LKR",
    "MMK",
    "MYR",
    "NGN",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PHP",
    "PKR",
    "PLN",
    "QAR",
    "RUB",
    "SAR",
    "SEK",
    "SGD",
    "THB",
    "TRY",
    "USD",
    "VND",
    "ZAR",
  ];

  // Professional state management for chips/tags__
  const [chips, setChips] = useState({
    responsibilities: [],
    requirementSkills: [],
    niceToHave: [],
    benefits: [],
    tags: [],
    whoCanApply: [],
  });

  const [enableWhoCanApply, setEnableWhoCanApply] = useState(false);
  const [currentInput, setCurrentInput] = useState({
    responsibilities: "",
    requirementSkills: "",
    niceToHave: "",
    benefits: "",
    tags: "",
    whoCanApply: "",
  });

  // React Hook Form with ALL fields required__
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    defaultValues: {
      jobTitle: "",
      jobType: "Full-time",
      workplaceType: "On-site",
      country: "",
      city: "",
      area: "",
      department: "",
      position: "",
      experienceLevel: "Intermediate Level",
      salaryRange: {
        min: "",
        max: "",
        currency: "USD",
        period: "year",
      },
      applicationDeadline: "",
      openPositions: 1,
      jobDescription: "",
    },
  });

  const formValues = watch();

  // TAG SYSTEM__
  const addChip = (fieldName, value) => {
    if (value.trim() && !chips[fieldName].includes(value.trim())) {
      setChips((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], value.trim()],
      }));
      setCurrentInput((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const removeChip = (fieldName, index) => {
    setChips((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const handleChipInputKeyPress = (fieldName, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip(fieldName, currentInput[fieldName]);
    }
  };

  const handleChipInputChange = (fieldName, value) => {
    setCurrentInput((prev) => ({ ...prev, [fieldName]: value }));
  };

  const addChipButtonClick = (fieldName) => {
    addChip(fieldName, currentInput[fieldName]);
  };

  //VALIDATION SYSTEM__
  const validateStep = async (nextStep) => {
    let fieldsToValidate = [];

    // STEP 1: All basic info required__
    if (currentStep === 1) {
      fieldsToValidate = [
        "jobTitle",
        "jobType",
        "workplaceType",
        "country",
        "city",
        "area",
        "department",
        "position",
      ];
    }
    // STEP 2: All details required__
    else if (currentStep === 2) {
      fieldsToValidate = [
        "experienceLevel",
        "openPositions",
        "salaryRange.min",
        "salaryRange.max",
        "applicationDeadline",
      ];
    }
    // STEP 3: Description__
    else if (currentStep === 3) {
      fieldsToValidate = ["jobDescription"];

      // Validate that required chips have at least one item__
      const requiredChips = [
        "responsibilities",
        "requirementSkills",
        "benefits",
      ];
      const chipErrors = requiredChips.filter(
        (field) => chips[field].length === 0
      );

      if (chipErrors.length > 0) {
        jhToastWarning(
          `Please add at least one item in: ${chipErrors.join(", ")}`
        );
        return;
      }
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(nextStep);
    }
  };

  const onSubmit = async (data) => {
    const completeJobData = {
      ...data,
      ...chips,
      whoCanApply: enableWhoCanApply ? chips.whoCanApply : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isExpired: false,
      totalApply: 0,
      companyID: profile._id,
      companyEmail: profile.userEmail,
      companyName: profile.companyName,
      companyLogo: profile.companyLogo,
      companyWebsite: profile.companyWebsite,
    };

    setPostLoading(true);
    await api
      .post("/recruiter-api/post-job", completeJobData)
      .then((res) => {
        if (res.data.insertedId) {
          setPostLoading(false);
          resetFrom();

          jhSuccess({
            title: "Job Posted Successfully!",
            text: "Your job has been published and is now visible to job seekers.",
          });
        } else {
          setPostLoading(false);
          jhError({
            title: "Posting Failed",
            text: "Failed to create job post. Please try again.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setPostLoading(false);
        resetFrom();
        jhError({
          title: "Posting Failed",
          text:
            error.response?.data?.message ||
            "Failed to post job. Please try again.",
        });
      });
  };

  const resetFrom = () => {
    setValue("jobTitle", "");
    setValue("jobType", "Full-time");
    setValue("workplaceType", "On-site");
    setValue("country", "");
    setValue("city", "");
    setValue("area", "");
    setValue("department", "");
    setValue("position", "");
    setValue("experienceLevel", "Mid Level");
    setValue("salaryRange.min", "");
    setValue("salaryRange.max", "");
    setValue("salaryRange.currency", "USD");
    setValue("salaryRange.period", "year");
    setValue("applicationDeadline", "");
    setValue("openPositions", 1);
    setValue("jobDescription", "");

    // 2. Reset all chips to empty__
    setChips({
      responsibilities: [],
      requirementSkills: [],
      niceToHave: [],
      benefits: [],
      tags: [],
      whoCanApply: [],
    });

    // 3. Reset current inputs__
    setCurrentInput({
      responsibilities: "",
      requirementSkills: "",
      niceToHave: "",
      benefits: "",
      tags: "",
      whoCanApply: "",
    });

    // 4. Reset whoCanApply checkbox__
    setEnableWhoCanApply(false);

    // 5. Go back to step 1__
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderChipSection = (
    fieldName,
    title,
    placeholder,
    required = false
  ) => (
    <div className="mb-6">
      <label className="block text-xl font-medium text-gray-700 mb-3">
        {title} {required && "*"}
        {/* TAG LIMIT COUNTER - ONLY FOR TAGS */}
        {fieldName === "tags" && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({chips.tags.length}/10)
          </span>
        )}
      </label>

      {/* Chips Display */}
      {chips[fieldName].length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {chips[fieldName].map((chip, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 text-white px-3 py-2 rounded-lg text-base ${
                fieldName === "tags" ? "bg-blue-500" : "bg-[#3C8F63]"
              }`}
            >
              {/* SHOW NUMBERS ONLY FOR TAGS */}
              {index + 1}. {chip}
              <button
                type="button"
                onClick={() => removeChip(fieldName, index)}
                className="hover:text-red-200 transition-colors"
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input with Add Button */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder={placeholder}
          value={currentInput[fieldName]}
          disabled={fieldName === "tags" && chips.tags.length >= 10}
          onChange={(e) => handleChipInputChange(fieldName, e.target.value)}
          onKeyPress={(e) => handleChipInputKeyPress(fieldName, e)}
          className={`flex-1 pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
            fieldName === "tags" && currentInput.tagsError
              ? "border-red-300"
              : "border-gray-200 focus:border-[#3C8F63]"
          }`}
        />
        <button
          type="button"
          onClick={() => addChipButtonClick(fieldName)}
          className="px-6 py-3 bg-[#3C8F63] text-white rounded-xl font-medium hover:bg-[#2a6b4a] transition-all duration-200"
        >
          <FiPlus size={18} />
        </button>
      </div>

      {/* Helper Text */}
      <p className="text-sm text-gray-500 mt-2">
        Type and press Enter or click + to add
      </p>

      {/* TAG LIMIT ERROR MESSAGE */}
      {fieldName === "tags" && currentInput.tagsError && (
        <p className="text-red-500 text-sm mt-1">{currentInput.tagsError}</p>
      )}

      {/* Required Validation Message */}
      {required && chips[fieldName].length === 0 && currentStep === 3 && (
        <p className="text-red-500 text-sm mt-1">
          Please add at least one {title.toLowerCase()}
        </p>
      )}
    </div>
  );

  return (
    <>
      {profile.verified !== "Verified" ? (
        <>
          <VerifyMessage></VerifyMessage>
          <div className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] flex items-start justify-center">
            <div className="w-full">
              <div className="rounded-2xl overflow-y-auto">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#3C8F63] to-[#2a6b4a] p-5 text-white text-center">
                  <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FiLock size={25} />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">
                    Verification Required
                  </h1>
                  <p className="text-white/80 text-lg">
                    Verify your account to access job posting features
                  </p>
                </div>

                {/* Main Content */}
                <div className="p-4">
                  {/* Warning Alert */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GoAlert size={20} color="red" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-red-800 mb-2">
                          Access Restricted
                        </h3>
                        <p className="text-red-700">
                          You need to be a verified recruiter to post jobs on
                          our platform. This helps maintain quality and trust in
                          our community.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IoCheckmarkCircleOutline size={20} color="blue" />
                        </div>
                        <h4 className="font-semibold text-blue-800">
                          Verified Badge
                        </h4>
                      </div>
                      <p className="text-blue-700 text-sm">
                        Get a verified badge that builds trust with job seekers
                        and increases application rates.
                      </p>
                    </div>

                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <MdElectricBolt size={20} color="green" />
                        </div>
                        <h4 className="font-semibold text-green-800">
                          Priority Listing
                        </h4>
                      </div>
                      <p className="text-green-700 text-sm">
                        Verified recruiters get priority in search results and
                        job listings for better visibility.
                      </p>
                    </div>
                  </div>

                  {/* Verification Process */}
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Verification Process
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#3C8F63] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Complete Your Profile
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Fill in all company details and upload required
                            documents
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#3C8F63] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Submit for Review
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Our admin team will review your information within
                            24-48 hours
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#3C8F63] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Get Verified
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Start posting jobs and connecting with qualified
                            candidates
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() =>
                        document
                          .getElementById("verify_message_modal")
                          .showModal()
                      }
                      disabled={
                        profile.verified === "Pending" ||
                        profile.verified === "Verified"
                      }
                      className="flex-1 bg-[#3C8F63] text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-[#2a6b4a] transition-all duration-200 shadow-lg shadow-[#3C8F63]/30 hover:shadow-xl hover:shadow-[#3C8F63]/40 flex items-center justify-center gap-2"
                    >
                      <IoCheckmarkCircleOutline size={20} />
                      {profile.verified === "Pending"
                        ? "You request is on pending..."
                        : "Request Verification"}
                    </button>

                    <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 ">
                      <a
                        href="https://portfolio-2-c48ba.web.app/"
                        target="main"
                        className="flex items-center justify-center gap-2"
                      >
                        <MdOutlineInfo size={20} />
                        Learn More
                      </a>
                    </button>
                  </div>

                  {/* Support Text */}
                  <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                      Need help? Contact our support team at{" "}
                      <a
                        href="mailto:support@jobhunting.com"
                        className="text-[#3C8F63] hover:underline"
                      >
                        shsoburhossen951@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-2 px-2">
          <div className="w-full mx-auto">
            {/* Header Section */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3C8F63] rounded-2xl shadow-lg mb-4">
                <FiBriefcase size={35} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Post a New Job
              </h1>
              <p className="text-gray-600">
                Fill in the details below to find the perfect candidate
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-5">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        step === currentStep
                          ? "bg-[#3C8F63] border-[#3C8F63] text-white shadow-lg shadow-[#3C8F63]/30"
                          : step < currentStep
                          ? "bg-[#3C8F63] border-[#3C8F63] text-white"
                          : "border-gray-300 text-gray-400 bg-white"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-8 h-1 mx-2 transition-all duration-300 ${
                          step < currentStep ? "bg-[#3C8F63]" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white rounded-2xl shadow-xl border border-[#3c8f6320] overflow-hidden w-full">
                {/* ==================== STEP 1: BASIC INFORMATION ==================== */}
                {currentStep === 1 && (
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#3C8F63]/10 rounded-xl flex items-center justify-center">
                        <FiBriefcase className="text-[#3C8F63] text-lg" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Job Basics
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Job Title */}
                      <div className="md:col-span-2">
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Senior Frontend Developer"
                          className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                            errors.jobTitle
                              ? "border-red-300"
                              : "border-gray-200 focus:border-[#3C8F63]"
                          }`}
                          {...register("jobTitle", {
                            required: "Job title is required",
                            minLength: {
                              value: 3,
                              message:
                                "Job title must be at least 3 characters",
                            },
                          })}
                        />
                        {errors.jobTitle && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.jobTitle.message}
                          </p>
                        )}
                      </div>

                      {/* Job Type */}
                      <div>
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Job Type *
                        </label>
                        <select
                          className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                            errors.jobType
                              ? "border-red-300"
                              : "border-gray-200 focus:border-[#3C8F63]"
                          }`}
                          {...register("jobType", {
                            required: "Job type is required",
                          })}
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                        {errors.jobType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.jobType.message}
                          </p>
                        )}
                      </div>

                      {/* Workplace Type */}
                      <div>
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Workplace Type *
                        </label>
                        <select
                          className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                            errors.workplaceType
                              ? "border-red-300"
                              : "border-gray-200 focus:border-[#3C8F63]"
                          }`}
                          {...register("workplaceType", {
                            required: "Workplace type is required",
                          })}
                        >
                          <option value="On-site">On-site</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                        {errors.workplaceType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.workplaceType.message}
                          </p>
                        )}
                      </div>

                      {/* Location - Three Parts */}
                      <div className="md:col-span-2">
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Country"
                              className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                                errors.country
                                  ? "border-red-300"
                                  : "border-gray-200 focus:border-[#3C8F63]"
                              }`}
                              {...register("country", {
                                required: "Country is required",
                              })}
                            />
                            {errors.country && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.country.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="City"
                              className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                                errors.city
                                  ? "border-red-300"
                                  : "border-gray-200 focus:border-[#3C8F63]"
                              }`}
                              {...register("city", {
                                required: "City is required",
                              })}
                            />
                            {errors.city && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.city.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="Area"
                              className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                                errors.area
                                  ? "border-red-300"
                                  : "border-gray-200 focus:border-[#3C8F63]"
                              }`}
                              {...register("area", {
                                required: "Area is required",
                              })}
                            />
                            {errors.area && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.area.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Department */}
                      <div>
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Department *
                        </label>
                        <select
                          className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                            errors.department
                              ? "border-red-300"
                              : "border-gray-200 focus:border-[#3C8F63]"
                          }`}
                          {...register("department", {
                            required: "Department is required",
                          })}
                        >
                          <option value="">Select Department</option>
                          {profile?.departments?.map((dept, index) => (
                            <option key={index} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                        {errors.department && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.department.message}
                          </p>
                        )}
                      </div>

                      {/* Position */}
                      <div>
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Position *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Senior Developer"
                          className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                            errors.position
                              ? "border-red-300"
                              : "border-gray-200 focus:border-[#3C8F63]"
                          }`}
                          {...register("position", {
                            required: "Position is required",
                          })}
                        />
                        {errors.position && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.position.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => validateStep(2)}
                        className="px-8 py-3 bg-[#3C8F63] text-white rounded-xl font-medium hover:bg-[#2a6b4a] transition-all duration-200 shadow-lg shadow-[#3C8F63]/30 hover:shadow-xl hover:shadow-[#3C8F63]/40"
                      >
                        Next: Details
                      </button>
                    </div>
                  </div>
                )}

                {/* ==================== STEP 2: JOB DETAILS ==================== */}
                {currentStep === 2 && (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#3C8F63]/10 rounded-xl flex items-center justify-center">
                        <FiUser className="text-[#3C8F63] text-lg" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Job Details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Experience Level */}
                      <div>
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Experience Level *
                        </label>
                        <select
                          className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                            errors.experienceLevel
                              ? "border-red-300"
                              : "border-gray-200 focus:border-[#3C8F63]"
                          }`}
                          {...register("experienceLevel", {
                            required: "Experience level is required",
                          })}
                        >
                          <option value="Junior Level">Junior Level</option>
                          <option value="Intermediate Level">
                            Intermediate Level
                          </option>
                          <option value="Senior Level">Senior Level</option>
                          <option value="Executive Level">
                            Executive Level
                          </option>
                        </select>
                        {errors.experienceLevel && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.experienceLevel.message}
                          </p>
                        )}
                      </div>

                      {/* Open Positions */}
                      <div>
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Open Positions *
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="1"
                          className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                            errors.openPositions
                              ? "border-red-300"
                              : "border-gray-200 focus:border-[#3C8F63]"
                          }`}
                          {...register("openPositions", {
                            required: "Open positions is required",
                            min: { value: 1, message: "Must be at least 1" },
                            valueAsNumber: true,
                          })}
                        />
                        {errors.openPositions && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.openPositions.message}
                          </p>
                        )}
                      </div>

                      {/* Salary Range */}
                      <div className="md:col-span-2">
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Salary Range *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="Min"
                              className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                                errors.salaryRange?.min
                                  ? "border-red-300"
                                  : "border-gray-200 focus:border-[#3C8F63]"
                              }`}
                              {...register("salaryRange.min", {
                                required: "Minimum salary is required",
                                valueAsNumber: true,
                              })}
                            />
                            {errors.salaryRange?.min && (
                              <p className="text-red-500 text-sm">
                                Min: {errors.salaryRange.min.message}
                              </p>
                            )}
                          </div>

                          <div className="relative">
                            <input
                              type="number"
                              placeholder="Max"
                              className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                                errors.salaryRange?.max
                                  ? "border-red-300"
                                  : "border-gray-200 focus:border-[#3C8F63]"
                              }`}
                              {...register("salaryRange.max", {
                                required: "Maximum salary is required",
                                valueAsNumber: true,
                              })}
                            />
                            {errors.salaryRange?.max && (
                              <p className="text-red-500 text-sm">
                                Max: {errors.salaryRange.max.message}
                              </p>
                            )}
                          </div>

                          <select
                            className="px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#3C8F63] transition-all duration-200 bg-gray-50"
                            {...register("salaryRange.currency", {
                              required: "Currency is required",
                            })}
                          >
                            {currencies.map((code) => (
                              <option key={code} value={code}>
                                {code}
                              </option>
                            ))}
                          </select>

                          <select
                            className="px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#3C8F63] transition-all duration-200 bg-gray-50"
                            {...register("salaryRange.period", {
                              required: "Period is required",
                            })}
                          >
                            <option value="Year">Per Year</option>
                            <option value="Month">Per Month</option>
                            <option value="Hour">Per Hour</option>
                            <option value="Contact">Contact</option>
                          </select>
                        </div>
                      </div>

                      {/* Application Deadline */}
                      <div className="md:col-span-2">
                        <label className="block text-xl font-medium text-gray-700 mb-2">
                          Application Deadline *
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="date"
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 ${
                              errors.applicationDeadline
                                ? "border-red-300"
                                : "border-gray-200 focus:border-[#3C8F63]"
                            }`}
                            {...register("applicationDeadline", {
                              required: "Application deadline is required",
                            })}
                          />
                        </div>
                        {errors.applicationDeadline && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.applicationDeadline.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => validateStep(3)}
                        className="px-8 py-3 bg-[#3C8F63] text-white rounded-xl font-medium hover:bg-[#2a6b4a] transition-all duration-200 shadow-lg shadow-[#3C8F63]/30 hover:shadow-xl hover:shadow-[#3C8F63]/40"
                      >
                        Next: Description
                      </button>
                    </div>
                  </div>
                )}

                {/* ==================== STEP 3: JOB DESCRIPTION ==================== */}
                {currentStep === 3 && (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#3C8F63]/10 rounded-xl flex items-center justify-center">
                        <FiBriefcase className="text-[#3C8F63] text-lg" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Job Description
                      </h2>
                    </div>

                    {/* Job Description */}
                    <div className="mb-6">
                      <label className="block text-xl font-medium text-gray-700 mb-2">
                        Job Description *
                      </label>
                      <textarea
                        rows="6"
                        placeholder="Describe the role, expectations, and what makes this position exciting..."
                        className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-gray-50 resize-none ${
                          errors.jobDescription
                            ? "border-red-300"
                            : "border-gray-200 focus:border-[#3C8F63]"
                        }`}
                        {...register("jobDescription", {
                          required: "Job description is required",
                          minLength: {
                            value: 50,
                            message:
                              "Job description must be at least 50 characters",
                          },
                        })}
                      ></textarea>
                      {errors.jobDescription && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.jobDescription.message}
                        </p>
                      )}
                    </div>

                    {/* Professional Chip Sections */}
                    {renderChipSection(
                      "responsibilities",
                      "Responsibilities",
                      "Add responsibility",
                      true
                    )}
                    {renderChipSection(
                      "requirementSkills",
                      "Required Skills",
                      "Add required skill",
                      true
                    )}
                    {renderChipSection(
                      "niceToHave",
                      "Nice to Have",
                      "Add nice to have skill",
                      false
                    )}
                    {renderChipSection(
                      "benefits",
                      "Benefits",
                      "Add benefit",
                      true
                    )}

                    {/* Tags - Professional Search Tags */}
                    {renderChipSection(
                      "tags",
                      "Search Tags (It will help your post rank higher)",
                      "Add tag (e.g. React, Remote, Senior)",
                      true
                    )}

                    {/* Who Can Apply - Optional with checkbox */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={enableWhoCanApply}
                          onChange={(e) =>
                            setEnableWhoCanApply(e.target.checked)
                          }
                          className="w-4 h-4 text-[#3C8F63] border-gray-300 rounded focus:ring-[#3C8F63]"
                        />
                        <label className="block text-xl font-medium text-gray-700">
                          Add "Who Can Apply" Requirements (Optional)
                        </label>
                      </div>

                      {enableWhoCanApply &&
                        renderChipSection(
                          "whoCanApply",
                          "Who Can Apply",
                          "Add requirement",
                          false
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => validateStep(4)}
                        className="px-8 py-3 bg-[#3C8F63] text-white rounded-xl font-medium hover:bg-[#2a6b4a] transition-all duration-200 shadow-lg shadow-[#3C8F63]/30 hover:shadow-xl hover:shadow-[#3C8F63]/40"
                      >
                        Next: Review
                      </button>
                    </div>
                  </div>
                )}

                {/* ==================== STEP 4: REVIEW & SUBMIT ==================== */}
                {currentStep === 4 && (
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#3C8F63]/10 rounded-xl flex items-center justify-center">
                        <FiBriefcase className="text-[#3C8F63] text-lg" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Review & Post
                      </h2>
                    </div>

                    {/* Professional Preview Card */}
                    <div className="bg-gradient-to-r from-[#3C8F63]/5 to-[#3C8F63]/10 border-2 border-[#3C8F63]/20 rounded-2xl p-6 mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {formValues.jobTitle || "Job Title"}
                          </h3>
                          <p className="text-gray-600">
                            {formValues.city && formValues.country
                              ? `${formValues.city}, ${formValues.country}`
                              : "Location"}{" "}
                            • {formValues.department || "Department"}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-[#3C8F63] text-white text-sm rounded-full font-medium">
                          {formValues.jobType}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Experience</p>
                          <p className="font-medium">
                            {formValues.experienceLevel}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Salary</p>
                          <p className="font-medium">
                            {formValues.salaryRange?.min &&
                            formValues.salaryRange?.max
                              ? `$${formValues.salaryRange.min} - $${formValues.salaryRange.max}`
                              : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Applications</p>
                          <p className="font-medium">0</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Deadline</p>
                          <p className="font-medium">
                            {formValues.applicationDeadline
                              ? new Date(
                                  formValues.applicationDeadline
                                ).toLocaleDateString()
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Final Actions */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        disabled={postLoading}
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={postLoading}
                        className="px-8 py-3 bg-[#3C8F63] text-white rounded-xl font-medium hover:bg-[#2a6b4a] transition-all duration-200 shadow-lg shadow-[#3C8F63]/30 hover:shadow-xl hover:shadow-[#3C8F63]/40"
                      >
                        {postLoading ? "Working..." : "Post Job"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RecPostJob;
