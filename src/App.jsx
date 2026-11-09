import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// import Footer from "./components/headerFooter/Footer/Footer";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";

import AdminDashboard from "./pages/admin/Dashboard/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import HomePage from "./pages/user/home/HomePage";
import Shop from "./pages/user/shop/Shop";
import ProductDetails from "./pages/user/productDetail/ProductDetails";
import Login from "./pages/user/login/Login";
import Cart from "./pages/user/cart/Cart";
import Checkout from "./pages/user/checkout/Checkout";
import CheckoutAddresses from "./pages/user/checkout/CheckoutAddresses";
import Orders from "./pages/user/order/Order";
import OrderSuccess from "./pages/user/order/OrderSuccess";
import OrderDetails from "./pages/user/order/OrderDetails";
import AdminOrders from "./pages/admin/OrdersList/AdminOrders";
import AdminOrderDetails from "./pages/admin/OrderDetail/AdminOrderDetails";
import AdminProducts from "./pages/admin/ProductList/AdminProducts";
import EditProduct from "./pages/admin/EditProduct/EditProduct";
import AddProduct from "./pages/admin/AddProduct/AddProduct";
import AdminCategories from "./pages/admin/CategoriesList/AdminCategories";
import EditCategory from "./pages/admin/EditCategory/EditCategory";
import AddCategory from "./pages/admin/AddCategory/AddCategory";
import AdminDiscounts from "./pages/admin/Discount/AdminDiscounts";
import AdminDiscountForm from "./pages/admin/Discount/AdminDiscountForm";
import Home from "./pages/user/home/Home";
import { Navbar } from "./components/home/Navbar";
import CategoriesPage from "./pages/user/category/CategoriesPage";
import PersonalizedCreations from "./components/home/PersonalizedCreations";
import AboutUs from "./components/home/AboutUs";
import ContactUs from "./components/home/ContactUs";
import { Footer } from "./components/home/Footer";
import {
  FAQs,
  PrivacyPolicy,
  ReturnsAndRefunds,
  ShippingAndDelivery,
  TermsAndConditions,
} from "./pages/LegalPolicies";
import Register from "./pages/user/register/Register";
import NotFound from "./pages/NotFound";

const AppLayout = () => {
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isAdminPage = location.pathname.startsWith("/paviknots/admin");

  const isHomePage = location.pathname === "/";

  return (
    <div className="App">
      {!isLoginPage && <Navbar />}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 18px",
            borderRadius: "8px",
            background: "#fffdfb",
            color: "#28252a",
            border: "1px solid #e5dcda",
            boxShadow: "0 6px 20px rgba(60, 40, 40, 0.08)",
            marginTop: "50px",
          },
        }}
      />

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/personalised-orders"
            element={<PersonalizedCreations />}
          />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route path="/faqs" element={<FAQs />} />
          <Route path="/shipping" element={<ShippingAndDelivery />} />
          <Route path="/returns" element={<ReturnsAndRefunds />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/addresses" element={<CheckoutAddresses />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderNumber" element={<OrderDetails />} />
          </Route>
          <Route element={<AdminProtectedRoute />}>
            <Route path="/paviknots/admin" element={<AdminDashboard />} />
            <Route path="/paviknots/admin/orders" element={<AdminOrders />} />
            <Route
              path="/paviknots/admin/orders/:orderNumber"
              element={<AdminOrderDetails />}
            />
            <Route
              path="/paviknots/admin/products"
              element={<AdminProducts />}
            />
            <Route
              path="/paviknots/admin/products/:id/edit"
              element={<EditProduct />}
            />
            <Route
              path="/paviknots/admin/products/add"
              element={<AddProduct />}
            />
            <Route
              path="/paviknots/admin/categories"
              element={<AdminCategories />}
            />
            <Route
              path="/paviknots/admin/categories/:id/edit"
              element={<EditCategory />}
            />
            <Route
              path="/paviknots/admin/categories/add"
              element={<AddCategory />}
            />

            <Route
              path="/paviknots/admin/promotions"
              element={<AdminDiscounts />}
            />

            <Route
              path="/paviknots/admin/promotions/:promotionId/edit"
              element={<AdminDiscountForm />}
            />

            <Route
              path="/paviknots/admin/promotions/new"
              element={<AdminDiscountForm />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isLoginPage && !isHomePage && !isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
