import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CategoryForm from "../../../components/admin/CategoryForm/CategoryForm";
import { createCategory } from "../../../api/adminCategory.api";
import "./AddCategory.css";
import { IoMdArrowBack } from "react-icons/io";

const AddCategory = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      console.log("ADD CATEGORY:", [...formData.entries()]);

      const response = await createCategory(formData);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to create category");
      }

      toast.success("Category created successfully");

      navigate("/paviknots/admin/categories");
    } catch (error) {
      console.error("CREATE CATEGORY ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create category",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/paviknots/admin/categories");
  };

  return (
    <div className="AddCategory">
      <div className="AddCategory-header">
        <Link
          to="/paviknots/admin/categories"
          className="EditCategory-backLink"
        >
          <IoMdArrowBack />
          Back to Categories
        </Link>
        <div>
          <h1>Add Category</h1>
          <p>Create a new category for organizing your crochet products.</p>
        </div>
      </div>

      <CategoryForm
        mode="add"
        loading={saving}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AddCategory;
