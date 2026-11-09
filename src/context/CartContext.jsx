import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCart } from "../api/cart.api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);

      const response = await getCart();

      setCart(response.data);
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const itemCount = cart?.itemCount || 0;
  const value = {
    cart,
    loading,
    itemCount,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
