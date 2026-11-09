import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { getCategories } from "../../api/category.api";
import "./CategoryShowcase.css";

const CategoryShowcase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data.categories || data || []);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="CategoryShowcase">
        <div className="CategoryShowcase-container">
          <div className="CategoryShowcase-heading">
            <p className="CategoryShowcase-eyebrow">✿ FIND YOUR FAVOURITE</p>

            <h2 className="CategoryShowcase-title">Shop by Category</h2>

            <p className="CategoryShowcase-subtitle">
              Little collections, made with lots of love.
            </p>
          </div>

          <div className="CategoryShowcase-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="CategoryShowcase-skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <section className="CategoryShowcase" id="categories">
      <div className="CategoryShowcase-container">
        <div className="CategoryShowcase-heading">
          <div className="CategoryShowcase-headingTop">
            <p className="CategoryShowcase-eyebrow">✿ FIND YOUR FAVOURITE</p>

            <span className="CategoryShowcase-decoration">♡</span>
          </div>

          <h2 className="CategoryShowcase-title">Shop by Category</h2>

          <p className="CategoryShowcase-subtitle">
            Little collections, made with lots of love.
          </p>
        </div>

        <div className="CategoryShowcase-grid">
          {categories.map((category) => (
            <a
              href={`/category/${category.slug}`}
              className="CategoryShowcase-card"
              key={category.id}
            >
              <div className="CategoryShowcase-imageWrapper">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="CategoryShowcase-image"
                  />
                ) : (
                  <div className="CategoryShowcase-imagePlaceholder">
                    <span>✿</span>
                  </div>
                )}

                <div className="CategoryShowcase-overlay" />

                <div className="CategoryShowcase-content">
                  <span className="CategoryShowcase-smallText">EXPLORE</span>

                  <h3 className="CategoryShowcase-name">{category.name}</h3>

                  <span className="CategoryShowcase-arrow">
                    <FiArrowUpRight size={17} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
