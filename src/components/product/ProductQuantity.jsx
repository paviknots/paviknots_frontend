import { FiMinus, FiPlus } from "react-icons/fi";
import "./ProductQuantity.css";

const ProductQuantity = ({ quantity, stock, onIncrease, onDecrease }) => {
  return (
    <div className="ProductQuantity">
      <button
        type="button"
        className="ProductQuantity-button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <FiMinus size={14} />
      </button>

      <span className="ProductQuantity-value">{quantity}</span>

      <button
        type="button"
        className="ProductQuantity-button"
        onClick={onIncrease}
        aria-label="Increase quantity"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
};

export default ProductQuantity;
