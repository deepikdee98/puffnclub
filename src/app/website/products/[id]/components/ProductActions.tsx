"use client";

import { Button } from "react-bootstrap";
import { FiShoppingBag, FiHeart, FiShare2 } from "react-icons/fi";

interface ProductActionsProps {
  selectedSize: string;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onWishlistToggle: () => void;
}

export default function ProductActions({
  selectedSize,
  isWishlisted,
  onAddToCart,
  onWishlistToggle,
}: ProductActionsProps) {
  return (
    <div className="d-flex gap-3 mb-4">
      <Button
        variant="dark"
        size="lg"
        className="flex-fill py-3"
        onClick={onAddToCart}
        disabled={!selectedSize}
      >
        <FiShoppingBag className="me-2" />
        ADD TO CART
      </Button>
      <Button
        variant="outline-dark"
        size="lg"
        className="px-4"
        onClick={onWishlistToggle}
      >
        <FiHeart fill={isWishlisted ? "currentColor" : "none"} />
      </Button>
      <Button variant="outline-dark" size="lg" className="px-4">
        <FiShare2 />
      </Button>
    </div>
  );
}
