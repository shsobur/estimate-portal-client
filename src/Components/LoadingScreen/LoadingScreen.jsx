/* eslint-disable no-unused-vars */
// LoadingScreen.jsx
import { motion } from "motion/react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white px-6 py-4 rounded-2xl shadow-lg text-center"
      >
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-gray-700 text-lg font-medium">
          Loading your user data…
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
