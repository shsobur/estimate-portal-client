import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  const features = [
    {
      icon: "🚀",
      title: "Smart Job Matching",
      description:
        "Our advanced AI algorithm matches you with perfect job opportunities based on your skills, experience, and career goals.",
    },
    {
      icon: "🔒",
      title: "Verified Companies",
      description:
        "Every employer is thoroughly verified to ensure genuine job opportunities and secure hiring processes.",
    },
    {
      icon: "💼",
      title: "Career Growth Tools",
      description:
        "Access resume builder, interview preparation, and career counseling to accelerate your professional journey.",
    },
    {
      icon: "🌍",
      title: "Global Opportunities",
      description:
        "Connect with employers worldwide and discover remote, hybrid, and on-site positions across 120+ countries.",
    },
    {
      icon: "⚡",
      title: "Quick Application",
      description:
        "Apply to multiple jobs with one-click applications and save your profile for faster submissions.",
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description:
        "Track your application status, profile views, and get insights to improve your job search strategy.",
    },
  ];

  const stats = [
    { number: "95%", label: "Success Rate" },
    { number: "10M+", label: "Job Seekers" },
    { number: "50K+", label: "Companies" },
    { number: "120+", label: "Countries" },
  ];

  return (
    <section className="wcu_section">
      <div className="wcu_container">
        {/* Section Header - Fixed Alignment */}
        <div className="wcu_header">
          <div className="wcu_header-badge">
            <span className="wcu_badge-icon">⭐</span>
            Why Choose JobHub
          </div>
          <h2 className="wcu_header-title">
            Your Career Success
            <span className="wcu_highlighted-text"> Starts Here</span>
          </h2>
          <p className="wcu_header-description">
            We're committed to making your job search efficient, effective, and
            rewarding. Join millions who've transformed their careers with our
            platform.
          </p>
        </div>

        {/* Stats Section */}
        <div className="wcu_stats">
          {stats.map((stat, index) => (
            <div key={index} className="wcu_stat-item">
              <div className="wcu_stat-number">{stat.number}</div>
              <div className="wcu_stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid - Smaller Cards */}
        <div className="wcu_features-grid">
          {features.map((feature, index) => (
            <div key={index} className="wcu_feature-card">
              <div className="wcu_feature-icon">{feature.icon}</div>
              <h3 className="wcu_feature-title">{feature.title}</h3>
              <p className="wcu_feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="wcu_cta">
          <button className="wcu_cta-btn wcu_primary-btn">
            <span className="wcu_btn-text">Start Your Journey Today</span>
            <span className="wcu_btn-icon">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;