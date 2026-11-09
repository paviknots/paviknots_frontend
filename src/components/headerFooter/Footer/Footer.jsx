import { FiInstagram, FiMail } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="Footer" id="contact">
      <div className="Footer-container">
        <div className="Footer-main">
          <div className="Footer-brand">
            <a href="/" className="Footer-brandName">
              PaviKnots
            </a>

            <p className="Footer-description">
              Handmade crochet creations, made with patience and love.
            </p>

            <a
              href="https://www.instagram.com/pavi_knots/"
              target="_blank"
              rel="noreferrer"
              className="Footer-instagram"
            >
              <FiInstagram size={16} />
              <span>Follow us on Instagram</span>
            </a>
          </div>

          <div className="Footer-links">
            <div className="Footer-column">
              <h3 className="Footer-heading">Explore</h3>
              <a href="/" className="Footer-link">
                Home
              </a>
              <a href="/products" className="Footer-link">
                Shop
              </a>
              <a href="/about" className="Footer-link">
                About Us
              </a>
            </div>

            <div className="Footer-column">
              <h3 className="Footer-heading">Support</h3>
              <a href="/contact" className="Footer-link">
                Contact Us
              </a>
              <a href="/faq" className="Footer-link">
                FAQs
              </a>
            </div>

            <div className="Footer-column">
              <h3 className="Footer-heading">Get in touch</h3>
              <a href="mailto:pavi.knots@gmail.com" className="Footer-contact">
                <FiMail size={15} />
                <span>pavi.knots@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="Footer-divider" />

        <div className="Footer-bottom">
          <p className="Footer-copyright">
            © {new Date().getFullYear()} PaviKnots. All rights reserved.
          </p>

          <div className="Footer-legal">
            <a href="/privacy" className="Footer-legalLink">
              Privacy
            </a>
            <span className="Footer-legalDot">·</span>
            <a href="/terms" className="Footer-legalLink">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
