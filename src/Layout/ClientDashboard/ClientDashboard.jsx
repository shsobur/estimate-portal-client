import { Outlet } from "react-router-dom";
import Footer from "../../ShearComponents/Footer/Footer";
import Navbar from "../../ShearComponents/Navbar/Navbar";

const ClientDashboard = () => {
  return (
    <>
      <div>
        {/* <Navbar></Navbar> */}
        <Outlet></Outlet>
        {/* <Footer></Footer> */}
      </div>
    </>
  );
};

export default ClientDashboard;