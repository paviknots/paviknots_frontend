import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAdminOrders } from "../../../api/admin.api";
import { MdOutlineRefresh } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";

import "./AdminOrders.css";

const ORDERS_PER_PAGE = 10;

const ORDER_STATUSES = [
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"];

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatStatus = (status = "") =>
  status.charAt(0) + status.slice(1).toLowerCase().replaceAll("_", " ");

const getStatusClass = (status = "") =>
  status.toLowerCase().replaceAll("_", "-");

export default function AdminOrders() {
  // Orders returned by the backend for the current page
  const [orders, setOrders] = useState([]);

  // Server pagination metadata
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: ORDERS_PER_PAGE,
    totalOrders: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  // Search and filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  // Request state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset to page 1 when the search or filters change
  useEffect(() => {
    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));
  }, [search, orderFilter, paymentFilter]);

  // Fetch orders for the current page
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminOrders({
        page: pagination.currentPage,
        limit: ORDERS_PER_PAGE,
        search,
        orderStatus: orderFilter,
        paymentStatus: paymentFilter,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Unable to fetch orders.");
      }

      if (!Array.isArray(response.data)) {
        throw new Error("The orders API returned an unexpected response.");
      }

      setOrders(response.data);

      setPagination((previous) => ({
        ...previous,
        ...(response.pagination || {}),
      }));
    } catch (err) {
      console.error("Fetch admin orders error:", err);

      setError(
        err.response?.data?.message || err.message || "Unable to fetch orders.",
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, search, orderFilter, paymentFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Navigate to a page
  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) {
      return;
    }

    setPagination((previous) => ({
      ...previous,
      currentPage: page,
    }));
  };

  // Clear search and filters
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setOrderFilter("ALL");
    setPaymentFilter("ALL");

    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));
  };

  // Refresh orders
  const handleRefresh = async () => {
    setNotice("");
    await fetchOrders();
  };

  // Generate a compact list of page numbers
  const renderPageNumbers = () => {
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 0) {
      return null;
    }

    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));

    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    const pages = [];

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    return pages.map((page) => (
      <button
        key={page}
        type="button"
        className={
          currentPage === page
            ? "AdminOrders-pageButton AdminOrders-pageButton--active"
            : "AdminOrders-pageButton"
        }
        onClick={() => goToPage(page)}
        disabled={loading}
        aria-label={`Go to page ${page}`}
        aria-current={currentPage === page ? "page" : undefined}
      >
        {page}
      </button>
    ));
  };

  // Summary values for the currently loaded page
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "SHIPPED",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  ).length;

  // Overall count comes from the server
  const totalOrders = pagination.totalOrders || 0;

  const startIndex =
    totalOrders === 0 ? 0 : (pagination.currentPage - 1) * ORDERS_PER_PAGE + 1;

  const endIndex = Math.min(
    pagination.currentPage * ORDERS_PER_PAGE,
    totalOrders,
  );

  return (
    <main className="AdminOrders">
      <div className="AdminOrders-container">
        {/* Top bar */}
        <div className="AdminOrders-topBar">
          <Link to="/paviknots/admin" className="AdminOrders-backLink">
            <IoMdArrowBack />
            Back to Dashboard
          </Link>

          <button
            type="button"
            className="AdminOrders-refreshBtn"
            onClick={handleRefresh}
            disabled={loading}
          >
            <MdOutlineRefresh size={18} />

            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Page header */}
        <header className="AdminOrders-header">
          <h1>Orders</h1>

          <p className="AdminOrders-subtitle">
            Manage customer orders and keep every order moving.
          </p>
        </header>

        {/* Success notice */}
        {notice && (
          <div
            className="AdminOrders-alert AdminOrders-alertSuccess"
            role="status"
          >
            {notice}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="AdminOrders-alert AdminOrders-alertError"
            role="alert"
          >
            <span>{error}</span>

            <button type="button" onClick={fetchOrders} disabled={loading}>
              Retry
            </button>
          </div>
        )}

        {/* Summary cards */}
        <section className="AdminOrders-summaryBox">
          <div className="AdminOrders-summaryCol">
            <strong>Total matching orders</strong>
            <span>{totalOrders}</span>
          </div>

          <div className="AdminOrders-summaryCol">
            <strong>Pending on this page</strong>
            <span>{pendingOrders}</span>
          </div>

          <div className="AdminOrders-summaryCol">
            <strong>Shipped on this page</strong>
            <span>{shippedOrders}</span>
          </div>

          <div className="AdminOrders-summaryCol">
            <strong>Delivered on this page</strong>
            <span>{deliveredOrders}</span>
          </div>
        </section>

        {/* Orders card */}
        <section className="AdminOrders-card">
          <div className="AdminOrders-cardHeader">
            <h2>All orders</h2>

            <span>
              {totalOrders} {totalOrders === 1 ? "order" : "orders"} found
            </span>
          </div>

          {/* Search and filters */}
          <div className="AdminOrders-filters">
            <div className="AdminOrders-filterGroup">
              <label htmlFor="AdminOrders-search">Search</label>

              <input
                id="AdminOrders-search"
                type="search"
                placeholder="Order number, customer, email..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>

            <div className="AdminOrders-filterGroup">
              <label htmlFor="AdminOrders-orderFilter">Order status</label>

              <select
                id="AdminOrders-orderFilter"
                value={orderFilter}
                onChange={(event) => setOrderFilter(event.target.value)}
              >
                <option value="ALL">All statuses</option>

                <option value="PENDING">Pending</option>

                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className="AdminOrders-filterGroup">
              <label htmlFor="AdminOrders-paymentFilter">Payment status</label>

              <select
                id="AdminOrders-paymentFilter"
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
              >
                <option value="ALL">All payments</option>

                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="AdminOrders-clearBtn"
              onClick={clearFilters}
              disabled={
                !searchInput && orderFilter === "ALL" && paymentFilter === "ALL"
              }
            >
              Clear filters
            </button>
          </div>

          {/* Orders table */}
          {loading ? (
            <div className="AdminOrders-loading">
              <p>Loading orders...</p>
            </div>
          ) : error ? (
            <div className="AdminOrders-empty">
              <p>Unable to load orders.</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="AdminOrders-empty">
              <p>No orders found. Try changing your search or filters.</p>
            </div>
          ) : (
            <div className="AdminOrders-tableWrapper">
              <table className="AdminOrders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const customerName =
                      order.customerName ||
                      order.user?.name ||
                      order.shippingName ||
                      "Customer";

                    const customerEmail =
                      order.customerEmail || order.user?.email || "";

                    return (
                      <tr key={order.id}>
                        <td>
                          <strong className="AdminOrders-orderNumber">
                            {order.orderNumber}
                          </strong>
                        </td>

                        <td className="AdminOrders-date">
                          {formatDate(order.createdAt)}
                        </td>

                        <td>
                          <div className="AdminOrders-customer">
                            <span className="AdminOrders-customerName">
                              {customerName}
                            </span>

                            {customerEmail && (
                              <span className="AdminOrders-customerEmail">
                                {customerEmail}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="AdminOrders-amount">
                          {formatCurrency(order.totalAmount)}
                        </td>

                        <td>
                          <span
                            className={`AdminOrders-badge AdminOrders-badge--${getStatusClass(
                              order.paymentStatus,
                            )}`}
                          >
                            {formatStatus(order.paymentStatus)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`AdminOrders-badge AdminOrders-badge--${getStatusClass(
                              order.status,
                            )}`}
                          >
                            {formatStatus(order.status)}
                          </span>
                        </td>

                        <td>
                          <Link
                            to={`/paviknots/admin/orders/${encodeURIComponent(
                              order.orderNumber,
                            )}`}
                            className="AdminOrders-viewLink"
                          >
                            View details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && (
            <div className="AdminOrders-pagination">
              <span className="AdminOrders-paginationInfo">
                Showing {startIndex}–{endIndex} of {totalOrders} orders
              </span>

              <div className="AdminOrders-paginationControls">
                <button
                  type="button"
                  className="AdminOrders-navigationButton"
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={loading || !pagination.hasPreviousPage}
                >
                  Previous
                </button>

                {renderPageNumbers()}

                <button
                  type="button"
                  className="AdminOrders-navigationButton"
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={loading || !pagination.hasNextPage}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
