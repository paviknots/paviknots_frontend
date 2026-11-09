import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiHeart } from "react-icons/fi";
import { getRelatedProducts } from "../../api/product.api";
import "./RelatedProducts.css";

const RelatedProducts = ({ slug }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        setLoading(true);
        const data = await getRelatedProducts(slug, 20);
        console.log("data", data);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadRelated();
  }, [slug]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.offsetWidth / 2;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (loading) return null;
  if (!products.length) return null;

  return (
    <section className="RelatedProducts">
      <div className="RelatedProducts-heading">
        <h2>You May Also Like</h2>
      </div>

      <div className="RelatedProducts-carouselWrapper">
        <button
          className="RelatedProducts-arrow RelatedProducts-arrowLeft"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </button>

        <div className="RelatedProducts-carousel" ref={scrollRef}>
          {products.map((item) => {
            const hasDiscount = item.discountPercentage > 0;

            return (
              <Link
                to={`/products/${item.slug}`}
                className="RelatedProducts-card"
                key={item.id}
              >
                <div className="RelatedProducts-image">
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    loading="lazy"
                  />
                </div>

                <div className="RelatedProducts-info">
                  <h3>{item.name}</h3>
                  <div className="RelatedProducts-priceRow">
                    <span className="RelatedProducts-price">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="RelatedProducts-originalPrice">
                          ₹{Number(item.basePrice).toLocaleString("en-IN")}
                        </span>
                        <span className="RelatedProducts-discountBadge">
                          {item.discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <button
          className="RelatedProducts-arrow RelatedProducts-arrowRight"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
};

export default RelatedProducts;
