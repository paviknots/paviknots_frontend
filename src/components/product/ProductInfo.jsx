import { FiTag } from "react-icons/fi";
import "./ProductInfo.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import ProductPerks from "./ProductPerks";

const ProductInfo = ({ product }) => {
  const stock = Number(product?.stock || 0);
  const isOutOfStock = stock <= 0;
  const hasDiscount = product?.discountPercentage > 0;

  // Function to smoothly scroll to the details section
  const handleScrollToDetails = (e) => {
    e.preventDefault();
    const detailsSection = document.getElementById("extended-product-details");
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="ProductInfo">
      <p className="ProductInfo-category">
        {product?.category?.name || "Handmade"}
      </p>

      <h1 className="ProductInfo-title">{product?.name}</h1>

      <div className="ProductInfo-priceContainer">
        <p className="ProductInfo-price">
          ₹{Number(product?.price || 0).toLocaleString("en-IN")}
        </p>

        {hasDiscount && (
          <>
            <span className="ProductInfo-originalPrice">
              ₹{Number(product?.basePrice).toLocaleString("en-IN")}
            </span>
            <span className="ProductInfo-discountBadge">
              <FiTag size={12} /> {product.discountPercentage}% OFF
            </span>
          </>
        )}
      </div>

      <div className="ProductInfo-stock" style={{ marginTop: "16px" }}>
        {isOutOfStock ? (
          <span className="ProductInfo-stockOut">Currently unavailable</span>
        ) : (
          <span className="ProductInfo-stockAvailable">In stock</span>
        )}
      </div>

      <div className="ProductInfo-divider" />

      <div className="ProductInfo-description">
        <p>{product?.description}</p>
      </div>
      {product?.perfectFor && (
        <div
          className="ProductInfo-description"
          style={{ fontStyle: "italic" }}
        >
          <p>Perfect for {product?.perfectFor}</p>
        </div>
      )}

      <button
        className="ProductInfo-seeMoreBtn"
        onClick={handleScrollToDetails}
      >
        <MdKeyboardArrowRight size={20} /> See more product details
      </button>
      <div style={{ width: "100%" }}>
        <ProductPerks />
      </div>
      {/* <div
        style={{
          background: "var(--primary)",
          color: "white",
          padding: "20px",
        }}
      >
        <p>Why you love it</p>
        <ol>
          <li>A dive and traditional handmade piece </li>
          <li>A dive and traditional handmade piece </li>
        </ol>
      </div> */}
    </div>
  );
};

export default ProductInfo;
