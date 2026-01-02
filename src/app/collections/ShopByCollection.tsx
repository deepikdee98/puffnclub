"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./style.module.scss";

// Collections with category mapping to products page filters
// Category values must match the backend category names used in products page
const collections = [
  {
    title: "The Everyday Classic",
    desc: (
      <>
        Clean lines, premium cotton,
        <br /> built for daily comfort.
      </>
    ),
    bgClass: styles.classicBg,
    category: "T-Shirt",
  },
  {
    title: "Oversized Energy",
    desc: (
      <>
        Streetwear staples with
        <br /> relaxed fits and bold.
      </>
    ),
    bgClass: styles.oversizedBg,
    category: "Sweat_Shirts",
  },
  {
    title: "Hoodies",
    desc: (
      <>
        Cozy comfort meets
        <br /> street-ready style.
      </>
    ),
    bgClass: styles.hoodieBg,
    category: "Hoodies",
  },
];

const ShopByCollection: React.FC = () => {
  const router = useRouter();

  const handleShopNow = (category: string) => {
    // Navigate to products page with category filter
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-2">SHOP BY COLLECTION</h2>
        <p className="text-center text-muted mb-4">
          Discover our core Puffn Club essentials — <br />
          from everyday classics to oversized streetwear icons.
        </p>
        <div className="row g-3">
          {/* Top full-width card */}
          <div className="col-12">
            <div
              className={`px-4 py-3 d-flex flex-column flex-md-row align-items-center ${styles.collectionCard} ${collections[0].bgClass}`}
              style={{ minHeight: 350 }}
            >
              <div className="flex-grow-1">
                <h2 className=" text-dark">{collections[0].title}</h2>
                <p className="mb-2 text-dark">{collections[0].desc}</p>
                <button
                  className="btn btn-dark px-4"
                  onClick={() => handleShopNow(collections[0].category)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>

          {/* Bottom two cards */}
          <div className="col-md-6">
            <div
              className={`d-flex align-items-center px-4 py-3 h-100 ${styles.collectionCard} ${collections[1].bgClass}`}
              style={{ minHeight: 350 }}
            >
              <div className="flex-grow-1">
                <h2 className=" text-dark">{collections[1].title}</h2>
                <p className="mb-2 text-dark">{collections[1].desc}</p>
                <button
                  className="btn btn-dark px-4"
                  onClick={() => handleShopNow(collections[1].category)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className={`d-flex align-items-center px-4 py-3 h-100 ${styles.collectionCard} ${collections[2].bgClass}`}
              style={{ minHeight: 350 }}
            >
              <div className="flex-grow-1">
                <h2 className="text-dark">{collections[2].title}</h2>
                <p className="mb-2 text-dark">{collections[2].desc}</p>
                <button
                  className="btn btn-dark px-4"
                  onClick={() => handleShopNow(collections[2].category)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopByCollection;
