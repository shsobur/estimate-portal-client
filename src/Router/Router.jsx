// Packages__
import { createBrowserRouter } from "react-router-dom";

// File path__
import HomePage from "../Layout/ClientDashboard/Pages/HomePage/HomePage";
import ClientLogin from "../Layout/ClientDashboard/Pages/ClientLogin/ClientLogin";
import ClientDashboard from "../Layout/ClientDashboard/ClientDashboard";
import AdminDashboard from "../Layout/AdminDashboard/AdminDashboard";
import AdminLogin from "../Layout/AdminDashboard/Page/AdminLogin/AdminLogin";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: "",
    element: <ClientDashboard></ClientDashboard>,
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
    element: <AdminDashboard></AdminDashboard>,
    children: [
      {
        path: "/Dashboard/AdminLogin",
        element: <AdminLogin></AdminLogin>,
      },
    ],
  },
]);

export default router;