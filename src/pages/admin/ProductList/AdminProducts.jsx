import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineRefresh, MdAdd, MdEdit, MdMoreHoriz } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import {
  getAdminProducts,
  updateAdminProductStatus,
} from "../../../api/adminProduct.api";
import "./AdminProducts.css";

const PRODUCTS_PER_PAGE = 10;

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const formatStatus = (status = "") =>
  status.charAt(0) + status.slice(1).toLowerCase();

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: PRODUCTS_PER_PAGE,
    totalProducts: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalCategories: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [updatingProductId, setUpdatingProductId] = useState(null);

  const currentPage = pagination.currentPage;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));
  }, [search, categoryFilter, statusFilter]);

  const fetchProducts = useCallback(
    async ({ showLoading = true } = {}) => {
      try {
        if (showLoading) {
          setLoading(true);
        }
        setError("");
        const response = await getAdminProducts({
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
          search,
          category: categoryFilter,
          status: statusFilter,
        });

        if (!response?.success) {
          throw new Error(response?.message || "Failed to fetch products.");
        }

        setProducts(Array.isArray(response.data) ? response.data : []);
        if (response.pagination) {
          setPagination((previous) => ({
            ...previous,
            ...response.pagination,
          }));
        }

        if (response.stats) {
          setStats(response.stats);
        }

        setCategories(
          Array.isArray(response.categories) ? response.categories : [],
        );
      } catch (err) {
        console.error("Fetch admin products error:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch products.",
        );
      } finally {
        setLoading(false);
      }
    },
    [currentPage, search, categoryFilter, statusFilter],
  );

  useEffect(() => {
    fetchProducts();
    return () => {};
  }, [fetchProducts]);

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages || page === currentPage) {
      return;
    }
    setPagination((previous) => ({
      ...previous,
      currentPage: page,
    }));
  };

  const pageNumbers = useMemo(() => {
    const totalPages = pagination.totalPages;

    if (totalPages <= 0) {
      return [];
    }

    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
  }, [currentPage, pagination.totalPages]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategoryFilter("ALL");
    setStatusFilter("ALL");

    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));

    setOpenMenuId(null);
  };

  const handleRefresh = () => {
    setOpenMenuId(null);
    fetchProducts();
  };

  const toggleProductStatus = async (product) => {
    if (updatingProductId) {
      return;
    }

    const nextStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      setUpdatingProductId(product.id);
      setError("");
      setOpenMenuId(null);

      await updateAdminProductStatus(product.id, nextStatus);

      await fetchProducts({ showLoading: false });
    } catch (err) {
      console.error("Update product status error:", err);
      setError(
        err.response?.data?.message || "Failed to update product status.",
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".AdminProducts-menuWrapper")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const startIndex =
    pagination.totalProducts === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const endIndex = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    pagination.totalProducts,
  );

  const renderPagination = () => {
    if (pagination.totalPages <= 1) {
      return null;
    }

    return (
      <div className="AdminProducts-paginationControls">
        <button
          type="button"
          className="AdminProducts-navigationButton"
          disabled={loading || !pagination.hasPreviousPage}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={`AdminProducts-pageButton ${
              currentPage === page ? "AdminProducts-pageButton--active" : ""
            }`}
            disabled={loading}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className="AdminProducts-navigationButton"
          disabled={loading || !pagination.hasNextPage}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <main className="AdminProducts">
      <div className="AdminProducts-container">
        {/* Top bar */}
        <div className="AdminProducts-topBar">
          <Link to="/paviknots/admin" className="AdminProducts-backLink">
            <IoMdArrowBack />
            Back to Dashboard
          </Link>

          <div className="AdminProducts-topActions">
            <Link
              to="/paviknots/admin/products/add"
              className="AdminProducts-addBtn"
            >
              <MdAdd size={18} />
              Add Product
            </Link>
          </div>
        </div>

        {/* Page header */}
        <header className="AdminProducts-header">
          <h1>Products</h1>
          <p className="AdminProducts-subtitle">
            Manage your handmade crochet products.
          </p>
        </header>

        {error && (
          <div
            className="AdminProducts-alert AdminProducts-alertError"
            role="alert"
          >
            <span>{error}</span>
            <button type="button" onClick={handleRefresh} disabled={loading}>
              Retry
            </button>
          </div>
        )}

        {/* Summary Box */}
        <section className="AdminProducts-summaryBox">
          <div className="AdminProducts-summaryCol">
            <strong>Total Products</strong>
            <span>{stats.totalProducts}</span>
          </div>

          <div className="AdminProducts-summaryCol">
            <strong>Active Products</strong>
            <span>{stats.activeProducts}</span>
          </div>

          <div className="AdminProducts-summaryCol">
            <strong>Inactive Products</strong>
            <span>{stats.inactiveProducts}</span>
          </div>

          <div className="AdminProducts-summaryCol">
            <strong>Total Categories</strong>
            <span>{stats.totalCategories}</span>
          </div>
        </section>

        {/* Products Card */}
        <section className="AdminProducts-card">
          <div className="AdminProducts-cardHeader">
            <h2>All products</h2>
            <span>
              {pagination.totalProducts}{" "}
              {pagination.totalProducts === 1 ? "product" : "products"} found
            </span>
          </div>

          {/* Search and filters */}
          <div className="AdminProducts-filters">
            <div className="AdminProducts-filterGroup">
              <label htmlFor="AdminProducts-search">Search</label>
              <input
                id="AdminProducts-search"
                type="search"
                placeholder="Product name, SKU..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>

            <div className="AdminProducts-filterGroup">
              <label htmlFor="AdminProducts-category">Category</label>
              <select
                id="AdminProducts-category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="ALL">All categories</option>
                {categories.map((category) => (
                  <option
                    key={category.id || category}
                    value={category.id || category}
                  >
                    {category.name || category}
                  </option>
                ))}
              </select>
            </div>

            <div className="AdminProducts-filterGroup">
              <label htmlFor="AdminProducts-status">Status</label>
              <select
                id="AdminProducts-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <button
              type="button"
              className="AdminProducts-clearBtn"
              onClick={clearFilters}
              disabled={
                !searchInput &&
                categoryFilter === "ALL" &&
                statusFilter === "ALL"
              }
            >
              Clear filters
            </button>
          </div>

          {/* Products table */}
          {loading ? (
            <div className="AdminProducts-loading">
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="AdminProducts-empty">
              <p>Unable to load products.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="AdminProducts-empty">
              <p>No products found. Try changing your search or filters.</p>
            </div>
          ) : (
            <div className="AdminProducts-tableWrapper">
              <table className="AdminProducts-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const image = product.images?.[0];
                    const categoryName =
                      product.category?.name ||
                      product.category ||
                      "Uncategorized";
                    const status =
                      product.status ||
                      (product.isActive ? "ACTIVE" : "INACTIVE");

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="AdminProducts-productCell">
                            <div className="AdminProducts-productImage">
                              {image?.url ? (
                                <img
                                  src={image.url}
                                  alt={image.altText || product.name}
                                  loading="lazy"
                                />
                              ) : (
                                <span>{getInitials(product.name)}</span>
                              )}
                            </div>
                            <div className="AdminProducts-productInfo">
                              <span className="AdminProducts-productName">
                                {product.name}
                              </span>
                              <span className="AdminProducts-productSlug">
                                {product.sku || product.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>{categoryName}</td>

                        <td className="AdminProducts-amount">
                          {formatCurrency(product.price)}
                        </td>

                        <td>
                          <span
                            className={`AdminProducts-badge AdminProducts-badge--${status.toLowerCase()}`}
                          >
                            {formatStatus(status)}
                          </span>
                        </td>

                        <td className="AdminProducts-date">
                          {formatDate(product.createdAt)}
                        </td>

                        <td>
                          <div className="AdminProducts-actions">
                            <Link
                              to={`/paviknots/admin/products/${encodeURIComponent(product.id)}/edit`}
                              className="AdminProducts-viewLink"
                            >
                              Edit
                            </Link>

                            <div className="AdminProducts-menuWrapper">
                              <button
                                type="button"
                                className="AdminProducts-moreButton"
                                aria-expanded={openMenuId === product.id}
                                disabled={updatingProductId === product.id}
                                onClick={() =>
                                  setOpenMenuId((previous) =>
                                    previous === product.id ? null : product.id,
                                  )
                                }
                              >
                                <MdMoreHoriz size={20} />
                              </button>

                              {openMenuId === product.id && (
                                <div className="AdminProducts-menu">
                                  <button
                                    type="button"
                                    disabled={updatingProductId === product.id}
                                    onClick={() => toggleProductStatus(product)}
                                  >
                                    {updatingProductId === product.id
                                      ? "Updating..."
                                      : status === "ACTIVE"
                                        ? "Mark as Inactive"
                                        : "Mark as Active"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && pagination.totalPages > 1 && (
            <div className="AdminProducts-pagination">
              <span className="AdminProducts-paginationInfo">
                Showing {startIndex}–{endIndex} of {pagination.totalProducts}{" "}
                products
              </span>
              {renderPagination()}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
