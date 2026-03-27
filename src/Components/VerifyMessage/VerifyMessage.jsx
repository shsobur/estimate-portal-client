// File path__
import useAxios from "../../Hooks/Axios";
import useUserData from "../../Hooks/userData";
import { jhError, jhSuccess, jhToastInfo } from "../../utils";
import SeekerModalHeader from "../../Shared/SeekerModalHeader/SeekerModalHeader";

// Form react__
import { useEffect, useState } from "react";

// Package__
import { format } from "date-fns";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { FiCheck, FiAlertTriangle, FiLock, FiSend, FiX } from "react-icons/fi";

const VerifyMessage = () => {
  const api = useAxios();
  const { profile, updateProfile } = useUserData();
  const [percent, setPercent] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [progressColor, setProgressColor] = useState("bg-red-500");
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form__
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkProfileData = () => {
      let dataCount = 0;

      const checks = [
        profile?.companyName,
        profile?.companyLogo,
        profile?.companyWebsite,
        profile?.industry,
        profile?.companySize?.currentEmployees &&
          profile?.companySize?.sizeRange,
        profile?.foundedYear,
        profile?.headquarters?.country &&
          profile?.headquarters?.city &&
          profile?.headquarters?.area,
        profile?.description,
        profile?.mission,
        profile?.vision,
        profile?.bio,
        profile?.departments?.length >= 1,
        profile?.keyPeople?.length >= 1,
        profile?.social?.linkedin ||
          profile?.social?.x ||
          (profile?.social?.additionalLinks &&
            Object.keys(profile.social.additionalLinks).length >= 1),
        profile?.companyGallery?.length >= 1,
      ];

      dataCount = checks.filter(Boolean).length;
      const calculatedPercent = Math.floor((dataCount / 15) * 100);

      setPercent(calculatedPercent);

      // Smart Progress Bar Colors__
      if (calculatedPercent >= 90) {
        setProgressColor("bg-green-700");
        setIsProfileComplete(true);
      } else if (calculatedPercent >= 70) {
        setProgressColor("bg-orange-500");
        setIsProfileComplete(false);
      } else {
        setProgressColor("bg-red-500");
        setIsProfileComplete(false);
      }
    };

    checkProfileData();
  }, [profile]);

  // Form Submission__
  const onSubmit = async (data) => {
    const verified = "Pending";

    const verificationData = {
      subject: data.subject,
      message: data.message,
      legalAgreement: isChecked,
      submittedAt: format(new Date(), "MMM dd, yyyy"),
      companyId: profile._id,
      completed: percent,
      isVerify: "Unverified",
      companyName: profile.companyName,
      email: profile.userEmail,
    };

    // Data for admin email__
    const templateParams = {
      subject: verificationData.subject,
      message: verificationData.message,
      companyName: verificationData.companyName,
      email: verificationData.email,
      submittedAt: verificationData.submittedAt,
      completed: verificationData.completed,
    };

    setIsLoading(true);
    await api
      .post("/recruiter-api/profile-verify-message", verificationData)
      .then((res) => {
        if (res.data.insertedId) {
          updateProfile(
            { verified },
            {
              onSuccess: () => {
                setIsLoading(false);
                handleCloseModal();

                jhSuccess({
                  title: "Verification Request Sent Successfully!",
                  text: "Our admin team will review your profile shortly.",
                });

                // Send email to admin__
                emailjs
                  .send(
                    import.meta.env.VITE_EMAIL_SERVICE_ID,
                    import.meta.env.VITE_EMAIL_TEMPLATE_ID,
                    templateParams,
                    import.meta.env.VITE_EMAIL_PUBLIC_KEY
                  )
                  .then(() => {
                    jhToastInfo(
                      "We've sent a verification request to admin for faster processing"
                    );
                  })
                  .catch((err) => {
                    console.log("Email send failed", err);
                  });
              },
              onError: () => {
                setIsLoading(false);
                handleCloseModal();
              },
            }
          );
        } else {
          setIsLoading(false);

          jhError({
            title: "Submission Failed",
            text: "Failed to send verification request. Please try again.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        handleCloseModal();

        jhError({
          title: "Submission Failed",
          text:
            error.response?.data?.message ||
            "Failed to send message. Please try again.",
        });
      });
  };

  const handleCloseModal = () => {
    document.getElementById("verify_message_modal").close();
  };
  return (
    <dialog id="verify_message_modal" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <SeekerModalHeader
          title="Account Verification Request"
          handleCloseModal={handleCloseModal}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Progress Bar Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                Verification Progress
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 text-lg">
                    Profile Completion
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      percent >= 90
                        ? "text-green-600"
                        : percent >= 70
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {percent}%
                  </span>
                </div>

                {/* Smart Progress Bar with Colors */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                {/* Status Message */}
                <p
                  className={`text-sm font-medium ${
                    percent >= 90
                      ? "text-green-600"
                      : percent >= 70
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {percent >= 90
                    ? "Your profile is complete! You can apply for verification."
                    : percent >= 70
                    ? "Your profile is almost complete. Please add more information."
                    : "Your profile needs more information to apply for verification."}
                </p>

                {/* Eligibility Notice */}
                {percent < 90 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      <strong>Requirement:</strong> You need at least{" "}
                      <b>90% </b>
                      profile completion to apply for verification.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Message Form Section */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Subject Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FiSend className="text-gray-500" />
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    disabled={percent < 90 || isLoading}
                    placeholder="Enter verification request subject..."
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 text-base ${
                      errors.subject
                        ? "border-red-300"
                        : "border-gray-300 focus:border-[#3C8F63]"
                    }`}
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: {
                        value: 5,
                        message: "Subject must be at least 5 characters",
                      },
                    })}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FiCheck className="text-gray-500" />
                    Message to Admin *
                  </label>
                  <textarea
                    rows="7"
                    name="message"
                    disabled={percent < 90 || isLoading}
                    placeholder="Write your verification message to the admin team. Include any relevant details about your profile information..."
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 text-base resize-y ${
                      errors.message
                        ? "border-red-300"
                        : "border-gray-300 focus:border-[#3C8F63]"
                    }`}
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 100,
                        message: "Message must be at least 100 characters",
                      },
                    })}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Please provide accurate information for faster verification
                  </p>
                </div>

                {/* Legal Warning Section */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <FiAlertTriangle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800 text-lg mb-3">
                        Important Legal Declaration
                      </h4>

                      {/* Checkbox with Legal Text */}
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isLoading}
                          onChange={(e) => setIsChecked(e.target.checked)}
                          className="w-5 h-5 text-[#3C8F63] border-gray-300 rounded focus:ring-[#3C8F63] mt-1 flex-shrink-0"
                        />
                        <div className="space-y-3">
                          <p className="text-red-700 font-medium">
                            I solemnly declare that all information provided in
                            my profile is true, accurate, and complete to the
                            best of my knowledge.
                          </p>

                          <div className="text-red-600 text-base space-y-2">
                            <div className="flex items-start gap-2">
                              <FiLock
                                size={16}
                                className="mt-0.5 flex-shrink-0"
                              />
                              <span>
                                <strong>Job Hunting Crime Act:</strong>{" "}
                                Providing false information may result in
                                account suspension for 30 days to permanent ban
                              </span>
                            </div>

                            <div className="flex items-start gap-2">
                              <FiLock
                                size={16}
                                className="mt-0.5 flex-shrink-0"
                              />
                              <span>
                                <strong>Digital Security Act 2018:</strong>{" "}
                                Misrepresentation can lead to legal actions
                                under sections 21, 25, and 31
                              </span>
                            </div>

                            <div className="flex items-start gap-2">
                              <FiLock
                                size={16}
                                className="mt-0.5 flex-shrink-0"
                              />
                              <span>
                                <strong>Penalty:</strong> Severe violations may
                                involve higher penalties according to the nature
                                of misinformation
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Transfer Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FiSend className="text-blue-600 text-xl mt-0.5" />
                    <div className="text-blue-800 text-base">
                      <span className="font-semibold">Note:</span> All your
                      profile data including personal information, company
                      details, documents, and contact information will be
                      transferred to admin for verification.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 sticky bottom-0 mt-6 -mx-6 -mb-4">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleCloseModal}
                    className="btn btn-outline h-[50px] px-6 text-base border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!isChecked || !isProfileComplete || isLoading}
                    className={`btn h-[50px] px-6 text-base ${
                      !isChecked || !isProfileComplete
                        ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#2d7a52] text-white"
                    }`}
                  >
                    <FiSend className="mr-2" />
                    {isLoading ? "Sending..." : "Send Verification Request"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default VerifyMessage;
