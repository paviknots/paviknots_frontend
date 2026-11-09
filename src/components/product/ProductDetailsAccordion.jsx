import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { BiDetail } from "react-icons/bi";
import { HiArrowPath } from "react-icons/hi2";
import "./ProductDetailsAccordion.css"; // Reusing the same CSS file for the accordion styles
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { FaGift } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const ProductDetailsAccordion = ({ product }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isIncludedOpen, setIsIncludedOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  console.log(product);

  return (
    <div
      id="extended-product-details"
      className="ProductDetailsAccordion-wrapper"
    >
      <div className="ProductInfo-accordionItem">
        <button
          type="button"
          className="ProductInfo-accordionHeader"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          aria-expanded={isDetailsOpen}
        >
          <h2 style={{ display: "flex", gap: "7px", alignItems: "center" }}>
            <BiDetail />
            Product Details
          </h2>

          <FiChevronDown
            size={18}
            className={`ProductInfo-chevron ${
              isDetailsOpen ? "ProductInfo-chevronRotate" : ""
            }`}
          />
        </button>

        {isDetailsOpen && (
          <div className="ProductInfo-specifications">
            <div className="ProductInfo-specRow">
              <span>Material</span>
              <strong>{product?.material || "Premium crochet yarn"}</strong>
            </div>
            <div className="ProductInfo-specRow">
              <span>Craft</span>
              <strong>Handmade Crochet</strong>
            </div>
            {product?.category?.name && (
              <div className="ProductInfo-specRow">
                <span>Product Type</span>
                <strong>{product?.category?.name}</strong>
              </div>
            )}

            {product?.measurements && (
              <div className="ProductInfo-specRow">
                <span>Measurements</span>
                <strong>{product.measurements}</strong>
              </div>
            )}

            {product?.itemCount !== undefined &&
              product?.itemCount !== null && (
                <div className="ProductInfo-specRow">
                  <span>Item Count</span>
                  <strong>
                    {product.itemCount}{" "}
                    {product.itemCount === 1 ? "piece" : "pieces"}
                  </strong>
                </div>
              )}

            {product?.weight && (
              <div className="ProductInfo-specRow">
                <span>Weight</span>
                <strong>{product.weight}</strong>
              </div>
            )}

            {product?.color && (
              <div className="ProductInfo-specRow">
                <span>Colour</span>
                <strong>{product.color}</strong>
              </div>
            )}

            <div className="ProductInfo-specRow">
              <span>Handmade</span>
              <strong>Yes</strong>
            </div>
          </div>
        )}
      </div>

      {product?.careInstructions && (
        <div className="ProductInfo-accordionItem">
          <button
            type="button"
            className="ProductInfo-accordionHeader"
            onClick={() => setIsCareOpen(!isCareOpen)}
            aria-expanded={isCareOpen}
          >
            <h2 style={{ display: "flex", gap: "7px", alignItems: "center" }}>
              <MdOutlineIntegrationInstructions />
              Care Instructions
            </h2>
            <FiChevronDown
              size={18}
              className={`ProductInfo-chevron ${
                isCareOpen ? "ProductInfo-chevronRotate" : ""
              }`}
            />
          </button>

          {isCareOpen && (
            <p className="ProductInfo-accordionContent">
              {product.careInstructions}
            </p>
          )}
        </div>
      )}

      {product?.whatsIncluded && (
        <div className="ProductInfo-accordionItem">
          <button
            type="button"
            className="ProductInfo-accordionHeader"
            onClick={() => setIsIncludedOpen(!isIncludedOpen)}
            aria-expanded={isIncludedOpen}
          >
            <h2 style={{ display: "flex", gap: "7px", alignItems: "center" }}>
              <IoIosCheckmarkCircleOutline />
              What's Included
            </h2>

            <FiChevronDown
              size={18}
              className={`ProductInfo-chevron ${
                isIncludedOpen ? "ProductInfo-chevronRotate" : ""
              }`}
            />
          </button>

          {isIncludedOpen && (
            <p className="ProductInfo-accordionContent">
              {product.whatsIncluded}
            </p>
          )}
        </div>
      )}

      <div className="ProductInfo-accordionItem">
        <button
          type="button"
          className="ProductInfo-accordionHeader"
          onClick={() => setIsReturnOpen(!isReturnOpen)}
          aria-expanded={isReturnOpen}
        >
          <h2 style={{ display: "flex", gap: "7px", alignItems: "center" }}>
            <HiArrowPath />
            Return & Cancellation
          </h2>

          <FiChevronDown
            size={18}
            className={`ProductInfo-chevron ${
              isReturnOpen ? "ProductInfo-chevronRotate" : ""
            }`}
          />
        </button>

        {isReturnOpen && (
          <div className="ProductInfo-accordionContent">
            <p style={{ marginBottom: "12px" }}>
              <strong>Returns:</strong> To initiate a return, please contact us on Instagram
              to receive the dedicated return address. Customers are required to
              bear the shipping costs for returning the item. Once we receive
              and verify the returned package, your refund will be processed.
              Please note that original shipping charges are non-refundable.
            </p>
            <p>
              <strong>Cancellations:</strong> Order cancellations can only be
              made before the product has been shipped. Once the shipment is
              dispatched, the order cannot be cancelled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsAccordion;
