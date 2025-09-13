"use client";

import { Card, Button } from "react-bootstrap";
import { FiArrowRight, FiShield } from "react-icons/fi";

interface OrderSummaryProps {
  totals: {
    subtotal: number;
    savings: number;
    couponDiscount: number;
    shipping: number;
    tax: number;
    total: number;
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
    <Card className="border-0 shadow-sm sticky-top" style={{ top: "100px" }}>
      <Card.Header className="bg-light border-0">
        <h6 className="mb-0">Order Summary</h6>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <span>Subtotal ({itemCount} items):</span>
          <span>Rs. {totals.subtotal}</span>
        </div>
        {totals.savings > 0 && (
          <div className="d-flex justify-content-between mb-2 text-success">
            <span>You Save:</span>
            <span>-{totals.savings}</span>
          </div>
        )}
        {appliedCoupon && (
          <div className="d-flex justify-content-between mb-2 text-success">
            <span>Coupon Discount:</span>
            <span>-{totals.couponDiscount}</span>
          </div>
        )}
        <div className="d-flex justify-content-between mb-2">
          <span>Shipping:</span>
          <span>{totals.shipping === 0 ? "FREE" : totals.shipping}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Tax:</span>
          <span>Rs. {totals.tax}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between fw-bold h5">
          <span>Total:</span>
          <span>Rs. {totals.total}</span>
        </div>
        <Button
          variant="dark"
          size="lg"
          className="w-100 mt-3"
          onClick={onContinue}
        >
          Place Order
          <FiArrowRight className="ms-2" />
        </Button>
        <div className="text-center mt-3">
          <small className="text-muted">
            <FiShield className="me-1" />
            Safe and Secure Payments
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}
