import "./OurStory.css";
import { FaChevronRight } from "react-icons/fa";

export function OurStory() {
  return (
    <section className="story-section">
      <div className="story-image">
        <img src="/About.png" alt="Colorful crochet yarn and handmade crafts" />
      </div>

      <div className="story-content">
        <span>OUR STORY</span>
        <h2>The PaviKnots Way</h2>

        <p>
          PaviKnots is a handmade crochet brand born out of a love for yarn,
          creativity, and meaningful gifts. Each piece is thoughtfully crafted
          by hand, bringing warmth, joy, and a personal touch to your special
          moments.
        </p>

        <a href="/about" className="story-btn">
          Read More
          <FaChevronRight />
        </a>
      </div>
    </section>
  );
}
