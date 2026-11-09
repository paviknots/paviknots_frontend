import {
  FaHeart,
  FaWandMagicSparkles,
  FaGem,
  FaTruckFast,
} from "react-icons/fa6";
import "./Benefits.css";

export function Benefits() {
  const benefits = [
    {
      icon: FaHeart,
      title: "100% Handmade",
      description: "Crafted with love",
    },
    {
      icon: FaWandMagicSparkles,
      title: "Custom & Unique",
      description: "One-of-a-kind creations",
    },
    {
      icon: FaGem,
      title: "Premium Quality",
      description: "Soft, safe & durable yarn",
    },
    {
      icon: FaTruckFast,
      title: "Pan India Delivery",
      description: "Get your favorites delivered",
    },
  ];

  return (
    <section className="benefits-section">
      {benefits.map(({ icon: Icon, title, description }) => (
        <div className="benefit-item" key={title}>
          <span className="benefit-icon">
            <Icon />
          </span>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
