"use client";

import Image from "next/image";
import styles from "../styles.module.scss";

export default function DeliveryInfo() {
  return (
    <div className=" border-top border-bottom px-2 pt-4 pb-4 pb-2 mb-2 mt-2">
      <h6 className="fw-bold mb-4">Shipping Details</h6>
      <div className="d-flex justify-content-between text-center">
        <div className="d-flex flex-column align-items-center flex-grow-1">
          <Image
            src="/images/cod-icon.svg"
            alt="COD available"
            width={32}
            height={32}
            className={styles.deliveryIcon}
          />
          <span className="small pt-2 text-dark">COD available</span>
        </div>
        <div className="d-flex flex-column align-items-center flex-grow-1">
          <Image
            src="/images/returns-icon.svg"
            alt="Return Policy"
            width={32}
            height={32}
            className={styles.deliveryIcon}
          />
          <span className="small pt-2 text-dark">
            7 days return or replace <br /> the product
          </span>
        </div>
        <div className="d-flex flex-column align-items-center flex-grow-1">
          <Image
            src="/images/shipping-icon.svg"
            alt="Shipping Time"
            width={32}
            height={32}
            className={styles.deliveryIcon}
          />
          <span className="small pt-2 text-dark">
            Usually ships in 3-4
            <br />
            business days
          </span>
        </div>
      </div>
    </div>
  );
}
