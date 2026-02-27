// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Compass } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-toiral-bg flex items-center justify-center overflow-hidden px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Big 404 with bounce & glow */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-8"
        >
          <h1 className="text-[180px] md:text-[220px] font-bold text-toiral-primary/10 tracking-[-10px] select-none">
            404
          </h1>
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-[120px] md:text-[150px] font-bold text-toiral-primary tracking-tighter drop-shadow-2xl">
              404
            </span>
          </motion.div>
        </motion.div>

        {/* Fun Icon */}
        <motion.div
          initial={{ rotate: -15, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mb-6 w-24 h-24 bg-white rounded-3xl shadow-soft flex items-center justify-center"
        >
          <Compass className="w-14 h-14 text-toiral-primary" />
        </motion.div>

        {/* Message */}
        <h2 className="text-4xl md:text-5xl font-bold text-toiral-dark mb-4">
          Oops! Page not found
        </h2>
        <p className="text-xl text-gray-600 max-w-md mx-auto mb-10">
          Looks like this page got lost in the project timeline.
          <br />
          Don't worry, let's get you back on track!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-3 bg-white hover:bg-toiral-light border border-toiral-primary/20 text-toiral-dark font-semibold px-8 py-4 rounded-3xl shadow-soft transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard/client/overview")} // change if you want admin
            className="flex items-center justify-center gap-3 bg-toiral-primary hover:bg-toiral-primary/90 text-white font-semibold px-8 py-4 rounded-3xl shadow-soft transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </motion.button>
        </div>

        {/* Footer text */}
        <p className="mt-12 text-sm text-gray-500">
          © 2024 Toiral Estimate. All projects are safe with us.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;