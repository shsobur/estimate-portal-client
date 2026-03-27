// File path__
import "./HomeLayout.css";
import Banner from "../Banner/Banner";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs";
import Footer from "../../../../Shared/Footer/Footer";
import FeaturedJobs from "../FeaturedJobs/FeaturedJobs";
import { AuthContext } from "../../../../Context/AuthContext";
import LoadingScreen from "../../../../Components/LoadingScreen/LoadingScreen";

// From react__
import { useContext } from "react";

const HomeLayout = () => {
  const { user, userLoading } = useContext(AuthContext);

  if (user && userLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="hl_main_sections_container">
        {/* Background Layer */}
        <div className="hl_sections_bg_layer">
          <div className="hl_bg_gradient"></div>
          <div className="hl_bg_circles">
            <div className="hl_bg_circle hl_circle1"></div>
            <div className="hl_bg_circle hl_circle2"></div>
            <div className="hl_bg_circle hl_circle3"></div>
            <div className="hl_bg_circle hl_circle4"></div>
          </div>
        </div>

        {/* Content Layer */}
        <div className="hl_sections_content_layer">
          <Banner />
          <WhyChooseUs />
          <FeaturedJobs />
          <Footer></Footer>
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
