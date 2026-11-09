import { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import "./ProductGallery.css";

const ProductGallery = ({ product }) => {
  const images = product?.images || [];
  const [selectedImage, setSelectedImage] = useState(0);

  const currentImage = images[selectedImage];

  return (
    <div className="ProductGallery">
      {images.length >= 1 && (
        <div className="ProductGallery-thumbnails">
          {images.map((image, index) => (
            <button
              type="button"
              key={image.id}
              className={`ProductGallery-thumbnail ${
                selectedImage === index ? "ProductGallery-thumbnailActive" : ""
              }`}
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={image.altText || `${product.name} ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}

      <div className="ProductGallery-main">
        {currentImage?.url ? (
          <img
            src={currentImage.url}
            alt={currentImage.altText || product.name}
            className="ProductGallery-mainImage"
          />
        ) : (
          <div className="ProductGallery-placeholder">
            <span>✿</span>
            <small>PaviKnots</small>
          </div>
        )}

        {product.isFeatured && (
          <span className="ProductGallery-featured">Featured</span>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
