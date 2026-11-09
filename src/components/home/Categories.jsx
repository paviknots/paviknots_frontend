import { useEffect, useState } from "react";
import { getCategories } from "../../api/category.api";
import { FaArrowRight } from "react-icons/fa6";

import "./Categories.css";

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCustomClick = (e) => {
    e.preventDefault();
    setIsOverlayOpen(true);
  };

  const handleConfirmCustom = () => {
    setIsOverlayOpen(false);
    window.open(
      "https://www.instagram.com/pavi_knots?rpxt=em80MzBpenF2ejB4&utm_source=qr",
      "_blank",
    );
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  if (loading) {
    return (
      <section className="home-category-section-container home-category-section">
        <div className="home-category-heading-row">
          <h2>Shop by Category</h2>
          <a href="/categories" className="home-category-view-all-link">
            View All <FaArrowRight />
          </a>
        </div>

        <div className="home-category-grid">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="home-category-card"
              style={{ height: "157px", background: "#f5f5f5" }}
            />
          ))}
        </div>
      </section>
    );
  }

  const displayCategories = categories.slice(0, 3);
  const customCategory = {
    id: "custom-order",
    name: "Custom Orders",
    isCustom: true,
  };

  const gridItems = [...displayCategories, customCategory];

  return (
    <section className="home-category-section-container home-category-section">
      <div className="home-category-heading-row">
        <h2>Shop by Category</h2>
        <a href="/categories" className="home-category-view-all-link">
          View All <FaArrowRight />
        </a>
      </div>

      <div className="home-category-grid">
        {gridItems.map((category) => (
          <a
            href={category.isCustom ? "#" : `/category/${category.slug}`}
            className="home-category-card"
            key={category.id || category.name}
            onClick={category.isCustom ? handleCustomClick : undefined}
          >
            {category.imageUrl ? (
              <img src={category.imageUrl} alt={category.name} />
            ) : (
              <img src="/customOrder.png" alt="Custom Orders" />
            )}
            <div>
              <h3>{category.name}</h3>
              <FaArrowRight />
            </div>
          </a>
        ))}
      </div>

      {isOverlayOpen && (
        <div className="home-category-overlay" onClick={handleCloseOverlay}>
          <div
            className="home-category-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Custom Orders</h3>
            <p>
              For custom orders, please contact us directly on Instagram. We'd
              love to craft something special just for you!
            </p>
            <div className="home-category-actions">
              <button
                className="home-category-cancel-btn"
                onClick={handleCloseOverlay}
              >
                Cancel
              </button>
              <button
                className="home-category-confirm-btn"
                onClick={handleConfirmCustom}
              >
                Open Instagram
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
