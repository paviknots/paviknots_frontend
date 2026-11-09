import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProductForm from "../../../components/admin/ProductForm/ProductForm";
import api from "../../../api/axios";
import "./EditProduct.css";
import {
  getAdminProductById,
  updateProduct,
  addProductImages,
  deleteProductImage,
  deleteProduct,
} from "../../../api/adminProduct.api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [productResponse, categoriesResponse] = await Promise.all([
        getAdminProductById(id),
        api.get("/categories"),
      ]);

      const productData = productResponse.data ?? productResponse.product;
      const categoryData = categoriesResponse.data;
      setProduct(productData);
      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : (categoryData.categories ??
              categoryData.data?.categories ??
              categoryData.data ??
              []),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    setError("");
    try {
      console.log(form);
      await updateProduct(id, form);
      toast.success("Product updated successfully");
      await fetchProduct();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update product.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddImages = async (images) => {
    if (!images?.length) return;

    setSubmitting(true);
    setError("");

    try {
      await addProductImages(id, images);

      toast.success("Images uploaded successfully");

      await fetchProduct();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to upload images.";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?",
    );
    if (!confirmed) return;
    setError("");
    try {
      await deleteProductImage(id, imageId);
      toast.success("Image deleted successfully");
      await fetchProduct();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete image.";
      setError(message);
      toast.error(message);
    }
  };

  const handleDeleteProduct = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? Delete means disabling the product",
    );
    if (!confirmed) return;
    setSubmitting(true);
    setError("");

    try {
      await deleteProduct(id);
      toast.success("Product disabled successfully");
      navigate("/paviknots/admin/products");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete product.";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="EditProduct__loading">Loading product...</div>;
  }

  if (error && !product) {
    return (
      <div className="EditProduct__error" role="alert">
        {error}
        <button type="button" onClick={fetchProduct}>
          Retry
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="EditProduct">
      {error && (
        <div className="EditProduct__error" role="alert">
          {error}
        </div>
      )}

      <ProductForm
        initialProduct={product}
        categories={categories}
        onSubmit={handleSubmit}
        onAddImages={handleAddImages}
        onDeleteImage={handleDeleteImage}
        onDelete={handleDeleteProduct}
        onCancel={() => navigate("/paviknots/admin/products")}
        submitting={submitting}
        isEdit
      />
    </div>
  );
}

export default EditProduct;
