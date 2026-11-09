import {
  FiHeart,
  FiBox,
  FiTruck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="Hero" id="home">
      <div className="Hero-bgPattern" />
      <svg
        className="Hero-yarnBackground"
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
      >
        <path
          d="M-50,150 C150,100 250,300 450,200 C600,100 750,250 1050,150"
          fill="none"
          stroke="#e8c7cc"
          strokeWidth="1.5"
        />
      </svg>
      <div className="Hero-yarnBallBackground">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="25" stroke="#e8c7cc" strokeWidth="1.5" />
          <path
            d="M15 20 C25 10 40 40 45 30"
            stroke="#e8c7cc"
            strokeWidth="1.5"
          />
          <path
            d="M15 40 C20 30 45 20 40 45"
            stroke="#e8c7cc"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <span className="Hero-bgDecoration Hero-bgDecoOne">✿</span>
      <span className="Hero-bgDecoration Hero-bgDecoTwo">✿</span>

      <div className="Hero-container">
        <div className="Hero-content">
          <div className="Hero-ratingBadge animate-fade-in">
            <span className="Hero-ratingStars">⭐⭐⭐⭐⭐</span>
            <span className="Hero-ratingText">
              <strong>4.9/5</strong> by 2000+ happy homes
            </span>
          </div>

          <p className="Hero-eyebrow">HANDMADE CROCHET CREATIONS</p>

          <h1 className="Hero-title">
            Little Knots,
            <br />
            <span className="Hero-titleAccent">Lovely Things</span>
            <span className="Hero-titleHeart">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d58b96"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </span>
          </h1>

          <p className="Hero-description">
            At PaviKnots, every knot becomes part of a little story — handmade
            for the moments that matter.
          </p>

          <div className="Hero-buttonWrapper">
            <a href="#shop" className="Hero-button">
              Shop Now
              <span className="Hero-buttonArrow">→</span>
            </a>
            <span className="Hero-buttonAnnotation">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 18L18 6M18 6H10M18 6V14"
                  stroke="#d58b96"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="Hero-visual">
          <div className="Hero-collage">
            <div className="Hero-handwrittenDeco">
              A little something,
              <br />
              for someone special ♡
            </div>

            <div className="Hero-card Hero-cardMain">
              <div className="Hero-polaroid">
                <img
                  src="/Ganesha.jpg"
                  alt="Handmade Ganesha crochet"
                  className="Hero-polaroidImage"
                />
              </div>
            </div>

            <div className="Hero-card Hero-cardLeft">
              <div className="Hero-polaroid">
                <img
                  src="/Muruga.jpg"
                  alt="Crochet Krishna"
                  className="Hero-polaroidImage"
                />
              </div>
              <span className="Hero-doodleHeart">♡</span>
            </div>

            <div className="Hero-card Hero-cardRight">
              <div className="Hero-tape"></div>
              <div className="Hero-polaroid">
                <img
                  src="/Ganesha.jpg"
                  alt="Crochet Ganesha"
                  className="Hero-polaroidImage"
                />
              </div>
            </div>

            <div className="Hero-note Hero-noteTop">
              <span className="Hero-notePin">📌</span>
              <span className="Hero-noteLine" />
              <span className="Hero-noteText">
                Little creations,
                <br />
                brighter days
              </span>
              <span className="Hero-noteHeart">♡</span>
            </div>

            <div className="Hero-noteSquare">
              <div className="Hero-tape Hero-tapeNote"></div>
              Handmade
              <br />
              with
              <br />
              Patience
              <br />
              <span>♡</span>
            </div>
          </div>

          <div className="Hero-mobileCarousel">
            <svg
              className="Hero-mobileDoodleLeft"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M20 10 C 10 0, 0 10, 20 30 C 40 10, 30 0, 20 10"
                stroke="#d58b96"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>


            <div className="Hero-blobContainer">
              <button className="Hero-navBtn Hero-navLeft">
                <FiChevronLeft size={20} />
              </button>

              <img
                src="/Ganesha.jpg"
                alt="Handmade Ganesha crochet"
                className="Hero-blobImage"
              />

              <button className="Hero-navBtn Hero-navRight">
                <FiChevronRight size={20} />
              </button>
            </div>

            <div className="Hero-carouselDots">
              <span className="Hero-dot active"></span>
              <span className="Hero-dot"></span>
              <span className="Hero-dot"></span>
            </div>
          </div>
        </div>

        <div className="Hero-valuesRow">
          <div className="Hero-valueItem">
            <div className="Hero-valueIcon">
              <FiHeart size={20} />
            </div>
            <span>
              Handmade
              <br />
              with Love
            </span>
          </div>
          <div className="Hero-valueItem">
            <div className="Hero-valueIcon">
              <FiBox size={20} />
            </div>
            <span>
              Secure
              <br />
              Packaging
            </span>
          </div>
          <div className="Hero-valueItem">
            <div className="Hero-valueIcon">
              <FiTruck size={20} />
            </div>
            <span>
              Pan India
              <br />
              Shipping
            </span>
          </div>
          <div className="Hero-valueItem">
            <div className="Hero-valueIcon">
              <LuLeaf size={20} />
            </div>
            <span>
              Made for
              <br />
              Everyday Joy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
