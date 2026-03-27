import {
  FaPaperPlane,
  FaTrash,
  FaSearch,
  FaEllipsisV,
  FaUser,
  FaTimes,
  FaBriefcase,
} from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import useSocket from "../../Hooks/useSocket";
import useChat from "../../Hooks/useChat";
import { AuthContext } from "../../Context/AuthContext";

const ReusableChatLayout = ({
  userRole,
  selectedUserFromState,
}) => {
  // Get current user info
  const { user } = useContext(AuthContext);
  const currentUserEmail = user?.email;

  // Socket and chat hooks
  const { socket, isConnected } = useSocket();
  const {
    conversationsWithUserInfo,
    loading: loadingConversations,
    fetchUserInfo,
    fetchMessages,
  } = useChat(currentUserEmail);

  // State for chat
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Get user display info (name, avatar, role)
  const getUserDisplayInfo = (userInfo) => {
    if (!userInfo) return null;

    const isRecruiter = userInfo.userRole === "Recruiter";

    return {
      name: isRecruiter ? userInfo.companyName : userInfo.userName,
      avatar: isRecruiter ? userInfo.companyLogo : userInfo.profilePhoto,
      initials:
        (isRecruiter ? userInfo.companyName : userInfo.userName)?.charAt(0) ||
        "U",
      role: userInfo.userRole,
      email: userInfo.userEmail,
    };
  };

  // Listen for new messages__
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (
        selectedConversation &&
        message.conversationId === selectedConversation._id
      ) {
        const formattedMessage = {
          id: message._id || Date.now(),
          senderId: message.senderEmail,
          senderName:
            message.senderEmail === currentUserEmail
              ? "You"
              : selectedUser?.name || message.senderEmail,
          text: message.text,
          timestamp: new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isCurrentUser: message.senderEmail === currentUserEmail,
        };
        setMessages((prev) => [...prev, formattedMessage]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", () => console.log("✅ Message sent"));

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
    };
  }, [socket, selectedConversation, selectedUser, currentUserEmail]);

  // Load user info and messages when selecting a conversation
  const handleSelectConversation = async (conversation) => {
    try {
      setLoadingMessages(true);

      // Get the other user in conversation
      const otherUserEmail = conversation.participants.find(
        (email) => email !== currentUserEmail
      );

      if (!otherUserEmail) return;

      // Get user info from conversation or fetch fresh
      let userInfo = conversation.userInfo;
      if (!userInfo) {
        userInfo = await fetchUserInfo(otherUserEmail);
      }

      // Get display info
      const displayInfo = getUserDisplayInfo(userInfo);
      console.log(displayInfo);

      // Fetch messages for this conversation
      const conversationMessages = await fetchMessages(conversation._id);

      // Format messages for display
      const formattedMessages = conversationMessages.map((msg) => ({
        id: msg._id,
        senderId: msg.senderEmail,
        senderName:
          msg.senderEmail === currentUserEmail
            ? "You"
            : displayInfo?.name || msg.senderEmail,
        text: msg.text,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCurrentUser: msg.senderEmail === currentUserEmail,
      }));

      // Set selected user info
      setSelectedUser({
        _id: userInfo?._id,
        name: displayInfo?.name || otherUserEmail,
        email: otherUserEmail,
        avatar: displayInfo?.avatar || null,
        avatarInitials:
          displayInfo?.initials || otherUserEmail?.charAt(0) || "U",
        role: displayInfo?.role || "User",
        isOnline: false,
      });

      setSelectedConversation(conversation);
      setMessages(formattedMessages);
    } catch (error) {
      console.error("❌ Error loading conversation:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a new message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser || !socket || !isConnected)
      return;

    // Add message to UI immediately
    const optimisticMessage = {
      id: Date.now(),
      senderId: "current",
      senderName: "You",
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Send via socket
    socket.emit("send_message", {
      to: selectedUser.email,
      text: messageInput,
      timestamp: new Date().toISOString(),
    });

    // Clear input
    setMessageInput("");
  };

  // Auto-select user when coming from User List page
  useEffect(() => {
    if (selectedUserFromState) {
      // Immediately set selected user from state (has image, name, etc.)
      const userFromState = {
        _id: selectedUserFromState._id,
        name: selectedUserFromState.name,
        email: selectedUserFromState.email,
        avatar: selectedUserFromState.image || null,
        avatarInitials:
          selectedUserFromState.name?.charAt(0) ||
          selectedUserFromState.email?.charAt(0) ||
          "U",
        role: selectedUserFromState.role || "User",
        isOnline: false,
      };

      setSelectedUser(userFromState);

      // Check if conversation already exists
      const existingConv = conversationsWithUserInfo.find((conv) =>
        conv.participants.includes(selectedUserFromState.email)
      );

      if (existingConv) {
        // Load existing conversation
        handleSelectConversation(existingConv);
      } else {
        // New conversation - empty messages
        setMessages([]);
        setSelectedConversation(null);
      }
    }
  }, [selectedUserFromState, conversationsWithUserInfo]);

  // Role-based settings
  const getRoleConfig = () => {
    const configs = {
      admin: {
        title: "Admin Messages",
        placeholder: "Search conversations...",
        canClearChat: true,
      },
      recruiter: {
        title: "Recruiter Messages",
        placeholder: "Search conversations...",
        canClearChat: true,
      },
      user: {
        title: "My Messages",
        placeholder: "Search conversations...",
        canClearChat: false,
      },
    };
    return configs[userRole] || configs.user;
  };

  const config = getRoleConfig();

  // Get role icon
  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return <FaUser className="text-[#3C8F63]" />;
      case "recruiter":
        return <FaBriefcase className="text-blue-600" />;
      case "user":
        return <FaUser className="text-green-600" />;
      default:
        return <FaUser />;
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversationsWithUserInfo.filter((conv) => {
    const displayInfo = getUserDisplayInfo(conv.userInfo);
    const searchName =
      displayInfo?.name ||
      conv.participants.find((email) => email !== currentUserEmail) ||
      "";
    return searchName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-[100%] bg-gray-100">
      {/* LEFT SIDEBAR - Conversation List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getRoleIcon()}
              <h2 className="text-xl font-bold text-gray-800">
                {config.title}
              </h2>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <FaEllipsisV />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={config.placeholder}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8F63] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="p-8 text-center text-gray-500">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const displayInfo = getUserDisplayInfo(conv.userInfo);
              const otherUserEmail = conv.participants.find(
                (email) => email !== currentUserEmail
              );

              return (
                <div
                  key={conv._id}
                  className={`flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation?._id === conv._id
                      ? "bg-green-50 border-l-4 border-l-[#3C8F63]"
                      : ""
                  }`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  {/* Avatar with Image or Initials */}
                  <div className="relative">
                    {displayInfo?.avatar ? (
                      <img
                        src={displayInfo.avatar}
                        alt={displayInfo.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 rounded-full ${
                        displayInfo?.avatar ? "hidden" : "flex"
                      } items-center justify-center font-bold text-white ${
                        displayInfo?.role === "Recruiter"
                          ? "bg-blue-600"
                          : "bg-[#3C8F63]"
                      }`}
                    >
                      {displayInfo?.initials ||
                        otherUserEmail?.charAt(0) ||
                        "U"}
                    </div>
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {displayInfo?.name || otherUserEmail}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {conv.updatedAt
                          ? new Date(conv.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600 truncate max-w-[120px]">
                        {conv.lastMessage?.text || "No messages yet"}
                      </span>
                      {/* Unread count badge - we'll add later */}
                    </div>

                    {/* Role Badge */}
                    <div className="mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          displayInfo?.role === "Admin"
                            ? "bg-purple-100 text-purple-700"
                            : displayInfo?.role === "Recruiter"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {displayInfo?.role || "User"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            {filteredConversations.length} conversation
            {filteredConversations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button className="md:hidden text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>

                {/* User Avatar in Header */}
                <div className="relative">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-12 h-12 rounded-full ${
                      selectedUser.avatar ? "hidden" : "flex"
                    } items-center justify-center font-bold text-white ${
                      selectedUser.role === "Recruiter"
                        ? "bg-blue-600"
                        : "bg-[#3C8F63]"
                    }`}
                  >
                    {selectedUser.avatarInitials}
                  </div>
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

              {config.canClearChat && (
                <button
                  onClick={() => console.log("Clear chat - to implement")}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <FaTrash />
                  Clear Chat
                </button>
              )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="mx-auto">
                {loadingMessages ? (
                  <div className="text-center text-gray-500 py-8">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${
                        message.isCurrentUser ? "flex justify-end" : "flex"
                      }`}
                    >
                      {!message.isCurrentUser && (
                        <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm mr-2">
                          {selectedUser.avatarInitials?.charAt(0) || "U"}
                        </div>
                      )}

                      <div
                        className={`max-w-[70%] ${
                          message.isCurrentUser ? "text-right" : ""
                        }`}
                      >
                        {!message.isCurrentUser && (
                          <p className="text-xs font-semibold text-gray-700 mb-1">
                            {message.senderName}
                          </p>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            message.isCurrentUser
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
                  ))
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="mx-auto">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder={`Message ${selectedUser.name}...`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C8F63] focus:border-transparent"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={loadingMessages}
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || loadingMessages}
                    className="px-6 py-3 bg-[#3C8F63] text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Empty state when no conversation is selected
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <FaUser className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-500 max-w-md">
              {userRole === "admin"
                ? "Choose a user from the list to start messaging"
                : userRole === "recruiter"
                ? "Select a candidate to view messages"
                : "Select a conversation to continue"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReusableChatLayout;
