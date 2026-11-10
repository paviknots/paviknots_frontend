import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cancelOrder, getOrderDetails } from "../../../api/orders";
import "./OrderDetails.css";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatStatus = (status = "") =>
  status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

function OrderDetails() {
  const { orderNumber } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelling, setCancelling] = useState(false);

  const canCancelOrder = ["PENDING", "CONFIRMED", "PROCESSING"].includes(
    order?.status,
  );

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      const response = await cancelOrder(order.id);

      if (response?.success) {
        setOrder(response.data);
        alert("Your order has been cancelled successfully.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Unable to cancel your order.");
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getOrderDetails(orderNumber);

        if (!response?.success || !response?.data) {
          throw new Error("Unable to retrieve order details.");
        }
        if (isMounted) {
          setOrder(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load order details. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
    return () => {
      isMounted = false;
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <main className="OrderDetails-loading">
        <p>Loading...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main
        className="OrderDetails-error"
        style={{ marginTop: "5rem", marginBottom: "5rem" }}
      >
        <div className="OrderDetails-errorIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
            <circle cx="18" cy="17" r="4" fill="#fbf8f3" />
            <path d="M18 15.5v2" />
            <path d="M18 19h.01" />
          </svg>
        </div>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          We couldn't find your order
        </h1>
        <p style={{ fontSize: "1.3rem", marginBottom: "3rem" }}>
          {error || "The requested order could not be found."}
        </p>
        <Link
          to="/products"
          style={{
            fontSize: "1rem",
            padding: "1rem",
            borderRadius: "10px",
            color: "white",
            background: "var(--accent-pink)",
          }}
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  const refund = order.payment;
  const isCancelled = order.status === "CANCELLED";
  const address = order.address;
  const payment = order.payment;

  const timelineSteps = [
    {
      key: "placed",
      title: "Order Placed",
      description: "We've received your order.",
      date: order.createdAt,
      completed: true,
    },
    {
      key: "payment",
      title: "Payment Confirmed",
      description: "Your payment was successful.",
      date: order.paymentConfirmedAt,
      completed: order.paymentStatus === "SUCCESS",
    },
    {
      key: "confirmed",
      title: "Order Confirmed",
      description: "Your order is confirmed and being prepared.",
      date: order.confirmedAt,
      completed: Boolean(order.confirmedAt),
    },

    ...(isCancelled
      ? [
          {
            key: "cancelled",
            title: "Order Cancelled",
            description: "This order has been cancelled.",
            date: order.cancelledAt || order.updatedAt,
            completed: true,
          },
          ...(refund?.refundStatus
            ? [
                {
                  key: "refund",
                  title:
                    refund.refundStatus === "PROCESSED"
                      ? "Refund Processed"
                      : refund.refundStatus === "FAILED"
                        ? "Refund Failed"
                        : "Refund Initiated",
                  description:
                    refund.refundStatus === "PROCESSED"
                      ? "Your refund has been processed. The amount will be credited to your original payment method within 5–7 working days."
                      : refund.refundStatus === "FAILED"
                        ? "We couldn't process your refund. Please contact us through email or Instagram for assistance."
                        : "Your refund request has been inititated and is currently being processed.",
                  date: refund.refundProcessedAt || refund.refundInitiatedAt,
                  completed: refund.refundStatus === "PROCESSED",
                },
              ]
            : []),
        ]
      : [
          {
            key: "shipped",
            title: "Shipped",
            description: "Your order is on its way.",
            date: order.shippedAt,
            completed: Boolean(order.shippedAt),
          },
          {
            key: "delivered",
            title: "Delivered",
            description: "Your order has been delivered.",
            date: order.deliveredAt,
            completed: Boolean(order.deliveredAt),
          },
        ]),
  ];

  return (
    <main className="OrderDetails">
      <div className="OrderDetails-container">
        <nav className="OrderDetails-breadcrumb">
          {/* <Link to="/">Your Account</Link>
          <span>›</span> */}
          <Link to="/orders">Your Orders</Link>
          <span>›</span>
          <span className="OrderDetails-crumbActive">Order Details</span>
        </nav>

        <div className="OrderDetails-header">
          <h1>Order Details</h1>
          <div className="OrderDetails-headerActions">
            <div className="OrderDetails-subHeader">
              <div className="OrderDetails-orderMeta">
                <div className="OrderDetails-metaItem">
                  <span className="OrderDetails-metaLabel">Order placed: </span>
                  <span className="OrderDetails-metaValue">
                    {order.createdAt ? formatDate(order.createdAt) : "—"}
                  </span>
                </div>

                <span className="OrderDetails-metaDivider">|</span>

                <div className="OrderDetails-metaItem">
                  <span className="OrderDetails-metaLabel">Order number: </span>
                  <span className="OrderDetails-metaValue">
                    {order.orderNumber}
                  </span>
                </div>
              </div>
            </div>
            {canCancelOrder && (
              <button
                type="button"
                className="OrderDetails-cancelBtn"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>

        <div className="OrderDetails-summaryBox">
          <div className="OrderDetails-summaryCol">
            <strong>Ship to</strong>
            {address ? (
              <div className="OrderDetails-addressText">
                <span>{address.name}</span>
                <span>{address.addressLine1}</span>
                {address.addressLine2 && <span>{address.addressLine2}</span>}
                <span>
                  {address.city}, {address.state}
                </span>
                <span>
                  {address.country || "INDIA"}, {address.pincode}
                </span>
              </div>
            ) : (
              <span>Address unavailable</span>
            )}
          </div>

          <div className="OrderDetails-summaryCol">
            <strong>Payment method</strong>
            <span>{formatStatus(payment?.method || "Razorpay")}</span>
          </div>

          <div className="OrderDetails-summaryCol OrderDetails-costSummary">
            <strong>Order Summary</strong>
            <div className="OrderDetails-costRow">
              <span>Item(s) Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="OrderDetails-costRow">
              <span>Total Discount:</span>
              <span>{formatPrice(order.discountAmount)}</span>
            </div>
            <div className="OrderDetails-costRow">
              <span>Shipping:</span>
              <span>{formatPrice(order.shippingAmount)}</span>
            </div>
            <div className="OrderDetails-costRow OrderDetails-grandTotal">
              <strong>Grand Total:</strong>
              <strong>{formatPrice(order.totalAmount)}</strong>
            </div>
          </div>
        </div>

        <div className="OrderDetails-lowerLayout">
          <div className="OrderDetails-itemsBox">
            <div className="OrderDetails-itemsHeader">
              <div className="OrderDetails-statusBlock">
                <h2>{formatStatus(order.status || "Confirmed")}</h2>
                <p>
                  Your order is {formatStatus(order.status || "confirmed")}.
                </p>
              </div>
            </div>

            {order.items?.map((item) => (
              <div className="OrderDetails-itemRow" key={item.id}>
                <div className="OrderDetails-itemImage">
                  {item.images ? (
                    <img src={item.images[0].url} alt={item.name} />
                  ) : (
                    <span>PK</span>
                  )}
                </div>
                <div className="OrderDetails-itemInfo">
                  <Link
                    to={`/products/${item.slug}`}
                    className="OrderDetails-itemName"
                  >
                    {item.name}
                  </Link>
                  <span className="OrderDetails-itemPrice">
                    {formatPrice(item.originalPrice)}
                  </span>
                  <span className="OrderDetails-quantity">
                    Qty:{item.quantity}
                  </span>

                  <div className="OrderDetails-itemButtons">
                    {/* <button className="OrderDetails-btnPrimary">
                      Buy It Again
                    </button> */}
                    <Link
                      to={`/products/${encodeURIComponent(item.slug)}`}
                      className="OrdersPage-btnSecondary"
                    >
                      View your item
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="OrderDetails-timelineBox">
            <h2>Order Timeline</h2>
            <div className="OrderDetails-timeline">
              {timelineSteps.map((step) => (
                <div
                  key={step.key}
                  className={`OrderDetails-timelineNode ${
                    step.completed ? "is-completed" : ""
                  }`}
                >
                  <div className="OrderDetails-timelineDot">
                    {step.completed && <span>✓</span>}
                  </div>

                  <div className="OrderDetails-timelineContent">
                    <strong>{step.title}</strong>

                    <p>{step.description}</p>

                    {step.date && (
                      <span>
                        {formatDate(step.date)}, {formatTime(step.date)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;
