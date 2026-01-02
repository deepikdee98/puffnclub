"use client";

import Image from "next/image";
import styles from "../styles.module.scss";
import classNames from "classnames";

interface Size {
  size: string;
  available: boolean;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  onSizeChartClick?: () => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
  onSizeChartClick,
}: SizeSelectorProps) {
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Select size</h6>
        {onSizeChartClick && (
          <button
            type="button"
            className={`btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2 ${styles.sizeChartBtn}`}
            onClick={onSizeChartClick}
          >
            <Image
              src="/images/sizechart.svg"
              alt="Size chart"
              width={31}
              height={15}
            />
            <span
              className={classNames(
                "text-dark fw-semibold text-decoration-underline",
                styles.sizeChartText
              )}
            >
              Size chart
            </span>
          </button>
        )}
      </div>
      <div className="d-flex gap-3">
        {Array.isArray(sizes) &&
          sizes.map((sizeObj) => (
            <button
              key={sizeObj.size}
              type="button"
              className={`btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 ${
                styles.sizeOption
              } ${selectedSize === sizeObj.size ? styles.selected : ""}`}
              style={{ width: "40px", height: "40px" }}
              onClick={() => sizeObj.available && onSizeSelect(sizeObj.size)}
              disabled={!sizeObj.available}
            >
              {sizeObj.size}
            </button>
          ))}
      </div>
    </div>
  );
}
