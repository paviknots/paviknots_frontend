import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "../../../api/admin.api";
import "./AdminDashboard.css";
import { MdOutlineDiscount } from "react-icons/md";

import { BiCategoryAlt } from "react-icons/bi";
import { BsBox } from "react-icons/bs";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const statusClass = (status = "") => status.toLowerCase().replaceAll("_", "-");

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminDashboard();
        console.log(response);

        if (!response.success) {
          throw new Error(
            response.data?.message || "Unable to load dashboard.",
          );
        }

        setDashboard(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="AdminDashboard">
        <div className="AdminDashboard-state">
          <span className="AdminDashboard-spinner" />
          <p>Preparing your dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="AdminDashboard">
        <div className="AdminDashboard-state">
          <h2>Dashboard unavailable</h2>
          <p>{error}</p>
          <button
            className="AdminDashboard-primaryButton"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const stats = dashboard?.stats ?? {};
  const recentOrders = dashboard?.recentOrders ?? [];

  return (
    <main className="AdminDashboard">
      <header className="AdminDashboard-header">
        <div>
          <p className="AdminDashboard-eyebrow">PAVIKNOTS / ADMINISTRATION</p>
          <h1>Dashboard</h1>
          <p className="AdminDashboard-subtitle">
            An overview of your shop and recent activity.
          </p>
        </div>
      </header>

      <section className="AdminDashboard-stats" aria-label="Store statistics">
        <article className="AdminDashboard-stat">
          <span className="AdminDashboard-statLabel">Total orders</span>
          <strong>{stats.totalOrders ?? 0}</strong>
          <span className="AdminDashboard-statNote">All recorded orders</span>
        </article>

        <article className="AdminDashboard-stat">
          <span className="AdminDashboard-statLabel">Successful orders</span>
          <strong>{stats.successfulOrders ?? 0}</strong>
          <span className="AdminDashboard-statNote">Payments confirmed</span>
        </article>

        <article className="AdminDashboard-stat">
          <span className="AdminDashboard-statLabel">Total revenue</span>
          <strong>{formatCurrency(stats.totalRevenue)}</strong>
          <span className="AdminDashboard-statNote">
            From successful payments
          </span>
        </article>

        <article className="AdminDashboard-stat">
          <span className="AdminDashboard-statLabel">Active products</span>
          <strong>{stats.activeProducts ?? 0}</strong>
          <span className="AdminDashboard-statNote">
            Currently visible in the shop
          </span>
        </article>
      </section>

      <section className="AdminDashboard-quickLinks">
        <div>
          <p className="AdminDashboard-eyebrow">QUICK ACCESS</p>
          <h2>Manage your store</h2>
        </div>

        <div className="AdminDashboard-actions">
          <Link
            to="/paviknots/admin/categories"
            className="AdminDashboard-action"
          >
            <span className="AdminDashboard-actionIcon">
              <BiCategoryAlt />
            </span>

            <span>
              <strong>Categories</strong>
              <small>Create and manage product categories</small>
            </span>

            <span className="AdminDashboard-arrow">↗</span>
          </Link>

          <Link
            to="/paviknots/admin/products"
            className="AdminDashboard-action"
          >
            <span className="AdminDashboard-actionIcon">
              <BsBox />
            </span>
            <span>
              <strong>Products</strong>
              <small>Add, edit, and manage products</small>
            </span>
            <span className="AdminDashboard-arrow">↗</span>
          </Link>

          <Link
            to="/paviknots/admin/promotions"
            className="AdminDashboard-action"
          >
            <span className="AdminDashboard-actionIcon">
              <MdOutlineDiscount />
            </span>
            <span>
              <strong>Discounts</strong>
              <small>Create and manage product promotions</small>
            </span>
            <span className="AdminDashboard-arrow">↗</span>
          </Link>

          <Link to="/paviknots/admin/orders" className="AdminDashboard-action">
            <span className="AdminDashboard-actionIcon">↗</span>
            <span>
              <strong>Orders</strong>
              <small>Review orders and update statuses</small>
            </span>
            <span className="AdminDashboard-arrow">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
