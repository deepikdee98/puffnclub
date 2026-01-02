'use client';

import React from 'react';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  category?: string;
}

interface OrderSummaryCardProps {
  items: OrderItem[];
  totalMRP: number;
  discount: number;
  deliveryCharges: number;
  totalPrice: number;
  onConfirmOrder: () => void;
  isDisabled?: boolean;
}

export default function OrderSummaryCard({
  items,
  totalMRP,
  discount,
  deliveryCharges,
  totalPrice,
  onConfirmOrder,
  isDisabled = false,
}: OrderSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-3 p-4 shadow-sm">
      <h6 className="fw-bold mb-4">Summary</h6>

      {/* Product Items */}
      {items.map((item) => (
        <div key={item.id} className="d-flex align-items-start mb-3">
          <img
            src={item.image}
            alt={item.name}
            className="rounded"
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
            }}
          />
          <div className="ms-3">
            {item.category && (
              <p className="text-muted mb-0 small">{item.category}</p>
            )}
            <p className="mb-0 fw-semibold small">{item.name}</p>
          </div>
        </div>
      ))}

      <hr className="my-3" />

      {/* Price Breakdown */}
      <div className="mb-2 d-flex justify-content-between">
        <span className="text-muted small">Total MRP</span>
        <span className="small">{formatCurrency(totalMRP)}</span>
      </div>
      <div className="mb-2 d-flex justify-content-between">
        <span className="text-muted small">Discount on MRP</span>
        <span className="small">{formatCurrency(discount)}</span>
      </div>
      <div className="mb-3 d-flex justify-content-between">
        <span className="text-muted small">Delivery charges</span>
        <span className="small">{formatCurrency(deliveryCharges)}</span>
      </div>

      <hr className="my-3" />

      {/* Total Price */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <span className="fw-bold">Total Price</span>
        <span className="fw-bold h5 mb-0">{formatCurrency(totalPrice)}</span>
      </div>

      {/* Confirm Order Button */}
      <button
        onClick={onConfirmOrder}
        disabled={isDisabled}
        className="btn btn-dark w-100 py-2"
      >
        Confirm Order
      </button>
    </div>
  );
}
