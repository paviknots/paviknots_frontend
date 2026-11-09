import React, { useEffect, useRef, useState } from "react";
import {
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiPackage,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import "./Navbar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef(null);

  const { itemCount } = useCart();
  const { isAuthenticated, loading, logout } = useAuth();

  const isAdminPage = location.pathname.startsWith("/paviknots/admin");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAccountMenuOpen(false);
    }
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAccountNavigation = (path) => {
    setIsAccountMenuOpen(false);
    closeMenu();
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setIsAccountMenuOpen(false);
    closeMenu();
    navigate("/login", { replace: true });
  };

  return (
    <header className={`Navbar ${isAdminPage ? "Navbar--admin" : ""}`}>
      <div className="Navbar-watercolor-bg"></div>

      <div className="Navbar-container">
        <NavLink to="/" className="Navbar-brand" onClick={closeMenu}>
          <div className="Navbar-brand-text">
            <span className="Navbar-brandName">PaviKnots</span>
          </div>
        </NavLink>

        {!isAdminPage && (
          <nav
            className={`Navbar-navigation ${
              isMobileMenuOpen ? "Navbar-navigation--open" : ""
            }`}
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `Navbar-link ${isActive ? "Navbar-linkActive" : ""}`
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `Navbar-link ${isActive ? "Navbar-linkActive" : ""}`
              }
              onClick={closeMenu}
            >
              Shop
            </NavLink>

            <a href="/#story" className="Navbar-link" onClick={closeMenu}>
              Our Story
            </a>

            <a href="/#contact" className="Navbar-link" onClick={closeMenu}>
              Contact
            </a>
          </nav>
        )}

        <div className="Navbar-actions">
          {!loading &&
            (isAuthenticated ? (
              <div className="Navbar-accountWrapper" ref={accountMenuRef}>
                <button
                  type="button"
                  className={`Navbar-action Navbar-user ${
                    isAccountMenuOpen ? "Navbar-user--active" : ""
                  }`}
                  aria-label="My account"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                >
                  <FiUser className="Navbar-icon" />
                  {!isAdminPage && (
                    <FiChevronDown className="Navbar-accountChevron" />
                  )}
                </button>

                {isAccountMenuOpen && (
                  <div className="Navbar-accountDropdown" role="menu">
                    {isAdminPage ? (
                      <>
                        <button
                          type="button"
                          className="Navbar-accountItem"
                          role="menuitem"
                          onClick={() =>
                            handleAccountNavigation("/paviknots/admin")
                          }
                        >
                          <FiPackage />
                          <span>Dashboard</span>
                        </button>

                        <div className="Navbar-accountDivider" />

                        <button
                          type="button"
                          className="Navbar-accountItem Navbar-accountLogout"
                          role="menuitem"
                          onClick={handleLogout}
                        >
                          <FiLogOut />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="Navbar-accountItem"
                          role="menuitem"
                          onClick={() => handleAccountNavigation("/orders")}
                        >
                          <FiPackage />
                          <span>My Orders</span>
                        </button>

                        <div className="Navbar-accountDivider" />

                        <button
                          type="button"
                          className="Navbar-accountItem Navbar-accountLogout"
                          role="menuitem"
                          onClick={handleLogout}
                        >
                          <FiLogOut />
                          <span>Logout</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              !isAdminPage && (
                <button
                  type="button"
                  className="Navbar-loginButton"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )
            ))}

          {/* Cart - only normal user pages */}
          {!isAdminPage && (
            <button
              type="button"
              className="Navbar-action Navbar-cart"
              aria-label={`Shopping cart${
                itemCount > 0 ? ` with ${itemCount} items` : ""
              }`}
              onClick={() => navigate("/cart")}
            >
              <FiShoppingCart className="Navbar-icon" />

              {itemCount > 0 && (
                <span className="Navbar-cartCount">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile menu - only normal user pages */}
          {!isAdminPage && (
            <button
              type="button"
              className="Navbar-action Navbar-hamburger"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMenu}
            >
              {isMobileMenuOpen ? (
                <FiX className="Navbar-icon" />
              ) : (
                <FiMenu className="Navbar-icon" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="Navbar-stitches"></div>
    </header>
  );
};

export default Navbar;
