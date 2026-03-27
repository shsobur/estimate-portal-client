import { FiBriefcase } from "react-icons/fi";
import { Outlet } from "react-router";

const DashboardContent = ({userLoading }) => {
  return (
    <>
      <main className="flex-1 p-2 overflow-auto">
        {userLoading ? (
          <div className="rounded-2xl h-full flex items-center justify-center bg-white shadow-inner">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#3C8F63]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="text-[#3C8F63]" size={24} />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                Your dashboard content will appear here
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl p-2 h-full bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] shadow-inner">
              <Outlet></Outlet>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default DashboardContent;