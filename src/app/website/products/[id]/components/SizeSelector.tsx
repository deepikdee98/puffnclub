"use client";

import styles from "../styles.module.scss";

interface Size {
  size: string;
  available: boolean;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
}: SizeSelectorProps) {
  return (
    <div className="mb-4">
      <h6 className="fw-bold mb-3">Select size</h6>
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
