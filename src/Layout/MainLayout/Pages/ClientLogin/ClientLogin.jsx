import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Mail, Monitor, PartyPopper, ArrowRight } from "lucide-react";

const ClientLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/client/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-toiral-bg flex items-center justify-center overflow-hidden">
      <div className="max-w-[1536px] mx-auto w-full px-2.5 md:px-5 py-8 lg:py-12">

        <div className="flex flex-col lg:flex-row justify-around items-center gap-10 lg:gap-16">

          {/* ==================== LEFT SIDE - JOURNEY ==================== */}
          <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 lg:pl-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full shadow-sm mb-6">
              <Sparkles className="w-5 h-5 text-toiral-primary" />
              <span className="text-sm font-medium text-toiral-dark">
                Your Project Journey
              </span>
            </div>

            {/* Heading */}
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

            {/* Journey Steps */}
            <div className="mt-12 relative pl-4">
              {/* Connecting Line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-linear-to-b from-toiral-primary/30 to-transparent" />

              <div className="space-y-14">
                {/* Step 1 */}
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-toiral-light rounded-3xl flex items-center justify-center shrink-0 shadow-sm border border-toiral-primary/20">
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

                {/* Step 2 */}
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-orange-100 rounded-3xl flex items-center justify-center shrink-0 shadow-sm">
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

                {/* Step 3 */}
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-amber-100 rounded-3xl flex items-center justify-center shrink-0 shadow-sm">
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
              {/* Mail Icon */}
              <div className="mx-auto w-20 h-20 bg-toiral-light rounded-3xl flex items-center justify-center">
                <Mail className="w-10 h-10 text-toiral-primary" />
              </div>

              <div className="text-center mt-8 mb-10">
                <h2 className="text-3xl font-bold text-toiral-dark">
                  Access Your Project
                </h2>
                <p className="text-gray-600 mt-2">
                  Enter your unique code to view real-time progress
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-8">
                <div>
                  <input
                    type="text"
                    placeholder="PRJ-2024-XYZ"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-toiral-primary"
                  />
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Check your email for your unique project code
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-toiral-primary hover:bg-toiral-primary/90 text-white font-semibold py-5 rounded-2xl flex items-center justify-center gap-3 text-lg transition-all disabled:opacity-70"
                >
                  {loading ? "Checking..." : "View My Project"}
                  {!loading && <ArrowRight className="w-6 h-6" />}
                </button>
              </form>

              <p className="text-center mt-8 text-sm text-gray-500">
                Can't find your code?{" "}
                <button className="text-toiral-primary font-medium hover:underline">
                  Contact support
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

export default ClientLogin;