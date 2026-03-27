import "./Footer.css";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/fab.png" alt="JobHunting Logo" />
              <h2>JobHunting</h2>
            </div>
            <p className="footer-description">
              Find your dream career with JobHunting. Connect with top employers
              and discover opportunities that match your skills and aspirations.
            </p>
            <div className="social-links-container">
              <div className="social-links">
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="#" className="social-link" aria-label="GitHub">
                  <FaGithub />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link" aria-label="Email">
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="footer-link">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="footer-link">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-links">
              <li>
                <Link to="/blog" className="footer-link">
                  Career Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="footer-link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <a href="mailto:hello@jobhunting.com" className="contact-link">
                  hello@jobhunting.com
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <a href="tel:+11234567890" className="contact-link">
                  +1 (123) 456-7890
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Address:</span>
                <span className="contact-text">
                  123 Career Street, Professional City, PC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} JobHunting. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="bottom-link">
                Privacy
              </Link>
              <span className="divider">|</span>
              <Link to="/terms" className="bottom-link">
                Terms
              </Link>
              <span className="divider">|</span>
              <Link to="/cookies" className="bottom-link">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
