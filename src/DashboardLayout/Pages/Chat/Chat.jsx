import "./Chat.css";
import { jhError } from "../../../utils";
import useUserData from "../../../Hooks/userData";
import { AuthContext } from "../../../Context/AuthContext";

// Package__
import { useLocation, useNavigate } from "react-router";

// From react__
import { useContext } from "react";
import ReusableChatLayout from "../../../Components/ReusableChatLayout/ReusableChatLayout";

const Chat = () => {
  const { logOut } = useContext(AuthContext);
  const { profile } = useUserData();
  const location = useLocation();
  const navigate = useNavigate();

  // Role check from route__
  const getRoleFromRoute = () => {
    const path = location.pathname;
    const role = profile?.userRole;

    if (!role) return null;

    if (path.includes("admin-chat")) {
      return role === "Admin" ? "admin" : null;
    }
    if (path.includes("recruiter-chat")) {
      return role === "Recruiter" ? "recruiter" : null;
    }
    if (path.includes("user-chat")) {
      return role === "Job Seeker" ? "user" : null;
    }
    return null;
  };

  const handleLogout = () => {
    logOut().then(() => {
      jhError({
        title: "Error!",
        text: "Warning! you are trying to unauthorize access. We captured you activity next time you might be block",
      });
    });
  };

  const userRole = getRoleFromRoute();

  if (userRole === null) {
    navigate("/");
    handleLogout();
  }

  // Data from use list for chat__
  const selectedUserFromState = location.state?.selectedUser;

  return (
    <div className="chat-page">
      <ReusableChatLayout
        userRole={userRole}
        userName={profile?.name || "User"}
        selectedUserFromState={selectedUserFromState}
      />
    </div>
  );
};

export default Chat;
