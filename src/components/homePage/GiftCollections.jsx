import { FiArrowUpRight } from "react-icons/fi";
import "./GiftCollections.css";

const GiftCollections = () => {
  return (
    <section className="GiftCollections">
      <div className="GiftCollections-container">
        <div className="GiftCollections-heading">
          <div className="GiftCollections-headingTop">
            <p className="GiftCollections-eyebrow">
              ✿ MADE FOR SPECIAL MOMENTS
            </p>

            <span className="GiftCollections-decoration">♡</span>
          </div>

          <h2 className="GiftCollections-title">
            Gifts that say
            <em>a little more</em>
          </h2>

          <p className="GiftCollections-subtitle">
            Thoughtful handmade pieces for birthdays, celebrations, thank-yous,
            and those little moments when you just want someone to know you're
            thinking of them.
          </p>
        </div>

        <div className="GiftCollections-grid">
          {/* Large collection */}
          <a
            href="/products?occasion=birthday"
            className="GiftCollections-card GiftCollections-cardLarge"
          >
            <div className="GiftCollections-imageWrapper">
              <img
                src="/Ganesha.jpg"
                alt="Handmade crochet gift for a special occasion"
                className="GiftCollections-image"
              />

              <div className="GiftCollections-overlay" />

              <div className="GiftCollections-content">
                <span className="GiftCollections-number">01</span>

                <div className="GiftCollections-text">
                  <span className="GiftCollections-label">
                    FOR THE BIRTHDAY ONE
                  </span>

                  <h3 className="GiftCollections-name">
                    Birthday
                    <br />
                    little joys
                  </h3>

                  <span className="GiftCollections-link">
                    Explore collection
                    <FiArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </a>

          {/* Top right */}
          <a
            href="/products?occasion=thank-you"
            className="GiftCollections-card GiftCollections-cardSmall"
          >
            <div className="GiftCollections-imageWrapper">
              <img
                src="/Muruga.jpg"
                alt="Handmade crochet thank you gift"
                className="GiftCollections-image"
              />

              <div className="GiftCollections-overlay" />

              <div className="GiftCollections-content">
                <span className="GiftCollections-number">02</span>

                <div className="GiftCollections-text">
                  <span className="GiftCollections-label">JUST BECAUSE</span>

                  <h3 className="GiftCollections-name">
                    A little
                    <br />
                    thank you
                  </h3>

                  <span className="GiftCollections-link">
                    Explore
                    <FiArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </a>

          {/* Bottom right */}
          <a
            href="/products?occasion=celebration"
            className="GiftCollections-card GiftCollections-cardSmall GiftCollections-cardAccent"
          >
            <div className="GiftCollections-imageWrapper">
              <img
                src="/Ganesha.jpg"
                alt="Handmade crochet celebration gift"
                className="GiftCollections-image"
              />

              <div className="GiftCollections-overlay" />

              <div className="GiftCollections-content">
                <span className="GiftCollections-number">03</span>

                <div className="GiftCollections-text">
                  <span className="GiftCollections-label">
                    SOMETHING TO CELEBRATE
                  </span>

                  <h3 className="GiftCollections-name">
                    Happy
                    <br />
                    moments
                  </h3>

                  <span className="GiftCollections-link">
                    Explore
                    <FiArrowUpRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>

        <div className="GiftCollections-footer">
          <span className="GiftCollections-footerLine" />
          <p className="GiftCollections-footerText">
            Made for giving. Made to be remembered. ♡
          </p>
          <span className="GiftCollections-footerLine" />
        </div>
      </div>
    </section>
  );
};

export default GiftCollections;
