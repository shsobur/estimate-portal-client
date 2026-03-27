// File path__
import "./Banner.css";
import bannerImage from "../../../../assets/bannerImage.webp";

// From react__
import { useEffect, useState } from "react";

// Package__
import Swal from "sweetalert2";

const Banner = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
  });

  // Get use screen size__
  useEffect(() => {
    const handleScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleScreenSize);

    return () => window.removeEventListener("resize", handleScreenSize);
  }, []);

  // Massage for mobile user__
  useEffect(() => {
    if (screenSize.width < 640 && !sessionStorage.getItem("mobileAlert")) {
      Swal.fire({
        title: "Hi there! 👋🏻",
        text: "Welcome! This site is optimized for tablet and desktop viewing. Our mobile app will be available soon for an even smoother experience",
        icon: "info",
      });

      sessionStorage.setItem("mobileAlert", "shown");
    }
  }, [screenSize]);

  return (
    <>
      <section id="hb_main_banner_container">
        <div className="hb_banner_content_container">
          <div className="hb_banner_content">
            <div className="hb_text_section">
              <div className="hb_content_wrapper">
                <div className="hb_badge">
                  <span className="hb_badge_icon">🚀</span>
                  Start Your Journey Today
                </div>

                <h1 className="hb_banner_title">
                  Find The Job That
                  <span className="hb_highlighted_text"> Fits Your Life</span>
                </h1>

                <p className="hb_description">
                  Join over 10 million professionals who found their dream
                  careers with us. Discover opportunities that match your skills
                  and lifestyle aspirations.
                </p>

                <div className="hb_cta_section">
                  <button className="hb_cta_btn hb_primary">
                    <span className="hb_btn_text">Explore Jobs</span>
                    <span className="hb_btn_icon">→</span>
                  </button>
                  <button className="hb_cta_btn hb_secondary">
                    <span className="hb_btn_text">News Feed</span>
                  </button>
                </div>

                <div className="hb_stats_section">
                  <div className="hb_stat_item">
                    <div className="hb_stat_number">10M+</div>
                    <div className="hb_stat_label">Job Seekers</div>
                  </div>
                  <div className="hb_stat_divider"></div>
                  <div className="hb_stat_item">
                    <div className="hb_stat_number">50K+</div>
                    <div className="hb_stat_label">Companies</div>
                  </div>
                  <div className="hb_stat_divider"></div>
                  <div className="hb_stat_item">
                    <div className="hb_stat_number">120+</div>
                    <div className="hb_stat_label">Countries</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hb_image_section">
              <div className="hb_image_container">
                <div className="hb_main_image_wrapper">
                  <img
                    src={bannerImage}
                    alt="Professional Career Success"
                    className="hb_main_image"
                  />
                  <div className="hb_image_overlay"></div>
                </div>

                {/* Floating achievement cards */}
                <div className="hb_floating_card hb_experience">
                  <div className="hb_card_icon">⭐</div>
                  <div className="hb_card_content">
                    <div className="hb_card_value">95%</div>
                    <div className="hb_card_label">Success Rate</div>
                  </div>
                </div>

                <div className="hb_floating_card hb_jobs">
                  <div className="hb_card_icon">💼</div>
                  <div className="hb_card_content">
                    <div className="hb_card_value">1,234+</div>
                    <div className="hb_card_label">New Jobs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;