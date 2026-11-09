import React from "react";
import Hero from "../../../components/homePage/Hero";
import FeaturedProducts from "../../../components/homePage/FeaturedProducts";
import CategoryShowcase from "../../../components/homePage/CategoryShowcase";
import OurStory from "../../../components/homePage/OurStory";
import GiftCollections from "../../../components/homePage/GiftCollections";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <CategoryShowcase />
      <OurStory />
      <GiftCollections />
    </div>
  );
};

export default HomePage;
