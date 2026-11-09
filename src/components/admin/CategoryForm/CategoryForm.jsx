import { useEffect, useRef, useState } from "react";
import "./CategoryForm.css";

const EMPTY_CATEGORY = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  imagePublicId: "",
  isActive: true,
};

const CategoryForm = ({
  mode = "add",
  initialCategory = null,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState(EMPTY_CATEGORY);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef(null);

  const isEdit = mode === "edit";

  useEffect(() => {
    if (initialCategory) {
      setForm({
        ...EMPTY_CATEGORY,
        ...initialCategory,
        name: initialCategory.name ?? "",
        slug: initialCategory.slug ?? "",
        description: initialCategory.description ?? "",
        imageUrl: initialCategory.imageUrl ?? "",
        imagePublicId: initialCategory.imagePublicId ?? "",
        isActive:
          initialCategory.isActive ?? initialCategory.status === "ACTIVE",
      });

      setImagePreview(initialCategory.imageUrl ?? "");
      setImageFile(null);
    } else {
      setForm(EMPTY_CATEGORY);
      setImagePreview("");
      setImageFile(null);
    }
  }, [initialCategory]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSlugChange = (event) => {
    const value = event.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    setForm((previous) => ({
      ...previous,
      slug: value,
    }));

    setErrors((previous) => ({
      ...previous,
      slug: "",
    }));
  };

  const handleStatusChange = (event) => {
    setForm((previous) => ({
      ...previous,
      isActive: event.target.value === "1",
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((previous) => ({
        ...previous,
        image: "Please select a valid image file",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        image: "Image size must be less than 5MB",
      }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    setErrors((previous) => ({
      ...previous,
      image: "",
    }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");

    setForm((previous) => ({
      ...previous,
      imageUrl: "",
      imagePublicId: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Category name must contain at least 2 characters";
    }

    if (!form.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (form.slug.trim().length < 2) {
      newErrors.slug = "Slug must contain at least 2 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("slug", form.slug.trim().toLowerCase());
    formData.append("description", form.description.trim());
    formData.append("isActive", String(form.isActive));

    if (isEdit && !imagePreview && !imageFile) {
      formData.append("removeImage", "true");
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    await onSubmit(formData);
  };

  return (
    <form className="CategoryForm" onSubmit={handleSubmit}>
      <div className="CategoryForm-layout">
        {/* LEFT SIDE */}
        <div className="CategoryForm-main">
          <div className="CategoryForm-card">
            <div className="CategoryForm-cardHeader">
              <div>
                <h2>Category Details</h2>

                <p>
                  {isEdit
                    ? "Update the category details and settings."
                    : "Create a new product category for your store."}
                </p>
              </div>
            </div>

            <div className="CategoryForm-fields">
              {/* Name */}
              <div className="CategoryForm-field">
                <label htmlFor="category-name">
                  Category Name <span>*</span>
                </label>

                <input
                  id="category-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Bouquets"
                  disabled={loading}
                />

                {errors.name && (
                  <small className="CategoryForm-error">{errors.name}</small>
                )}
              </div>

              {/* Slug */}
              <div className="CategoryForm-field">
                <label htmlFor="category-slug">
                  Slug <span>*</span>
                </label>

                <input
                  id="category-slug"
                  name="slug"
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. bouquets"
                  disabled={loading}
                />

                <small className="CategoryForm-help">
                  Used in the category URL.
                </small>

                {errors.slug && (
                  <small className="CategoryForm-error">{errors.slug}</small>
                )}
              </div>

              {/* Description */}
              <div className="CategoryForm-field CategoryForm-fieldFull">
                <label htmlFor="category-description">Description</label>

                <textarea
                  id="category-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the products that belong to this category..."
                  rows={6}
                  disabled={loading}
                />

                <small className="CategoryForm-help">
                  A short description helps keep your catalog organized.
                </small>
              </div>

              {isEdit && (
                <div className="CategoryForm-field CategoryForm-fieldFull">
                  <label htmlFor="category-status">Status</label>

                  <select
                    id="category-status"
                    value={form.isActive ? "1" : "0"}
                    onChange={handleStatusChange}
                    disabled={loading}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>

                  <small className="CategoryForm-help">
                    Inactive categories will not be available for new products.
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="CategoryForm-sidebar">
          <div className="CategoryForm-card">
            <div className="CategoryForm-cardHeader">
              <div>
                <h2>Category Image</h2>

                <p>Upload an image for this category.</p>
              </div>
            </div>

            <div className="CategoryForm-imageSection">
              <div className="CategoryForm-imagePreview">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={form.name || "Category preview"}
                  />
                ) : (
                  <div className="CategoryForm-imageEmpty">
                    <span>+</span>
                    <p>No image selected</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="CategoryForm-fileInput"
                disabled={loading}
              />

              <div className="CategoryForm-imageActions">
                <button
                  type="button"
                  className="CategoryForm-imageButton"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </button>

                {imagePreview && (
                  <button
                    type="button"
                    className="CategoryForm-removeButton"
                    onClick={handleRemoveImage}
                    disabled={loading}
                  >
                    Remove Image
                  </button>
                )}
              </div>

              <p className="CategoryForm-imageHelp">
                JPG, PNG or WebP. Maximum size 5MB.
              </p>

              {errors.image && (
                <small className="CategoryForm-error">{errors.image}</small>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="CategoryForm-actions">
        <button
          type="button"
          className="CategoryForm-cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="CategoryForm-submit"
          disabled={loading}
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
