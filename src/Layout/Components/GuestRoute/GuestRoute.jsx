import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

const GuestRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Still loading auth__
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // If user is logged in redirect based on role__
  if (user) {
    const isAdmin = user.role === "admin" || user.isAdmin;

    return (
      <Navigate
        to={
          isAdmin ? "/dashboard/admin/overview" : "/dashboard/client/overview"
        }
        replace
      />
    );
  }

  // Not logged in, show login page__
  return children;
};

export default GuestRoute;