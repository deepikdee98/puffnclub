"use client";

import { FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";

interface DeliveryInfoProps {
  deliveryInfo: {
    freeDelivery: boolean;
    deliveryTime: string;
    returnPolicy: string;
    warranty?: string;
  };
}

export default function DeliveryInfo({ deliveryInfo }: DeliveryInfoProps) {
  return (
    <div className="delivery-info bg-light p-3 rounded">
      <h6 className="fw-bold mb-3">Delivery & Services</h6>
      <div className="d-flex align-items-center mb-2">
        <FiTruck className="me-2 text-success" />
        <span className="small">Free delivery on orders above $50</span>
      </div>
      <div className="d-flex align-items-center mb-2">
        <FiRefreshCw className="me-2 text-info" />
        <span className="small">{deliveryInfo?.returnPolicy ?? "No return policy available."}</span>
      </div>
      <div className="d-flex align-items-center">
        <FiShield className="me-2 text-warning" />
        <span className="small">{deliveryInfo?.warranty ?? "No warranty information available."}</span>
      </div>
    </div>
  );
}
