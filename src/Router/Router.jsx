// Packages__
import { createBrowserRouter } from "react-router-dom";

// File path__
import MainLayout from "../Layout/MainLayout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout/DashboardLayout";
import HomePage from "../Layout/MainLayout/Pages/HomePage/HomePage";
<<<<<<< HEAD
import ClientLogin from "../Layout/MainLayout/Pages/ClientLogin/ClientLogin";
=======
>>>>>>> dcb14d45f3aece23ac343a4192c29ef0338a58f7

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: "",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
<<<<<<< HEAD
        element: <ClientLogin></ClientLogin>
      },
      {
        path: "/",
=======
>>>>>>> dcb14d45f3aece23ac343a4192c29ef0338a58f7
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