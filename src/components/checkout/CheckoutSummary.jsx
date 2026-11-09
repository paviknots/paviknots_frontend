import { FiLock } from "react-icons/fi";
import "./CheckoutSummary.css";

const CheckoutSummary = ({ cart, onPlaceOrder, loading = false }) => {
  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);
  const shipping = Number(cart?.shippingFee);
  const discount = Number(cart?.discount || 0);
  const total = Number(cart?.total);
  console.log(cart);

  return (
    <aside className="CheckoutSummary">
      <div className="CheckoutSummary-header">
        <h2 className="CheckoutSummary-title">Order Summary</h2>
        <span className="CheckoutSummary-count">
          {cart?.itemCount || 0} items
        </span>
      </div>

      <div className="CheckoutSummary-items">
        {items.map((item) => {
          const product = item.product;
          const quantity = Number(item.quantity || 1);
          const price = Number(product?.price);
          const image = product?.images?.[0]?.url;

          return (
            <div key={item.id} className="CheckoutSummary-item">
              <div className="CheckoutSummary-image">
                {image ? (
                  <img src={image} alt={product?.name} />
                ) : (
                  <span>✿</span>
                )}
              </div>

              <div className="CheckoutSummary-product">
                <span className="CheckoutSummary-productName">
                  {product?.name}
                </span>
                <span className="CheckoutSummary-productPrice">
                  ₹{price.toLocaleString("en-IN")} each
                </span>
                <span className="CheckoutSummary-productQty">
                  Qty: {quantity}
                </span>
              </div>

              <div className="CheckoutSummary-itemTotal">
                ₹{(price * quantity).toLocaleString("en-IN")}
              </div>
            </div>
          );
        })}
      </div>

      <div className="CheckoutSummary-pricing">
        <div className="CheckoutSummary-row">
          <span>Subtotal</span>
          <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
        </div>
        <div className="CheckoutSummary-row">
          <span>Discount</span>
          <strong>- ₹{discount.toLocaleString("en-IN")}</strong>
        </div>
        <div className="CheckoutSummary-row">
          <span>Shipping</span>
          <span>₹{shipping.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="CheckoutSummary-total">
        <span>Total</span>
        <strong className="CheckoutSummary-totalAmount">
          ₹{total.toLocaleString("en-IN")}
        </strong>
      </div>

      <button
        type="button"
        className="CheckoutSummary-payBtn"
        onClick={onPlaceOrder}
        disabled={loading}
      >
        {loading ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
      </button>

      <div className="CheckoutSummary-secure">
        <FiLock size={12} />
        <span>Secure payment powered by Razorpay</span>
      </div>
    </aside>
  );
};

export default CheckoutSummary;
