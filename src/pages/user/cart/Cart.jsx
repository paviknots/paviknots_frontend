import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";

import { getCart } from "../../../api/cart.api";
import CartItem from "../../../components/cart/CartItem";
import CartSummary from "../../../components/cart/CartSummary";

import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await getCart();

      setCart(response.data);
    } catch (error) {
      console.error("Failed to load cart:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <section className="Cart Cart-loading">
        <p>Loading your little collection...</p>
      </section>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <section className="Cart Cart-empty">
        <div className="Cart-emptyIcon">
          <FiShoppingBag size={38} />
        </div>

        <h1 className="Cart-emptyTitle">
          Your cart is
          <br />
          <em>waiting for you.</em>
        </h1>

        <p className="Cart-emptyText">
          Explore our handmade creations, add something you love, and come back
          here to make it yours.
        </p>

        <Link to="/products" className="Cart-shopButton">
          Explore the collection
        </Link>
      </section>
    );
  }

  return (
    <section className="Cart">
      <div className="Cart-container">
        <div className="Cart-container-main">
          <div className="Cart-subcontainer">
            <header className="Cart-header">
              <p className="Cart-eyebrow">YOUR BAG</p>

              <p className="Cart-count">
                {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
              </p>
            </header>
            <div className="Cart-layout">
              <div className="Cart-items">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onCartUpdated={fetchCart}
                  />
                ))}
              </div>
            </div>
          </div>

          <CartSummary cart={cart} />
        </div>
      </div>
    </section>
  );
};

export default Cart;
