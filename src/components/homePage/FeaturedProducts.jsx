import { useEffect, useState } from "react";
import { FiHeart, FiArrowUpRight } from "react-icons/fi";
import { getFeaturedProducts } from "../../api/product.api";
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const data = await getFeaturedProducts(4);
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
      <section className="FeaturedProducts" id="shop">
        <div className="FeaturedProducts-container">
          <div className="FeaturedProducts-heading">
            <p className="FeaturedProducts-eyebrow">✿ OUR FAVOURITES</p>
            <h2 className="FeaturedProducts-title">
              Little things worth gifting
            </h2>
          </div>

          <div className="FeaturedProducts-grid">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="FeaturedProducts-skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="FeaturedProducts" id="shop">
      <div className="FeaturedProducts-container">
        <div className="FeaturedProducts-heading">
          <div className="FeaturedProducts-headingTop">
            <p className="FeaturedProducts-eyebrow">✿ OUR FAVOURITES</p>

            <span className="FeaturedProducts-headingDecoration">♡</span>
          </div>

          <h2 className="FeaturedProducts-title">
            Little things worth gifting
          </h2>

          <p className="FeaturedProducts-subtitle">
            Handmade pieces for every little occasion, made slowly and meant to
            make someone smile.
          </p>
        </div>

        <div className="FeaturedProducts-grid">
          {products.map((product) => {
            const image = product.images?.[0]?.url;

            return (
              <article className="FeaturedProducts-card" key={product.id}>
                <div className="FeaturedProducts-imageWrapper">
                  <a
                    href={`/products/${product.slug}`}
                    className="FeaturedProducts-imageLink"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.images?.[0]?.altText || product.name}
                        className="FeaturedProducts-image"
                      />
                    ) : (
                      <div className="FeaturedProducts-imagePlaceholder">
                        PaviKnots
                      </div>
                    )}
                  </a>

                  <button
                    type="button"
                    className="FeaturedProducts-wishlist"
                    aria-label={`Add ${product.name} to wishlist`}
                  >
                    <FiHeart size={17} />
                  </button>

                  <span className="FeaturedProducts-featuredTag">Featured</span>
                </div>

                <div className="FeaturedProducts-info">
                  <p className="FeaturedProducts-category">
                    {product.category?.name}
                  </p>

                  <div className="FeaturedProducts-nameRow">
                    <a
                      href={`/products/${product.slug}`}
                      className="FeaturedProducts-name"
                    >
                      {product.name}
                    </a>

                    <a
                      href={`/products/${product.slug}`}
                      className="FeaturedProducts-arrow"
                      aria-label={`View ${product.name}`}
                    >
                      <FiArrowUpRight size={16} />
                    </a>
                  </div>

                  <p className="FeaturedProducts-price">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="FeaturedProducts-footer">
          <a href="/products" className="FeaturedProducts-viewAll">
            Explore All Creations
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
