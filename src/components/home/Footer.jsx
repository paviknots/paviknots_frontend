import { FiInstagram, FiMail } from "react-icons/fi";
import "./Footer.css";
export function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-grid">
        <div className="footer-brand">
          <h2>PaviKnots</h2>
          <small>HANDMADE WITH PATIENCE</small>
          <p>Handmade crochet creations crafted with love, yarn, and care.</p>
          <div className="footer-social">
            <FiInstagram size={15} />
            <span>@pavi_knots</span>
          </div>
        </div>

        <div>
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/categories">Categories</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </div>

        <div>
          <h3>Help</h3>
          <a href="/faqs">FAQs</a>
          <a href="/shipping">Shipping & Delivery</a>
          <a href="/returns">Returns & Refunds</a>
          <a href="/terms-and-conditions">Terms & Conditions</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>

        <div>
          <h3>Got a Question?</h3>
          <div>
            <FiMail size={15} />
            <p>pavi.knots@gmail.com</p>
          </div>
          <div>
            <FiInstagram size={15} />
            <p>pavi_knots</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 PaviKnots. All rights reserved.</span>
        <span>Handmade with Love in TamilNadu</span>
      </div>
    </footer>
  );
}
