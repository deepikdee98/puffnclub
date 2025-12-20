"use client";

import { Button } from "react-bootstrap";
import Image from "next/image";
import styles from "../styles.module.scss";

interface ProductActionsProps {
  selectedSize: string;
  isWishlisted: boolean;
  isAddedToCart: boolean;
  onAddToBag: () => void;
  onGoToCart: () => void;
  onWishlistToggle: () => void;
}

export default function ProductActions({
  selectedSize,
  isWishlisted,
  isAddedToCart,
  onAddToBag,
  onGoToCart,
  onWishlistToggle,
}: ProductActionsProps) {
  return (
    <div className="d-flex w-50 align-items-center gap-3 mb-4">
      <Button
        variant={isAddedToCart ? "dark" : "outline-dark"}
        size="lg"
        className={`flex-grow-1 ${styles.goToCartBtn}`}
        onClick={isAddedToCart ? onGoToCart : onAddToBag}
        disabled={!selectedSize}
      >
        {isAddedToCart ? "Go to Cart" : "Add to Bag"}
      </Button>
      <button
        type="button"
        className="border-0 bg-transparent p-0"
        onClick={onWishlistToggle}
        aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        style={{ cursor: "pointer" }}
      >
        <Image
          src={isWishlisted ? "/images/whishlist-icon.svg" : "/images/add-whislisht.svg"}
          alt={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          width={36}
          height={36}
        />
      </button>
    </div>
  );
}
