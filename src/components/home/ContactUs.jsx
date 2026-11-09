import React, { useState, useEffect } from "react";
import { FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { sendContactMessage } from "../../api/contact.api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./ContactUs.css";

const INSTAGRAM_LINK =
  "https://www.instagram.com/pavi_knots?rpxt=em80MzBpenF2ejB4&utm_source=qr";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to send a message.");
      return;
    }

    setLoading(true);

    try {
      const data = await sendContactMessage(formData);

      toast.success(data.message || "Your message has been sent successfully!");

      setFormData((prev) => ({
        ...prev,
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
      }));
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors?.length) {
        response.errors.forEach((item) => {
          toast.error(`${item.field.toUpperCase()}: ${item.message}`);
        });
      } else {
        toast.error(
          response?.message || "Unable to send your message. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="ContactPage">
      <section className="Contact-hero">
        <div className="Contact-hero-content">
          <span className="Contact-eyebrow">GET IN TOUCH</span>
          <h1 className="Contact-title">
            Let's Create Something <br />
            <span>Beautiful Together.</span>
          </h1>
          <p className="Contact-subtitle">
            Have a question about a product, want to request a custom crochet
            order, or just want to say hi? We'd love to hear from you!
          </p>
        </div>
      </section>

      <section className="Contact-main-section">
        <div className="Contact-container">
          <div className="Contact-info-column">
            <h2>Contact Information</h2>
            <p className="Contact-info-desc">
              Reach out to us through any of the channels below. We try our best
              to respond within 24-48 hours.
            </p>

            <div className="Contact-info-cards">
              <a
                href="mailto:pavi.knots@gmail.com"
                className="Contact-info-card"
              >
                <div className="Contact-icon-wrapper">
                  <FiMail size={24} />
                </div>
                <div>
                  <h3>Email Us</h3>
                  <p>pavi.knots@gmail.com</p>
                </div>
              </a>

              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                className="Contact-info-card"
              >
                <div className="Contact-icon-wrapper">
                  <FaInstagram size={24} />
                </div>
                <div>
                  <h3>Instagram</h3>
                  <p>@pavi_knots</p>
                </div>
              </a>

              {/* <div className="Contact-info-card">
                <div className="Contact-icon-wrapper">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h3>Location</h3>
                  <p>Srivilliputhur, India (Pan-India Delivery)</p>
                </div>
              </div> */}
              {/* 
              <div className="Contact-info-card">
                <div className="Contact-icon-wrapper">
                  <FiClock size={24} />
                </div>
                <div>
                  <h3>Working Hours</h3>
                  <p>Mon - Sat: 10:00 AM - 6:00 PM</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="Contact-form-column">
            <div className="Contact-form-wrapper">
              <h2>Send a Message</h2>

              <form onSubmit={handleSubmit} className="Contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    readOnly={isAuthenticated}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    readOnly={isAuthenticated}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>
                    <option value="Custom Order">Custom Crochet Order</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Shipping & Delivery">
                      Shipping & Delivery
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your idea or question..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="Contact-btn-primary"
                  disabled={loading || authLoading}
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <FiSend size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactUs;
