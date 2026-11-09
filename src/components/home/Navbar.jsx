import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { FaInstagram } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { FiPackage, FiLogOut, FiX, FiSearch } from "react-icons/fi";

import "./Navbar.css";
import { AnnouncementBar } from "./AnnouncementBar";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
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

  const closeMenu = () => {
    setMenuOpen(false);
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

  const handleInstagram = () => {
    window.open(
      "https://www.instagram.com/pavi_knots?rpxt=em80MzBpenF2ejB4&utm_source=qr",
    );
  };

  return (
    <div>
      <AnnouncementBar />

      <header className={`Navbar-main ${isAdminPage ? "Navbar-admin" : ""}`}>
        {/* 1. Mobile Menu Toggle (Moved to the front) */}
        {!isAdminPage && (
          <button
            className="Navbar-mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <FiX /> : <GiHamburgerMenu />}
          </button>
        )}

        {/* 2. Brand Logo (Centered) */}
        <NavLink to="/" className="Navbar-brand-logo" onClick={closeMenu}>
          <span style={{ textAlign: "center" }}>
            <strong>PaviKnots</strong>
            <small>HANDMADE WITH PATIENCE</small>
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        {!isAdminPage && (
          <nav
            className={
              menuOpen ? "Navbar-nav-links Navbar-active" : "Navbar-nav-links"
            }
          >
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "Navbar-active" : "")}
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? "Navbar-active" : "")}
              onClick={closeMenu}
            >
              Products
            </NavLink>
            {/* <NavLink
              to="/personalised-orders"
              className={({ isActive }) => (isActive ? "Navbar-active" : "")}
              onClick={closeMenu}
            >
              Personalised 
            </NavLink> */}
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "Navbar-active" : "")}
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "Navbar-active" : "")}
              onClick={closeMenu}
            >
              Contact
            </NavLink>
          </nav>
        )}

        <div className="Navbar-nav-actions">
          {!isAdminPage && (
            <button
              className="Navbar-action-btn Navbar-search-btn"
              aria-label="Search"
              onClick={handleInstagram}
            >
              <FaInstagram />
            </button>
          )}

          {/* Cart */}
          {!isAdminPage && (
            <button
              className="Navbar-cart-link Navbar-action-btn"
              onClick={() => {
                closeMenu();
                navigate("/cart");
              }}
              aria-label="Cart"
            >
              <BsCart3 />
              <span className="Navbar-cart-badge">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </button>
          )}

          {/* Account Profile */}
          {!loading &&
            (isAuthenticated ? (
              <div className="Navbar-account-wrapper" ref={accountMenuRef}>
                <button
                  className={`Navbar-action-btn Navbar-profile-btn ${
                    isAccountMenuOpen ? "Navbar-active" : ""
                  }`}
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  aria-label="User menu"
                >
                  <CgProfile />
                </button>

                {isAccountMenuOpen && (
                  <div className="Navbar-account-dropdown">
                    {isAdminPage ? (
                      <>
                        <button
                          onClick={() =>
                            handleAccountNavigation("/paviknots/admin")
                          }
                        >
                          <FiPackage /> <span>Dashboard</span>
                        </button>
                        <div className="Navbar-dropdown-divider" />
                        <button
                          className="Navbar-logout-btn"
                          onClick={handleLogout}
                        >
                          <FiLogOut /> <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAccountNavigation("/orders")}
                        >
                          <FiPackage /> <span>My Orders</span>
                        </button>
                        <div className="Navbar-dropdown-divider" />
                        <button
                          className="Navbar-logout-btn"
                          onClick={handleLogout}
                        >
                          <FiLogOut /> <span>Logout</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              !isAdminPage && (
                <button
                  className="Navbar-login-btn"
                  onClick={() => {
                    closeMenu();
                    navigate("/login");
                  }}
                >
                  Login
                </button>
              )
            ))}

          {/* Shop Now Button (Hidden on Mobile) */}
          {!isAdminPage && (
            <NavLink
              to="/products"
              className="Navbar-shop-now-btn"
              onClick={closeMenu}
            >
              Shop Now
            </NavLink>
          )}
        </div>
      </header>
    </div>
  );
}
