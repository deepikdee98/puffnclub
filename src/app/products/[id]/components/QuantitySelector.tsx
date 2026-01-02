"use client";

import { Button } from "react-bootstrap";
import { FiMinus, FiPlus } from "react-icons/fi";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (change: number) => void;
  maxQuantity?: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  maxQuantity = 10,
}: QuantitySelectorProps) {
  return (
    <div className="mb-4">
      <h6 className="fw-bold mb-3">Quantity</h6>
      <div className="d-flex align-items-center">
        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
          className="rounded-circle"
          style={{ width: "40px", height: "40px" }}
        >
          <FiMinus />
        </Button>
        <span className="mx-4 fw-bold h5 mb-0">{quantity}</span>
        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => onQuantityChange(1)}
          disabled={quantity >= maxQuantity}
          className="rounded-circle"
          style={{ width: "40px", height: "40px" }}
        >
          <FiPlus />
        </Button>
      </div>
    </div>
  );
}
