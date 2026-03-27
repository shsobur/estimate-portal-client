import axios from "axios";
import { useMemo } from "react";

const useAxios = () => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_SERVER_API_URL,
      withCredentials: true,
      timeout: 20000,
    });

    // Request interceptor (for logging/debugging)__
    instance.interceptors.request.use(
      (config) => {
        console.log("Request sent to:", config.url);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor (handle errors globally)__
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === "ECONNABORTED") {
          console.error("Request timeout");
        } else if (error.response) {
          console.error("Server error:", error.response.status);
        } else {
          console.error("Network error");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return axiosInstance;
};

export default useAxios;