import { Outlet } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const MainLayout = () => {
  return (
    <>
      <Outlet></Outlet>
    </>
  );
};

export default MainLayout;