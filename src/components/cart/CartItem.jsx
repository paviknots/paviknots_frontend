import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMinus, FiPlus } from "react-icons/fi";

import { updateCartItem, removeCartItem } from "../../api/cart.api";

import "./CartItem.css";

const CartItem = ({ item, onCartUpdated }) => {
  const [updating, setUpdating] = useState(false);

  const product = item.product;
  const quantity = Number(item.quantity || 1);
  const price = Number(product?.price || 0);

  const updateQuantity = async (newQuantity) => {
    if (newQuantity < 1 || updating) return;

    try {
      setUpdating(true);

      await updateCartItem(product.id, newQuantity);
      await onCartUpdated();
    } catch (error) {
      console.error(
        "Failed to update cart item:",
        error.response?.data || error.message,
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (updating) return;

    try {
      setUpdating(true);

      await removeCartItem(product.id);
      await onCartUpdated();
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error.response?.data || error.message,
      );
    } finally {
      setUpdating(false);
    }
  };

  if (!product) return null;

  const image = product.images?.[0]?.url;

  return (
    <article className={`CartItem ${updating ? "CartItem-updating" : ""}`}>
      <Link to={`/products/${product.slug}`} className="CartItem-imageLink">
        {image ? (
          <img src={image} alt={product.name} className="CartItem-image" />
        ) : (
          <div className="CartItem-imagePlaceholder">
            <span>✿</span>
          </div>
        )}
      </Link>

      <div className="CartItem-content">
        <div className="CartItem-detailsTop">
          <div className="CartItem-info">
            <Link to={`/products/${product.slug}`} className="CartItem-name">
              {product.name}
            </Link>

            {product.category?.name && (
              <p className="CartItem-category">
                Category: {product.category.name}
              </p>
            )}
          </div>

          <div className="CartItem-pricing">
            <p className="CartItem-price">₹{price.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="CartItem-actionsRow">
          <div className="CartItem-quantity">
            <button
              type="button"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={updating || quantity <= 1}
              aria-label="Decrease quantity"
            >
              <FiMinus size={14} />
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={updating}
              aria-label="Increase quantity"
            >
              <FiPlus size={14} />
            </button>
          </div>

          <span className="CartItem-divider">|</span>

          <button
            type="button"
            className="CartItem-actionBtn"
            onClick={handleRemove}
            disabled={updating}
          >
            Delete
          </button>
          
        </div>
      </div>
    </article>
  );
};

export default CartItem;
