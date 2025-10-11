"use client";

import { Button } from "react-bootstrap";
import { FiHeart } from "react-icons/fi";
import styles from "../styles.module.scss";

interface ProductActionsProps {
  selectedSize: string;
  isWishlisted: boolean;
  onGoToCart: () => void;
  onWishlistToggle: () => void;
}

export default function ProductActions({
  selectedSize,
  isWishlisted,
  onGoToCart,
  onWishlistToggle,
}: ProductActionsProps) {
  return (
    <div className="d-flex w-50 align-items-center gap-3 mb-4">
      <Button
        variant="outline-dark"
        size="lg"
        className={`flex-grow-1 ${styles.goToCartBtn}`}
        onClick={onGoToCart}
        disabled={!selectedSize}
      >
        Go to Cart
      </Button>
      <button
        type="button"
        className={`btn btn-outline-light border rounded-circle d-flex align-items-center justify-content-center ${
          styles.wishlistBtn
        } ${isWishlisted ? styles.wishlisted : ""}`}
        onClick={onWishlistToggle}
        aria-label="Add to Wishlist"
      >
        <FiHeart
          size={24}
          className="text-dark"
          fill={isWishlisted ? "currentColor" : "none"}
        />
        <span className={styles.plusSign}>+</span>
      </button>
    </div>
  );
}
