import { useState, useEffect } from "react";
import useAxios from "./Axios";

const useChat = (currentUserEmail) => {
  const api = useAxios();
  const [conversations, setConversations] = useState([]);
  const [conversationsWithUserInfo, setConversationsWithUserInfo] = useState(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversations for current user
  const fetchConversations = async () => {
    if (!currentUserEmail) return;

    setLoading(true);
    try {
      const { data } = await api.get(
        `/chat-api/conversations/${currentUserEmail}`
      );
      setConversations(data);

      // Fetch user info for each conversation
      await fetchUserInfoForConversations(data);
      setError(null);
    } catch (err) {
      setError("Failed to load conversations");
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user info for all conversations
  const fetchUserInfoForConversations = async (conversationsList) => {
    if (!conversationsList.length) return;

    const conversationsWithInfo = await Promise.all(
      conversationsList.map(async (conversation) => {
        const otherUserEmail = conversation.participants.find(
          (email) => email !== currentUserEmail
        );

        if (!otherUserEmail) return { ...conversation, userInfo: null };

        try {
          const userInfo = await fetchUserInfo(otherUserEmail);
          return { ...conversation, userInfo };
        } catch (error) {
          console.error("Error fetching user info:", error);
          return { ...conversation, userInfo: null };
        }
      })
    );

    setConversationsWithUserInfo(conversationsWithInfo);
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return [];

    try {
      const { data } = await api.get(`/chat-api/messages/${conversationId}`);
      return data;
    } catch (err) {
      console.error("Error fetching messages:", err);
      return [];
    }
  };

  // Fetch user info by email
  const fetchUserInfo = async (email) => {
    if (!email) return null;

    try {
      const { data } = await api.get(`/chat-api/user/${email}`);
      return data;
    } catch (err) {
      console.error("Error fetching user info:", err);
      return null;
    }
  };

  // Load conversations when component mounts
  useEffect(() => {
    if (currentUserEmail) {
      fetchConversations();
    }
  }, [currentUserEmail]);

  return {
    conversations,
    conversationsWithUserInfo,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    fetchUserInfo,
  };
};

export default useChat;