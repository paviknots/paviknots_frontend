import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FiArrowRight, FiKey, FiGift } from "react-icons/fi";
import { TbFlower } from "react-icons/tb";
import { LuShoppingBag } from "react-icons/lu";
import { GiRibbon } from "react-icons/gi";
import { BiHomeHeart } from "react-icons/bi";
import { PiFlowerLotusLight } from "react-icons/pi";
import { RiBearSmileLine } from "react-icons/ri";

import { getCategories } from "../../../api/category.api";
import "./CategoriesPage.css";

// Dynamically assign icons based on category name
const getCategoryIcon = (name = "") => {
  const value = name.toLowerCase();

  if (value.includes("god") || value.includes("divine")) {
    return <PiFlowerLotusLight />;
  }

  if (value.includes("doll") || value.includes("character")) {
    return <RiBearSmileLine />;
  }

  if (
    value.includes("plant") ||
    value.includes("flower") ||
    value.includes("bouquet")
  ) {
    return <TbFlower />;
  }

  if (value.includes("keychain")) {
    return <FiKey />;
  }

  if (value.includes("bag") || value.includes("pouch")) {
    return <LuShoppingBag />;
  }

  if (value.includes("hair") || value.includes("ribbon")) {
    return <GiRibbon />;
  }

  if (value.includes("home") || value.includes("decor")) {
    return <BiHomeHeart />;
  }

  if (value.includes("gift")) {
    return <FiGift />;
  }

  return <TbFlower />;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCategories();

        // Handle different API response structures
        const categoryList = Array.isArray(data)
          ? data
          : Array.isArray(data.categories)
            ? data.categories
            : Array.isArray(data.data)
              ? data.data
              : [];

        setCategories(categoryList.filter((cat) => cat.isActive !== false));
      } catch (err) {
        setError("Unable to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className="CategoriesPage">
      {/* Hero Section */}
      <section className="CategoriesPage-hero">
        <div className="CategoriesPage-breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          Categories
        </div>

        <h1 className="CategoriesPage-title">Our Categories</h1>

        <div className="CategoriesPage-divider">
          <span className="CategoriesPage-line" />
          <span className="CategoriesPage-heart">♡</span>
          <span className="CategoriesPage-line" />
        </div>

        <p className="CategoriesPage-subtitle">
          Explore our handmade crochet creations by category
        </p>
      </section>

      {/* Categories Grid */}
      {loading ? (
        <div className="CategoriesPage-message">Loading categories...</div>
      ) : error ? (
        <div className="CategoriesPage-message CategoriesPage-error">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="CategoriesPage-message">
          No categories available at the moment.
        </div>
      ) : (
        <section className="CategoriesPage-grid">
          {categories.map((cat) => (
            <Link
              to={`/category/${cat.slug}`}
              className="CategoriesCard"
              key={cat.id}
            >
              <div className="CategoriesCard-imageWrapper">
                <img src={cat.imageUrl} alt={cat.name} loading="lazy" />
              </div>

              <div className="CategoriesCard-footer">
                <div className="CategoriesCard-info">
                  <span className="CategoriesCard-icon">
                    {getCategoryIcon(cat.name)}
                  </span>

                  <h3 className="CategoriesCard-name">{cat.name}</h3>
                </div>

                <FiArrowRight className="CategoriesCard-arrow" size={18} />
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
