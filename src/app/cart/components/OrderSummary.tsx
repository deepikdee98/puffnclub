"use client";

import { Card, Button } from "react-bootstrap";

interface OrderSummaryProps {
  totals: {
    subtotal: number;
    savings: number;
    couponDiscount: number;
    shipping: number;
    tax: number;
    total: number;
    mrp: number;
    delivery: number;
  };
  itemCount: number;
  appliedCoupon: any;
  onContinue: () => void;
  formatCurrency: (amount: number) => string;
}

export default function OrderSummary({
  totals,
  itemCount,
  appliedCoupon,
  onContinue,
  formatCurrency,
}: OrderSummaryProps) {
  return (
    <Card className="border-0 shadow-sm rounded">
      <Card.Body>
        <div className="mb-3">
          <div className="fw-semibold mb-2">Price Summary</div>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">No.of quantity</span>
          <span>{itemCount}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Total MRP</span>
          <span>{formatCurrency(totals.mrp)}</span>
        </div>
        {totals.savings > 0 && (
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Discount on MRP</span>
            <span>{formatCurrency(totals.savings)}</span>
          </div>
        )}
        {appliedCoupon && totals.couponDiscount > 0 && (
          <div className="d-flex justify-content-between mb-2 text-success">
            <span>Coupon applied</span>
            <span>{formatCurrency(totals.couponDiscount)}</span>
          </div>
        )}
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Delivery charges</span>
          <span>{formatCurrency(totals.delivery)}</span>
        </div>
        <hr className="my-3" />
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-bold">Total Price</span>
          <span className="fw-bold fs-5">{formatCurrency(totals.total)}</span>
        </div>
        <Button variant="dark" className="w-100 py-2 fs-6" onClick={onContinue}>
          Proceed to buy
        </Button>
      </Card.Body>
    </Card>
  );
}
