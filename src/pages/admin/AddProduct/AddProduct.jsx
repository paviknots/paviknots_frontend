import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProductForm from "../../../components/admin/ProductForm/ProductForm";
import api from "../../../api/axios";

import "./AddProduct.css";
import { createProduct } from "../../../api/adminProduct.api";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/categories");
        const categoryData = response.data;
        const normalizedCategories = Array.isArray(categoryData)
          ? categoryData
          : (categoryData.categories ??
            categoryData.data?.categories ??
            categoryData.data ??
            []);

        setCategories(normalizedCategories);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError(err.response?.data?.message || "Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (form, images) => {
    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("slug", form.slug.trim());
      formData.append("description", form.description.trim());
      formData.append("price", Number(form.price));
      formData.append("categoryId", form.categoryId);
      formData.append("material", form.material?.trim() || "");
      formData.append("measurements", form.measurements?.trim() || "");
      formData.append("itemCount", Number(form.itemCount) || 1);
      formData.append("weight", form.weight?.trim() || "");
      formData.append("color", form.color?.trim() || "");
      formData.append("careInstructions", form.careInstructions?.trim() || "");
      formData.append("whatsIncluded", form.whatsIncluded?.trim() || "");
      formData.append("isFeatured", Boolean(form.isFeatured));
      images.forEach((image) => {
        formData.append("images", image);
      });

      await createProduct(formData);
      toast.success("Product created successfully");
    } catch (err) {
      console.error("Failed to create product:", err);
      const message =
        err.response?.data?.message || "Failed to create product.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/paviknots/admin/products");
  };

  if (loading) {
    return (
      <div className="AddProduct">
        <div className="AddProduct-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="AddProduct">
      {error && <div className="AddProduct-error">{error}</div>}

      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
        isEdit={false}
      />
    </div>
  );
}

export default AddProduct;
