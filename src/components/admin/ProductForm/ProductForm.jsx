import { useEffect, useState } from "react";
import "./ProductForm.css";
import { IoMdArrowBack } from "react-icons/io";

const EMPTY_PRODUCT = {
  name: "",
  slug: "",
  categoryId: "",
  price: "",
  description: "",
  material: "",
  measurements: "",
  itemCount: 1,
  weight: "",
  color: "",
  careInstructions: "",
  whatsIncluded: "",
  perfectFor: "",
  isFeatured: false,
};

function ProductForm({
  initialProduct,
  categories = [],
  onSubmit,
  onCancel,
  onDelete,
  onAddImages,
  onDeleteImage,
  submitting = false,
  isEdit = false,
}) {
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [errors, setErrors] = useState({});
  const [newImages, setNewImages] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!initialProduct) {
      setForm(EMPTY_PRODUCT);
      return;
    }

    setForm({
      ...EMPTY_PRODUCT,
      ...initialProduct,

      name: initialProduct.name ?? "",
      slug: initialProduct.slug ?? "",
      description: initialProduct.description ?? "",
      price: initialProduct.price ?? "",
      material: initialProduct.material ?? "",
      measurements: initialProduct.measurements ?? "",
      itemCount: initialProduct.itemCount ?? 1,
      weight: initialProduct.weight ?? "",
      color: initialProduct.color ?? "",
      careInstructions: initialProduct.careInstructions ?? "",
      whatsIncluded: initialProduct.whatsIncluded ?? "",
      perfectFor: initialProduct.perfectFor ?? "",
      categoryId:
        initialProduct.categoryId ?? initialProduct.category?.id ?? "",
      isFeatured: Boolean(initialProduct.isFeatured),
    });
  }, [initialProduct]);

  useEffect(() => {
    if (initialProduct?.images?.length > 0) {
      const stillExists = initialProduct.images.find(
        (img) => img.id === selectedImage?.id || img.url === selectedImage?.url,
      );
      if (!stillExists) {
        setSelectedImage(initialProduct.images[0]);
      }
    } else {
      setSelectedImage(null);
    }
  }, [initialProduct?.images, selectedImage]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]:
          type === "checkbox" ? checked : type === "number" ? value : value,
      };

      if (name === "name" && !isEdit) {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }

      return updated;
    });

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleImageChange = (event) => {
    setNewImages(Array.from(event.target.files || []));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = "Product name is required.";
    }
    if (!form.slug.trim()) {
      nextErrors.slug = "Product slug is required.";
    }
    if (!form.categoryId) {
      nextErrors.categoryId = "Select a category.";
    }
    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) <= 0
    ) {
      nextErrors.price = "Enter a valid price greater than zero.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (
      !Number.isInteger(Number(form.itemCount)) ||
      Number(form.itemCount) < 1
    ) {
      nextErrors.itemCount = "Item count must be at least 1.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim(),
      categoryId: form.categoryId,
      price: Number(form.price),
      itemCount: Number(form.itemCount),
      isFeatured: Boolean(form.isFeatured),
    };

    await onSubmit(payload, newImages);
  };

  const fieldError = (name) =>
    errors[name] ? (
      <span className="ProductForm__error">{errors[name]}</span>
    ) : null;

  return (
    <form className="ProductForm" onSubmit={handleSubmit}>
      <div className="ProductForm__top">
        <div>
          <button
            type="button"
            className="ProductForm__back"
            onClick={onCancel}
          >
            <IoMdArrowBack /> Back to Products
          </button>

          <h1>{isEdit ? "Edit Product" : "Add Product"}</h1>

          <p>
            {isEdit
              ? "Update product details and images."
              : "Add a new handmade creation to your collection."}
          </p>
        </div>

        {/* {isEdit && onDelete && (
          <button
            type="button"
            className="ProductForm__delete"
            onClick={onDelete}
          >
            Delete Product
          </button>
        )} */}
      </div>

      <div className="ProductForm__main">
        <section className="ProductForm__card">
          <h2>Product Information</h2>

          <div className="ProductForm__grid">
            <label>
              Product Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Crochet Sunflower Bouquet"
              />
              {fieldError("name")}
            </label>

            <label>
              Slug
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="crochet-sunflower-bouquet"
              />
              <small>Use lowercase letters, numbers, and hyphens.</small>
              {fieldError("slug")}
            </label>

            <label>
              Category
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {fieldError("categoryId")}
            </label>

            <label>
              Price (₹)
              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="699"
              />
              {fieldError("price")}
            </label>
          </div>

          <label className="ProductForm__fullField">
            Description
            <textarea
              name="description"
              rows="6"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your handmade product..."
            />
            {fieldError("description")}
          </label>
          <label className="ProductForm__included">
            Perfect For
            <textarea
              name="perfectFor"
              rows="3"
              value={form.perfectFor ?? ""}
              onChange={handleChange}
              placeholder="e.g. Birthday gifts, anniversaries, baby showers, home decor..."
            />
            <small>
              Mention occasions or situations where this product makes a perfect
              gift.
            </small>
          </label>
          <div className="ProductForm__detailsGrid">
            <label>
              Material
              <input
                name="material"
                value={form.material ?? ""}
                onChange={handleChange}
                placeholder="e.g. Premium cotton yarn"
              />
            </label>

            <label>
              Item Count
              <input
                type="number"
                name="itemCount"
                min="1"
                step="1"
                value={form.itemCount}
                onChange={handleChange}
              />
              {fieldError("itemCount")}
            </label>

            <label>
              Color
              <input
                name="color"
                value={form.color ?? ""}
                onChange={handleChange}
                placeholder="e.g. Yellow, brown, green"
              />
            </label>

            <label>
              Weight
              <input
                name="weight"
                value={form.weight ?? ""}
                onChange={handleChange}
                placeholder="e.g. 250 g"
              />
            </label>
            <label>
              Measurements
              <input
                name="measurements"
                value={form.measurements ?? ""}
                onChange={handleChange}
                placeholder="e.g. Approx. 30 cm × 20 cm"
              />
            </label>

            <label>
              Care Instructions
              <textarea
                name="careInstructions"
                rows="1"
                value={form.careInstructions ?? ""}
                onChange={handleChange}
                placeholder="How should customer care this item?"
              />
            </label>

            <label className="ProductForm__included">
              What's Included
              <textarea
                name="whatsIncluded"
                rows="3"
                value={form.whatsIncluded ?? ""}
                onChange={handleChange}
                placeholder="List the items included with this product."
              />
            </label>
          </div>
        </section>

        <div className="ProductForm__side">
          <section className="ProductForm__card">
            <div className="ProductForm__sectionHeader">
              <h2>Product Images</h2>

              <label
                className="ProductForm__uploadButton"
                style={{
                  color: "black",
                  background: "white",
                  border: "1px solid black",
                }}
              >
                + Add Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {initialProduct?.images?.length > 0 && (
              <div className="ProductForm__imageGallery">
                <div className="ProductForm__thumbnailList">
                  {initialProduct.images.map((image) => {
                    const isActive =
                      selectedImage &&
                      (selectedImage.id === image.id ||
                        selectedImage.url === image.url);

                    return (
                      <button
                        type="button"
                        key={image.id || image.url}
                        className={`ProductForm__thumbnailBtn ${
                          isActive ? "is-active" : ""
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        <img src={image.url} alt={image.altText || form.name} />
                      </button>
                    );
                  })}
                </div>

                <div className="ProductForm__largePreview">
                  {selectedImage && (
                    <>
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.altText || form.name}
                      />
                      {onDeleteImage && selectedImage.id && (
                        <button
                          type="button"
                          className="ProductForm__removeLargeImage"
                          onClick={() => onDeleteImage(selectedImage.id)}
                          aria-label="Delete image"
                          title="Delete Image"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {newImages.length > 0 && (
              <div className="ProductForm__selectedFiles">
                <strong>Selected images</strong>
                {newImages.map((image) => (
                  <div key={`${image.name}-${image.size}`}>{image.name}</div>
                ))}
              </div>
            )}

            {isEdit && newImages.length > 0 && (
              <button
                type="button"
                className="ProductForm__secondaryButton"
                onClick={() => onAddImages?.(newImages)}
              >
                Upload Selected Images
              </button>
            )}

            {/* <p className="ProductForm__hint">
              The first image is used as the main
              product image.
            </p> */}
          </section>

          <section className="ProductForm__card">
            <h2>Product Status</h2>

            <label className="ProductForm__toggleRow">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />

              <span className="ProductForm__toggle" />

              <span>
                <strong>Featured Product</strong>
                <small>Show this product on the homepage.</small>
              </span>
            </label>
          </section>
        </div>
      </div>

      <div className="ProductForm__actions">
        <button
          type="button"
          className="ProductForm__cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="ProductForm__submit"
          disabled={submitting}
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
