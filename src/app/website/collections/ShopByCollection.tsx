import React from "react";
import styles from "./style.module.scss";

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
  },
];

const ShopByCollection: React.FC = () => (
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
              <button className="btn btn-dark px-4">Shop Now</button>
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
              <button className="btn btn-dark px-4">Shop Now</button>
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
              <button className="btn btn-dark px-4">Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ShopByCollection;
