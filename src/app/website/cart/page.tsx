"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FiShoppingBag, FiArrowLeft, FiArrowRight, FiCheck, FiShield } from "react-icons/fi";
import { LoadingSpinner } from "@/app/components";
import { useCart } from '../contexts/CartContext';
import StepIndicator from "./components/StepIndicator";
import CartItem from "./components/CartItem";
import OrderSummary from "./components/OrderSummary";
import CouponSection from "./components/CouponSection";
import AddressSelection from "./components/AddressSelection";
import PaymentOptions from "./components/PaymentOptions";
import { useAuth } from "../contexts/AuthContext";

// Addresses will be derived from authenticated customer profile

type UIAddress = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export default function CartPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Bag, 2: Address, 3: Payment
  const { cart, isLoading, updateCartItem, removeFromCart, refreshCart } = useCart();
  const { customer } = useAuth();

  const uiAddresses: UIAddress[] = (customer?.addresses || []).map((a: any) => ({
    id: a._id || '',
    name: (customer as any)?.fullName || `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
    phone: customer?.phone || "",
    address: a.street || "",
    city: a.city || "",
    state: a.state || "",
    pincode: a.zipCode || "",
    isDefault: !!a.isDefault,
  }));

  const initialSelected = uiAddresses.find(a => a.isDefault) || uiAddresses[0] || (null as any);
  const [selectedAddress, setSelectedAddress] = useState<UIAddress | null>(initialSelected);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update selected address when customer addresses change
  useEffect(() => {
    const updated = (customer?.addresses || []).map((a: any) => ({
      id: a._id || '',
      name: (customer as any)?.fullName || `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
      phone: customer?.phone || "",
      address: a.street || "",
      city: a.city || "",
      state: a.state || "",
      pincode: a.zipCode || "",
      isDefault: !!a.isDefault,
    }));
    const preferred = updated.find(a => a.isDefault) || updated[0] || null;
    setSelectedAddress(preferred as any);
  }, [customer]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const applyCoupon = (code: string) => {
    if (code.toUpperCase() === "SAVE10") {
      setAppliedCoupon({
        code: "SAVE10",
        discount: 10,
        type: "percentage",
      });
    } else {
      alert("Invalid coupon code");
    }
  };

  const cartItems = cart?.items || [];
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const savings = cartItems.reduce((sum: number, item: any) => {
      const itemSavings = item.product.compareAtPrice
        ? (item.product.compareAtPrice - item.price) * item.quantity
        : 0;
      return sum + itemSavings;
    }, 0);

    const couponDiscount = appliedCoupon
      ? appliedCoupon.type === "percentage"
        ? subtotal * (appliedCoupon.discount / 100)
        : appliedCoupon.discount
      : 0;

    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = (subtotal - couponDiscount) * 0.08;
    const total = subtotal - couponDiscount + shipping + tax;

    return { subtotal, savings, couponDiscount, shipping, tax, total };
  };

  const totals = calculateTotals();

  // Step 1: Shopping Bag
  const renderBagStep = () => (
    <Row>
      <Col lg={8}>
        <div>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">
                <FiShoppingBag className="me-2" />
                Shopping Bag ({cartItems.length} items)
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {isLoading ? (
                <div className="text-center py-5">
                  <LoadingSpinner />
                  <p className="mt-3 text-muted">Loading your cart...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <div>
                    <FiShoppingBag size={60} className="text-muted mb-3" />
                    <h5 className="text-muted">Your bag is empty</h5>
                    <p className="text-muted mb-4">Add some items to get started</p>
                    <Button variant="dark" as="a" href="/website/products">
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              ) : (
                cartItems.map((item: any) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    formatCurrency={formatCurrency}
                  />
                ))
              )}
            </Card.Body>
          </Card>
          {/* Coupon Section */}
          {cartItems.length > 0 && (
            <CouponSection
              appliedCoupon={appliedCoupon}
              onApplyCoupon={applyCoupon}
              formatCurrency={formatCurrency}
              couponDiscount={totals.couponDiscount}
            />
          )}
        </div>
      </Col>
      <Col lg={4}>
        <div>
          {cartItems.length > 0 && (
            <OrderSummary
              totals={totals}
              itemCount={cartItems.length}
              appliedCoupon={appliedCoupon}
              onContinue={() => setCurrentStep(2)}
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      </Col>
    </Row>
  );

  // Step 2: Address Selection
  const renderAddressStep = () => (
    <Row>
      <Col lg={8}>
        <div>
          <AddressSelection
            addresses={uiAddresses as any}
            selectedAddress={selectedAddress as any}
            onSelectAddress={setSelectedAddress as any}
          />
          <div className="d-flex gap-2 mt-4">
            <Button
              variant="outline-dark"
              onClick={() => setCurrentStep(1)}
              className="flex-fill"
            >
              <FiArrowLeft className="me-2" />
              Back
            </Button>
            <Button
              variant="dark"
              className="flex-fill"
              onClick={() => setCurrentStep(3)}
              disabled={!selectedAddress}
            >
              Continue
              <FiArrowRight className="ms-2" />
            </Button>
          </div>
        </div>
      </Col>
      <Col lg={4}>
        <div>
          <OrderSummary
            totals={totals}
            itemCount={cartItems.length}
            appliedCoupon={appliedCoupon}
            onContinue={() => setCurrentStep(3)}
            formatCurrency={formatCurrency}
          />
        </div>
      </Col>
    </Row>
  );

  // Step 3: Payment
  const renderPaymentStep = () => (
    <Row>
      <Col lg={8}>
        <div>
          <PaymentOptions
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
        </div>
      </Col>
      <Col lg={4}>
        <div>
          <Card
            className="border-0 shadow-sm sticky-top"
            style={{ top: "100px" }}
          >
            <Card.Header className="bg-light border-0">
              <h6 className="mb-0">Order Summary</h6>
            </Card.Header>
            <Card.Body>
              {/* Order Items */}
              <div className="mb-3">
                {cartItems.map((item: any) => (
                  <div key={item._id} className="d-flex align-items-center mb-2">
                    <img
                      src={item.product.images?.[0] || "https://via.placeholder.com/200x200"}
                      alt={item.product.name}
                      className="rounded me-2"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <div className="small fw-bold">{item.product.name}</div>
                      <div className="small text-muted">Qty: {item.quantity}</div>
                    </div>
                    <div className="small fw-bold">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              {/* Delivery Address */}
              <div className="mb-3">
                <small className="text-muted">Delivering to:</small>
                <div className="small fw-bold">{selectedAddress?.name || '—'}</div>
                <div className="small text-muted">
                  {selectedAddress?.city || '—'}, {selectedAddress?.state || '—'} - {selectedAddress?.pincode || '—'}
                </div>
              </div>
              <hr />
              {/* Price Breakdown */}
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Coupon Discount:</span>
                  <span>-{formatCurrency(totals.couponDiscount)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>
                  {totals.shipping === 0 ? "FREE" : formatCurrency(totals.shipping)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold h5">
                <span>Total:</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
              <div className="d-flex gap-2 mt-3">
                <Button
                  variant="outline-dark"
                  onClick={() => setCurrentStep(2)}
                  className="flex-fill"
                >
                  <FiArrowLeft className="me-2" />
                  Back
                </Button>
                <Button
                  variant="dark"
                  className="flex-fill"
                  disabled={!paymentMethod}
                  onClick={() => alert("Order placed successfully!")}
                >
                  Place Order
                  <FiCheck className="ms-2" />
                </Button>
              </div>
              <div className="text-center mt-3">
                <small className="text-muted">
                  <FiShield className="me-1" />
                  100% Safe & Secure Payments
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Col>
    </Row>
  );

  return (
    <Container className="py-4">
      <StepIndicator currentStep={currentStep} />
      {currentStep === 1 && renderBagStep()}
      {currentStep === 2 && renderAddressStep()}
      {currentStep === 3 && renderPaymentStep()}
    </Container>
  );
}
