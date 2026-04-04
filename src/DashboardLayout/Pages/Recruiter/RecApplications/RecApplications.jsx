import "./RecApplications.css";
import { useEffect, useState } from "react";
import useAxios from "../../../../Hooks/Axios";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaEye,
  FaInbox,
} from "react-icons/fa";
import DigitalResume from "../../../../Components/DigitalResume/DigitalResume";
import { jhToastError } from "../../../../utils";

// Skeleton Card__
const SkeletonCard = () => (
  <div className="ra_application-card animate-pulse">
    <div className="ra_candidate-info">
      <div className="ra_candidate-avatar">
        <div className="w-14 h-14 rounded-md bg-gray-200" />
      </div>
      <div className="ra_candidate-details gap-2 flex flex-col">
        <div className="h-4 w-36 bg-gray-200 rounded-md" />
        <div className="h-3 w-24 bg-gray-100 rounded-md" />
        <div className="h-3 w-20 bg-gray-100 rounded-md" />
      </div>
    </div>
    <div className="ra_job-applied">
      <div className="h-4 w-52 bg-gray-200 rounded-md" />
    </div>
    <div className="ra_application-details">
      <div className="h-3 w-28 bg-gray-100 rounded-md" />
      <div className="h-3 w-20 bg-gray-100 rounded-md" />
      <div className="h-6 w-12 bg-gray-200 rounded-lg" />
    </div>
    <div className="ra_card-footer">
      <div className="h-10 w-full bg-gray-200 rounded-lg" />
    </div>
  </div>
);

// Empty State__
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
      <FaInbox className="text-gray-400 text-3xl" />
    </div>
    <h3 className="text-xl font-bold text-gray-700 mb-2">
      No Applications Yet
    </h3>
    <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
      When candidates apply to your job postings, their applications will appear
      here for review.
    </p>
  </div>
);

const RecApplications = () => {
  const api = useAxios();
  const [applications, setApplications] = useState([]);
  const [clickedApp, setClickedApp] = useState([]);
  const [appDataloading, setAppDataLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Get applications__
  useEffect(() => {
    const applicationsData = async () => {
      try {
        const res = await api.get("/recruiter-api/job-applications");
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        jhToastError("Failed to load applications!");
      } finally {
        setPageLoading(false);
      }
    };
    applicationsData();
  }, [api]);

  // Format time__
  const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now - past) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    if (weeks < 4) return `${weeks} weeks ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  };

  // Handle seeker data__
  const handleSeekerData = async (seekerId) => {
    setAppDataLoading(true);

    if (!seekerId) {
      jhToastError("This application has some problem!");
      setAppDataLoading(false);
      return;
    }

    try {
      const res = await api.get(`/recruiter-api/resume-data/${seekerId}`);
      if (res.status === 200) {
        setClickedApp(res.data);
        document.getElementById("rec_digital_Resume").showModal();
      }
    } catch {
      jhToastError("Failed to load resume data!");
    } finally {
      setAppDataLoading(false);
    }
  };

  // Handle application status__
  const handleApplicationStatus = async (id, currentStatus) => {
    try {
      if (currentStatus !== "new") return;

      await api.patch(`/recruiter-api/job-applications/${id}`, {
        status: "seen",
      });

      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: "seen" } : app)),
      );
    } catch (error) {
      console.error("Error updating application status:", error);
      jhToastError("Failed to update application status!");
    }
  };

  return (
    <>
      <DigitalResume
        applicationId={applicationId}
        clickedApp={clickedApp}
        resumeLink={applications.resumeLink}
      />
      <section className="ra_section">
        <div className="ra_container">
          {/* Section Header */}
          <div className="ra_header">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="ra_header-title">
                  Recent{" "}
                  <span className="ra_highlighted-text">Applications</span>
                </h2>
                <p className="ra_header-description">
                  Review and manage job applications from candidates. Stay
                  updated with new submissions.
                </p>
              </div>
              {/* Application Count Badge */}
              {!pageLoading && applications.length > 0 && (
                <div className="self-start sm:self-center shrink-0 px-4 py-1.5 bg-[#3c8f63]/10 text-[#3c8f63] text-sm font-semibold rounded-full border border-[#3c8f63]/20">
                  {applications.length}{" "}
                  {applications.length === 1 ? "Application" : "Applications"}
                </div>
              )}
            </div>
          </div>

          {/* Skeleton Loading */}
          {pageLoading && (
            <div className="ra_applications-list">
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!pageLoading && applications.length === 0 && <EmptyState />}

          {/* Applications List */}
          {!pageLoading && applications.length > 0 && (
            <div className="ra_applications-list">
              {applications.map((app) => (
                <div key={app._id} className="ra_application-card">
                  {/* Card Header - Candidate Info */}
                  <div className="ra_candidate-info">
                    <div className="ra_candidate-avatar">
                      <img
                        src={app.seekerImage}
                        alt={app.seekerName}
                        className="rounded-md w-14 h-14 object-cover"
                      />
                    </div>
                    <div className="ra_candidate-details">
                      <h3 className="ra_candidate-name">{app?.seekerName}</h3>
                      <div className="ra_candidate-meta">
                        <span className="ra_candidate-title">
                          <b>{app?.seekerProject}</b> Project Added
                        </span>
                        <span className="ra_candidate-experience">
                          {app?.seekerExp} Experience Added
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Applied Job Info */}
                  <div className="ra_job-applied">
                    <h4 className="ra_applied-job-title">
                      <FaBriefcase className="ra_job-icon" />
                      Applied for: {app?.positionName}
                    </h4>
                  </div>

                  {/* Application Details */}
                  <div className="ra_application-details">
                    <div className="ra_detail-item">
                      <FaMapMarkerAlt className="ra_detail-icon" />
                      <span>
                        {app?.seekerLocation?.city},{" "}
                        {app?.seekerLocation?.country}
                      </span>
                    </div>
                    <div className="ra_detail-item">
                      <FaClock className="ra_detail-icon" />
                      <span>{timeAgo(app.applyTime)}</span>
                    </div>
                    <div className="ra_detail-item">
                      {app.status === "new" ? (
                        <span className="py-1 px-2.5 bg-red-500 text-white text-xs rounded-lg font-bold tracking-wide">
                          New
                        </span>
                      ) : (
                        <span className="py-1 px-2.5 bg-blue-500 text-white text-xs rounded-lg font-bold tracking-wide">
                          Seen
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ra_card-footer">
                    <button
                      disabled={appDataloading}
                      onClick={() => {
                        handleSeekerData(app.seekerId);
                        handleApplicationStatus(app._id, app.status);
                        setApplicationId(app._id);
                      }}
                      className="ra_view-btn"
                    >
                      {appDataloading ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          View Full Application
                          <FaEye className="ra_btn-icon" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default RecApplications;