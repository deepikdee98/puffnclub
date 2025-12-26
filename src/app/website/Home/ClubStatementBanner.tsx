import React from "react";
import Image from "next/image";
import styles from "./style.module.scss";
import classNames from "classnames";

const ClubStatementBanner: React.FC = () => (
  <section className={styles.clubBanner}>
    <div className={styles.overlay}>
      <div className={styles.content}>
        <p className={classNames("text-white", styles.statement)}>
          Step into a world where every T-shirt isn’t just clothing —<br />
          it’s a statement of who you are.
        </p>
        <h2 className={styles.title}>
          Puffn Club —{" "}
          <span style={{ fontWeight: 600 }}>Your Style, Your Club.</span>
        </h2>
        {/* Brand Logo */}
        <div className={styles.logo}>
          <Image
            src="/images/puffn-logo.svg"
            alt="Puffn Club Logo"
            width={70}
            height={60}
            priority
          />
        </div>
      </div>
    </div>
  </section>
);

export default ClubStatementBanner;
