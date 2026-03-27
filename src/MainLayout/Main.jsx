// File__
import Navbar from "../Shared/Navbar/Navbar";

// Package__
import { Outlet } from "react-router-dom";
import ProgressBar from "../Components/ProgressBar/ProgressBar";

const Main = () => {

  return (
    <>
      <ProgressBar></ProgressBar>
      <Navbar></Navbar>
      <Outlet></Outlet>
    </>
  );
};

export default Main;
