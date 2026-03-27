import {
  FaPaperPlane,
  FaTrash,
  FaUser,
  FaCircle,
  FaEllipsisV,
  FaBriefcase,
} from "react-icons/fa";
import { HiOutlineEmojiHappy } from "react-icons/hi";

const RecruiterChatLayout = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row h-[100%] bg-gray-100">
        {/* Left Sidebar - Users List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-gray-50 flex flex-col flex-shrink-0">
          {/* Sidebar Header */}
          <div className="p-4 md:p-5 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaBriefcase className="text-[#3C8F63]" />
                Recruiter
              </h2>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <FaEllipsisV className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            {/* User Card - Selected */}
            <div className="flex items-center gap-3 p-3 md:p-4 bg-[#E8F5EE] border border-[#3C8F63]/30 rounded-xl mb-3 cursor-pointer transition-all hover:border-[#3C8F63]/50">
              <div className="relative">
                <div className="w-12 h-12 bg-[#3C8F63] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  JD
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 truncate">
                    John Doe
                  </h4>
                  <span className="text-xs text-gray-500">10:30 AM</span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  Senior Developer
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="inline-block px-2.5 py-0.5 border border-[#3C8F63] bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    Applicant
                  </span>
                  <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                </div>
              </div>
            </div>

            {/* User Card */}
            <div className="flex items-center gap-3 p-3 md:p-4 bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-xl mb-3 cursor-pointer transition-all">
              <div className="relative">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  SA
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 truncate">
                    Sarah Ahmed
                  </h4>
                  <span className="text-xs text-gray-500">09:45 AM</span>
                </div>
                <p className="text-sm text-gray-600 truncate">UI/UX Designer</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    Applicant
                  </span>
                  <span className="w-6 h-6 bg-gray-300 text-gray-600 text-xs rounded-full flex items-center justify-center font-bold">
                    0
                  </span>
                </div>
              </div>
            </div>

            {/* User Card */}
            <div className="flex items-center gap-3 p-3 md:p-4 bg-white hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-xl mb-3 cursor-pointer transition-all">
              <div className="relative">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  MR
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 truncate">
                    Mike Rahim
                  </h4>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  DevOps Engineer
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    Applicant
                  </span>
                  <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-[#3C8F63] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  JD
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">John Doe</h3>
                <div className="flex items-center gap-2">
                  <FaCircle className="text-green-500 text-xs" />
                  <p className="text-sm text-green-600 font-medium">Online</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#3C8F63] text-white hover:bg-[#2E7A55] border border-[#3C8F63] rounded-lg transition-colors font-medium">
                <FaUser />
                View Profile
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors font-medium">
                <FaTrash />
                Clear Chat
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 bg-gradient-to-b from-gray-100 to-white">
            {/* Received Message */}
            <div className="flex gap-3 mb-4 md:mb-5">
              <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                JD
              </div>
              <div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 max-w-xs md:max-w-md">
                  <p className="text-gray-800">
                    Hello, I'm interested in the Senior Developer position.
                  </p>
                </div>
                <span className="text-xs text-gray-500 mt-1 block pl-1">
                  10:30 AM
                </span>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex justify-end mb-4 md:mb-5">
              <div className="flex flex-col items-end">
                <div className="bg-[#3C8F63] text-white rounded-2xl rounded-br-none px-4 py-3 max-w-xs md:max-w-md">
                  <p>Hi John, we'd like to schedule an interview with you.</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
              </div>
            </div>

            {/* Received Message */}
            <div className="flex gap-3 mb-4 md:mb-5">
              <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                JD
              </div>
              <div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 max-w-xs md:max-w-md">
                  <p className="text-gray-800">
                    That sounds great! What time works for you?
                  </p>
                </div>
                <span className="text-xs text-gray-500 mt-1 block pl-1">
                  10:33 AM
                </span>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex justify-end mb-4 md:mb-5">
              <div className="flex flex-col items-end">
                <div className="bg-[#3C8F63] text-white rounded-2xl rounded-br-none px-4 py-3 max-w-xs md:max-w-md">
                  <p>How about tomorrow at 2 PM?</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">10:35 AM</span>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 md:p-5 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
                <HiOutlineEmojiHappy className="text-2xl text-gray-500" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#3C8F63] focus:ring-2 focus:ring-[#3C8F63]/20"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3.5 bg-[#3C8F63] text-white rounded-xl hover:bg-[#2E7A55] transition-colors font-medium">
                <FaPaperPlane />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterChatLayout;