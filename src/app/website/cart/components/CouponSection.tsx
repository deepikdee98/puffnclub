"use client";

import { useState } from "react";
import { Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { FiTag, FiCheck } from "react-icons/fi";

interface CouponSectionProps {
  appliedCoupon: any;
  onApplyCoupon: (code: string) => void;
  formatCurrency: (amount: number) => string;
  couponDiscount: number;
}

export default function CouponSection({
  appliedCoupon,
  onApplyCoupon,
  formatCurrency,
  couponDiscount,
}: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    onApplyCoupon(couponCode);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h6 className="mb-3">
          <FiTag className="me-2" />
          Apply Coupon
        </h6>
        <Row>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Enter coupon code (try: SAVE10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Button
              variant="outline-dark"
              onClick={handleApplyCoupon}
              className="w-100"
            >
              Apply
            </Button>
          </Col>
        </Row>
        {appliedCoupon && (
          <Alert variant="success" className="mt-3 mb-0">
            <FiCheck className="me-2" />
            Coupon "{appliedCoupon.code}" applied! You saved{" "}
            {formatCurrency(couponDiscount)}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}
