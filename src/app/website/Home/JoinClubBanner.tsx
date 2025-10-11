import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";

const JoinClubBanner: React.FC = () => (
  <section
    className={`${styles.joinClubBanner} position-relative d-flex align-items-center justify-content-center`}
  >
    {/* Overlay */}
    <div className={styles.overlay}></div>

    {/* Logo top left */}
    <div
      className="position-absolute top-0 start-0 ms-4 mt-3"
      style={{ zIndex: 3 }}
    >
      <Image
        src="/images/logo-white.svg"
        alt="Puffn Club Logo"
        width={200}
        height={40}
        priority
      />
    </div>

    {/* Centered content */}
    <div className="text-center text-white z-3">
      <h2 className=" mb-1">Join the Puffn Club</h2>
      <p className="mb-0 fs-5">
        the more you shop, the stronger your style game gets.
      </p>
    </div>
  </section>
);

export default JoinClubBanner;
