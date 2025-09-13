"use client";

import { Button } from "react-bootstrap";

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
      <h6 className="fw-bold mb-3">
        Size: <span className="fw-normal text-muted">{selectedSize}</span>
      </h6>
      <div className="d-flex gap-2 flex-wrap">
        {Array.isArray(sizes) &&
          sizes.map((sizeObj) => (
            <Button
              key={sizeObj.size}
              variant={
                selectedSize === sizeObj.size ? "dark" : "outline-secondary"
              }
              size="sm"
              onClick={() => sizeObj.available && onSizeSelect(sizeObj.size)}
              disabled={!sizeObj.available}
              className="px-3 py-2"
              style={{ minWidth: "50px" }}
            >
              {sizeObj.size}
            </Button>
          ))}
      </div>
    </div>
  );
}
