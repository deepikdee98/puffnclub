"use client";
import type { Product } from "../../../services/productService";

interface ProductInfoProps {
  product: Pick<Product, "name" | "price" | "comparePrice">;
  getDiscountPercentage: () => number;
}

export default function ProductInfo({
  product,
  getDiscountPercentage,
}: ProductInfoProps) {
  return (
    <div className="product-details">
      <h1 className="h3 mb-2 text-dark">{product.name}</h1>
      <div className="price-section mb-4">
        <div className="d-flex align-items-center flex-wrap">
          <span className="h4 text-dark fw-bold me-3">₹{product.price}</span>
          {product.comparePrice && (
            <>
              <span className="text-muted text-decoration-line-through me-2 h6">
                ₹{product.comparePrice}
              </span>
            </>
          )}
        </div>
        {product.comparePrice && (
          <>
            <span className="text-success fw-bold me-2">
              {getDiscountPercentage()}% off
            </span>
            <small className="text-muted">on festive season</small>
          </>
        )}
      </div>
    </div>
  );
}
