// File__
import "./index.css";
import "./AlertStyle/Alert.css";
import router from "./Routes/Routes.jsx";
import AuthProvider from "./Provider/AuthProvider.jsx";

// Package__
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SocketProvider from "./Provider/SocketProvider.jsx";

// TenStackQuery__
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </SocketProvider>
    </QueryClientProvider>
  </StrictMode>
);