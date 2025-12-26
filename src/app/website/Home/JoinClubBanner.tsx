import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";
import classNames from "classnames";

const JoinClubBanner: React.FC = () => (
  <section className={`${styles.joinClubBanner} position-relative`}>
    {/* Overlay */}
    <div className={styles.overlay}></div>

    {/* Desktop Layout */}
    <div
      className={`${styles.desktopLayout} d-none d-lg-flex align-items-center justify-content-center`}
    >
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
        <h2 className="mb-1 font-bebas">Join the Puffn Club</h2>
        <p className="mb-0 fs-5 text-white">
          the more you shop, the stronger your style game gets.
        </p>
      </div>
    </div>

    {/* Mobile Layout */}
    <div className={`${styles.mobileLayout} d-lg-none`}>
      <div className={styles.mobileContent}>
        <h2 className={styles.mobileTitle}>
          JOIN THE
          <br />
          PUFFN CLUB
        </h2>
        <p className={classNames("text-white", styles.mobileText)}>
          the more you shop,
          <br />
          the stronger
          <br />
          your style game gets.
        </p>
        <div className={styles.mobileLogo}>
          <Image
            src="/images/logo-white.svg"
            alt="Puffn Club Logo"
            width={120}
            height={24}
            priority
          />
        </div>
      </div>
    </div>
  </section>
);

export default JoinClubBanner;
