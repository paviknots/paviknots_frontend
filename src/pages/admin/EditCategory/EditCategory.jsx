import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import CategoryForm from "../../../components/admin/CategoryForm/CategoryForm";
import "./EditCategory.css";
import {
  getAdminCategoryById,
  updateCategory,
} from "../../../api/adminCategory.api";
import { IoMdArrowBack } from "react-icons/io";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await getAdminCategoryById(id);
        setCategory(response?.category || response?.data || null);
      } catch (error) {
        console.error("GET CATEGORY ERROR:", error);
        toast.error(
          error?.response?.data?.message || "Failed to load category",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      console.log([...formData.entries()]);
      await updateCategory(id, formData);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("UPDATE CATEGORY ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update category",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="EditCategory">
        <div className="EditCategory-loading">Loading category...</div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="EditCategory">
      <div className="EditCategory-header">
        <Link
          to="/paviknots/admin/categories"
          className="EditCategory-backLink"
        >
          <IoMdArrowBack /> Back to Categories
        </Link>
        <div>
          <h1>Edit Category</h1>
          <p>Update the category details and settings.</p>
        </div>
      </div>

      <CategoryForm
        mode="edit"
        initialCategory={category}
        loading={saving}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/paviknots/admin/categories")}
      />
    </div>
  );
};

export default EditCategory;
