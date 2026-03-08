// Package__
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "sweetalert2/dist/sweetalert2.min.css";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// File path__
import "./index.css";
import router from "./Router/Router.jsx";
import AuthProvider from "./Provider/AuthProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
