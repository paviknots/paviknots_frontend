import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiTag } from "react-icons/fi";
import { MdOutlineRefresh, MdMoreHoriz } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";

import {
  getAdminCategories,
  updateCategoryStatus,
} from "../../../api/adminCategory.api";

import "./AdminCategories.css";

const getStatusClass = (status = "") =>
  status.toLowerCase().replaceAll("_", "-");

const formatStatus = (status = "") =>
  status.charAt(0) + status.slice(1).toLowerCase().replaceAll("_", " ");

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
  });

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminCategories({
        search,
        status,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to load categories.");
      }

      setCategories(response.data ?? []);

      setStats(
        response.stats ?? {
          totalCategories: 0,
          activeCategories: 0,
          inactiveCategories: 0,
        },
      );
    } catch (err) {
      console.error("Failed to load categories:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load categories.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".AdminCategories-menuWrapper")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCategories = useMemo(() => {
    return categories;
  }, [categories]);

  const handleStatusChange = async (category) => {
    setOpenMenuId(null);
    const newStatus = category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      setUpdatingCategoryId(category.id);
      await updateCategoryStatus(category.id, newStatus);
      toast.success(
        `Category ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`,
      );
      await fetchCategories();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update category status.",
      );
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  const handleRefresh = async () => {
    setOpenMenuId(null);
    await fetchCategories();
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("ALL");
    setOpenMenuId(null);
  };

  return (
    <main className="AdminCategories">
      <div className="AdminCategories-container">
        <div className="AdminCategories-topBar">
          <Link to="/paviknots/admin" className="AdminCategories-backLink">
            <IoMdArrowBack />
            Back to Dashboard
          </Link>

          <div className="AdminCategories-topActions">
            <Link
              to="/paviknots/admin/categories/add"
              className="AdminCategories-addBtn"
            >
              <FiPlus size={18} />
              Add Category
            </Link>
          </div>
        </div>

        <header className="AdminCategories-header">
          <h1>Categories</h1>
          <p className="AdminCategories-subtitle">
            Organize your handmade products into categories.
          </p>
        </header>

        {error && (
          <div
            className="AdminCategories-alert AdminCategories-alertError"
            role="alert"
          >
            <span>{error}</span>
            <button type="button" onClick={fetchCategories}>
              Retry
            </button>
          </div>
        )}

        <section className="AdminCategories-summaryBox">
          <div className="AdminCategories-summaryCol">
            <strong>Total categories</strong>
            <span>{stats.totalCategories ?? 0}</span>
          </div>

          <div className="AdminCategories-summaryCol">
            <strong>Active categories</strong>
            <span>{stats.activeCategories ?? 0}</span>
          </div>

          <div className="AdminCategories-summaryCol">
            <strong>Inactive categories</strong>
            <span>{stats.inactiveCategories ?? 0}</span>
          </div>
        </section>

        <section className="AdminCategories-card">
          <div className="AdminCategories-cardHeader">
            <h2>All categories</h2>
            <span>
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1 ? "category" : "categories"}{" "}
              found
            </span>
          </div>

          <div className="AdminCategories-filters">
            <div className="AdminCategories-filterGroup">
              <label>Search</label>
              <input
                type="text"
                placeholder="Category name or slug..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>

            <div className="AdminCategories-filterGroup">
              <label>Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <button
              type="button"
              className="AdminCategories-clearBtn"
              onClick={clearFilters}
              disabled={!searchInput && status === "ALL"}
            >
              Clear filters
            </button>
          </div>

          {loading ? (
            <div className="AdminCategories-loading">
              <p>Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="AdminCategories-empty">
              <p>No categories found. Try changing your search or filters.</p>
            </div>
          ) : (
            <div className="AdminCategories-tableWrapper">
              <table className="AdminCategories-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Slug</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <div className="AdminCategories-categoryCell">
                          <div className="AdminCategories-categoryImage">
                            {category.imageUrl ? (
                              <img
                                src={category.imageUrl}
                                alt={category.name}
                              />
                            ) : (
                              <FiTag size={20} />
                            )}
                          </div>
                          <div className="AdminCategories-categoryInfo">
                            <strong className="AdminCategories-categoryName">
                              {category.name}
                            </strong>
                            {category.description && (
                              <span className="AdminCategories-categoryDesc">
                                {category.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="AdminCategories-slug">
                          {category.slug}
                        </span>
                      </td>

                      <td>
                        <span className="AdminCategories-productCount">
                          {category.productCount ?? 0}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`AdminCategories-badge AdminCategories-badge--${getStatusClass(
                            category.status,
                          )}`}
                        >
                          {formatStatus(category.status)}
                        </span>
                      </td>

                      <td>
                        <div className="AdminCategories-actions">
                          <Link
                            to={`/paviknots/admin/categories/${category.id}/edit`}
                            className="AdminCategories-viewLink"
                          >
                            Edit
                          </Link>

                          <div className="AdminCategories-menuWrapper">
                            <button
                              type="button"
                              className="AdminCategories-moreButton"
                              aria-expanded={openMenuId === category.id}
                              disabled={updatingCategoryId === category.id}
                              onClick={() =>
                                setOpenMenuId((previous) =>
                                  previous === category.id ? null : category.id,
                                )
                              }
                            >
                              <MdMoreHoriz size={20} />
                            </button>

                            {openMenuId === category.id && (
                              <div className="AdminCategories-menu">
                                <button
                                  type="button"
                                  disabled={updatingCategoryId === category.id}
                                  onClick={() => handleStatusChange(category)}
                                >
                                  {updatingCategoryId === category.id
                                    ? "Updating..."
                                    : category.status === "ACTIVE"
                                      ? "Mark as Inactive"
                                      : "Mark as Active"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminCategories;
