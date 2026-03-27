import { useContext, useState } from "react";
import {
  FaTimes,
  FaRegLightbulb,
  FaCloudUploadAlt,
  FaRegFilePdf,
  FaMapMarkerAlt,
  FaBriefcase,
  FaLaptop,
  FaDollarSign,
} from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router";
import useUserData from "../../Hooks/userData";
import useAxios from "../../Hooks/Axios";
import { jhConfirm, jhError, jhSuccess, jhWarning } from "../../utils";

const JobApply = ({ jobData }) => {
  const api = useAxios();
  const { profile } = useUserData();
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [resumeLink, setResumeLink] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleApplyJob = async () => {
    if (!user) {
      handleCloseModal();

      jhConfirm({
        title: "Opps! You are not logged in",
        text: "Would you like to logged in now?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Log in",
        cancelButtonText: "Later",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/sign-in");
        }
        document.getElementById("job_apply_modal").showModal();
      });

      return;
    }

    const applyData = {
      applyTime: new Date(),
      jobPostId: jobData._id,
      resumeLink: resumeLink === "" ? "No link provide" : resumeLink,
      companyEmail: jobData.companyEmail,
      applicantEmail: user.email,
      positionName: jobData.position,
      seekerId: profile._id,
      seekerImage: profile.profilePhoto,
      seekerName: profile.userName,
      seekerExp: profile.experience.length,
      seekerProject: profile.projects.length,
      seekerLocation: profile.location
    };

    const seekerId = profile._id;

    setSubmitLoading(true);
    const res = await api.post(`/user-api/apply-job/${user.email}`, applyData);

    if (res.data.insertedId) {
      jhSuccess({
        title: "Success!",
        text: "Job apply successfully",
      });

      const res2 = await api.patch(
        `/user-api/update-job-details/${jobData._id}`,
        { seekerId }
      );
      if (res2.data.modifiedCount > 0) {
        navigate("/jobs");
        setSubmitLoading(false);
      }
    } else if (res.data.status === 402) {
      setSubmitLoading(false);

      jhWarning({
        title: "Warning!",
        text: "We find some illegal actions. Please login again",
      });

      logOut()
        .then(() => {
          navigate("/sign-in");
        })
        .catch(() => {
          jhError({
            title: "Error!",
            text: "Failed to log out. Please try again.",
          });
        });
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("job_apply_modal");
    modal.close();
  };

  return (
    <>
      <dialog
        id="job_apply_modal"
        className="modal flex items-center justify-center"
      >
        <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Apply for Position
              </h2>
              <button
                onClick={() =>
                  document.getElementById("job_apply_modal").close()
                }
                className="btn btn-ghost btn-circle"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <form className="px-6 py-4 space-y-6">
              {/* Job Information Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Job Details
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {jobData?.position}
                      </h4>
                      <p className="text-gray-700 font-medium">
                        {jobData?.companyName}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {jobData?.workplaceType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <span>
                        {jobData?.country}, {jobData?.city}, {jobData?.area}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaBriefcase className="text-gray-500" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaLaptop className="text-gray-500" />
                      <span>Remote</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaDollarSign className="text-gray-500" />
                      <span>
                        {jobData?.salaryRange?.min} -{" "}
                        {jobData?.salaryRange?.max}{" "}
                        {jobData?.salaryRange?.currency} /{" "}
                        {jobData?.salaryRange?.period}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Resume Section */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaRegFilePdf className="text-blue-600 text-xl mt-0.5" />
                    <div className="text-blue-800 text-base">
                      <span className="font-semibold">
                        Digital Resume Created:
                      </span>{" "}
                      We've automatically generated a digital resume based on
                      your profile. Recruiters will be able to view this when
                      you apply.
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Resume Upload Section */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                  <FaCloudUploadAlt className="text-[#3C8F63] text-lg" />
                  Upload Custom Resume (Optional)
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 font-medium text-gray-700 text-lg">
                      <FaRegFilePdf className="text-red-500" />
                      Google Drive Resume URL
                    </label>
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        placeholder="https://drive.google.com/file/d/your-file-id/view"
                        className="input input-bordered w-full h-[55px] text-base border-2 border-gray-300 focus:border-[#3C8F63] focus:outline-none rounded-lg"
                      />
                      <p className="text-sm text-gray-500">
                        Upload your resume to Google Drive and paste the
                        shareable link here.
                        <strong>
                          {" "}
                          Make sure the link is set to{" "}
                          <b>"Anyone with the link can view</b>"
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Upload Instructions */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <FaCloudUploadAlt className="text-yellow-600 text-xl mt-0.5" />
                      <div className="text-yellow-800 text-sm">
                        <span className="font-semibold">How to upload:</span>
                        <ol className="list-decimal list-inside mt-1 space-y-1">
                          <li>
                            Go to{" "}
                            <a
                              href="https://drive.google.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline font-medium"
                            >
                              Google Drive
                            </a>
                          </li>
                          <li>Upload your resume PDF</li>
                          <li>
                            Right-click the file → Share → General access →
                            Change to "Anyone with the link"
                          </li>
                          <li>Copy the link and paste it above</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Tips */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaRegLightbulb className="text-green-600 text-xl mt-0.5" />
                  <div className="text-green-800 text-base">
                    <span className="font-semibold italic">Tip:</span> Ensure
                    your <strong>digital resume</strong> is up-to-date. Adding a
                    custom resume can help highlight specific experiences
                    relevant to this position.
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
                onClick={() =>
                  document.getElementById("job_apply_modal").close()
                }
                className="btn btn-outline h-[50px] sm:px-6 px-2 text-base border-gray-300 hover:bg-gray-50"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitLoading}
                onClick={handleApplyJob}
                className="btn h-[50px] px-6 text-base bg-[#3C8F63] border-[#3C8F63] hover:bg-[#2d7a52] text-white"
              >
                {submitLoading ? "Submitting" : "Submit Application"}
              </button>
            </div>
          </div>
        </div>

        {/* DaisyUI Modal Backdrop - Click to Close */}
        <form method="dialog">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default JobApply;
