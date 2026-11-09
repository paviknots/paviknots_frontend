import { Link } from "react-router-dom";
import "./CheckoutAddress.css";

const CheckoutAddress = ({ selectedAddress }) => {
  if (!selectedAddress) {
    return (
      <div className="CheckoutAddress">
        <div className="CheckoutAddress-header">
          <h3 className="CheckoutAddress-title">
            No delivery address selected
          </h3>
          <Link to="/checkout/addresses" className="CheckoutAddress-link">
            Add an address
          </Link>
        </div>
      </div>
    );
  }

  const addressParts = [
    selectedAddress.addressLine1,
    selectedAddress.addressLine2,
    selectedAddress.city,
    selectedAddress.state,
    selectedAddress.pincode,
    selectedAddress.country || "India",
  ].filter(Boolean);

  return (
    <div className="CheckoutAddress">
      <div className="CheckoutAddress-header">
        <h3 className="CheckoutAddress-title">
          Delivering to {selectedAddress.name}
        </h3>
      </div>
      <p className="CheckoutAddress-text">{addressParts.join(", ")}</p>
      <Link to="/checkout/addresses" className="CheckoutAddress-link">
        Change the delivery address
      </Link>
    </div>
  );
};

export default CheckoutAddress;
