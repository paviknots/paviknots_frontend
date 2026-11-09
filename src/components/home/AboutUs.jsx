import React from "react";
import { FiHeart, FiAward, FiSmile, FiArrowRight } from "react-icons/fi";
import { PiYarn } from "react-icons/pi";
import { FaInstagram } from "react-icons/fa";

import "./AboutUs.css";

const values = [
  {
    icon: <FiHeart size={28} />,
    title: "Made with Love",
    description:
      "Every stitch is crafted by hand, ensuring that your piece is 100% unique and full of character.",
  },
  {
    icon: <PiYarn size={30} />,
    title: "Premium Yarn",
    description:
      "We source high-quality, skin-friendly yarns that make our creations not just beautiful, but durable and soft.",
  },
  {
    icon: <FiAward size={28} />,
    title: "Attention to Detail",
    description:
      "From the color palette to the final knot, we obsess over the tiny details that make our crafts special.",
  },
  {
    icon: <FiSmile size={28} />,
    title: "Customer Joy",
    description:
      "Nothing makes us happier than seeing our handmade creations bring a smile to your face and your loved ones.",
  },
];

const INSTAGRAM_LINK =
  "https://www.instagram.com/pavi_knots?rpxt=em80MzBpenF2ejB4&utm_source=qr";

function AboutUs() {
  return (
    <main className="AboutPage">
      <section className="About-hero">
        <div className="About-hero-content">
          <span className="About-eyebrow">THE STORY OF PAVIKNOTS</span>

          <h1 className="About-title">
            Every Stitch Has
            <br />
            <span>A Story to Tell.</span>
          </h1>

          <p className="About-subtitle">
            PaviKnots started with a love for handmade crochet and the joy of
            creating something unique. Today, we bring that same passion to
            every creation, making each piece personal, meaningful, and special.
          </p>

          <a href="#our-story" className="About-hero-link">
            Discover Our Journey
            <FiArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="About-story-section" id="our-story">
        <div className="About-story-container">
          <div className="About-story-imageWrapper">
            <img
              src="/About.png"
              alt="PaviKnots Workspace"
              className="About-story-image"
            />
            <div className="About-story-image-badge">
              {/* <PiYarn size={34} /> */}
              <span>Est. 2025</span>
            </div>
          </div>

          <div className="About-story-text">
            <h2>How It All Started</h2>
            <p>
              PaviKnots began with a simple love for crochet and handmade gifts.
              I first learned crochet during my school days, but rediscovered my
              passion when I made a little blue penguin keychain for myself. The
              compliments and encouragement it received inspired me to explore
              crochet again and create more handmade pieces. With support from
              friends and a growing interest in my creations, PaviKnots slowly
              became a small business.
            </p>
            <p>
              Today, I create crochet dolls, keychains, floral bouquets, purses
              and personalised gifts. Every product is handmade with patience,
              attention to detail and care. I believe a handmade gift should
              feel personal, thoughtful and worth keeping. Whether you are
              choosing a gift for someone special or treating yourself, each
              creation is made with care.
            </p>
            <div className="About-signature">
              <span className="About-signature-name">Pavithra</span>
              <span className="About-signature-title">
                Founder & Maker, PaviKnots
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="About-values-section">
        <div className="About-values-header">
          <h2>Our Philosophy</h2>
          <p>The care and creativity behind everything we make.</p>
        </div>

        <div className="About-values-grid">
          {values.map((value, index) => (
            <div className="About-value-card" key={index}>
              <div className="About-value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="About-cta-section">
        <div className="About-cta-container">
          <h2>Join Our Creative Journey</h2>
          <p>
            Get a closer look at our handmade creations, latest updates, and
            little moments from the world of PaviKnots.
          </p>
          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noreferrer"
            className="About-btn-primary"
          >
            <FaInstagram size={20} /> Follow @pavi_knots
          </a>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;
