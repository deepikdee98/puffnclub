'use client';

import React from 'react';

interface DeliveryAddressCardProps {
  name: string;
  phone: string;
  address: string;
  onChangeAddress?: () => void;
}

export default function DeliveryAddressCard({
  name,
  phone,
  address,
  onChangeAddress,
}: DeliveryAddressCardProps) {
  return (
    <div className="bg-white rounded-3 p-4 shadow-sm mb-3">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h6 className="mb-0 fw-bold">{name}</h6>
        {onChangeAddress && (
          <button
            onClick={onChangeAddress}
            className="btn btn-link text-success p-0 text-decoration-none small"
          >
            Change
          </button>
        )}
      </div>
      <p className="text-muted mb-2 small">{phone}</p>
      <p className="text-muted mb-0 small">{address}</p>
    </div>
  );
}
