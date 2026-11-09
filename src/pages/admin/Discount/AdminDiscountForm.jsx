import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { MdOutlineDiscount, MdSave } from "react-icons/md";

import {
  createAdminPromotion,
  getAdminPromotionById,
  updateAdminPromotion,
} from "../../../api/adminDiscount.api";

import { getAdminProducts } from "../../../api/adminProduct.api";
import { getAdminCategories } from "../../../api/adminCategory.api";

import "./AdminDiscountForm.css";

const initialForm = {
  name: "",
  description: "",
  type: "FESTIVAL",
  discountType: "PERCENTAGE",
  discountValue: "",
  scope: "ALL_PRODUCTS",
  minOrderValue: "",
  maxDiscount: "",
  priority: 0,
  startAt: "",
  endAt: "",
  isActive: true,
  productIds: [],
  categoryIds: [],
};


const extractList = (response, key) => {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.[key])) return data.data[key];

  return [];
};


const extractPromotion = (response) => {
  let data = response?.data ?? response;

  if (data?.promotion) return data.promotion;
  if (data?.data?.promotion) return data.data.promotion;

  return data;
};


const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
};


const extractRelationIds = (items, directKey, relationKey) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") return item;

      return item?.[directKey] ?? item?.[relationKey]?.id ?? item?.id;
    })
    .filter(Boolean);
};

