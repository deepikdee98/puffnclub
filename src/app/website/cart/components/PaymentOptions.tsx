"use client";

import { Card, Form, Row, Col, Button, Badge } from "react-bootstrap";
import { FiCreditCard } from "react-icons/fi";

interface PaymentOptionsProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export default function PaymentOptions({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentOptionsProps) {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-light border-0">
        <h5 className="mb-0">
          <FiCreditCard className="me-2" />
          Payment Options
        </h5>
      </Card.Header>
      <Card.Body>
        <div className="payment-options">
          {/* UPI */}
          <div className="border rounded p-3 mb-3">
            <Form.Check
              type="radio"
              name="payment"
              id="upi"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              label={
                <div className="d-flex align-items-center">
                  <strong>UPI</strong>
                  <Badge bg="success" className="ms-2 small">
                    Recommended
                  </Badge>
                </div>
              }
            />
            {paymentMethod === "upi" && (
              <div className="mt-3 ms-4">
                <Form.Control
                  type="text"
                  placeholder="Enter UPI ID (e.g., user@paytm)"
                />
              </div>
            )}
          </div>

          {/* Credit/Debit Card */}
          <div className="border rounded p-3 mb-3">
            <Form.Check
              type="radio"
              name="payment"
              id="card"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              label={<strong>Credit/Debit Card</strong>}
            />
            {paymentMethod === "card" && (
              <div className="mt-3 ms-4">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" placeholder="Card Number" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" placeholder="Cardholder Name" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" placeholder="MM/YY" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" placeholder="CVV" />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}
          </div>

          {/* Wallet */}
          <div className="border rounded p-3 mb-3">
            <Form.Check
              type="radio"
              name="payment"
              id="wallet"
              value="wallet"
              checked={paymentMethod === "wallet"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              label={<strong>Digital Wallet</strong>}
            />
            {paymentMethod === "wallet" && (
              <div className="mt-3 ms-4">
                <div className="d-flex gap-2">
                  <Button variant="outline-dark" size="sm">
                    PayPal
                  </Button>
                  <Button variant="outline-dark" size="sm">
                    Apple Pay
                  </Button>
                  <Button variant="outline-dark" size="sm">
                    Google Pay
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Cash on Delivery */}
          <div className="border rounded p-3 mb-3">
            <Form.Check
              type="radio"
              name="payment"
              id="cod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              label={
                <div>
                  <strong>Cash on Delivery</strong>
                  <div className="text-muted small mt-1">
                    Pay when you receive your order
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
