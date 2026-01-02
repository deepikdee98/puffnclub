"use client";

import type { Product } from "../../../services/productService";
import { Badge } from "react-bootstrap";

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
        {/* <dt className="col-sm-4 fw-bold">SKU</dt>
        <dd className="col-sm-8">{product.sku || "N/A"}</dd> */}

        {/* <dt className="col-sm-4 fw-bold">Brand</dt>
        <dd className="col-sm-8">{product.brand || "N/A"}</dd>

        <dt className="col-sm-4 fw-bold">Category</dt>
        <dd className="col-sm-8">{product.category || "N/A"}</dd>

        <dt className="col-sm-4 fw-bold">Selected Colour</dt>
        <dd className="col-sm-8">{selectedColor || "N/A"}</dd>

        <dt className="col-sm-4 fw-bold">Available Colours</dt>
        <dd className="col-sm-8">
          {product.availableColors && product.availableColors.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {product.availableColors.map((color, index) => (
                <Badge key={index} bg="secondary" className="px-2 py-1">
                  {color}
                </Badge>
              ))}
            </div>
          ) : (
            "N/A"
          )}
        </dd> */}

        {/* <dt className="col-sm-4 fw-bold">Available Sizes</dt>
        <dd className="col-sm-8">
          {product.availableSizes && product.availableSizes.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {product.availableSizes.map((size, index) => (
                <Badge key={index} bg="outline-secondary" className="px-2 py-1 border">
                  {size}
                </Badge>
              ))}
            </div>
          ) : (
            "N/A"
          )}
        </dd> */}
{/* 
        <dt className="col-sm-4 fw-bold">Tags</dt>
        <dd className="col-sm-8">
          {product.tags && product.tags.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} bg="info" className="px-2 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            "No tags"
          )}
        </dd>

        <dt className="col-sm-4 fw-bold">Total Stock</dt>
        <dd className="col-sm-8">{product.totalStock || 0} units</dd> */}

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

        {product.isFeatured && (
          <>
            <dt className="col-sm-4 fw-bold">Featured</dt>
            <dd className="col-sm-8">
              <Badge bg="success">Yes</Badge>
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}
