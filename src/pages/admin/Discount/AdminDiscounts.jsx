import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd, MdOutlineDiscount } from "react-icons/md";
import "./AdminDiscounts.css";
import { getAdminPromotions } from "../../../api/adminDiscount.api";
import { IoMdArrowBack } from "react-icons/io";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount));

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "—";

const getStatus = (promotion) => {
  const now = new Date();

  if (!promotion.isActive) return "INACTIVE";
  if (promotion.startAt && new Date(promotion.startAt) > now)
    return "SCHEDULED";
  if (promotion.endAt && new Date(promotion.endAt) < now) return "EXPIRED";

  return "ACTIVE";
};

const getDiscount = (promotion) => {
  const value = Number(promotion.discountValue ?? 0);

  return promotion.discountType === "PERCENTAGE"
    ? `${value}% off`
    : `${formatCurrency(value)} off`;
};

export default function AdminDiscounts() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminPromotions();

        const data = response?.data ?? response;

        if (response?.success === false) {
          throw new Error(response.message || "Unable to load discounts.");
        }

        const promotionList = Array.isArray(data)
          ? data
          : Array.isArray(data?.promotions)
            ? data.promotions
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setPromotions(promotionList);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load discounts.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  const filteredPromotions = promotions.filter((promotion) => {
    const name = (
      promotion.name ||
      promotion.title ||
      promotion.description ||
      ""
    ).toLowerCase();

    const matchesSearch = name.includes(search.toLowerCase());
    const matchesStatus = status === "ALL" || getStatus(promotion) === status;
    const matchesType = type === "ALL" || promotion.discountType === type;

    return matchesSearch && matchesStatus && matchesType;
  });

  const activeCount = promotions.filter(
    (item) => getStatus(item) === "ACTIVE",
  ).length;

  const scheduledCount = promotions.filter(
    (item) => getStatus(item) === "SCHEDULED",
  ).length;

  const inactiveCount = promotions.filter(
    (item) => getStatus(item) === "INACTIVE",
  ).length;


  return (
    <main className="AdminDiscounts">
      <div className="AdminDiscounts-topbar">
        <Link to="/paviknots/admin" className="AdminDiscounts-back">
          <IoMdArrowBack /> Back to Dashboard
        </Link>

        <Link
          to="/paviknots/admin/promotions/new"
          className="AdminDiscounts-addButton"
        >
          <MdAdd size={18} /> Add Discount
        </Link>
      </div>

      <header className="AdminDiscounts-header">
        <h1>Discounts</h1>
        <p>Manage promotions and special offers for your shop.</p>
      </header>

      <section className="AdminDiscounts-stats">
        <article>
          <span>Total Discounts</span>
          <strong>{promotions.length}</strong>
        </article>
        <article>
          <span>Active Discounts</span>
          <strong>{activeCount}</strong>
        </article>
        <article>
          <span>Scheduled Discounts</span>
          <strong>{scheduledCount}</strong>
        </article>
        <article>
          <span>Inactive Discounts</span>
          <strong>{inactiveCount}</strong>
        </article>
      </section>

      <section className="AdminDiscounts-tableCard">
        <div className="AdminDiscounts-tableHeader">
          <h2>All discounts</h2>
          <span>{filteredPromotions.length} discounts found</span>
        </div>

        <div className="AdminDiscounts-filters">
          <label>
            Search
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Discount name..."
            />
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="INACTIVE">Inactive</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </label>

          <label>
            Discount type
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="ALL">All types</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed amount</option>
            </select>
          </label>

          <button
            className="AdminDiscounts-clear"
            onClick={() => {
              setSearch("");
              setStatus("ALL");
              setType("ALL");
            }}
          >
            Clear filters
          </button>
        </div>

        {loading ? (
          <div className="AdminDiscounts-state">Loading discounts...</div>
        ) : error ? (
          <div className="AdminDiscounts-state AdminDiscounts-error">
            {error}
          </div>
        ) : (
          <div className="AdminDiscounts-tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Discount</th>
                  <th>Type</th>
                  <th>Applies to</th>
                  <th>Discount value</th>
                  <th>Status</th>
                  <th>Start date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPromotions.map((promotion) => {
                  const currentStatus = getStatus(promotion);

                  return (
                    <tr key={promotion.id}>
                      <td>
                        <div className="AdminDiscounts-name">
                          <span className="AdminDiscounts-icon">
                            <MdOutlineDiscount />
                          </span>
                          <div>
                            <strong>
                              {promotion.name ||
                                promotion.title ||
                                promotion.description ||
                                "Untitled promotion"}
                            </strong>
                            <small>Priority: {promotion.priority ?? 0}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        {promotion.discountType === "PERCENTAGE"
                          ? "Percentage"
                          : "Fixed amount"}
                      </td>

                      <td>{promotion.scope || "—"}</td>

                      <td>
                        <strong>{getDiscount(promotion)}</strong>
                      </td>

                      <td>
                        <span
                          className={`AdminDiscounts-status is-${currentStatus.toLowerCase()}`}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      <td>{formatDate(promotion.startAt)}</td>

                      <td>
                        <Link
                          className="AdminDiscounts-edit"
                          to={`/paviknots/admin/promotions/${promotion.id}/edit`}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {filteredPromotions.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div className="AdminDiscounts-empty">
                        <MdOutlineDiscount />
                        <strong>No discounts found</strong>
                        <span>Add a discount or adjust your filters.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
