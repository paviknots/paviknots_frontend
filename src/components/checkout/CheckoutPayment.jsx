import { FiLock, FiCreditCard } from "react-icons/fi";
import "./CheckoutPayment.css";

const CheckoutPayment = ({ selectedMethod, onSelectMethod }) => {
  return (
    <section className="CheckoutPayment">
      <div className="CheckoutPayment-header">
        <div className="CheckoutPayment-titleWrapper">
          <div>
            <h2 className="CheckoutPayment-title">Payment Method</h2>
            <p className="CheckoutPayment-subtitle">
              Pay securely using Razorpay
            </p>
          </div>
        </div>
      </div>

      <div
        className={`CheckoutPayment-card ${
          selectedMethod === "razorpay" ? "CheckoutPayment-cardSelected" : ""
        }`}
        onClick={() => onSelectMethod("razorpay")}
      >
        <div className="CheckoutPayment-cardLeft">
          <span className="CheckoutPayment-radio">
            {selectedMethod === "razorpay" && (
              <span className="CheckoutPayment-radioDot" />
            )}
          </span>
          <div className="CheckoutPayment-icon">
            <FiCreditCard size={20} />
          </div>
          <div className="CheckoutPayment-info">
            <strong>Razorpay</strong>
            <p>Pay with UPI, Cards, Net Banking and more</p>
          </div>
        </div>

        <div className="CheckoutPayment-logos">
          <span className="CheckoutPayment-logoText">UPI</span>
          <span className="CheckoutPayment-logoText CheckoutPayment-visa">
            VISA
          </span>
          <div className="CheckoutPayment-mcCircles">
            <span className="CheckoutPayment-mcRed"></span>
            <span className="CheckoutPayment-mcYellow"></span>
          </div>
          {/* <span className="CheckoutPayment-logoBank">🏦</span>
          <span className="CheckoutPayment-logoPlus">+4</span> */}
        </div>
      </div>

      <div className="CheckoutPayment-secureNote">
        <FiLock size={14} />
        <span>Your payment information is secure and encrypted.</span>
      </div>
    </section>
  );
};

export default CheckoutPayment;
