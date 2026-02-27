import { useState, useMemo } from "react";
import axios from "axios";

const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL:
        import.meta.env.VITE_SERVER_API_URL || "http://localhost:5000",
      withCredentials: true,
      timeout: 20000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        setLoading(true);
        setError(null); // clear old error
        console.log("Request sent to:", config.url);
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        setLoading(false);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        setError(errorMsg);

        console.error("API Error:", errorMsg);
        return Promise.reject(error);
      },
    );

    return instance;
  }, []);

  const clearError = () => setError(null);

  return {
    api,
    loading,
    error,
    clearError,
  };
};

export default useAxios;