export default function AdminDiscountForm() {
  const navigate = useNavigate();
  const { promotionId } = useParams();

  const isEditMode = Boolean(promotionId);

  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingPromotion, setLoadingPromotion] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadOptions = async () => {
      setLoadingOptions(true);
      const results = await Promise.allSettled([
        getAdminProducts(),
        getAdminCategories(),
      ]);

      if (!mounted) return;

      if (results[0].status === "fulfilled") {
        setProducts(extractList(results[0].value, "products"));
      } else {
        console.error("Failed to load products:", results[0].reason);
        setProducts([]);
      }

      if (results[1].status === "fulfilled") {
        setCategories(extractList(results[1].value, "categories"));
      } else {
        console.error("Failed to load categories:", results[1].reason);
        setCategories([]);
      }

      setLoadingOptions(false);
    };

    loadOptions();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!promotionId) {
      setForm(initialForm);
      setLoadingPromotion(false);
      return;
    }

    let mounted = true;
    const loadPromotion = async () => {
      setLoadingPromotion(true);
      setError("");

      try {
        const response = await getAdminPromotionById(promotionId);
        const promotion = extractPromotion(response);

        if (!promotion || !promotion.id) {
          throw new Error(
            "Promotion details were not found in the API response.",
          );
        }

        if (!mounted) return;

        const productRelations =
          promotion.products ?? promotion.promotionProducts ?? [];

        const categoryRelations =
          promotion.categories ?? promotion.promotionCategories ?? [];

        setForm({
          name: promotion.name ?? "",
          description: promotion.description ?? "",
          type: promotion.type ?? "FESTIVAL",
          discountType: promotion.discountType ?? "PERCENTAGE",
          discountValue:
            promotion.discountValue == null
              ? ""
              : String(promotion.discountValue),
          scope: promotion.scope ?? "ALL_PRODUCTS",

          minOrderValue:
            promotion.minOrderValue == null
              ? ""
              : String(promotion.minOrderValue),

          maxDiscount:
            promotion.maxDiscount == null ? "" : String(promotion.maxDiscount),

          priority: promotion.priority ?? 0,

          startAt: toDateTimeLocal(promotion.startAt),
          endAt: toDateTimeLocal(promotion.endAt),

          isActive: promotion.isActive ?? true,

          productIds: extractRelationIds(
            productRelations,
            "productId",
            "product",
          ),

          categoryIds: extractRelationIds(
            categoryRelations,
            "categoryId",
            "category",
          ),
        });
      } catch (err) {
        console.error("Failed to load promotion:", err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load promotion details.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingPromotion(false);
        }
      }
    };

    loadPromotion();

    return () => {
      mounted = false;
    };
  }, [promotionId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,

      ...(name === "scope" && value !== "SELECTED_PRODUCTS"
        ? { productIds: [] }
        : {}),

      ...(name === "scope" && value !== "SELECTED_CATEGORIES"
        ? { categoryIds: [] }
        : {}),
    }));
  };

  const handleSelection = (event) => {
    const { name, value, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: checked
        ? previous[name].includes(value)
          ? previous[name]
          : [...previous[name], value]
        : previous[name].filter((id) => id !== value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isEditMode && loadingPromotion) {
      setError("Please wait until the promotion has finished loading.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter a discount name.");
      return;
    }

    if (!form.type) {
      setError("Please select a promotion type.");
      return;
    }

    const discountValue = Number(form.discountValue);

    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      setError("Enter a discount value greater than zero.");
      return;
    }

    if (form.discountType === "PERCENTAGE" && discountValue > 100) {
      setError("Percentage discount cannot exceed 100%.");
      return;
    }

    if (!form.startAt) {
      setError("Please select a start date.");
      return;
    }

    if (
      form.endAt &&
      new Date(form.endAt).getTime() < new Date(form.startAt).getTime()
    ) {
      setError("End date must be after the start date.");
      return;
    }

    if (
      form.minOrderValue !== "" &&
      (!Number.isFinite(Number(form.minOrderValue)) ||
        Number(form.minOrderValue) < 0)
    ) {
      setError("Minimum order value must be zero or greater.");
      return;
    }

    if (
      form.maxDiscount !== "" &&
      (!Number.isFinite(Number(form.maxDiscount)) ||
        Number(form.maxDiscount) < 0)
    ) {
      setError("Maximum discount must be zero or greater.");
      return;
    }

    if (form.scope === "SELECTED_PRODUCTS" && form.productIds.length === 0) {
      setError("Select at least one product.");
      return;
    }

    if (form.scope === "SELECTED_CATEGORIES" && form.categoryIds.length === 0) {
      setError("Select at least one category.");
      return;
    }

    const startDate = new Date(form.startAt);
    const endDate = form.endAt ? new Date(form.endAt) : null;

    if (Number.isNaN(startDate.getTime())) {
      setError("Please enter a valid start date.");
      return;
    }

    if (endDate && Number.isNaN(endDate.getTime())) {
      setError("Please enter a valid end date.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      type: form.type,
      discountType: form.discountType,
      discountValue,
      scope: form.scope,

      minOrderValue:
        form.minOrderValue === "" ? null : Number(form.minOrderValue),

      maxDiscount: form.maxDiscount === "" ? null : Number(form.maxDiscount),

      priority: Number(form.priority) || 0,
      startAt: startDate.toISOString(),
      endAt: endDate ? endDate.toISOString() : null,
      isActive: form.isActive,

      productIds: form.scope === "SELECTED_PRODUCTS" ? form.productIds : [],

      categoryIds: form.scope === "SELECTED_CATEGORIES" ? form.categoryIds : [],
    };

    try {
      setSaving(true);

      const response = isEditMode
        ? await updateAdminPromotion(promotionId, payload)
        : await createAdminPromotion(payload);

      if (response?.success === false) {
        throw new Error(
          response.message ||
            `Unable to ${isEditMode ? "update" : "create"} discount.`,
        );
      }

      navigate("/paviknots/admin/promotions");
    } catch (err) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} promotion:`,
        err,
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          `Unable to ${isEditMode ? "update" : "create"} discount.`,
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingPromotion) {
    return (
      <main className="AdminDiscountForm">
        <Link
          to="/paviknots/admin/promotions"
          className="AdminDiscountForm-back"
        >
          <IoMdArrowBack />
          Back to Discounts
        </Link>

        <div className="AdminDiscountForm-card">
          <p>Loading promotion details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="AdminDiscountForm">
      <header className="AdminDiscountForm-header">
        <Link
          to="/paviknots/admin/promotions"
          className="AdminDiscountForm-back"
        >
          <IoMdArrowBack />
          Back to Discounts
        </Link>
        <h1>{isEditMode ? "Edit Discount" : "Add Discount"}</h1>
        <p>
          {isEditMode
            ? "Update your promotion details."
            : "Create a promotion for your handmade crochet products."}
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="AdminDiscountForm-layout">
          <section className="AdminDiscountForm-card">
            <h2>Discount Information</h2>

            <div className="AdminDiscountForm-fields">
              <label className="AdminDiscountForm-field full">
                Discount Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Diwali Sale"
                  maxLength={100}
                  required
                />
              </label>

              <label className="AdminDiscountForm-field full">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this promotion..."
                  rows={4}
                />
              </label>

              <label className="AdminDiscountForm-field">
                Promotion Type
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                >
                  <option value="SALE">Sale</option>
                  <option value="FESTIVAL">Festival</option>
                  <option value="CLEARANCE">Clearance</option>
                </select>
              </label>

              <label className="AdminDiscountForm-field">
                Discount Type
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  required
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                </select>
              </label>

              <label className="AdminDiscountForm-field">
                Discount Value
                <input
                  name="discountValue"
                  type="number"
                  min="0.01"
                  max={form.discountType === "PERCENTAGE" ? "100" : undefined}
                  step="0.01"
                  value={form.discountValue}
                  onChange={handleChange}
                  placeholder={
                    form.discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 100"
                  }
                  required
                />
              </label>

              <label className="AdminDiscountForm-field">
                Applies To
                <select
                  name="scope"
                  value={form.scope}
                  onChange={handleChange}
                  required
                >
                  <option value="ALL_PRODUCTS">All Products</option>
                  <option value="SELECTED_PRODUCTS">Selected Products</option>
                  <option value="SELECTED_CATEGORIES">
                    Selected Categories
                  </option>
                </select>
              </label>

              {form.scope === "SELECTED_PRODUCTS" && (
                <fieldset className="AdminDiscountForm-selection full">
                  <legend>Select Products</legend>

                  {loadingOptions ? (
                    <p>Loading products...</p>
                  ) : products.length === 0 ? (
                    <p>No products available.</p>
                  ) : (
                    products.map((product) => (
                      <label key={product.id}>
                        <input
                          type="checkbox"
                          name="productIds"
                          value={product.id}
                          checked={form.productIds.includes(product.id)}
                          onChange={handleSelection}
                        />
                        {product.name}
                      </label>
                    ))
                  )}
                </fieldset>
              )}

              {form.scope === "SELECTED_CATEGORIES" && (
                <fieldset className="AdminDiscountForm-selection full">
                  <legend>Select Categories</legend>

                  {loadingOptions ? (
                    <p>Loading categories...</p>
                  ) : categories.length === 0 ? (
                    <p>No categories available.</p>
                  ) : (
                    categories.map((category) => (
                      <label key={category.id}>
                        <input
                          type="checkbox"
                          name="categoryIds"
                          value={category.id}
                          checked={form.categoryIds.includes(category.id)}
                          onChange={handleSelection}
                        />
                        {category.name}
                      </label>
                    ))
                  )}
                </fieldset>
              )}

              <label className="AdminDiscountForm-field">
                Minimum Order Value (₹)
                <input
                  name="minOrderValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minOrderValue}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </label>

              <label className="AdminDiscountForm-field">
                Maximum Discount (₹)
                <input
                  name="maxDiscount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.maxDiscount}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </label>

              <label className="AdminDiscountForm-field">
                Priority
                <input
                  name="priority"
                  type="number"
                  min="0"
                  step="1"
                  value={form.priority}
                  onChange={handleChange}
                />
                <small>Higher priority takes precedence.</small>
              </label>
            </div>
          </section>

          <aside className="AdminDiscountForm-sidebar">
            <section className="AdminDiscountForm-card">
              <h2>Discount Settings</h2>

              <div className="AdminDiscountForm-fields single">
                <label className="AdminDiscountForm-field">
                  Start Date
                  <input
                    type="datetime-local"
                    name="startAt"
                    value={form.startAt}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="AdminDiscountForm-field">
                  End Date
                  <input
                    type="datetime-local"
                    name="endAt"
                    value={form.endAt}
                    onChange={handleChange}
                    min={form.startAt || undefined}
                  />
                  <small>Optional. Leave blank for no end date.</small>
                </label>

                <label className="AdminDiscountForm-toggle">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />

                  <span>
                    <strong>Enable discount</strong>
                    <small>
                      The promotion can apply during its configured dates.
                    </small>
                  </span>
                </label>
              </div>
            </section>

            <section className="AdminDiscountForm-card">
              <h2>Preview</h2>

              <div className="AdminDiscountForm-preview">
                <MdOutlineDiscount />

                <span>{form.name || "Your discount name"}</span>

                <strong>
                  {form.discountValue
                    ? form.discountType === "PERCENTAGE"
                      ? `${form.discountValue}% OFF`
                      : `₹${form.discountValue} OFF`
                    : "Discount value"}
                </strong>

                <small>
                  {form.scope === "ALL_PRODUCTS"
                    ? "All products"
                    : form.scope === "SELECTED_PRODUCTS"
                      ? `${form.productIds.length} product(s) selected`
                      : `${form.categoryIds.length} categor(ies) selected`}
                </small>
              </div>
            </section>
          </aside>
        </div>

        {error && (
          <p className="AdminDiscountForm-error" role="alert">
            {error}
          </p>
        )}

        <div className="AdminDiscountForm-actions">
          <Link to="/paviknots/admin/promotions">Cancel</Link>

          <button type="submit" disabled={saving || loadingPromotion}>
            {saving
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Discount"
                : "Create Discount"}
          </button>
        </div>
      </form>
    </main>
  );
}
