'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from 'react-bootstrap';
import ActionButton from './shared/ActionButton';
import {
  formatPrice,
  getDeliveryStatusText,
  getProductImage,
  getProductName,
  getProductSize,
  getProductQuantity,
  getProductPrice,
  getOrderAction,
} from '../utils/orderHelpers';
import type { Order, OrderAction } from '../types/orders.types';

interface OrderCardProps {
  order: Order;
  onAction: (orderId: string, action: OrderAction) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onAction }) => {
  const productImage = getProductImage(order);
  const productName = getProductName(order);
  const productSize = getProductSize(order);
  const productQty = getProductQuantity(order);
  const productPrice = getProductPrice(order);
  const deliveryStatus = getDeliveryStatusText(order);
  const actionConfig = getOrderAction(order);

  return (
    <Card className="mb-3 border shadow-sm">
      <Card.Body className="p-3">
        {/* Header with Order ID and Delivery Status */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <p className="small text-muted mb-0">Order ID: #{order.orderNumber}</p>
          </div>
          <div className="text-end">
            <p className="small text-muted mb-0">{deliveryStatus}</p>
          </div>
        </div>

        {/* Product Details in Horizontal Layout */}
        <div className="d-flex gap-3 align-items-center">
          {/* Product Image */}
          <div
            className="rounded overflow-hidden flex-shrink-0"
            style={{
              width: '80px',
              height: '80px',
              position: 'relative',
            }}
          >
            <Image
              src={productImage}
              alt={productName}
              fill
              style={{ objectFit: 'cover' }}
              sizes="80px"
            />
          </div>

          {/* Product Info */}
          <div className="flex-grow-1">
            <h6 className="mb-1 fw-semibold">{productName}</h6>
            <p className="text-muted small mb-1">
              Size: {productSize} | Qty: {productQty}
            </p>
            <p className="fw-bold mb-0">{formatPrice(productPrice)}</p>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <ActionButton
              label={actionConfig.label}
              onClick={() => onAction(order._id, actionConfig.action)}
              variant="primary"
              size="sm"
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderCard;
