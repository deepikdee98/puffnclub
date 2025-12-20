"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import PageHeader from "../components/shared/PageHeader";
import OrderCard from "../components/OrderCard";
import EmptyOrdersState from "../components/EmptyOrdersState";
import TrackingTimeline from "../components/TrackingTimeline";
import ProductCard from "../components/shared/ProductCard";
import ActionButton from "../components/shared/ActionButton";
import ReviewModal from "../components/modals/ReviewModal";
import ExchangeModal from "../components/modals/ExchangeModal";
import ReturnProductModal from "../components/modals/ReturnProductModal";
import CancelOrderModal from "../components/modals/CancelOrderModal";
import { generateTrackingStages } from "../utils/orderHelpers";
import type { Order, OrderItem } from "../types/orders.types";

// Mock data for testing
const mockProduct: OrderItem = {
  _id: "1",
  product: {
    _id: "prod1",
    name: "Rounded Neck T-Shirt",
    category: "Regular tee",
    images: ["/default-image.png"],
  },
  variant: {
    size: "M",
    color: "Red",
  },
  quantity: 1,
  price: 499,
  total: 499,
  availableSizes: ["S", "M", "L", "XL"],
  availableColors: [
    { name: "Black", hexCode: "#000000" },
    { name: "Tan", hexCode: "#D2B48C" },
  ],
};

const mockOrder: Order = {
  _id: "order123",
  orderNumber: "FTS234578",
  customer: {
    _id: "cust1",
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
  },
  items: [mockProduct],
  shippingAddress: {
    fullName: "Test User",
    phone: "1234567890",
    addressLine1: "123 Test Street",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
  },
  billingAddress: {
    fullName: "Test User",
    phone: "1234567890",
    addressLine1: "123 Test Street",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
  },
  paymentMethod: "COD",
  paymentStatus: "pending",
  orderStatus: "shipped",
  subtotal: 499,
  shippingCost: 0,
  tax: 0,
  total: 499,
  trackingNumber: "TRACK123456",
  estimatedDelivery: "2025-12-15",
  createdAt: "2025-12-01",
  updatedAt: "2025-12-09",
};

const deliveredOrder: Order = {
  ...mockOrder,
  _id: "order456",
  orderStatus: "delivered",
  deliveredAt: "2025-12-08",
};

export default function TestUIPage() {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "track">("list");

  const trackingStages = generateTrackingStages(mockOrder);
  const deliveredTrackingStages = generateTrackingStages(deliveredOrder);

  return (
    <>
      <Container className="py-4">
        {/* View Toggle */}
        <div className="mb-4 d-flex gap-2">
          <Button
            variant={currentView === "list" ? "dark" : "outline-dark"}
            onClick={() => setCurrentView("list")}
          >
            Orders List View
          </Button>
          <Button
            variant={currentView === "track" ? "dark" : "outline-dark"}
            onClick={() => setCurrentView("track")}
          >
            Track Order View
          </Button>
        </div>

        {currentView === "list" ? (
          <>
            <h4 className="mb-3">Orders List Components</h4>

            {/* Order Cards */}
            <div className="mb-5">
              <h6 className="mb-3">Order Cards (Different States)</h6>
              <OrderCard
                order={mockOrder}
                onAction={(id, action) =>
                  alert(`Action: ${action} on order ${id}`)
                }
              />
              <OrderCard
                order={deliveredOrder}
                onAction={(id, action) =>
                  alert(`Action: ${action} on order ${id}`)
                }
              />
            </div>

            {/* Empty State */}
            <div className="mb-5">
              <h6 className="mb-3">Empty State</h6>
              <div className="border rounded p-4">
                <EmptyOrdersState />
              </div>
            </div>
          </>
        ) : (
          <>
            <h4 className="mb-3">Track Order Components</h4>

            <Row className="g-4 mb-5">
              <Col lg={6}>
                <h6 className="mb-3">Tracking Timeline (In Progress)</h6>
                <div className="bg-white p-4 rounded shadow-sm">
                  <TrackingTimeline stages={trackingStages} />
                </div>
              </Col>
              <Col lg={6}>
                <h6 className="mb-3">Product Card</h6>
                <ProductCard product={mockProduct} size="large" />
              </Col>
            </Row>

            <Row className="g-4">
              <Col lg={6}>
                <h6 className="mb-3">Tracking Timeline (Delivered)</h6>
                <div className="bg-white p-4 rounded shadow-sm">
                  <TrackingTimeline stages={deliveredTrackingStages} />
                </div>
              </Col>
            </Row>
          </>
        )}

        {/* Modal Triggers */}
        <div className="mt-5 pt-5 border-top">
          <h4 className="mb-3">Test All Modals</h4>
          <div className="d-flex gap-3 flex-wrap">
            <Button variant="dark" onClick={() => setShowReviewModal(true)}>
              Open Review Modal
            </Button>
            <Button variant="dark" onClick={() => setShowExchangeModal(true)}>
              Open Exchange Modal
            </Button>
            <Button variant="dark" onClick={() => setShowReturnModal(true)}>
              Open Return Modal
            </Button>
            <Button variant="dark" onClick={() => setShowCancelModal(true)}>
              Open Cancel Modal
            </Button>
          </div>
        </div>
      </Container>

      {/* All Modals */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        orderId={mockOrder._id}
        productId={mockProduct.product._id}
        productName={mockProduct.product.name}
        onSuccess={() => console.log("Review submitted")}
      />

      <ExchangeModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        orderId={mockOrder._id}
        productId={mockProduct.product._id}
        availableSizes={mockProduct.availableSizes || []}
        availableColors={mockProduct.availableColors || []}
        onExchangeSelect={() => console.log("Exchange selected")}
        onReturnSelect={() => {
          setShowExchangeModal(false);
          setShowReturnModal(true);
        }}
        onSuccess={() => console.log("Exchange submitted")}
      />

      <ReturnProductModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        orderId={mockOrder._id}
        productId={mockProduct.product._id}
        product={mockProduct}
        onSuccess={() => console.log("Return submitted")}
      />

      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        orderId={mockOrder._id}
        orderStatus={mockOrder.orderStatus}
        onSuccess={() => console.log("Order cancelled")}
      />
    </>
  );
}
