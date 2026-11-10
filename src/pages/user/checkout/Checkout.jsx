import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { FiAlertTriangle, FiChevronLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import { getCart } from "../../../api/cart.api";
import {
  getAddresses,
  checkout,
  verifyPayment,
  cancelCheckout,
} from "../../../api/checkout.api";

import CheckoutAddress from "../../../components/checkout/CheckoutAddress";
import CheckoutPayment from "../../../components/checkout/CheckoutPayment";
import CheckoutSummary from "../../../components/checkout/CheckoutSummary";

import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(
    location.state?.selectedAddress || null,
  );

  const [selectedMethod, setSelectedMethod] = useState("razorpay");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    loadCheckout();
  }, []);

  const loadCheckout = async () => {
    try {
      setLoading(true);

      const [cartResponse, addressResponse] = await Promise.all([
        getCart(),
        getAddresses(),
      ]);

      const cartData = cartResponse.data;
      const addressData = addressResponse.data || [];

      setCart(cartData);
      setAddresses(addressData);

      const defaultAddress =
        addressData.find((address) => address.isDefault) || null;

      setSelectedAddress((currentAddress) => currentAddress || defaultAddress);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (forceOverride = false) => {
    const isForce = forceOverride === true;
    if (placingOrder) return;

    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (selectedMethod !== "razorpay") {
      toast.error("Please select a valid payment method.");
      return;
    }

    if (!cart?.items?.length) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await checkout(selectedAddress.id, isForce);

      const checkoutData = response.data;
      const razorpayData = checkoutData.razorpay;

      if (!razorpayData || !window.Razorpay) {
        throw new Error("Razorpay Checkout could not be initialized.");
      }

      const options = {
        key: razorpayData.keyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "PaviKnots",
        description: "Handmade crochet order",
        order_id: razorpayData.orderId,

        prefill: {
          name: selectedAddress.name,
          contact: selectedAddress.phone,
        },

        notes: {
          orderId: checkoutData.order.id,
          orderNumber: checkoutData.order.orderNumber,
        },

        handler: async (paymentResponse) => {
          try {
            setPlacingOrder(true);
            const verificationResponse = await verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });
            navigate(`/order-success?order=${checkoutData.order.orderNumber}`);
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                "Payment verification failed. Please contact support.",
            );
          } finally {
            setPlacingOrder(false);
          }
        },

        modal: {
          ondismiss: async () => {
            try {
              const cancelResponse = await cancelCheckout(
                checkoutData.order.id,
              );
              if (cancelResponse.data.paid) {
                navigate(
                  `/order-success?order=${checkoutData.order.orderNumber}`,
                );
                return;
              }
              toast.success(
                cancelResponse.data.message ||
                  "Checkout cancelled. You can try again.",
              );
            } catch (error) {
              toast.error(
                error.response?.data?.message ||
                  "Unable to check payment status. Please try again shortly.",
              );
            } finally {
              setPlacingOrder(false);
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (paymentResponse) => {
        toast.error(paymentResponse.error?.description || "Payment failed.");
        setPlacingOrder(false);
      });

      razorpay.open();
    } catch (error) {
      if (error.response?.data?.code === "CHECKOUT_IN_PROGRESS" && !isForce) {
        setShowOverrideModal(true);
        setPlacingOrder(false);
        return;
      }
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to initialize checkout.",
      );
    }
  };

  const confirmRestartCheckout = () => {
    setShowOverrideModal(false);
    handlePlaceOrder(true);
  };

  if (loading) {
    return (
      <main className="Checkout Checkout-loading">
        <p>Preparing your checkout...</p>
      </main>
    );
  }

  if (!cart?.items?.length) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <main className="Checkout">
      <div className="Checkout-container">
        <div className="Checkout-container-main">
          <Link to="/cart" className="Checkout-backToCart">
            <FiChevronLeft size={16} />
            <span>Back to cart</span>
          </Link>

          <header className="Checkout-pageHeader">
            <h1 className="Checkout-pageTitle">Checkout</h1>

            <p className="Checkout-pageSubtitle">
              A few details, and your handmade piece is ready to come home.
            </p>
          </header>

          <div className="Checkout-main">
            <CheckoutAddress selectedAddress={selectedAddress} />

            <CheckoutPayment
              selectedMethod={selectedMethod}
              onSelectMethod={setSelectedMethod}
            />
          </div>
        </div>

        <div className="Checkout-layout">
          <CheckoutSummary
            cart={{ ...cart }}
            loading={placingOrder}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
      {showOverrideModal && (
        <div className="Checkout-modal-overlay">
          <div className="Checkout-modal-content">
            <div className="Checkout-modal-header">
              <div className="Checkout-modal-icon">
                <FiAlertTriangle size={24} />
              </div>
              <h2>Payment in Progress</h2>
            </div>

            <p>
              It looks like you have a previous payment process that wasn't
              completed. Would you like to cancel the previous session and start
              a new payment?
            </p>

            <div className="Checkout-modal-actions">
              <button
                className="Checkout-modal-btn Checkout-modal-btn-cancel"
                onClick={() => setShowOverrideModal(false)}
                disabled={placingOrder}
              >
                Go Back
              </button>
              <button
                className="Checkout-modal-btn Checkout-modal-btn-confirm"
                onClick={confirmRestartCheckout}
                disabled={placingOrder}
              >
                {placingOrder ? "Starting..." : "Start New Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;
