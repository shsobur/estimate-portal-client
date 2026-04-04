// Package__
import { useContext } from "react";
import { MdDescription } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

// File path__
import useAxios from "../../Hooks/Axios";
import useSocket from "../../Hooks/useSocket";
import { AuthContext } from "../../Context/AuthContext";
import {
  getRecruiterWelcomeMessage,
  jhConfirm,
  jhToastError,
  jhToastSuccess,
} from "../../utils";
import DigitalResumeContent from "../DigitalResumeContent/DigitalResumeContent";
import SeekerModalHeader from "../../Shared/SeekerModalHeader/SeekerModalHeader";

const DigitalResume = ({ clickedApp, resumeLink, applicationId }) => {
  const api = useAxios();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { user } = useContext(AuthContext);

  const handleCloseModal = () => {
    const modal = document.getElementById("rec_digital_Resume");
    if (modal) modal.close();
  };

  // Handle Accept button click
  const handleAcceptCandidate = async () => {
    if (!clickedApp) {
      console.error("No candidate data available");
      return;
    }

    try {
      const candidateEmail = clickedApp.userEmail;
      const candidateName = clickedApp.userName || "Candidate";
      const recruiterEmail = user?.email;

      if (!recruiterEmail) {
        redirectToChat();
        return;
      }

      const welcomeMessage = getRecruiterWelcomeMessage(
        candidateName,
        recruiterEmail,
      );

      if (socket && isConnected) {
        socket.emit("send_auto_message", {
          to: candidateEmail,
          from: recruiterEmail,
          text: welcomeMessage,
          timestamp: new Date().toISOString(),
        });

        socket.once("auto_message_sent", (data) => {
          console.log("Auto message sent successfully:", data);
        });

        socket.once("auto_message_error", (error) => {
          console.error("Auto message failed:", error);
        });
      }

      // Update isAccept to true
      await api.patch(`/recruiter-api/job-applications/${applicationId}`, {
        isAccept: true,
      });

      handleCloseModal();
      redirectToChat();
    } catch (error) {
      console.error("Error accepting candidate:", error);
      redirectToChat();
    }
  };

  // Helper function to redirect to chat
  const redirectToChat = () => {
    navigate("/dashboard/recruiter-chat", {
      state: {
        selectedUser: {
          email: clickedApp.userEmail,
          name: clickedApp.userName || "Candidate",
          role: "Job Seeker",
          image: clickedApp.profilePhoto || "",
          _id: clickedApp.userId || clickedApp._id,
        },
      },
    });
  };

  const handleRejectCandidate = async () => {
    // 1. Close modal first so alert appears on top
    handleCloseModal();

    // 2. Show confirmation alert
    const result = await jhConfirm({
      title: "Reject Application?",
      text: "Are you sure you want to reject this candidate? This action cannot be undone.",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      icon: "warning",
    });

    // 3. If cancelled → reopen the modal
    if (!result.isConfirmed) {
      document.getElementById("rec_digital_Resume").showModal();
      return;
    }

    // 4. If confirmed → call PUT route
    try {
      await api.put(`/recruiter-api/job-applications/${applicationId}`);
      jhToastSuccess("Application rejected successfully!");
    } catch (error) {
      console.error("Error rejecting application:", error);
      jhToastError("Failed to reject application!");
    }
  };

  return (
    <>
      <div>
        <dialog id="rec_digital_Resume" className="modal">
          <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
            {/* Header - Standard Modal Header */}
            <SeekerModalHeader
              title="Digital Resume"
              handleCloseModal={handleCloseModal}
            />

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Main Content - Digital Resume will go here */}
              <div className="p-6">
                {/* Digital Resume Content Area */}
                <div className="mb-8">
                  <DigitalResumeContent
                    clickedApp={clickedApp}
                    resumeLink={resumeLink}
                  ></DigitalResumeContent>
                </div>

                {/* Standard Tip Box */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <MdDescription className="text-green-600 text-xl mt-0.5" />
                    <div className="text-green-800 text-base">
                      <span className="font-semibold">Tip:</span> Review the
                      candidate's resume thoroughly before making a decision.
                      Check for relevant experience, skills, and qualifications
                      that match your job requirements.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Only */}
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex justify-end gap-3">
                {/* Reject Button */}
                <button
                  onClick={handleRejectCandidate}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:bg-red-100 transition-all duration-200 flex items-center gap-2"
                >
                  <FaTimes className="h-4 w-4" />
                  <span>Reject</span>
                </button>

                {/* Accept Button - UPDATED */}
                <button
                  onClick={handleAcceptCandidate}
                  className="px-5 py-2.5 bg-[#3c8f63] text-white rounded-lg font-medium hover:bg-emerald-600 active:bg-emerald-700 transition-all duration-200 flex items-center gap-2"
                >
                  <FaCheck className="h-4 w-4" />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal backdrop click to close */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCloseModal}>close</button>
          </form>
        </dialog>
      </div>
    </>
  );
};

export default DigitalResume;
