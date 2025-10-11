"use client";
import styles from "../styles.module.scss";
interface ColorSelectorProps {
  variants: any[];
  selectedColor: string;
  onColorSelect: (colorName: string) => void;
}

export default function ColorSelector({
  variants,
  selectedColor,
  onColorSelect,
}: ColorSelectorProps) {
  // Get default image for a color variant
  const getColorImage = (color: string): string => {
    const variant = variants.find((v) => v.color === color);
    return variant?.images?.[0] || "/default-image.png";
  };

  return (
    <div className={`${styles.colorSelector} mb-4`}>
      <h6 className="fw-bold mb-3">
        Color: <span className="fw-normal text-muted">{selectedColor}</span>
      </h6>

      {/* Color Thumbnails Row */}
      <div className={`${styles.colorThumbnails} d-flex gap-3`}>
        {variants.map((variant) => (
          <div
            key={variant.color}
            className={`${styles.colorOption} ${
              variant.stock <= 0 ? "opacity-50" : ""
            }`}
            onClick={() => variant.stock > 0 && onColorSelect(variant.color)}
          >
            <div
              className={`${styles.colorThumbnailWrapper} ${
                selectedColor === variant.color ? styles.selected : ""
              }`}
            >
              <img
                src={getColorImage(variant.color)}
                alt={`${variant.color} variant`}
                className={styles.colorThumbnailImage}
              />
              {variant.stock <= 0 && (
                <div className={styles.outOfStockOverlay}>
                  <span className={styles.outOfStockText}>Out of Stock</span>
                </div>
              )}
            </div>
            {/* <p className={`${styles.colorName} text-center mt-1 mb-0`}>
              {variant.color}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
}
