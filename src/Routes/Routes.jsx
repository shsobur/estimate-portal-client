// File__
import Main from "../MainLayout/Main";
import Jobs from "../MainLayout/Pages/Jobs/Jobs";
import Dashboard from "../DashboardLayout/Dashboard";
import Chat from "../DashboardLayout/Pages/Chat/Chat";
import JobDetails from "../MainLayout/Pages/JobDetails/JobDetails";
import SignIn from "../MainLayout/Pages/Authentication/SignIn/SignIn";
import SignUp from "../MainLayout/Pages/Authentication/SignUp/SignUp";
import UserProfile from "../MainLayout/Pages/UserProfile/UserProfile";
import UserList from "../DashboardLayout/Pages/Admin/UserList/UserList";
import HomeLayout from "../MainLayout/Pages/HomePageLayout/HomeLayout/HomeLayout";
import RecPostJob from "../DashboardLayout/Pages/Recruiter/RecPostJob/RecPostJob";
import RecruiterProfile from "../MainLayout/Pages/RecruiterProfile/RecruiterProfile";
import RecOverview from "../DashboardLayout/Pages/Recruiter/RecOverview/RecOverview";
import AdminOverview from "../DashboardLayout/Pages/Admin/AdminOverview/AdminOverview";
import VerifyCompany from "../DashboardLayout/Pages/Admin/VerifyCompany/VerifyCompany";
import UserOverview from "../DashboardLayout/Pages/JobSeeker/UserOverview/UserOverview";
import MyApplication from "../DashboardLayout/Pages/JobSeeker/MyApplication/MyApplication";
import RecApplications from "../DashboardLayout/Pages/Recruiter/RecApplications/RecApplications";

// Package__
import { createBrowserRouter } from "react-router-dom";
import RecAllJobPost from "../DashboardLayout/Pages/Recruiter/RecAllJobPost/RecAllJobPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <HomeLayout></HomeLayout>,
      },
      {
        path: "/jobs",
        element: <Jobs></Jobs>,
      },
      {
        path: "/recruiter-profile/:email",
        element: <RecruiterProfile></RecruiterProfile>,
        loader: ({ params }) =>
          fetch(
            `http://localhost:5000/common-api/profile-data/${params.email}`,
          ),
      },
      {
        path: "/job-details/:id",
        element: <JobDetails></JobDetails>,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/common-api/job-details/${params.id}`),
      },
      {
        path: "/recruiter-profile",
        element: <RecruiterProfile></RecruiterProfile>,
      },
      {
        path: "/user-profile",
        element: <UserProfile></UserProfile>,
      },
      {
        path: "/sign-up",
        element: <SignUp></SignUp>,
      },
      {
        path: "/sign-in",
        element: <SignIn></SignIn>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      // Admin routes__
      {
        path: "/dashboard/admin-overview",
        element: <AdminOverview></AdminOverview>,
      },
      {
        path: "/dashboard/verify-company",
        element: <VerifyCompany></VerifyCompany>,
      },

      {
        path: "/dashboard/user-list",
        element: <UserList></UserList>,
      },

      {
        path: "/dashboard/admin-chat",
        element: <Chat></Chat>,
      },

      // Recruiter routes__
      {
        path: "/dashboard/recruiter-overview",
        element: <RecOverview></RecOverview>,
      },
      {
        path: "/dashboard/recruiter-post-job",
        element: <RecPostJob></RecPostJob>,
      },
      {
        path: "/dashboard/recruiter-job-applications",
        element: <RecApplications></RecApplications>,
      },
      {
        path: "/dashboard/all-job-post",
        element: <RecAllJobPost></RecAllJobPost>,
      },
      {
        path: "/dashboard/recruiter-chat",
        element: <Chat></Chat>,
      },
      // User route__
      {
        path: "/dashboard/user-overview",
        element: <UserOverview></UserOverview>,
      },
      {
        path: "/dashboard/user-chat",
        element: <Chat></Chat>,
      },
      {
        path: "/dashboard/user-my-applications",
        element: <MyApplication></MyApplication>,
      },
    ],
  },
]);

export default router;
