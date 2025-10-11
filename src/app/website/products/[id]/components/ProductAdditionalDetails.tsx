"use client";

import type { Product } from "../../../services/productService";

interface ProductAdditionalDetailsProps {
  product: Product;
  selectedColor: string;
}

export default function ProductAdditionalDetails({
  product,
  selectedColor,
}: ProductAdditionalDetailsProps) {
  return (
    <div className="product-additional-details mt-4">
      <h5 className="mb-3">Product details</h5>
      <dl className="row">
        <dt className="col-sm-4 fw-bold">Colour</dt>
        <dd className="col-sm-8">{selectedColor || "N/A"}</dd>

        <dt className="col-sm-4 fw-bold">Material</dt>
        <dd className="col-sm-8">{product.material || "Cotton"}</dd>

        <dt className="col-sm-4 fw-bold">Pattern</dt>
        <dd className="col-sm-8">{product.pattern || "Solid / Plain"}</dd>

        <dt className="col-sm-4 fw-bold">Occasion</dt>
        <dd className="col-sm-8">{product.occasion || "Casual"}</dd>

        <dt className="col-sm-4 fw-bold">Easy care</dt>
        <dd className="col-sm-8">
          {product.easyCare || "Can do both machine wash & hand wash"}
        </dd>
      </dl>
    </div>
  );
}
