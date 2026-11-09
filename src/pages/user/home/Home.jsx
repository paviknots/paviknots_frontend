import React from "react";
import { InstagramGallery } from "../../../components/home/HomeComponents";
import "../../../components/home/Home.css";
import { AnnouncementBar } from "../../../components/home/AnnouncementBar";
import { Hero } from "../../../components/home/Hero";
import { Benefits } from "../../../components/home/Benefits";
import { Categories } from "../../../components/home/Categories";
import { FeaturedProducts } from "../../../components/home/FeaturedProducts";
import { OurStory } from "../../../components/home/OurStory";
import { Navbar } from "../../../components/home/Navbar";
import { Footer } from "../../../components/home/Footer";

const Home = () => {
  return (
    <main className="paviknots-home">
      {/* <AnnouncementBar /> */}
      {/* <Navbar /> */}
      <Hero />
      <Benefits />
      <Categories />
      <FeaturedProducts />
      <OurStory />
      <Footer />
    </main>
  );
};

export default Home;
