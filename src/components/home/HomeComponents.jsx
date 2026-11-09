import React, { useState } from "react";


export function InstagramGallery() {
  const images = [
    "/images/ganesha-doll.jpg",
    "/images/crochet-doll.jpg",
    "/images/sunflower-keychain.jpg",
    "/images/home-decor.jpg",
    "/images/diwali-hero.jpg",
    "/images/pumpkin-decor.jpg",
  ];

  return (
    <section className="instagram-section">
      <div className="section-heading">
        <h2>◎ Follow Us on Instagram</h2>
        <p>
          Get a peek into our latest creations, behind the scenes, and more!
        </p>
      </div>

      <div className="instagram-grid">
        {images.map((image, index) => (
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            key={index}
          >
            <img src={image} alt={`PaviKnots creation ${index + 1}`} />
          </a>
        ))}
      </div>
    </section>
  );
}

