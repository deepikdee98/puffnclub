"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { orderService } from "../services/orderService";
import UpiPayment from "./components/UpiPayment";
import CardPayment from "./components/CardPayment";
import DeliveryAddressCard from "./components/DeliveryAddressCard";
import OrderSummaryCard from "./components/OrderSummaryCard";
import { UpiFormData, CardFormData } from "./schemas/validationSchemas";
import styles from "./checkout.module.scss";

type PaymentMethod = "upi" | "card" | "cod" | null;

export default function CheckoutPage() {
  const router = useRouter();
  const { customer } = useAuth();
  const { cart } = useCart();

  const [expandedPayment, setExpandedPayment] = useState<PaymentMethod>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(null);
  const [selectedShippingOption, setSelectedShippingOption] = useState<any>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);

  // TEMPORARY: Static data for testing (remove when login is fixed)
  const staticAddress = {
    name: "Vistesh",
    phone: "9123456789",
    address:
      "1/74a, munusubu vari street, near water tank, teeparu road, Tadiparru, undrajvaram mandal, Tanuku, E.G.D",
  };

  // Get customer's default address (fallback to static for now)
  const defaultAddress =
    customer?.addresses?.find((addr: any) => addr.isDefault) ||
    customer?.addresses?.[0];

  // TEMPORARY: Static cart data for testing (remove when login is fixed)
  const staticCartItems = [
    {
      id: "1",
      name: "Rounded Neck T-Shirt",
      image: "/default-image.png",
      category: "Regular tee",
    },
  ];

  // Calculate totals from cart (use static data for now)
  const cartItems = cart?.items || [];
  const hasRealCart = cartItems.length > 0;

  // Use static values for testing
  const totalMRP = hasRealCart
    ? cartItems.reduce((sum: number, item: any) => {
        const originalPrice = item.product.compareAtPrice || item.price;
        return sum + originalPrice * item.quantity;
      }, 0)
    : 699;

  const subtotal = hasRealCart
    ? cartItems.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      )
    : 200;

  const discount = hasRealCart ? totalMRP - subtotal : 499;
  // Get shipping charges from selected option or default
  const deliveryCharges = selectedShippingOption?.rate || (hasRealCart && subtotal > 500 ? 0 : 60);
  const totalPrice = hasRealCart ? subtotal + deliveryCharges : 559;

  // Load selected shipping option from sessionStorage
  useEffect(() => {
    const storedShippingOption = sessionStorage.getItem('selectedShippingOption');
    if (storedShippingOption) {
      try {
        setSelectedShippingOption(JSON.parse(storedShippingOption));
      } catch (error) {
        console.error('Error parsing shipping option:', error);
      }
    }
  }, []);

  // Format items for OrderSummaryCard
  const orderItems = hasRealCart
    ? cartItems.map((item: any) => ({
        id: item._id,
        name: item.product.name,
        image: item.product.images?.[0] || "/default-image.png",
        category: item.product.category || "Regular tee",
      }))
    : staticCartItems;

  const handleAccordionToggle = (method: PaymentMethod) => {
    if (expandedPayment === method) {
      setExpandedPayment(null);
    } else {
      setExpandedPayment(method);
      setSelectedPaymentMethod(method);
    }
  };

  const handleCODSelect = () => {
    setSelectedPaymentMethod("cod");
    setExpandedPayment(null);
  };

  const handleUpiSubmit = (data: UpiFormData) => {
    console.log("UPI Payment Data:", data);
    // TODO: Process UPI payment when API is ready
    alert(`UPI Payment submitted with ID: ${data.upiId}`);
  };

  const handleCardSubmit = (data: CardFormData) => {
    console.log("Card Payment Data:", data);
    // TODO: Process card payment when API is ready
    alert("Card Payment submitted successfully!");
  };

  const handleConfirmOrder = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    if (!defaultAddress && !customer?.addresses?.[0]) {
      toast.error("Please add a delivery address", {
        position: "bottom-right",
        autoClose: 3000,
      });
      router.push("/checkout/address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty", {
        position: "bottom-right",
        autoClose: 3000,
      });
      router.push("/cart");
      return;
    }

    setCreatingOrder(true);

    try {
      const address = defaultAddress || customer?.addresses?.[0];
      
      if (!address) {
        toast.error("Please add a delivery address", {
          position: "bottom-right",
          autoClose: 3000,
        });
        router.push("/checkout/address");
        return;
      }
      
      const orderData = {
        items: cartItems.map((item: any) => ({
          product: item.product._id || item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        })),
        shippingAddress: {
          type: 'home' as const,
          firstName: customer?.firstName || '',
          lastName: customer?.lastName || '',
          address1: address.street || '',
          city: address.city || '',
          state: address.state || '',
          postalCode: address.zipCode || '',
          country: address.country || 'India',
          phone: customer?.phone || '',
          isDefault: false,
        },
        billingAddress: {
          type: 'home' as const,
          firstName: customer?.firstName || '',
          lastName: customer?.lastName || '',
          address1: address.street || '',
          city: address.city || '',
          state: address.state || '',
          postalCode: address.zipCode || '',
          country: address.country || 'India',
          phone: customer?.phone || '',
          isDefault: false,
        },
        paymentMethod: selectedPaymentMethod,
      };

      const response = await orderService.createOrder(orderData);
      
      // Clear session storage
      sessionStorage.removeItem('selectedShippingOption');
      sessionStorage.removeItem('deliveryPincode');

      toast.success("Order placed successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      router.push(`/orders/${response.order._id}/track`);
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to place order. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleChangeAddress = () => {
    router.push("/checkout/address");
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container className="py-5">
        <Row>
          {/* Left Column - Payment Options */}
          <Col lg={7} className="mb-4">
            <h5 className="mb-4">Choose your payment option</h5>

            {/* UPI Payment Accordion */}
            <div className="bg-white rounded-3 shadow-sm mb-3">
              <button
                onClick={() => handleAccordionToggle("upi")}
                className="w-100 d-flex justify-content-between align-items-center p-3 bg-transparent border-0"
                style={{ cursor: "pointer" }}
              >
                <span className="fw-semibold">Pay with UPI ID</span>
                {expandedPayment === "upi" ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </button>
              <UpiPayment
                isExpanded={expandedPayment === "upi"}
                onSubmit={handleUpiSubmit}
              />
            </div>

            {/* Card Payment Accordion */}
            <div className="bg-white rounded-3 shadow-sm mb-3">
              <button
                onClick={() => handleAccordionToggle("card")}
                className="w-100 d-flex justify-content-between align-items-center p-3 bg-transparent border-0"
                style={{ cursor: "pointer" }}
              >
                <span className="fw-semibold">Pay with Credit/Debit card</span>
                {expandedPayment === "card" ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </button>
              <CardPayment
                isExpanded={expandedPayment === "card"}
                onSubmit={handleCardSubmit}
              />
            </div>

            {/* COD Radio Button */}
            <div className="bg-white rounded-3 shadow-sm p-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="codPayment"
                  checked={selectedPaymentMethod === "cod"}
                  onChange={handleCODSelect}
                />
                <label
                  className="form-check-label fw-semibold"
                  htmlFor="codPayment"
                  style={{ cursor: "pointer" }}
                >
                  Pay on Cash Delivery
                </label>
              </div>
            </div>
          </Col>

          {/* Right Column - Address and Summary */}
          <Col lg={5}>
            {/* Delivery Address - Using static data for now */}
            <DeliveryAddressCard
              name={
                defaultAddress
                  ? customer?.fullName ||
                    `${customer?.firstName || ""} ${
                      customer?.lastName || ""
                    }`.trim()
                  : staticAddress.name
              }
              phone={
                defaultAddress ? customer?.phone || "" : staticAddress.phone
              }
              address={
                defaultAddress
                  ? `${
                      (defaultAddress as any).street ||
                      (defaultAddress as any).address ||
                      (defaultAddress as any).addressLine1 ||
                      ""
                    }${
                      (defaultAddress as any).city ||
                      (defaultAddress as any).state ||
                      (defaultAddress as any).zipCode ||
                      (defaultAddress as any).postalCode
                        ? ", "
                        : ""
                    }${(defaultAddress as any).city || ""}${
                      (defaultAddress as any).state
                        ? ", " + (defaultAddress as any).state
                        : ""
                    }${
                      (defaultAddress as any).zipCode
                        ? ", " + (defaultAddress as any).zipCode
                        : (defaultAddress as any).postalCode
                        ? ", " + (defaultAddress as any).postalCode
                        : ""
                    }`
                  : staticAddress.address
              }
              onChangeAddress={handleChangeAddress}
            />

            {/* Order Summary */}
            <OrderSummaryCard
              items={orderItems}
              totalMRP={totalMRP}
              discount={discount}
              deliveryCharges={deliveryCharges}
              totalPrice={totalPrice}
              onConfirmOrder={handleConfirmOrder}
              isDisabled={!selectedPaymentMethod || creatingOrder}
            />
            {selectedShippingOption && (
              <div className="mt-2 small text-muted">
                Shipping via: {selectedShippingOption.courierName} ({selectedShippingOption.estimatedDeliveryDays} days)
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
