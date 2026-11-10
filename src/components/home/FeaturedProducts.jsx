import { useEffect, useState } from "react";
import { getFeaturedProducts } from "../../api/product.api";
import "./FeaturedProducts.css";
import { FaArrowRight } from "react-icons/fa";
import { data } from "react-router-dom";

export function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const data = await getFeaturedProducts(6);
        console.log(data);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="section-container featured-section">
        <div className="featured-heading-row">
          <h2>Featured Products</h2>
          <a href="/products" className="featured-view-all">
            View All <FaArrowRight />
          </a>
        </div>
        <div className="featured-grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="featured-card-skeleton" />
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="section-container featured-section">
      <div className="featured-heading-row">
        <h2>Featured Products</h2>
        <a href="/products" className="featured-view-all">
          View All <FaArrowRight />
        </a>
      </div>

      <div className="featured-grid">
        {products.map((product) => {
          const image = product.images?.[0]?.url || product.image;
          const hasDiscount = product.discountPercentage > 0;

          return (
            <a
              href={`/products/${product.slug || product.id}`}
              className="featured-card"
              key={product.id}
            >
              <div className="featured-image-wrapper">
                {image ? (
                  <img src={image} alt={product.name} />
                ) : (
                  <div className="featured-image-placeholder">PaviKnots</div>
                )}
              </div>

              <div className="featured-details">
                <h3>{product.name}</h3>

                <div className="featured-priceRow">
                  <strong className="featured-currentPrice">
                    ₹
                    {Number(
                      product.discountedPrice > 0
                        ? product.discountedPrice
                        : product.originalPrice,
                    ).toLocaleString("en-IN")}
                  </strong>

                  {hasDiscount && (
                    <>
                      <span className="featured-originalPrice">
                        ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                      </span>
                      <span className="featured-discountBadge">
                        {product.discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
