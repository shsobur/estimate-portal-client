import { useEffect, useState } from "react";
import { SocketContext } from "../Context/SocketContext";
import { io } from "socket.io-client";

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [isConnected, setIsConnected] = useState(false);

  const SOCKET_URL = import.meta.env.VITE_SERVER_API_URL;

  // Initialize socket connectio__
  const connectSocket = ({ userData }) => {
    if (socket) return;

    console.log("Connecting socket for user:", userData?.email);

    const newSocket = io(SOCKET_URL, {
      query: {
        userId: userData._id,
        email: userData.email,
        role: userData.role,
      },
      transports: ["websocket"],
    });

    // Connect__
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      setIsConnected(true);
    });

    // Disconnect__
    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");

      setIsConnected(false);
    });

    setSocket(newSocket);

    return newSocket;
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const socketInfo = {
    socket,
    isConnected,
    connectSocket,
  };

  return (
    <SocketContext.Provider value={socketInfo}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;