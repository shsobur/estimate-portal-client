import { Outlet } from "react-router-dom";
import Footer from "../../ShearComponents/Footer/Footer";
import Navbar from "../../ShearComponents/Navbar/Navbar";

const MainLayout = () => {
  return (
    <>
      <div>
<<<<<<< HEAD
        {/* <Navbar></Navbar> */}
        <Outlet></Outlet>
        {/* <Footer></Footer> */}
=======
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
>>>>>>> dcb14d45f3aece23ac343a4192c29ef0338a58f7
      </div>
    </>
  );
};

export default MainLayout;