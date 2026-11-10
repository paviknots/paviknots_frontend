import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiStar,
  FiTag,
  FiFilter,
  FiRefreshCw,
  FiLayers,
  FiSmile,
  FiSun,
  FiKey,
  FiBriefcase,
  FiShoppingCart,
} from "react-icons/fi";
import { LuSearchX } from "react-icons/lu";
import { BiCategory } from "react-icons/bi";

import { getProducts } from "../../../api/product.api";
import { getCategories } from "../../../api/category.api";
import { addToCart } from "../../../api/cart.api";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import "./Shop.css";
import { IoMdWarning } from "react-icons/io";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Price Filter States
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 16,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [addingProductId, setAddingProductId] = useState(null);
  const [cartToast, setCartToast] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const LIMIT = 16;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || data || []);
      } catch (error) {
        console.error("Failed to load categories:");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedProduct || showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct, showFilters]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({
          search: search || undefined,
          category: selectedCategories.length
            ? selectedCategories.join(",")
            : undefined,
          sort: sort || undefined,
          minPrice: appliedMinPrice !== "" ? appliedMinPrice : undefined,
          maxPrice: appliedMaxPrice !== "" ? appliedMaxPrice : undefined,
          page,
          limit: LIMIT,
        });

        const loadedProducts = data.products || [];

        if (sort === "featured") {
          loadedProducts.sort(
            (a, b) => Number(b.isFeatured) - Number(a.isFeatured),
          );
        }

        setProducts(loadedProducts);
        setPagination(
          data.pagination || {
            page,
            limit: LIMIT,
            total: loadedProducts.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        );
      } catch (error) {
        setError("We couldn't load the creations right now.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [
    search,
    selectedCategories,
    sort,
    appliedMinPrice,
    appliedMaxPrice,
    page,
  ]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategories((current) =>
      current.includes(categorySlug)
        ? current.filter((slug) => slug !== categorySlug)
        : [...current, categorySlug],
    );

    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleApplyFilters = () => {
    const min = minPrice === "" ? "" : Number(minPrice);
    const max = maxPrice === "" ? "" : Number(maxPrice);

    if (
      (min !== "" && (!Number.isFinite(min) || min < 0)) ||
      (max !== "" && (!Number.isFinite(max) || max < 0))
    ) {
      return;
    }

    if (min !== "" && max !== "" && min > max) {
      alert("Minimum price cannot exceed maximum price.");
      return;
    }

    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
    setPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setSelectedCategories([]);
    setSort("");
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (!pagination.hasPreviousPage) return;
    setPage((currentPage) => currentPage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    if (!pagination.hasNextPage) return;
    setPage((currentPage) => currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (Number(product.stock) === 0) {
      setCartError("This product is currently out of stock.");
      return;
    }
    setSelectedProduct(product);
    setCartQuantity(1);
    setCartError("");
  };

  const handleIncreaseCartQuantity = () => {
    if (!selectedProduct) return;
    const stock = Number(selectedProduct.stock);
    setCartQuantity((currentQuantity) =>
      currentQuantity < stock ? currentQuantity + 1 : currentQuantity,
    );
  };

  const handleDecreaseCartQuantity = () => {
    setCartQuantity((currentQuantity) => Math.max(currentQuantity - 1, 1));
  };

  const closeCartConfirmation = () => {
    if (addingProductId) return;
    setSelectedProduct(null);
    setCartQuantity(1);
    setCartError("");
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return;

    try {
      setAddingProductId(selectedProduct.id);
      setCartError("");

      await addToCart(selectedProduct.id, cartQuantity);
      await refreshCart();

      setCartMessage(`${selectedProduct.name} added to your cart.`);
      setCartToast(true);
      setSelectedProduct(null);
      setCartQuantity(1);

      setTimeout(() => {
        setCartToast(false);
      }, 3500);
    } catch (error) {
      setCartError(
        error.response?.data?.message ||
          "Unable to add this item to your cart.",
      );
    } finally {
      setAddingProductId(null);
    }
  };

  const displayedProducts = products;

  return (
    <main className="Shop">
      <section className="Shop-content">
        {/* MATCHING SCREENSHOT: Header for Mobile layout */}
        <div className="Shop-headerTextMobile">
          <h1 className="Shop-pageTitle">Our Creations</h1>
          <p className="Shop-pageSubtitle">Discover our crochet collection.</p>
        </div>

        <div className="Shop-mobileToolbar">
          <div className="Shop-mobileToolbarTop">
            <span className="Shop-mobileResultCount">
              {loading
                ? "..."
                : `${products.length} ${
                    products.length === 1 ? "creation" : "creations"
                  } found`}
            </span>
            <div className="Shop-mobileSort">
              <span className="Shop-sortLabel">Sort by:</span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="Shop-sortSelect"
              >
                <option value="">Default</option>
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low - High</option>
                <option value="price-high">Price: High - Low</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            className="Shop-mobileFilterBtn"
            onClick={() => setShowFilters(true)}
          >
            <FiFilter size={16} /> Filters
          </button>
        </div>

        <div className="Shop-layout">
          <aside
            className={`Shop-sidebar ${showFilters ? "Shop-sidebarOpen" : ""}`}
          >
            <div className="Shop-sidebarInner">
              <div className="Shop-sidebarHeaderMobile">
                <h2>Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="Shop-sidebarClose"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="Shop-filterGroup">
                <h3 className="Shop-filterHeader">
                  <BiCategory size={20} /> Categories
                </h3>

                <div className="Shop-categories">
                  <label className="Shop-categoryCheckbox">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === 0}
                      onChange={() => {
                        setSelectedCategories([]);
                        setPage(1);
                      }}
                    />
                    <span className="Shop-checkboxCustom" />
                    <span className="Shop-catBtnLeft">
                      <span>All Products</span>
                    </span>
                  </label>

                  {categories.map((category) => (
                    <label key={category.id} className="Shop-categoryCheckbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.slug)}
                        onChange={() => handleCategoryChange(category.slug)}
                      />

                      <span className="Shop-checkboxCustom" />

                      <span className="Shop-catBtnLeft">
                        <span>{category.name}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="Shop-filterGroup">
                <h3 className="Shop-filterHeader">
                  <FiTag /> Price Range
                </h3>
                <div className="Shop-priceInputs">
                  <div className="Shop-priceInputWrapper">
                    <span>₹</span>
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(event) => setMinPrice(event.target.value)}
                      placeholder="Min"
                    />
                  </div>
                  <span className="Shop-priceDash">-</span>
                  <div className="Shop-priceInputWrapper">
                    <span>₹</span>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              <button className="Shop-applyBtn" onClick={handleApplyFilters}>
                <FiFilter /> Apply Filter
              </button>

              <button className="Shop-clearFiltersBtn" onClick={clearFilters}>
                <FiRefreshCw /> Clear Filters
              </button>
            </div>
          </aside>

          {showFilters && (
            <div
              className="Shop-filterOverlay"
              onClick={() => setShowFilters(false)}
            />
          )}

          <div className="Shop-mainArea">
            <div className="Shop-headerRow DesktopOnly">
              <div className="Shop-headerText">
                <h1 className="Shop-pageTitle">Our Creations</h1>
                <p className="Shop-pageSubtitle">
                  Discover our handmade crochet collection.
                </p>
              </div>

              <div className="Shop-toolbar">
                <span className="Shop-resultCount">
                  {loading
                    ? "Loading..."
                    : `${products.length} ${
                        products.length === 1 ? "creation" : "creations"
                      } found`}
                </span>
                <span className="Shop-toolbarDivider">|</span>
                <div className="Shop-desktopSort">
                  <span className="Shop-sortLabel">Sort by:</span>
                  <select
                    value={sort}
                    onChange={handleSortChange}
                    className="Shop-sortSelect"
                  >
                    <option value="">Default</option>
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low - High</option>
                    <option value="price-high">Price: High - Low</option>
                  </select>
                </div>
              </div>
            </div>

            {error ? (
              <div className="Shop-emptyState">
                <span className="Shop-emptyIcon">
                  <IoMdWarning />
                </span>
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="Shop-primaryBtn"
                >
                  Try Again
                </button>
              </div>
            ) : loading ? (
              <div className="Shop-productGrid">
                {Array.from({ length: LIMIT }).map((_, idx) => (
                  <div className="Shop-cardSkeleton" key={idx} />
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="Shop-emptyState">
                <span className="Shop-emptyIcon">
                  <LuSearchX />
                </span>
                <h2>Nothing found here</h2>
                <p>Try changing your filters.</p>
                <button onClick={clearFilters} className="Shop-primaryBtn">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="Shop-productGrid">
                  {displayedProducts.map((product) => {
                    const image = product.images?.[0]?.url;
                    const hasDiscount = product.discountPercentage > 0;

                    return (
                      <article className="Shop-card" key={product.id}>
                        <div className="Shop-cardImage">
                          <Link to={`/products/${product.slug}`}>
                            {image ? (
                              <img src={image} alt={product.name} />
                            ) : (
                              <div className="Shop-placeholder">PaviKnots</div>
                            )}
                          </Link>

                          {/* Removed Wishlist Button as requested */}

                          {hasDiscount ? (
                            <span className="Shop-tag Shop-discountTag">
                              <FiTag /> {product.discountPercentage}% OFF
                            </span>
                          ) : product.isFeatured ? (
                            <span className="Shop-tag Shop-featuredTag">
                              <FiStar /> Featured
                            </span>
                          ) : null}
                        </div>

                        <div className="Shop-cardDetails">
                          <h3 className="Shop-cardTitle">
                            <Link to={`/products/${product.slug}`}>
                              {product.name}
                            </Link>
                          </h3>

                          <div className="Shop-cardMeta">
                            <strong className="Shop-currentPrice">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </strong>
                            {hasDiscount && (
                              <span className="Shop-originalPrice">
                                ₹
                                {Number(product.basePrice).toLocaleString(
                                  "en-IN",
                                )}
                              </span>
                            )}
                          </div>

                          <button
                            className="Shop-addCartBtn"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            disabled={Number(product.stock) === 0}
                          >
                            <FiShoppingCart size={16} />
                            {Number(product.stock) === 0
                              ? "Out of Stock"
                              : "Add to Cart"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="Shop-pagination">
                    <button
                      disabled={!pagination.hasPreviousPage}
                      onClick={handlePreviousPage}
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <span>
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      disabled={!pagination.hasNextPage}
                      onClick={handleNextPage}
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="Shop-modalOverlay" onClick={closeCartConfirmation}>
          <div
            className="Shop-modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="Shop-modalClose" onClick={closeCartConfirmation}>
              <FiX size={24} />
            </button>
            <div className="Shop-modalHeader">
              {selectedProduct.images?.[0]?.url ? (
                <img
                  src={selectedProduct.images[0].url}
                  alt={selectedProduct.name}
                />
              ) : (
                <div className="Shop-modalPlaceholder">PaviKnots</div>
              )}
              <div>
                <h2>{selectedProduct.name}</h2>
                <strong
                  style={{
                    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                  }}
                >
                  ₹{Number(selectedProduct.price).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="Shop-modalQuantity">
              <span>Quantity:</span>
              <div className="Shop-qtyControls">
                <button onClick={handleDecreaseCartQuantity}>−</button>
                <span>{cartQuantity}</span>
                <button onClick={handleIncreaseCartQuantity}>+</button>
              </div>
            </div>

            {cartError && <p className="Shop-errorText">{cartError}</p>}

            <div className="Shop-modalTotal">
              <span>Total:</span>
              <strong
                style={{
                  fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                }}
              >
                ₹
                {(Number(selectedProduct.price) * cartQuantity).toLocaleString(
                  "en-IN",
                )}
              </strong>
            </div>

            <button
              className="Shop-confirmCartBtn"
              onClick={handleConfirmAddToCart}
              disabled={Boolean(addingProductId)}
            >
              {addingProductId === selectedProduct.id
                ? "Adding to Cart..."
                : "Confirm Add to Cart"}
            </button>
          </div>
        </div>
      )}

      {cartToast && (
        <div className="ProductDetails-cartToast Shop-toast">
          <div className="ProductDetails-cartToastContent">
            <span className="ProductDetails-cartToastCheck">✓</span>
            <span>{cartMessage}</span>
          </div>

          <Link to="/cart" className="ProductDetails-cartToastLink">
            View Cart
          </Link>
        </div>
      )}
    </main>
  );
};

export default Shop;
