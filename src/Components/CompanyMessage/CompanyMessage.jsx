import { useState } from "react";
import {
  FaTimes,
  FaCheck,
  FaTimesCircle,
  FaBuilding,
  FaEnvelope,
  FaCalendar,
  FaPaperclip,
} from "react-icons/fa";
import useAxios from "../../Hooks/Axios";
import emailjs from "@emailjs/browser";
import { jhConfirm, jhError, jhSuccess, jhToastInfo } from "../../utils";

const CompanyMessage = ({ companyMessage }) => {
  const api = useAxios();
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);

    const newCompanyData = {
      companyId: companyMessage.companyId,
      companyName: companyMessage.companyName,
      email: companyMessage.email,
      isVerify: "Verified",
      isBlock: false,
      blockTime: 0,
    };

    const templateParams = {
      to_email: companyMessage.email,
      companyName: companyMessage.companyName,
    };

    handleCloseModal();

    jhConfirm({
      title: "Are you sure?",
      text: "You want to approve this company?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.put(
            `/admin-api/company-verify-approve-data/${companyMessage._id}`,
            newCompanyData
          );

          if (res.data.modifiedCount > 0) {
            const res = await api.patch(
              `/admin-api/company-profile-status/${companyMessage.email}`
            );
            if (res.data.modifiedCount > 0) {
              jhSuccess({
                title: "Success",
                text: "Company Approved Successfully",
              });

              emailjs
                .send(
                  import.meta.env.VITE_SECOND_EMAIL_SERVICE_ID,
                  import.meta.env.VITE_SECOND_EMAIL_TEMPLATE_ID,
                  templateParams,
                  import.meta.env.VITE_SECOND_EMAIL_PUBLIC_KEY,
                )
                .then(() => {
                  console.log("Email send");
                  jhToastInfo("Email send to company");
                })
                .catch(err => {
                  console.log("Email send failed",err);
                })
            } else {
              jhError({
                title: "Error",
                text: "Profile updated, but company profile update failed",
              });
            }

            handleCloseModal();
          } else {
            jhError({
              title: "Error",
              text: "Failed to approve. Please try again.",
            });
          }
        } catch (error) {
          console.error("Approval error:", error);
          jhError({
            title: "Error",
            text: "Something went wrong. Please try again.",
          });
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
        const modal = document.getElementById("company_verify_message");
        modal.showModal();
      }
    });
  };

  const handleReject = () => {
    if (!isRejecting) {
      setIsRejecting(true);
      return;
    }

    if (!rejectReason.trim()) {
      jhToastInfo("Please provide a reason for rejection");
      return;
    }

    setIsSubmitting(false);
    setIsRejecting(false);
    setRejectReason("");
    handleCloseModal();
  };

  const handleCancelReject = () => {
    setIsRejecting(false);
    setRejectReason("");
  };

  const handleCloseModal = () => {
    setIsRejecting(false);
    setRejectReason("");
    const modal = document.getElementById("company_verify_message");
    modal.close();
  };

  return (
    <dialog id="company_verify_message" className="modal">
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaPaperclip className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Verification Request
              </h2>
              <p className="text-gray-600 text-sm">
                Review company verification details
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-6">
            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-gray-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-semibold text-gray-800">
                      {companyMessage?.companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">
                      {companyMessage?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaCalendar className="text-gray-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">Submitted On</p>
                    <p className="font-semibold text-gray-800">
                      {companyMessage?.submittedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 text-center">
                    <span className="text-gray-500 text-lg">#</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Subject</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {companyMessage?.subject}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <FaPaperclip className="text-gray-500" />
                Verification Message
              </h3>

              <div className="bg-white border-2 border-gray-300 rounded-xl p-4">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {companyMessage?.message}
                </div>
              </div>
            </div>

            {/* Rejection Reason Input */}
            {isRejecting && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                    <FaTimesCircle className="text-red-500" />
                    Reason for Rejection
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a clear reason why you are rejecting this verification request. This message will be sent to the company..."
                    rows="4"
                    className="textarea textarea-bordered w-full text-base border-2 border-gray-300 focus:border-red-500 focus:outline-none rounded-lg resize-none"
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500">
                    {rejectReason?.length}/500 characters
                  </p>
                </div>

                {/* Rejection Tip */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaTimesCircle className="text-red-600 text-xl mt-0.5" />
                    <div className="text-red-800 text-base">
                      <span className="font-semibold">Note:</span> Please
                      provide constructive feedback to help the company
                      understand what needs to be improved for successful
                      verification.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FaCheck className="text-blue-600 text-xl mt-0.5" />
                <div className="text-blue-800 text-base">
                  <span className="font-semibold">
                    Verification Guidelines:
                  </span>{" "}
                  Please review the company's information thoroughly before
                  making a decision. Ensure all provided documents and
                  information meet our verification standards.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="border-t bg-gray-50 px-6 py-4 sticky bottom-0 rounded-b-lg">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            {!isRejecting ? (
              <>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className={`btn h-[50px] px-6 text-base ${
                    isSubmitting
                      ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 border-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  <FaTimesCircle className="mr-2" />
                  Reject Request
                </button>

                <button
                  onClick={handleAccept}
                  disabled={isSubmitting}
                  className={`btn h-[50px] px-6 text-base ${
                    isSubmitting
                      ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#3C8F63] border-[#3C8F63] hover:bg-[#2d7a52] text-white"
                  }`}
                >
                  <FaCheck className="mr-2" />
                  {isSubmitting ? "Processing..." : "Approve Verification"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancelReject}
                  disabled={isSubmitting}
                  className="btn btn-outline h-[50px] px-6 text-base border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>

                <button
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectReason.trim()}
                  className={`btn h-[50px] px-6 text-base ${
                    isSubmitting || !rejectReason.trim()
                      ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 border-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  <FaTimesCircle className="mr-2" />
                  {isSubmitting ? "Submitting..." : "Confirm Rejection"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default CompanyMessage;
