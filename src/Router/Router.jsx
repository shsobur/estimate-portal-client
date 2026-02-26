import { createBrowserRouter } from "react-router-dom";

import ClientLogin from "../Layout/MainLayout/Pages/ClientLogin/ClientLogin";
import AdminLogin from "../Layout/MainLayout/Pages/AdminLogin/AdminLogin";

import MainLayout from "../Layout/MainLayout/MainLayout";
import Dashboard from "../Layout/Dashboard/Dashboard";
import ClientOverview from "../Layout/Dashboard/ClientPages/ClientOverview/ClientOverview";
import AdminOverview from "../Layout/Dashboard/AdminPages/AdminOverview/AdminOverview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ClientLogin />,
      },
      {
        path: "admin-login",
        element: <AdminLogin />,
      },
    ],
  },

  {
    path: "/dashboard/client",
    element: <Dashboard role="client" />,
    children: [
      {
        path: "/dashboard/client/overview",
        element: <ClientOverview />,
      },
    ],
  },

  {
    path: "/dashboard/admin",
    element: <Dashboard role="admin" />,
    children: [
      {
        path: "/dashboard/admin/overview",
        element: <AdminOverview />,
      },
    ],
  },
]);

export default router;