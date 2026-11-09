import { FiHeart, FiShoppingBag } from "react-icons/fi";
import ProductQuantity from "./ProductQuantity";
import "./ProductPurchase.css";

const ProductPurchase = ({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onAddToCart,
  addingToCart = false,
  isLoggedIn = false,
}) => {
  const stock = Number(product?.stock || 0);

  return (
    <div className="ProductPurchase">
      <div className="ProductPurchase-actions">
        <ProductQuantity
          quantity={quantity}
          stock={stock}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />

        <button
          type="button"
          className="ProductPurchase-addButton"
          onClick={onAddToCart}
          disabled={addingToCart}
        >
          <FiShoppingBag size={17} />

          <span>
            {addingToCart
              ? "Adding..."
              : isLoggedIn
                ? "Add to Cart"
                : "Login to Add to Cart"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductPurchase;
