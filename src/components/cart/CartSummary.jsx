import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiLock } from "react-icons/fi";
import { BiRupee } from "react-icons/bi";

import "./CartSummary.css";

const CartSummary = ({ cart }) => {
  const total = Number(cart?.total || 0);
  const subtotal = Number(cart?.subtotal || 0);
  const discount = Number(cart?.discount || 0);
  const shippingFee = Number(cart?.shippingFee);

  return (
    <aside className="CartSummary">
      <div className="CartSummary-header">
        <p className="CartSummary-eyebrow">ORDER SUMMARY</p>
      </div>

      <div className="CartSummary-details">
        <div className="CartSummary-row">
          <span>Subtotal</span>
          <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
        </div>

        <div className="CartSummary-row">
          <span>Discount</span>
          <strong>₹{discount.toLocaleString("en-IN")}</strong>
        </div>

        <div className="CartSummary-row CartSummary-rowMuted">
          <span>Shipping</span>
          <span>
            {shippingFee !== 0 ? (
              <>₹{shippingFee.toLocaleString("en-IN")}</>
            ) : (
              "Free"
            )}
          </span>
        </div>
      </div>

      <div className="CartSummary-total">
        <span>Total</span>
        <strong>₹{total.toLocaleString("en-IN")}</strong>
      </div>

      <Link to="/products" className="CartSummary-continue-shopping">
        <FiArrowLeft size={16} />
        Continue shopping
      </Link>

      <Link to="/checkout" className="CartSummary-checkout">
        <span>Proceed to checkout</span>
        <FiArrowRight size={17} />
      </Link>

      <div className="CartSummary-note">
        <FiLock size={14} />
        <span>Secure checkout &amp; safe payments</span>
      </div>
    </aside>
  );
};

export default CartSummary;
