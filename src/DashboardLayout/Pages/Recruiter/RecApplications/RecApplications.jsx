import "./RecApplications.css";
import { useEffect, useState } from "react";
import useAxios from "../../../../Hooks/Axios";
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaEye } from "react-icons/fa";
import DigitalResume from "../../../../Components/DigitalResume/DigitalResume";
import { jhToastError } from "../../../../utils";

const RecApplications = () => {
  const api = useAxios();
  const [applications, setApplications] = useState([]);
  const [clickedApp, setClickedApp] = useState([]);
  const [appDataloading, setAppDataLoading] = useState(false);

  // Get applications__
  useEffect(() => {
    const applicationsData = async () => {
      const res = await api.get("/recruiter-api/job-applications");
      setApplications(res.data);
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
      jhToastError("This application have some problem!");
      return
    }

    const res = await api.get(`/recruiter-api/resume-data/${seekerId}`)
    if(res.status === 200) {
      setClickedApp(res.data);
      setAppDataLoading(false);
      document.getElementById("rec_digital_Resume").showModal();
    }
  };

  return (
    <>
      <DigitalResume clickedApp={clickedApp} resumeLink={applications.resumeLink}></DigitalResume>
      <section className="ra_section">
        <div className="ra_container">
          {/* Section Header */}
          <div className="ra_header">
            <h2 className="ra_header-title">
              Recent <span className="ra_highlighted-text">Applications</span>
            </h2>
            <p className="ra_header-description">
              Review and manage job applications from candidates. Stay updated
              with new submissions.
            </p>
          </div>

          {/* Applications List */}
          <div className="ra_applications-list">
            {applications.map((app) => (
              <div key={app._id} className="ra_application-card">
                {/* Status Badge */}
                {/* <div className={`ra_status-badge ra_status-${app?.status}`}>
                {app?.status?.charAt(0)?.toUpperCase() + app?.status?.slice(1)}
              </div> */}

                {/* Card Header - Candidate Info */}
                <div className="ra_candidate-info">
                  <div className="ra_candidate-avatar">
                    <img
                      src={app.seekerImage}
                      alt="image"
                      className="rounded-md"
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
                      {app?.seekerLocation.city}, {app?.seekerLocation.country}
                    </span>
                  </div>
                  <div className="ra_detail-item">
                    <FaClock className="ra_detail-icon" />
                    <span>{timeAgo(app.applyTime)}</span>
                  </div>
                  <div className="ra_detail-item">
                    <span className="py-1 px-2 bg-red-500 text-white rounded-lg font-bold">
                      New
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="ra_card-footer">
                  <button
                    disabled={appDataloading}
                    onClick={() => handleSeekerData(app.seekerId)}
                    className="ra_view-btn"
                  >
                    {appDataloading ? "Prosing..." : "View Full Application"}

                    <FaEye className="ra_btn-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecApplications;
