import { FaArrowRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

import "./Hero.css";
export function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>
          <span className="hero-script">Handmade Crochet</span>
          <br />
          <span className="hero-serif">Creations for a</span>
          <br />
          <em className="hero-script highlight">Happier Diwali</em>{" "}
          <span className="diya-icon">
            🪔
            <span className="spark-right"></span>
          </span>
        </h1>

        <p>
          Unique, handcrafted crochet dolls, gifts, and décor made with love,
          perfect for the festive season.
        </p>

        <div className="hero-buttons">
          <a href="/products" className="hero-primary-btn">
            Shop Collection <FaArrowRight />
          </a>
        </div>
      </div>

      <div className="hero-image">
        <div className="hero-image-before"></div>
        <div className="hero-image-container">
          <img src="homeBanner.png" alt="Handmade crochet festive dolls" />
        </div>
      </div>
    </section>
  );
}
