import {
  FiMessageCircle,
  FiImage,
  FiPlayCircle,
  FiArrowRight,
  FiHeart,
  FiGift,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";
import { FaInstagram, FaBirthdayCake, FaStar } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { PiYarn, PiDiamondThin } from "react-icons/pi";
import { LiaShippingFastSolid } from "react-icons/lia";

import "./PersonalizedCreations.css";

const steps = [
  {
    title: "Share Your Idea",
    description: "Tell us what you want to create",
    icon: <FiMessageSquare size={24} />,
  },
  {
    title: "We Craft with Care",
    description: "Handmade tailored just for you",
    icon: <PiYarn size={26} />,
  },
  {
    title: "Review & Approve",
    description: "See the final look before delivery",
    icon: <FiImage size={24} />,
  },
  {
    title: "Delivered to You",
    description: "Safely packed and shipped",
    icon: <LiaShippingFastSolid size={24} />,
  },
];

const specialMoments = [
  { label: "Gifts for\nLoved Ones", icon: <FiGift size={28} /> },
  { label: "Birthdays &\nAnniversaries", icon: <FaBirthdayCake size={28} /> },
  { label: "Couple\nKeepsakes", icon: <FiHeart size={28} /> },
  { label: "Home\nDécor", icon: <FiHome size={28} /> },
];

const whyChooseUs = [
  {
    title: "Handmade with Love",
    description: "Each piece is carefully crocheted by hand.",
    icon: <FiHeart size={24} />,
  },
  {
    title: "Fully Customizable",
    description: "Share your idea, we'll bring it to life.",
    icon: <PiDiamondThin size={28} />,
  },
  {
    title: "Pan India Delivery",
    description: "Get your favorites delivered anywhere.",
    icon: <LiaShippingFastSolid size={26} />,
  },
  {
    title: "Premium Quality",
    description: "Neatly crafted with attention to detail.",
    icon: <FiCheckCircle size={24} />,
  },
];

const INSTAGRAM_LINK =
  "https://www.instagram.com/pavi_knots?rpxt=em80MzBpenF2ejB4&utm_source=qr";

function PersonalizedCreations() {
  return (
    <main className="PersonalizedPage">
      {/* --- HERO SECTION --- */}
      <section className="PC-hero">
        <div className="PC-heroContainer">
          <div className="PC-heroImageWrapper">
            <img
              src="/t.png"
              alt="Handcrafted crochet dolls"
              className="PC-heroImage"
            />
          </div>

          <div className="PC-heroContentWrapper">
            <div className="PC-heroText">
              <h2 className="PC-preTitle">Custom Crochet</h2>
              <h1 className="PC-title">Creations Just for You</h1>
              <p className="PC-subtitle">
                Discover custom crochet creations, carefully handmade to match
                your style, story and special moments.
              </p>
            </div>

            <div className="PC-heroSteps">
              {steps.map((step, index) => (
                <div className="PC-step" key={index}>
                  <div className="PC-stepIconWrapper">
                    <div className="PC-stepIcon">{step.icon}</div>
                    {index < steps.length - 1 && (
                      <div className="PC-stepLine"></div>
                    )}
                  </div>
                  <h3>{step.title}</h3>
                </div>
              ))}
            </div>

            <div className="PC-heroActions">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                className="PC-btn PC-btnPrimary"
              >
                <FaInstagram size={18} /> Request a Custom Order{" "}
                <FiArrowRight />
              </a>

              {/* Updated to act as an anchor link to the How It Works section */}
              <a href="#how-it-works" className="PC-btn PC-btnOutline">
                <FiPlayCircle size={18} /> How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* <section id="how-it-works" className="PC-section-howItWorks">
        <div className="PC-how-header">
          <span className="PC-moments-eyebrow">THE PROCESS</span>
          <h2>How It Works</h2>
          <p>Your custom crochet journey in 4 simple steps.</p>
        </div>

        <div className="PC-how-grid">
          {steps.map((step, index) => (
            <div className="PC-how-step-card" key={index}>
              <div className="PC-how-step-number">{index + 1}</div>
              <div className="PC-how-icon-large">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="PC-section-moments">
        <div className="PC-moments-container">
          <div className="PC-moments-text">
            <span className="PC-moments-eyebrow">PERFECT FOR</span>
            <h2>Your Special Moments</h2>
            <p>
              Custom crochet creations that make every occasion more memorable.
            </p>
          </div>

          <div className="PC-moments-divider"></div>

          <div className="PC-moments-grid">
            {specialMoments.map((moment, index) => (
              <div className="PC-moment-item" key={index}>
                <div className="PC-moment-icon">{moment.icon}</div>
                <span className="PC-moment-label">
                  {moment.label.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="PC-section-why">
        <div className="PC-why-header">
          <div className="PC-why-line"></div>
          <h2>Why Choose PaviKnots?</h2>
          <div className="PC-why-line"></div>
        </div>

        <div className="PC-why-grid">
          {whyChooseUs.map((feature, index) => (
            <div className="PC-why-item" key={index}>
              <div className="PC-why-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="PC-section-testimonials">
        <div className="PC-testimonials-container">
          <div className="PC-testimonials-left">
            <span className="PC-moments-eyebrow">CUSTOMER LOVE</span>
            <h2>
              What Our <br /> Customers Say ♡
            </h2>
          </div>

          <div className="PC-testimonials-right">
            <div className="PC-quote-mark">“</div>
            <div className="PC-testimonial-content">
              <p>
                "The customized doll was so cute and exactly how I imagined it.
                The detailing is just perfect!"
              </p>
              <div className="PC-testimonial-author">
                <strong>— Kavya R.</strong>
                <div className="PC-stars">
                  <FaStar fill="#ffc107" color="#ffc107" />
                  <FaStar fill="#ffc107" color="#ffc107" />
                  <FaStar fill="#ffc107" color="#ffc107" />
                  <FaStar fill="#ffc107" color="#ffc107" />
                  <FaStar fill="#ffc107" color="#ffc107" />
                </div>
              </div>
            </div>
            <div className="PC-testimonial-controls">
              <button className="PC-nav-btn">
                <FiChevronLeft size={20} />
              </button>
              <button className="PC-nav-btn PC-nav-btn-active">
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="PC-section-cta">
        <div className="PC-cta-card">
          <div className="PC-cta-imageWrapper">
            <img
              src="/yarn-heart.png"
              alt="Crochet Heart"
              className="PC-cta-image"
            />
          </div>
          <div className="PC-cta-content">
            <h2>Have a Unique Idea in Mind?</h2>
            <p>Let's turn it into a handmade crochet creation just for you.</p>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="PC-btn PC-btn-white"
            >
              <FaInstagram size={18} color="#af2851" /> Request a Custom Order{" "}
              <FiArrowRight color="#af2851" />
            </a>
          </div>
        </div>
      </section> */}
    </main>
  );
}

export default PersonalizedCreations;
