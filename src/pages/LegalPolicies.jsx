import React from "react";
import "./LegalPolicies.css";

export function FAQs() {
  return (
    <section className="policy-section" id="faqs">
      <h2>FAQs</h2>

      <div className="policy-item">
        <h3>1. Are all your products handmade?</h3>
        <p>
          Yes, every single piece at PaviKnots is 100% handmade with patience
          and care. Because each item is hand-crocheted, slight variations in
          size, stitch tension, and color may occur, making your piece entirely
          unique.
        </p>
      </div>

      <div className="policy-item">
        <h3>2. Do you accept custom orders?</h3>
        <p>
          We love bringing your ideas to life! Custom orders are subject to our
          current workload and yarn availability. Please reach out to us at
          pavi.knots@gmail.com or DM us on Instagram (@pavi_knots) with your
          reference images and color preferences to discuss feasibility and
          pricing.
        </p>
      </div>

      <div className="policy-item">
        <h3>3. How long does it take to make an item?</h3>
        <p>
          Since our products are made to order, crafting time can take anywhere
          from 3 to 14 business days, depending on the complexity of the design
          and the volume of orders we currently have.
        </p>
      </div>
    </section>
  );
}

export function ShippingAndDelivery() {
  return (
    <section className="policy-section" id="shipping">
      <h2>Shipping & Delivery</h2>

      <div className="policy-item">
        <h3>Order Processing Time</h3>
        <p>
          Because our items are handmade to order, please allow 3 to 14 business
          days for us to craft your piece before it is dispatched. Ready-to-ship
          items will be dispatched within 2-3 business days.
        </p>
      </div>

      <div className="policy-item">
        <h3>Shipping Rates & Delivery</h3>
        <ul>
          <li>We currently ship across India.</li>
          <li>
            Standard shipping usually takes 4-7 business days to reach you once
            dispatched, depending on your location.
          </li>
          <li>
            Shipping rates are calculated at checkout based on your delivery
            address and the weight of your package.
          </li>
        </ul>
      </div>

      <div className="policy-item">
        <h3>Order Tracking</h3>
        <p>
          Once your order has been dispatched, you will receive a shipping
          confirmation email containing your tracking number and a link to track
          your package. Please allow 24 hours for the tracking information to
          update.
        </p>
      </div>

      <div className="policy-item">
        <h3>Delays & Issues</h3>
        <p>
          While we rely on trusted courier partners, transit delays caused by
          weather, holidays, or logistical issues are out of our control. If
          your package is significantly delayed, please contact us at
          pavi.knots@gmail.com, and we will do our best to help coordinate with
          the courier.
        </p>
      </div>
    </section>
  );
}

export function ReturnsAndRefunds() {
  return (
    <section className="policy-section" id="returns">
      <h2>Returns & Refunds</h2>

      <div className="policy-item">
        <h3>Return Policy</h3>
        <p>
          At PaviKnots, we pour our heart into creating every item. Because of
          the delicate and handmade nature of crochet,{" "}
          <strong>
            we do not accept returns or exchanges for a change of mind.
          </strong>
        </p>
      </div>

      <div className="policy-item">
        <h3>Custom Orders</h3>
        <p>
          All custom orders and personalized items are final sale and cannot be
          returned, exchanged, or refunded.
        </p>
      </div>

      <div className="policy-item">
        <h3>Damaged or Incorrect Items</h3>
        <p>
          We inspect every item carefully before shipping. However, if you
          receive a defective, damaged, or incorrect item, please contact us
          within <strong>48 hours of delivery</strong>.
        </p>
        <ul>
          <li>
            Email us at pavi.knots@gmail.com with your order number and clear
            photos of the defect or damage.
          </li>
          <li>
            If your claim is approved, we will arrange for a replacement or
            issue a refund to your original payment method.
          </li>
        </ul>
      </div>

      <div className="policy-item">
        <h3>Refund Processing</h3>
        <p>
          Approved refunds will be processed within 5-7 business days. Please
          note that it may take additional time for your bank or payment
          provider to post the refund to your account. Shipping charges are
          non-refundable.
        </p>
      </div>
    </section>
  );
}

export function TermsAndConditions() {
  return (
    <section className="policy-section" id="terms">
      <h2>Terms & Conditions</h2>

      <div className="policy-item">
        <h3>1. General Overview</h3>
        <p>
          By accessing or placing an order with PaviKnots, you agree to be bound
          by these Terms & Conditions. These terms apply to all users of the
          site, including browsers, customers, and merchants.
        </p>
      </div>

      <div className="policy-item">
        <h3>2. Product Accuracy</h3>
        <p>
          We make every effort to display the colors and details of our products
          accurately. However, colors may appear slightly different depending on
          your monitor settings. Furthermore, because all items are handmade,
          slight variations in size, color, and design are a natural part of the
          crafting process and are not considered defects.
        </p>
      </div>

      <div className="policy-item">
        <h3>3. Pricing and Availability</h3>
        <p>
          All prices are listed in Indian Rupees (INR). Prices for our products
          are subject to change without notice. We reserve the right to modify
          or discontinue a product at any time. We are not liable for any
          modification, price change, or suspension of a product.
        </p>
      </div>

      <div className="policy-item">
        <h3>4. Intellectual Property</h3>
        <p>
          All designs, images, text, and graphics on this website are the
          intellectual property of PaviKnots. You may not use, reproduce, or
          distribute any of our content without our explicit written permission.
        </p>
      </div>

      <div className="policy-item">
        <h3>5. User Conduct</h3>
        <p>
          You agree not to use our products or website for any illegal or
          unauthorized purpose. Harassment, abusive language, or fraudulent
          orders will result in an immediate ban from our services.
        </p>
      </div>
    </section>
  );
}

export function PrivacyPolicy() {
  return (
    <section className="policy-section" id="privacy">
      <h2>Privacy Policy</h2>

      <div className="policy-item">
        <h3>1. Information We Collect</h3>
        <p>
          When you make a purchase from PaviKnots, we collect the personal
          information you provide to us, such as your name, shipping address,
          billing address, phone number, and email address. This is strictly to
          process and fulfill your order.
        </p>
      </div>

      <div className="policy-item">
        <h3>2. How We Use Your Information</h3>
        <p>We use your information to:</p>
        <ul>
          <li>Process your transactions and arrange for shipping.</li>
          <li>
            Send you order confirmations, shipping updates, and customer support
            messages.
          </li>
          <li>Screen orders for potential risk or fraud.</li>
        </ul>
      </div>

      <div className="policy-item">
        <h3>3. Third-Party Services</h3>
        <p>
          We do not sell your personal information. We only share your data with
          trusted third parties necessary to fulfill your order, such as our
          secure payment gateways (e.g., Razorpay/Stripe) and our courier
          partners. These providers have their own privacy policies regarding
          the information we are required to provide to them for your
          purchase-related transactions.
        </p>
      </div>

      <div className="policy-item">
        <h3>4. Data Retention</h3>
        <p>
          When you place an order through our website, we will maintain your
          Order Information for our records unless and until you ask us to
          delete this information.
        </p>
      </div>

      <div className="policy-item">
        <h3>5. Contact Us</h3>
        <p>
          For more information about our privacy practices, if you have
          questions, or if you would like to request the deletion of your data,
          please contact us by email at pavi.knots@gmail.com.
        </p>
      </div>
    </section>
  );
}
