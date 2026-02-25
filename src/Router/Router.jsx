// Packages__
import { createBrowserRouter } from "react-router-dom";

// File path__
import HomePage from "../Layout/ClientDashboard/Pages/HomePage/HomePage";
import ClientLogin from "../Layout/ClientDashboard/Pages/ClientLogin/ClientLogin";
import ClientDashboard from "../Layout/ClientDashboard/ClientDashboard";
import AdminDashboard from "../Layout/AdminDashboard/AdminDashboard";
import AdminLogin from "../Layout/AdminDashboard/Page/AdminLogin/AdminLogin";
import AdminOverview from "../Layout/AdminDashboard/Page/AdminOverview/AdminOverview";
import MainLayout from "../Layout/MainLayout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: "",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <ClientLogin></ClientLogin>,
      },
      {
        path: "/Admin-login",
        element: <AdminLogin></AdminLogin>,
      },
    ],
  },
  {
    path: "/ClientDashboard",
    errorElement: "",
    element: <ClientDashboard></ClientDashboard>,
    children: [
      {
        path: "/ClientDashboard/Client-Home",
        element: <HomePage></HomePage>,
      },
    ],
  },
  {
    path: "/AdminDashboard",
    errorElement: "",
    element: <AdminDashboard></AdminDashboard>,
    children: [
      {
        path: "/AdminDashboard/Admin-Overview",
        element: <AdminOverview></AdminOverview>,
      },
    ],
  },
]);

export default router;
