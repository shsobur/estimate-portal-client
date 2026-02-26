import { Outlet } from "react-router-dom";

const MainLayout = ({role}) => {
  return (
    <>
      <Outlet></Outlet>
      <h1>You are in {role} layout</h1>
    </>
  );
};

export default MainLayout;