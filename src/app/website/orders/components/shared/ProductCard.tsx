'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from 'react-bootstrap';
import { formatPrice } from '../../utils/orderHelpers';
import type { OrderItem } from '../../types/orders.types';

interface ProductCardProps {
  product: OrderItem;
  showPrice?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showPrice = true,
  size = 'medium',
  className = '',
}) => {
  const imageUrl = product.product.images?.[0] || '/default-image.png';

  const getImageSize = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80 };
      case 'large':
        return { width: 300, height: 300 };
      default:
        return { width: 120, height: 120 };
    }
  };

  const imgDimensions = getImageSize();

  return (
    <Card className={`border-0 bg-light ${className}`}>
      <Card.Body className="p-4">
        {/* Product Image - Full Width */}
        <div
          className="mb-3 rounded overflow-hidden w-100"
          style={{
            height: imgDimensions.height,
            position: 'relative',
          }}
        >
          <Image
            src={imageUrl}
            alt={product.product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>

        {/* Product Details */}
        <div>
          {/* Product Category */}
          {product.product.category && (
            <p className="text-muted small mb-1" style={{ fontSize: '0.875rem' }}>
              {product.product.category}
            </p>
          )}

          {/* Product Name and Price - Side by Side */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-semibold mb-0" style={{ fontSize: '1.125rem' }}>
              {product.product.name}
            </h6>
            {showPrice && (
              <span className="fw-bold" style={{ fontSize: '1.125rem' }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Size and Quantity */}
          <div className="d-flex gap-3 text-muted" style={{ fontSize: '0.875rem' }}>
            {product.variant?.size && <span>Size : {product.variant.size}</span>}
            <span>Qty : {product.quantity}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
