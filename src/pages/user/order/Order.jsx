import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiChevronDown } from "react-icons/fi";

import { getMyOrders } from "../../../api/orders";
import "./Order.css";

import { SiHackthebox } from "react-icons/si";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatStatus = (status = "") =>
  status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyOrders();

        if (!response?.success || !Array.isArray(response.data)) {
          throw new Error("Unable to retrieve your orders.");
        }

        if (!cancelled) {
          setOrders(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load your orders. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableYears = useMemo(() => {
    return [
      ...new Set(
        orders
          .filter((order) => order.createdAt)
          .map((order) => new Date(order.createdAt).getFullYear()),
      ),
    ].sort((a, b) => b - a);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.orderNumber?.toLowerCase().includes(query) ||
        order.items?.some((item) => item.name?.toLowerCase().includes(query));

      let matchesPeriod = true;

      if (period === "past-3-months") {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - 3);

        matchesPeriod =
          Boolean(order.createdAt) && new Date(order.createdAt) >= cutoff;
      } else if (period !== "all") {
        matchesPeriod =
          Boolean(order.createdAt) &&
          new Date(order.createdAt).getFullYear() === Number(period);
      }

      return matchesSearch && matchesPeriod;
    });
  }, [orders, searchQuery, period]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <main className="OrdersPage">
      <div className="OrdersPage-container">
        {/* <nav className="OrdersPage-breadcrumb">
          <Link to="/">Your Account</Link>
          <span>›</span>
          <span className="OrdersPage-crumbActive">Your Orders</span>
        </nav> */}

        <div className="OrdersPage-header">
          <h1>Your Orders</h1>
          <form className="OrdersPage-searchBox" onSubmit={handleSearch}>
            <div className="OrdersPage-searchInput">
              <FiSearch className="OrdersPage-searchIcon" />
              <input
                type="text"
                placeholder="Search all orders"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>
            <button type="submit" className="OrdersPage-searchBtn">
              Search Orders
            </button>
          </form>
        </div>

        {!loading && !error && (
          <div className="OrdersPage-controls">
            <span>
              <strong>
                {filteredOrders.length}{" "}
                {filteredOrders.length === 1 ? "order" : "orders"}
              </strong>{" "}
              placed in
            </span>
            <div className="OrdersPage-selectWrapper">
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
              >
                <option value="all">All orders</option>
                <option value="past-3-months">Past 3 months</option>
                <option value={String(2025)}>2025</option>
                {availableYears.map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
              <FiChevronDown className="OrdersPage-selectIcon" />
            </div>
          </div>
        )}

        {loading && (
          <div className="OrdersPage-state">
            <span className="OrdersPage-loader" />
            <p>Loading your orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className="OrdersPage-state NoOrderContainer">
            <div className="OrdersPage-emptyIcon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="35"
                  cy="25"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M15 58V54C15 44.6 23.1 37 33 37H37C42 37 46.5 39 49.5 42"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M49 53V48C49 43.6 52.1 41 56 41C59.9 41 63 43.6 63 48V53"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <rect
                  x="44"
                  y="52"
                  width="24"
                  height="19"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <circle cx="56" cy="59" r="2" fill="currentColor" />

                <path
                  d="M56 61V64"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="NoOrderContainer_h2">Unable to load your orders</h2>
            <p className="NoOrderContainer_p">{error}</p>
            <button
              type="button"
              className="OrdersPage-btnAction NoOrderContainer_link"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="OrdersPage-state NoOrderContainer">
            <div className="OrdersPage-emptyIcon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="17"
                  y="23"
                  width="46"
                  height="42"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path d="M17 34H63" stroke="currentColor" strokeWidth="1.6" />

                <path
                  d="M29 23V17H51V23"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M27 44H43M27 51H37"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                <circle
                  cx="55"
                  cy="56"
                  r="13"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M50 51L60 61M60 51L50 61"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="NoOrderContainer_h2">No orders yet</h2>
            <p className="NoOrderContainer_p">
              Your PaviKnots orders will appear here.
            </p>
            <Link
              to="/products"
              className="OrdersPage-btnAction NoOrderContainer_link"
            >
              Explore Products
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          orders.length > 0 &&
          filteredOrders.length === 0 && (
            <div className="OrdersPage-state  NoOrderContainer">
              <div className="OrdersPage-emptyIcon">
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 160 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Search icon */}
                  <circle
                    cx="69"
                    cy="65"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M91 87L112 108"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Search handle detail */}
                  <path
                    d="M57 65H81"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M69 53V77"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Small decorative stars */}
                  <path
                    d="M113 36V46M108 41H118"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M35 105V113M31 109H39"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <path
                    d="M48 128H94"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="NoOrderContainer_h2">No matching orders</h2>
              <p className="NoOrderContainer_p">
                Try another search term or date filter.
              </p>
              <button
                type="button"
                className="OrdersPage-btnAction NoOrderContainer_link"
                onClick={() => {
                  setSearchInput("");
                  setSearchQuery("");
                  setPeriod("all");
                }}
              >
                Clear filters
              </button>
            </div>
          )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="OrdersPage-list">
            {filteredOrders.map((order) => (
              <div className="OrdersPage-card" key={order.id}>
                <div className="OrdersPage-cardHeader">
                  <div className="OrdersPage-headerLeft">
                    <div className="OrdersPage-headerBlock">
                      <span className="OrdersPage-label">ORDER PLACED</span>
                      <span className="OrdersPage-value">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="OrdersPage-headerBlock">
                      <span className="OrdersPage-label">TOTAL</span>
                      <span className="OrdersPage-value">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    <div className="OrdersPage-headerBlock">
                      <span className="OrdersPage-label">SHIP TO</span>
                      <button className="OrdersPage-shipBtn">
                        {order.shipTo || order.address?.name}{" "}
                        {/* <FiChevronDown /> */}
                      </button>
                    </div>
                  </div>
                  <div className="OrdersPage-headerRight">
                    <div className="OrdersPage-orderNumberBlock">
                      <span className="OrdersPage-label">
                        ORDER # {order.orderNumber}
                      </span>
                    </div>
                    <div className="OrdersPage-headerLinks">
                      <Link
                        to={`/orders/${encodeURIComponent(order.orderNumber)}`}
                      >
                        View order details
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="OrdersPage-cardBody">
                  <div>
                    {order.status == "CANCELLED" && (
                      <div className="OrderPage-orderCancel">
                        <div className="OrderPage-orderCancel-icon-container">
                          <div className="OrderPage-orderCancel-box OrderPage-orderCancel-box-crossicon">
                            <SiHackthebox size={22} />
                          </div>
                          <div className="OrderPage-orderCancel-icon OrderPage-orderCancel-icon-cross">
                            <ImCross size={7} />
                          </div>
                        </div>

                        <div className="OrderPage-orderCancel-content OrderPage-orderCancel-content-cross">
                          <p>Cancelled</p>
                          <p>
                            on{" "}
                            {order.cancelledAt
                              ? new Date(order.cancelledAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}
                            .
                          </p>
                        </div>
                      </div>
                    )}

                    {order.status == "DELIVERED" && (
                      <div className="OrderPage-orderCancel">
                        <div className="OrderPage-orderCancel-icon-container">
                          <div className="OrderPage-orderCancel-box OrderPage-orderCancel-box-tickicon">
                            <SiHackthebox size={22} />
                          </div>
                          <div className="OrderPage-orderCancel-icon OrderPage-orderCancel-icon-tick">
                            <FaCheck size={7} />
                          </div>
                        </div>

                        <div className="OrderPage-orderCancel-content OrderPage-orderCancel-content-tick">
                          <p>Delivered</p>
                          <p>
                            on{" "}
                            {order.deliveredAt
                              ? new Date(order.deliveredAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}
                            .
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {(order.items || []).map((item) => {
                    const image = item.images?.[0];
                    return (
                      <div className="OrdersPage-itemRow" key={item.id}>
                        <div className="OrdersPage-itemImage">
                          {image?.url ? (
                            <img
                              src={image.url}
                              alt={image.altText || item.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="OrdersPage-imagePlaceholder">
                              PK
                            </div>
                          )}
                        </div>
                        <div className="OrdersPage-itemDetails">
                          <Link
                            to={`/products/${encodeURIComponent(item.slug)}`}
                            className="OrdersPage-itemName"
                          >
                            {item.name}
                          </Link>
                          <div className="OrdersPage-itemPrice">
                            ₹ {/* <FaIndianRupeeSign /> */}
                            {item.unitPrice}
                          </div>

                          <div className="OrdersPage-itemActions">
                            {/* <button className="OrdersPage-btnPrimary">
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
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;
