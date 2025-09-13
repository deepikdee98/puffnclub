"use client";

import { Badge } from "react-bootstrap";
import { FiStar } from "react-icons/fi";

import type { Product } from "../../../services/productService";

interface ProductInfoProps {
  product: Pick<Product, "name" | "brand" | "price" | "comparePrice" | "rating" | "reviewsCount">;
  formatCurrency: (amount: number) => string;
  renderStars: (rating: number) => React.ReactNode;
  getDiscountPercentage: () => number;
}

export default function ProductInfo({
  product,
  formatCurrency,
  renderStars,
  getDiscountPercentage,
}: ProductInfoProps) {
  return (
    <div className="product-details">
      <h1 className="h3 mb-2 text-dark">{product.name}</h1>
      <p className="text-muted mb-3 h6">{product.brand}</p>

      {/* Rating */}
      {/* <div className="d-flex align-items-center mb-4 p-3 bg-light rounded">
        <div className="me-3">{renderStars(product.rating || 0)}</div>
        <span className="me-2 fw-bold">{product.rating || 0}</span>
        <span className="text-muted">({product.reviewsCount || 0} reviews)</span>
      </div> */}

      {/* Price */}
      <div className="price-section mb-4 p-3 bg-white border rounded">
        <div className="d-flex align-items-center flex-wrap">
          <span className="h4 text-dark fw-bold me-3">Rs. {product.price}</span>
          {product.comparePrice && (
            <>
              <span className="text-muted text-decoration-line-through me-2 h6">
                Rs. {product.comparePrice}
              </span>
              <Badge bg="success" className="px-2 py-1">
                {getDiscountPercentage()}% OFF
              </Badge>
            </>
          )}
        </div>
        <small className="text-success">✓ Inclusive of all taxes</small>
      </div>
    </div>
  );
}
