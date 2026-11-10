import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import { getProduct } from "../../../api/product.api";
import { addToCart } from "../../../api/cart.api";

import ProductGallery from "../../../components/product/ProductGallery";
import ProductInfo from "../../../components/product/ProductInfo";
import ProductPurchase from "../../../components/product/ProductPurchase";
import ProductPerks from "../../../components/product/ProductPerks";

import "./ProductDetails.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import RelatedProducts from "../../../components/product/RelatedProducts";
import ProductDetailsAccordion from "../../../components/product/ProductDetailsAccordion";
import { LuSearchX } from "react-icons/lu";

const ProductDetails = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartToast, setCartToast] = useState(false);

  const navigate = useNavigate();

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { refreshCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(slug);

        setProduct(data.product || data);
      } catch (error) {
        setError("We couldn't find this creation.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleIncrease = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((currentQuantity) => Math.max(currentQuantity - 1, 1));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");
      await addToCart(product.id, quantity);
      await refreshCart();
      setCartToast(true);
      setTimeout(() => {
        setCartToast(false);
      }, 3500);
    } catch (error) {
      setCartMessage(
        error.response?.data?.message ||
          "Unable to add this item to your cart.",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <main className="ProductDetails">
        <div className="ProductDetails-container">
          <div className="ProductDetails-loading">
            <div className="ProductDetails-loadingGallery" />

            <div className="ProductDetails-loadingInfo">
              <div className="ProductDetails-loadingLine ProductDetails-loadingSmall" />
              <div className="ProductDetails-loadingLine ProductDetails-loadingTitle" />
              <div className="ProductDetails-loadingLine" />
              <div className="ProductDetails-loadingLine ProductDetails-loadingShort" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="ProductDetails">
        <div className="ProductDetails-error">
          <LuSearchX className="ProductDetails-errorSymbol" />
          <h1 className="ProductDetails-errorTitle">Creation not found</h1>
          <p className="ProductDetails-errorText">
            This little creation may have moved somewhere else.
          </p>
          <Link to="/products" className="ProductDetails-backButton">
            <FiArrowLeft size={16} />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ProductDetails">
      <div className="ProductDetails-container">
        <div className="ProductDetails-breadcrumb">
          <Link to="/" className="ProductDetails-breadcrumbLink">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="ProductDetails-breadcrumbLink">
            Shop
          </Link>
          <span>/</span>

          <span className="ProductDetails-breadcrumbCurrent">
            {product.name}
          </span>
        </div>

        <div className="ProductDetails-layout">
          <div className="ProductDetails-gallery">
            <ProductGallery product={product} />
          </div>

          <div className="ProductDetails-content">
            <ProductInfo product={product} />

            <ProductPurchase
              product={product}
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onAddToCart={handleAddToCart}
              addingToCart={addingToCart}
              isLoggedIn={isAuthenticated}
            />

            {cartToast && (
              <div className="ProductDetails-cartToast">
                <div className="ProductDetails-cartToastContent">
                  <span className="ProductDetails-cartToastCheck">✓</span>

                  <span>{product.name} added to your cart</span>
                </div>

                <Link to="/cart" className="ProductDetails-cartToastLink">
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </div>
        <ProductDetailsAccordion product={product} />
        <RelatedProducts slug={product.slug} />
      </div>
    </main>
  );
};

export default ProductDetails;
