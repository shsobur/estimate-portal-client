// Packages__
import { createBrowserRouter } from "react-router-dom";

// File path__
import MainLayout from "../Layout/MainLayout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout/DashboardLayout";
import HomePage from "../Layout/MainLayout/Pages/HomePage/HomePage";
import ClientLogin from "../Layout/MainLayout/Pages/ClientLogin/ClientLogin";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: "",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <ClientLogin></ClientLogin>
      },
      {
        path: "/",
        element: <HomePage></HomePage>,
      },
    ],
  },
  {
    path: "/Dashboard",
    errorElement: "",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        // Dashboard components hear__
      },
    ],
  },
]);

export default router;