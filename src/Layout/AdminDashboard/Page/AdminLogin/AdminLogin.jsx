import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Monitor,
  PartyPopper,
  ArrowRight,
  Shield,
} from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Implement Google OAuth login flow here__
  };

  const handleSwitchToClient = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-toiral-bg flex items-center justify-center overflow-hidden">
      <div className="max-w-[1536px] mx-auto w-full px-2.5 md:px-5 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row justify-around items-center gap-10 lg:gap-16">

          {/* ==================== LEFT SIDE - JOURNEY ==================== */}
          <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 lg:pl-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full shadow-sm mb-6">
              <Sparkles className="w-5 h-5 text-toiral-primary" />
              <span className="text-sm font-medium text-toiral-dark">
                Your Project Journey
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-toiral-dark leading-tight">
              Track your project{" "}
              <span className="relative inline-block text-toiral-primary">
                every step
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-toiral-primary/30 rounded-full" />
              </span>{" "}
              of the way
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-md">
              From kickoff to launch, stay connected with real-time updates on
              your project's progress.
            </p>

            <div className="mt-12 relative pl-4">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-toiral-primary/30 to-transparent" />

              <div className="space-y-14">
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-toiral-light rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm border border-toiral-primary/20">
                    <Mail className="w-7 h-7 text-toiral-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-toiral-dark">
                      Receive Code
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Get your unique access code
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-orange-100 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Monitor className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-toiral-dark">
                      Track Progress
                    </h3>
                    <p className="text-gray-600 mt-1">
                      View real-time project updates
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-amber-100 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <PartyPopper className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-toiral-dark">
                      Celebrate Success
                    </h3>
                    <p className="text-gray-600 mt-1">
                      See your project come to life
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT SIDE - CARD ==================== */}
          <div className="flex-1 w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
              {/* Admin Shield Icon */}
              <div className="mx-auto w-20 h-20 bg-toiral-light rounded-3xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-toiral-primary" />
              </div>

              <div className="text-center mt-8 mb-10">
                <h2 className="text-3xl font-bold text-toiral-dark">
                  Admin Portal
                </h2>
                <p className="text-gray-600 mt-2">
                  Sign in to manage projects, clients &amp; team
                </p>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-semibold py-4 rounded-2xl flex items-center justify-center gap-4 text-lg transition-all hover:shadow-md cursor-pointer"
              >
                <div className="w-8 h-8 bg-toiral-primary rounded flex items-center justify-center text-white text-xl font-bold">
                  G
                </div>
                Continue with Google
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Only authorized team members can access
              </p>

              <p className="text-center mt-10 text-sm text-gray-500">
                Want to track your project?{" "}
                <button
                  onClick={handleSwitchToClient}
                  className="text-toiral-primary font-medium hover:underline"
                >
                  Switch to Client Login
                </button>
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-8">
              © 2024 Toiral Estimate. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;