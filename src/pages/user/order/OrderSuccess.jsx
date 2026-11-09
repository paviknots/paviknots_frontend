import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheck, FiArrowRight } from "react-icons/fi";

import { getOrderDetails } from "../../../api/orders";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      if (!orderNumber) {
        setError("We couldn't find your order reference.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");

        const response = await getOrderDetails(orderNumber);
        const orderData = response?.data;

        if (cancelled) return;

        if (!orderData) {
          setError("We couldn't find your order.");
          return;
        }

        setOrder(orderData);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load your order details.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <main className="OrderSuccess OrderSuccess-state">
        <span className="OrderSuccess-loader" />
        <p>Loading your order details...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main
        className="OrderSuccess"
        style={{ display: "flex", flexDirection: "column", margin: "5rem" }}
      >
        <div className="OrderSuccess-errorIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="15"
              y="22"
              width="42"
              height="42"
              rx="3"
              stroke="#000"
              strokeWidth="1.6"
            />

            <path d="M15 32H57" stroke="#000" strokeWidth="1.6" />

            <path
              d="M27 22V17H45V22"
              stroke="#000"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle
              cx="54"
              cy="53"
              r="15"
              fill="none"
              stroke="#000"
              strokeWidth="1.6"
            />

            <path
              d="M54 45V54"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <circle cx="54" cy="60" r="1.3" fill="#000" />

            <path
              d="M25 42H37M25 49H33"
              stroke="#000"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Order details unavailable
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
          {error || "Please check your order reference."}
        </p>
        <Link
          to="/products"
          className="OrderSuccess-primaryButton"
          style={{
            fontSize: "1rem",
            borderRadius: "10px",
            color: "white",
            width: "250px",
          }}
        >
          Continue shopping
          <FiArrowRight />
        </Link>
      </main>
    );
  }

  return (
    <main className="OrderSuccess">
      <div className="OrderSuccess-container">
        <section className="OrderSuccess-hero">
          <div className="OrderSuccess-check">
            <FiCheck />
          </div>

          <p className="OrderSuccess-eyebrow">ORDER CONFIRMATION</p>

          <h1 className="orderplaced">
            Order placed <br />
            successfully.
          </h1>

          <p className="OrderSuccess-description">
            Thank you for shopping with PaviKnots.
            <br className="OrderSuccess-desktopBreak" />
            We're getting your knots ready.
          </p>

          <p className="OrderSuccess-orderNumber">
            Order number: <strong>#{order.orderNumber}</strong>
          </p>
        </section>

        <div className="OrderSuccess-actions">
          <Link
            to={`/orders/${encodeURIComponent(order.orderNumber)}`}
            className="OrderSuccess-primaryButton"
          >
            View order details
            <FiArrowRight />
          </Link>

          <Link to="/products" className="OrderSuccess-secondaryButton">
            Continue shopping
          </Link>
        </div>

        {/* <p className="OrderSuccess-footerNote">
          Handmade with care, just for you.
        </p> */}
      </div>
    </main>
  );
};

export default OrderSuccess;
