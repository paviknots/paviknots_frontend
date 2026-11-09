import { FaGift, FaHandHoldingHeart } from "react-icons/fa6";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiLeaf } from "react-icons/bi";
import { PiHandHeart, PiHandHeartLight } from "react-icons/pi";
import { GoGift } from "react-icons/go";


import "./ProductPerks.css";

const ProductPerks = () => {
  return (
    <div className="ProductPerks">
      <div className="ProductPerks-item">
        <div className="ProductPerks-icon">
          <LiaShippingFastSolid size={24} />
        </div>
        <div className="ProductPerks-content">
          <strong>
            Pan India
            <br />
            Shipping
          </strong>
        </div>
      </div>

      <div className="ProductPerks-item">
        <div className="ProductPerks-icon">
          <PiHandHeart size={26} />
        </div>
        <div className="ProductPerks-content">
          <strong>
            100%
            <br />
            Handmade
          </strong>
        </div>
      </div>

      <div className="ProductPerks-item">
        <div className="ProductPerks-icon">
          <GoGift size={22} />
        </div>
        <div className="ProductPerks-content">
          <strong>
            Perfect
            <br />
            for Gifting
          </strong>
        </div>
      </div>

      <div className="ProductPerks-item">
        <div className="ProductPerks-icon">
          <BiLeaf size={22} />
        </div>
        <div className="ProductPerks-content">
          <strong>
            Eco-friendly
            <br />
            Packaging
          </strong>
        </div>
      </div>
    </div>
  );
};

export default ProductPerks;
