import {
  FaPaperPlane,
  FaTrash,
  FaCircle,
  FaSearch,
  FaEllipsisV,
  FaBuilding,
  FaUser,
  FaTimes,
} from "react-icons/fa";
import { HiOutlineEmojiHappy } from "react-icons/hi";

const AdminChatLayout = () => {
  // Static data for now - will replace with state later
  const conversations = [
    {
      id: 1,
      userId: "user_123",
      name: "John Doe",
      avatar: "JD",
      role: "Job Seeker",
      lastMessage: "Hello, I have a question about...",
      lastMessageTime: "10:45 AM",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: 2,
      userId: "user_456",
      name: "Jane Smith",
      avatar: "JS",
      role: "Recruiter",
      lastMessage: "Thanks for the update!",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: 3,
      userId: "user_789",
      name: "Mike Johnson",
      avatar: "MJ",
      role: "Job Seeker",
      lastMessage: "When is the interview?",
      lastMessageTime: "2 days ago",
      unreadCount: 5,
      isOnline: true,
    },
  ];

  const messages = [
    {
      id: 1,
      senderId: "user_123",
      senderName: "John Doe",
      text: "Hello! How can I help you?",
      timestamp: "10:40 AM",
      isAdmin: false,
    },
    {
      id: 2,
      senderId: "admin",
      senderName: "You",
      text: "I need help with the dashboard.",
      timestamp: "10:41 AM",
      isAdmin: true,
    },
    {
      id: 3,
      senderId: "user_123",
      senderName: "John Doe",
      text: "Sure, what specific issue are you facing?",
      timestamp: "10:42 AM",
      isAdmin: false,
    },
  ];

  const selectedUser = {
    id: "user_123",
    name: "John Doe",
    avatar: "JD",
    role: "Job Seeker",
    isOnline: true,
  };

  // Handler functions - will implement later
  const handleSendMessage = () => {
    console.log("Send message - will implement with socket");
  };

  const handleSelectUser = (userId) => {
    console.log("Select user:", userId);
  };

  const handleSearch = (query) => {
    console.log("Search:", query);
  };

  const handleClearChat = () => {
    console.log("Clear chat - will implement later");
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* LEFT SIDEBAR - Conversation List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaUser className="text-[#3C8F63]" />
              <h2 className="text-xl font-bold text-gray-800">
                Admin Messages
              </h2>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <FaEllipsisV />
            </button>
          </div>

          {/* Online Status */}
          <div className="px-3 py-2 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200 mb-4">
            <div className="flex items-center gap-2">
              <FaCircle className="text-xs text-green-500" />
              <span>3 users online</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8F63] focus:border-transparent"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedUser.id === user.id
                  ? "bg-green-50 border-l-4 border-l-[#3C8F63]"
                  : ""
              }`}
              onClick={() => handleSelectUser(user.userId)}
            >
              {/* Avatar with Online Status */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#3C8F63] text-white flex items-center justify-center font-bold">
                  {user.avatar}
                </div>
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {user.name}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {user.lastMessageTime}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-600 truncate max-w-[120px]">
                    {user.lastMessage}
                  </span>
                  {user.unreadCount > 0 && (
                    <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {user.unreadCount}
                    </span>
                  )}
                </div>

                {/* Role Badge */}
                <div className="mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "Recruiter"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            {conversations.length} conversations
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            {/* Back button for mobile (hidden on desktop) */}
            <button className="md:hidden text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#3C8F63] text-white flex items-center justify-center font-bold">
              {selectedUser.avatar}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                {selectedUser.name}
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedUser.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {selectedUser.isOnline ? "Online" : "Offline"}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {selectedUser.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
          >
            <FaTrash />
            Clear Chat
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.isAdmin ? "flex justify-end" : "flex"
                }`}
              >
                {!message.isAdmin && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm mr-2">
                    {selectedUser.avatar.charAt(0)}
                  </div>
                )}

                <div
                  className={`max-w-[70%] ${
                    message.isAdmin ? "text-right" : ""
                  }`}
                >
                  {!message.isAdmin && (
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      {message.senderName}
                    </p>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.isAdmin
                        ? "bg-[#3C8F63] text-white rounded-br-none"
                        : "bg-white border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <HiOutlineEmojiHappy className="text-2xl" />
              </button>

              <input
                type="text"
                placeholder={`Message ${selectedUser.name}...`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C8F63] focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />

              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-[#3C8F63] text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaPaperPlane />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>

            {/* Optional: Typing indicator - will implement with socket */}
            <div className="mt-2 text-sm text-gray-500">
              {/* {isTyping && <span>{selectedUser.name} is typing...</span>} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatLayout;