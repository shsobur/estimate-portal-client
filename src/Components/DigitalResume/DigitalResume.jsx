import { MdDescription } from "react-icons/md";
import SeekerModalHeader from "../../Shared/SeekerModalHeader/SeekerModalHeader";
import { FaCheck, FaTimes } from "react-icons/fa";
import DigitalResumeContent from "../DigitalResumeContent/DigitalResumeContent";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import useSocket from "../../Hooks/useSocket";
import { AuthContext } from "../../Context/AuthContext";
import { getRecruiterWelcomeMessage } from "../../utils";

const DigitalResume = ({ clickedApp, resumeLink }) => {
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
      // 1. Get candidate info
      const candidateEmail = clickedApp.userEmail;
      const candidateName = clickedApp.userName || "Candidate";
      const recruiterEmail = user?.email;

      if (!recruiterEmail) {
        console.error("Recruiter email not found");
        // Still redirect to chat
        redirectToChat();
        return;
      }

      // 2. Prepare auto message
      const welcomeMessage = getRecruiterWelcomeMessage(
        candidateName,
        recruiterEmail
      );

      // 3. Send auto message via socket
      if (socket && isConnected) {
        console.log("📤 Sending auto message to:", candidateEmail);

        socket.emit("send_auto_message", {
          to: candidateEmail,
          from: recruiterEmail,
          text: welcomeMessage,
          timestamp: new Date().toISOString(),
        });

        // Listen for confirmation
        socket.once("auto_message_sent", (data) => {
          console.log("Auto message sent successfully:", data);
          handleAcceptApplication();
        });

        socket.once("auto_message_error", (error) => {
          console.error("Auto message failed:", error);
        });
      } else {
        console.warn(
          "Socket not connected, auto message will be sent when connected"
        );
        // You might want to store this message to send later
      }

      // 4. Close modal
      handleCloseModal();

      // 5. Redirect to recruiter chat
      redirectToChat();
    } catch (error) {
      console.error("Error accepting candidate:", error);
      // Still redirect to chat even if message fails
      redirectToChat();
    }
  };

  // After accept application__
  const handleAcceptApplication = () => {
    // __
  }

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

  const handleRejectCandidate = () => {
    console.log("Candidate rejected:", clickedApp.userEmail);
    handleCloseModal();
    // Reject logic here__
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
