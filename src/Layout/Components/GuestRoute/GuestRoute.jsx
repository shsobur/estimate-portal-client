import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import AuthLoading from "../AuthLoading/AuthLoading";

const GuestRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  const accessEmail = [
    "shsoburhossen951@gmail.com",
    "abirsabirhossain@gmail.com",
    "alifshahriarjihad@gmail.com",
    "rankwithmarufur@gmail.com",
    "aminulislam004474@gmail.com",
  ];

  // Still loading auth__
  if (loading) {
    return (
      <div>
        <AuthLoading></AuthLoading>
      </div>
    );
  }

  // If user is logged in, decide admin/client based on email__
  if (user) {
    const userEmail = user.email?.toLowerCase();

    const isAdmin = userEmail && accessEmail.includes(userEmail);

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
