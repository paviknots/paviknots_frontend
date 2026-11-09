import { FiArrowRight } from "react-icons/fi";
import "./OurStory.css";

const OurStory = () => {
  return (
    <section className="OurStory" id="story">
      <div className="OurStory-container">
        <div className="OurStory-visual">
          <div className="OurStory-imageFrame">
            <img
              src="/Ganesha.jpg"
              alt="Handmade crochet creation by PaviKnots"
              className="OurStory-image"
            />
          </div>

          <span className="OurStory-decoration OurStory-decorationTop">✿</span>

          <span className="OurStory-decoration OurStory-decorationBottom">
            ♡
          </span>

          <div className="OurStory-note">
            <span>HANDMADE</span>
            <strong>with patience</strong>
          </div>
        </div>

        <div className="OurStory-content">
          <div className="OurStory-eyebrow">
            <span>✿</span>
            OUR LITTLE STORY
          </div>

          <h2 className="OurStory-title">
            Made slowly.
            <br />
            <em>Made with patience.</em>
          </h2>

          <p className="OurStory-description">
            Every PaviKnots piece begins with a simple idea — turning ordinary
            yarn into something that can make someone smile.
          </p>

          <p className="OurStory-description">
            Each stitch is carefully made by hand, with patience, creativity,
            and a whole lot of love. From little gifts to meaningful keepsakes,
            we create pieces meant to be treasured.
          </p>

          <div className="OurStory-signature">
            <span>Made by hand,</span>
            <strong>made for you ♡</strong>
          </div>

          <a href="/our-story" className="OurStory-button">
            Read Our Story
            <FiArrowRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
