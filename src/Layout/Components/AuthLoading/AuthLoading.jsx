const AuthLoading = () => {
  return (
    <>
      <div>
        <div className="min-h-screen bg-toiral-bg flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center gap-6">
            {/* Logo with pulse animation */}
            <div className="relative">
              <div className="w-20 h-20 bg-toiral-primary rounded-3xl flex items-center justify-center">
                <span className="text-white text-4xl font-bold">T</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 border-4 border-toiral-primary/30 rounded-3xl"
              />
            </div>

            {/* Text */}
            <div className="text-center">
              <p className="text-2xl font-semibold text-toiral-dark">
                Checking access...
              </p>
              <p className="text-gray-500 mt-1">Please wait a moment</p>
            </div>

            {/* Nice spinner */}
            <div className="w-8 h-8 border-4 border-toiral-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLoading;