import { createBrowserRouter } from "react-router-dom";

import ClientLogin from "../Layout/MainLayout/Pages/ClientLogin/ClientLogin";
import AdminLogin from "../Layout/MainLayout/Pages/AdminLogin/AdminLogin";

import MainLayout from "../Layout/MainLayout/MainLayout";
import Dashboard from "../Layout/Dashboard/Dashboard";
import ClientOverview from "../Layout/Dashboard/ClientPages/ClientOverview/ClientOverview";
import AdminOverview from "../Layout/Dashboard/AdminPages/AdminOverview/AdminOverview";
import ErrorPage from "../Layout/Components/ErrorPage/ErrorPage";
import AddClient from "../Layout/Dashboard/AdminPages/AddClient/AddClient";
import AddProject from "../Layout/Dashboard/AdminPages/AddProject/AddProject";
import ViewProject from "../Layout/Dashboard/AdminPages/ViewProject/ViewProject";

import ProjectOverview from "../Layout/Components/ProjectOverview/ProjectOverview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage></ErrorPage>,
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
    errorElement: <ErrorPage></ErrorPage>,
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
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/dashboard/admin/overview",
        element: <AdminOverview />,
      },
      {
        path: "/dashboard/admin/add-client",
        element: <AddClient></AddClient>,
      },
      {
        path: "/dashboard/admin/add-project",
        element: <AddProject></AddProject>,
      },
      {
        path: "/dashboard/admin/view-project/:projectId",
        element: <ViewProject></ViewProject>,
        children: [          
          {
            index: true,
            path: "overview",
            element: <ProjectOverview></ProjectOverview>,
          },
        ],
      },
    ],
  },
]);

export default router;
