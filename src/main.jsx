// Package__
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// File path__
import "./index.css";
import router from "./Router/Router.jsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);