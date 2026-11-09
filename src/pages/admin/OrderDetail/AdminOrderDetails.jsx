import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAdminOrderDetails,
  updateAdminOrderStatus,
} from "../../../api/admin.api";
import { MdOutlineRefresh } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";

import "./AdminOrderDetails.css";

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(Number(amount));

const formatDate = (date) => {
  if (!date) return "—";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
};

const formatTime = (date) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

const formatStatus = (status = "") =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const getAddressLines = (order) => {
  const fields = [
    order.shippingAddress1,
    order.shippingAddress2,
    order.shippingLandmark,
    [order.shippingCity, order.shippingState].filter(Boolean).join(", "),
    order.shippingCountry || "India",
    order.shippingPinCode,
  ];
  return fields.filter(Boolean);
};

export default function AdminOrderDetails() {
  const { orderNumber } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminOrderDetails(orderNumber);

      if (!response?.success || !response.data) {
        throw new Error(response?.message || "Unable to fetch order details.");
      }
      const orderData = response.data;
      setOrder(orderData);
      console.log(order);
      setNewStatus(orderData.status);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch order details.",
      );
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (event) => {
    event.preventDefault();
    if (!order || !newStatus || newStatus === order.status) return;

    const confirmed = window.confirm(
      `Change order ${order.orderNumber} to ${formatStatus(newStatus)}?`,
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setNotice("");
      const response = await updateAdminOrderStatus(order.id, newStatus);
      if (!response?.success) {
        throw new Error(response?.message || "Unable to update order status.");
      }
      setNotice("Order status updated successfully.");
      await fetchOrder();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update order status.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="AdminOrderDetails-loading">
        <p>Loading order details...</p>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="AdminOrderDetails-errorState">
        <Link to="/paviknots/admin/orders">
          <IoMdArrowBack /> Back to orders
        </Link>
        <h2>Unable to load order</h2>
        <p>{error}</p>
        <button onClick={fetchOrder}>Try again</button>
      </main>
    );
  }

  const items = order.items ?? [];
  const payment = order.payment ?? null;
  const shippingLines = getAddressLines(order);

  const canUpdateStatus =
    order.status !== "DELIVERED" && order.status !== "CANCELLED";
  const paymentIsSuccessful = order.paymentStatus === "SUCCESS";

  const allowedStatuses = STATUS_OPTIONS.filter((status) => {
    if (
      ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(status) &&
      !paymentIsSuccessful
    ) {
      return false;
    }
    switch (order.status) {
      case "PENDING":
        return ["PENDING", "CONFIRMED", "CANCELLED"].includes(status);
      case "CONFIRMED":
        return ["CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].includes(
          status,
        );
      case "PROCESSING":
        return ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(
          status,
        );
      case "SHIPPED":
        return ["SHIPPED", "DELIVERED"].includes(status);
      case "DELIVERED":
      case "CANCELLED":
        return false;
      default:
        return status === order.status;
    }
  });

  // Calculate generic subtotal if not strictly provided
  const subtotal = order.subtotal;
  const shippingAmount = order.shippingAmount;

  return (
    <main className="AdminOrderDetails">
      <div className="AdminOrderDetails-container">
        <div className="AdminOrderDetails-topBar">
          <Link
            to="/paviknots/admin/orders"
            className="AdminOrderDetails-backLink"
          >
            <IoMdArrowBack />
            Back to orders
          </Link>
          <button
            className="AdminOrderDetails-refreshBtn"
            onClick={fetchOrder}
            disabled={loading}
          >
            <MdOutlineRefresh size={18} /> Refresh
          </button>
        </div>

        <div className="AdminOrderDetails-header">
          <h1>Order Details</h1>
          <div className="AdminOrderDetails-meta">
            <span>Order placed: {formatDate(order.createdAt)}</span>
            <span className="AdminOrderDetails-metaDivider">|</span>
            <span>Order number: {order.orderNumber}</span>
          </div>
        </div>

        {error && (
          <div className="AdminOrderDetails-alert AdminOrderDetails-alertError">
            {error}
          </div>
        )}
        {notice && (
          <div className="AdminOrderDetails-alert AdminOrderDetails-alertSuccess">
            {notice}
          </div>
        )}

        <div className="AdminOrderDetails-summaryBox">
          <div className="AdminOrderDetails-summaryCol">
            <strong>Ship to</strong>
            <div className="AdminOrderDetails-addressText">
              <span className="AdminOrderDetails-customerName">
                {order.customerName || order.user?.name || "Customer"}
              </span>
              <span className="AdminOrderDetails-customerContact">
                {order.customerEmail || order.user?.email}
              </span>
              <span className="AdminOrderDetails-customerContact">
                {order.customerPhone || order.user?.phone}
              </span>
              {shippingLines.map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </div>
          </div>

          <div className="AdminOrderDetails-summaryCol">
            <strong>Payment method</strong>
            <div className="AdminOrderDetails-paymentText">
              <span>{payment?.provider || "Razorpay"}</span>
              <span>Status: {formatStatus(order.paymentStatus)}</span>
              {payment?.razorpayPaymentId && (
                <span className="AdminOrderDetails-paymentId">
                  ID: {payment.razorpayPaymentId}
                </span>
              )}
            </div>
          </div>

          <div className="AdminOrderDetails-summaryCol AdminOrderDetails-costSummary">
            <strong>Order Summary</strong>
            <div className="AdminOrderDetails-costRow">
              <span>Item(s) Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="OrderDetails-costRow">
              <span>Total Discount:</span>
              <span>{formatCurrency(order.discountAmount)}</span>
            </div>
            <div className="AdminOrderDetails-costRow">
              <span>Shipping:</span>
              <span>{formatCurrency(shippingAmount)}</span>
            </div>
            <div className="AdminOrderDetails-costRow AdminOrderDetails-grandTotal">
              <strong>Grand Total:</strong>
              <strong>{formatCurrency(order.totalAmount)}</strong>
            </div>
          </div>
        </div>

        <div className="AdminOrderDetails-layout">
          <div className="AdminOrderDetails-main">
            <section className="AdminOrderDetails-itemsBox">
              <div className="AdminOrderDetails-itemsHeader">
                <h2>{formatStatus(order.status)}</h2>
                <p>This order is {formatStatus(order.status)}.</p>
              </div>

              {items.length === 0 ? (
                <p className="AdminOrderDetails-empty">No items found.</p>
              ) : (
                <div className="AdminOrderDetails-itemsList">
                  {items.map((item) => {
                    const productName =
                      item.productName ||
                      item.name ||
                      item.product?.name ||
                      "Product";
                    const unitPrice = Number(
                      item.productPrice ?? item.price ?? 0,
                    );
                    const quantity = Number(item.quantity ?? 0);
                    const imageUrl =
                      item.imageUrl ||
                      item.image ||
                      item.product?.images?.[0]?.url ||
                      item.images?.[0]?.url;

                    return (
                      <article className="AdminOrderDetails-item" key={item.id}>
                        <div className="AdminOrderDetails-itemImage">
                          {imageUrl ? (
                            <img src={imageUrl} alt={productName} />
                          ) : (
                            <span>PK</span>
                          )}
                        </div>
                        <div className="AdminOrderDetails-itemInfo">
                          <span className="AdminOrderDetails-itemName">
                            {productName}
                          </span>
                          <span className="AdminOrderDetails-itemPrice">
                            {formatCurrency(unitPrice)}
                          </span>
                          <span className="AdminOrderDetails-itemQty">
                            Qty: {quantity}
                          </span>
                        </div>
                        <div className="AdminOrderDetails-itemTotal">
                          <strong>
                            {formatCurrency(unitPrice * quantity)}
                          </strong>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="AdminOrderDetails-sidebar">
            <section className="AdminOrderDetails-actionBox">
              <h2>Update Status</h2>
              {!canUpdateStatus ? (
                <p className="AdminOrderDetails-muted">
                  Order is in a terminal state.
                </p>
              ) : (
                <form
                  className="AdminOrderDetails-statusForm"
                  onSubmit={handleStatusUpdate}
                >
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    disabled={saving}
                  >
                    {allowedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                  {!paymentIsSuccessful && (
                    <p className="AdminOrderDetails-warningText">
                      Payment not confirmed.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="AdminOrderDetails-updateBtn"
                    disabled={
                      saving ||
                      newStatus === order.status ||
                      !allowedStatuses.includes(newStatus)
                    }
                  >
                    {saving ? "Updating..." : "Update order"}
                  </button>
                </form>
              )}
            </section>

            <section className="AdminOrderDetails-timelineBox">
              <h2>Order Timeline</h2>
              <div className="AdminOrderDetails-timeline">
                <div className="AdminOrderDetails-timelineNode is-completed">
                  <div className="AdminOrderDetails-timelineDot">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="AdminOrderDetails-timelineContent">
                    <strong>Order Placed</strong>
                    <p>We've received the order.</p>
                    <span>
                      {order.createdAt
                        ? `${formatDate(order.createdAt)}, ${formatTime(order.createdAt)}`
                        : "—"}
                    </span>
                  </div>
                </div>

                <div
                  className={`AdminOrderDetails-timelineNode ${["SUCCESS", "PAID"].includes(order.paymentStatus?.toUpperCase()) ? "is-completed" : ""}`}
                >
                  <div className="AdminOrderDetails-timelineDot">
                    {["SUCCESS", "PAID"].includes(
                      order.paymentStatus?.toUpperCase(),
                    ) && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="AdminOrderDetails-timelineContent">
                    <strong>Payment Confirmed</strong>
                    <p>The payment was successful.</p>
                    <span>
                      {["SUCCESS", "PAID"].includes(
                        order.paymentStatus?.toUpperCase(),
                      )
                        ? `${formatDate(order.paymentConfirmedAt || payment?.updatedAt || order.createdAt)}, ${formatTime(order.paymentConfirmedAt || payment?.updatedAt || order.createdAt)}`
                        : "Pending"}
                    </span>
                  </div>
                </div>

                <div
                  className={`AdminOrderDetails-timelineNode ${["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status?.toUpperCase()) ? "is-completed" : ""}`}
                >
                  <div className="AdminOrderDetails-timelineDot">
                    {[
                      "CONFIRMED",
                      "PROCESSING",
                      "SHIPPED",
                      "DELIVERED",
                    ].includes(order.status?.toUpperCase()) && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="AdminOrderDetails-timelineContent">
                    <strong>Order Confirmed</strong>
                    <p>Order is confirmed and being prepared.</p>
                    <span>
                      {[
                        "CONFIRMED",
                        "PROCESSING",
                        "SHIPPED",
                        "DELIVERED",
                      ].includes(order.status?.toUpperCase()) && order.updatedAt
                        ? `${formatDate(order.updatedAt)}, ${formatTime(order.updatedAt)}`
                        : "—"}
                    </span>
                  </div>
                </div>

                <div
                  className={`AdminOrderDetails-timelineNode ${["SHIPPED", "DELIVERED"].includes(order.status?.toUpperCase()) ? "is-completed" : ""}`}
                >
                  <div className="AdminOrderDetails-timelineDot">
                    {["SHIPPED", "DELIVERED"].includes(
                      order.status?.toUpperCase(),
                    ) && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="AdminOrderDetails-timelineContent">
                    <strong>Shipped</strong>
                    <p>The order has been shipped.</p>
                    <span>
                      {["SHIPPED", "DELIVERED"].includes(
                        order.status?.toUpperCase(),
                      ) && order.shippedAt
                        ? `${formatDate(order.shippedAt)}, ${formatTime(order.shippedAt)}`
                        : "—"}
                    </span>
                  </div>
                </div>

                <div
                  className={`AdminOrderDetails-timelineNode ${order.status?.toUpperCase() === "DELIVERED" ? "is-completed" : ""}`}
                >
                  <div className="AdminOrderDetails-timelineDot">
                    {order.status?.toUpperCase() === "DELIVERED" && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="AdminOrderDetails-timelineContent">
                    <strong>Delivered</strong>
                    <p>The order is Delivered.</p>
                    <span>
                      {order.status?.toUpperCase() === "DELIVERED" &&
                      order.deliveredAt
                        ? `${formatDate(order.deliveredAt)}, ${formatTime(order.deliveredAt)}`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
