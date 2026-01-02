"use client";

import { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Badge, Spinner } from "react-bootstrap";
import { FiPercent, FiTag, FiX, FiClock, FiCheckCircle } from "react-icons/fi";
import styles from "../cart.module.scss";
import { API_ENDPOINTS } from "../../services/api";

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  terms: string[];
  isApplied?: boolean;
}

interface CouponSectionProps {
  appliedCoupons: Coupon[];
  onApplyCoupons: (coupons: Coupon[]) => void;
  formatCurrency: (amount: number) => string;
  cartSubtotal: number;
}

export default function CouponSection({
  appliedCoupons,
  onApplyCoupons,
  formatCurrency,
  cartSubtotal,
}: CouponSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCoupons, setSelectedCoupons] =
    useState<Coupon[]>(appliedCoupons);
  const [manualCode, setManualCode] = useState("");
  const [manualCodeError, setManualCodeError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch active coupons from backend
  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("🔵 Fetching coupons from:", API_ENDPOINTS.WEBSITE.COUPONS.GET_ACTIVE);
        const response = await fetch(API_ENDPOINTS.WEBSITE.COUPONS.GET_ACTIVE);
        const data = await response.json();
        
        if (data.success) {
          console.log("✅ Coupons fetched successfully:", data.data);
          setAvailableCoupons(data.data);
        } else {
          console.error("❌ Failed to fetch coupons:", data.message);
          setError(data.message || "Failed to load coupons");
        }
      } catch (err) {
        console.error("❌ Error fetching coupons:", err);
        setError("Failed to load coupons. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Calculate savings for a coupon
  const calculateSavings = (coupon: Coupon): number => {
    if (cartSubtotal < coupon.minAmount) return 0;

    if (coupon.type === "percentage") {
      const discount = (cartSubtotal * coupon.value) / 100;
      return coupon.maxDiscount
        ? Math.min(discount, coupon.maxDiscount)
        : discount;
    } else {
      return coupon.value;
    }
  };

  // Check if coupon is applicable
  const isCouponApplicable = (coupon: Coupon): boolean => {
    return cartSubtotal >= coupon.minAmount;
  };

  // Toggle coupon selection
  const toggleCoupon = (coupon: Coupon) => {
    if (!isCouponApplicable(coupon)) return;

    const isSelected = selectedCoupons.some((c) => c.id === coupon.id);
    if (isSelected) {
      setSelectedCoupons(selectedCoupons.filter((c) => c.id !== coupon.id));
    } else {
      setSelectedCoupons([...selectedCoupons, coupon]);
    }
  };

  // Apply manual coupon code
  const applyManualCode = async () => {
    setManualCodeError("");
    
    // First check in available coupons
    const foundCoupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === manualCode.toUpperCase()
    );

    if (foundCoupon) {
      if (!isCouponApplicable(foundCoupon)) {
        setManualCodeError(
          `Minimum purchase of ${formatCurrency(foundCoupon.minAmount)} required`
        );
        return;
      }

      if (selectedCoupons.some((c) => c.id === foundCoupon.id)) {
        setManualCodeError("Coupon already applied");
        return;
      }

      setSelectedCoupons([...selectedCoupons, foundCoupon]);
      setManualCode("");
      setManualCodeError("");
      return;
    }

    // If not found in available coupons, validate with backend
    try {
      console.log("🔵 Validating coupon code:", manualCode);
      const response = await fetch(API_ENDPOINTS.WEBSITE.COUPONS.VALIDATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: manualCode,
          orderAmount: cartSubtotal,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Coupon validated:", data.data);
        // Create coupon object from validation response
        const validatedCoupon: Coupon = {
          id: manualCode, // Use code as ID for manually entered coupons
          code: data.data.code,
          title: `${data.data.discountType === 'percentage' ? `${data.data.discountValue}% Off` : `₹${data.data.discountValue} Off`}`,
          description: `Get ${data.data.discountType === 'percentage' ? `${data.data.discountValue}%` : `₹${data.data.discountValue}`} discount`,
          type: data.data.discountType,
          value: data.data.discountValue,
          minAmount: 0,
          expiryDate: new Date().toISOString(),
          terms: [],
        };

        if (selectedCoupons.some((c) => c.code === validatedCoupon.code)) {
          setManualCodeError("Coupon already applied");
          return;
        }

        setSelectedCoupons([...selectedCoupons, validatedCoupon]);
        setManualCode("");
        setManualCodeError("");
      } else {
        console.error("❌ Coupon validation failed:", data.message);
        setManualCodeError(data.message || "Invalid coupon code");
      }
    } catch (err) {
      console.error("❌ Error validating coupon:", err);
      setManualCodeError("Failed to validate coupon. Please try again.");
    }
  };

  // Calculate total maximum savings
  const totalSavings = selectedCoupons.reduce(
    (sum, coupon) => sum + calculateSavings(coupon),
    0
  );

  // Handle apply coupons
  const handleApplyCoupons = () => {
    onApplyCoupons(selectedCoupons);
    setShowModal(false);
  };

  return (
    <>
      <Card className="border-0 shadow-sm rounded mb-3">
        <Card.Body>
          <div className="fw-semibold mb-3">
            Apply coupon
          </div>

          {appliedCoupons.length > 0 && (
            <div
              className="mb-3 p-3 rounded d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#d4edda", border: "1px solid #c3e6cb" }}
            >
              <div>
                <div className="fw-bold text-success mb-1">
                  {appliedCoupons.map((c) => c.code).join(", ")}
                </div>
                <small className="text-success">
                  Coupon applied on the Festive season
                </small>
              </div>
              <Button
                variant="link"
                className="text-danger p-0"
                onClick={() => {
                  setSelectedCoupons([]);
                  onApplyCoupons([]);
                }}
              >
                <FiX size={20} />
              </Button>
            </div>
          )}

          <Button
            variant={appliedCoupons.length > 0 ? "outline-success" : "outline-dark"}
            size="sm"
            onClick={() => {
              setSelectedCoupons(appliedCoupons);
              setShowModal(true);
            }}
            className="w-100"
          >
            {appliedCoupons.length > 0 ? "CHANGE COUPON" : "SELECT COUPON"}
          </Button>
        </Card.Body>
      </Card>

      {/* Coupon Selection Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        dialogClassName={styles.couponModal}
      >
        <Modal.Header className="border-0 pb-2">
          <div>
            <Modal.Title className="h5 mb-1">Apply Coupons</Modal.Title>
          </div>
          <Button
            variant=""
            onClick={() => setShowModal(false)}
            className="p-0 border-0"
          >
            <FiX size={20} />
          </Button>
        </Modal.Header>

        <Modal.Body className="pt-0">
          {/* Manual Coupon Entry */}
          <div className="mb-4">
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Enter coupon code"
                value={manualCode}
                onChange={(e) => {
                  setManualCode(e.target.value.toUpperCase());
                  setManualCodeError("");
                }}
                isInvalid={!!manualCodeError}
                className={styles.manualEntry}
              />
              <Button
                variant="outline-dark"
                onClick={applyManualCode}
                disabled={!manualCode.trim()}
                className={styles.manualEntry}
              >
                CHECK
              </Button>
            </div>
            {manualCodeError && (
              <small className="text-danger">{manualCodeError}</small>
            )}
          </div>

          {/* Available Coupons */}
          <div className="mb-3">
            <h6 className="mb-3 text-dark fw-semibold">Available Coupons</h6>
            
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading coupons...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-danger">{error}</p>
              </div>
            ) : availableCoupons.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No coupons available at the moment</p>
              </div>
            ) : (
              <div className={styles.couponScrollbar}>
                {availableCoupons.map((coupon) => {
                const isApplicable = isCouponApplicable(coupon);
                const isSelected = selectedCoupons.some(
                  (c) => c.id === coupon.id
                );
                const savings = calculateSavings(coupon);

                return (
                  <Card
                    key={coupon.id}
                    className={`mb-3 position-relative ${styles.couponCard} ${
                      isSelected
                        ? styles.selected
                        : isApplicable
                        ? styles.applicable
                        : styles.notApplicable
                    }`}
                    onClick={() => toggleCoupon(coupon)}
                    style={{ cursor: isApplicable ? "pointer" : "not-allowed" }}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div
                        className={`position-absolute top-0 end-0 bg-success text-white d-flex align-items-center justify-content-center ${styles.selectionIndicator}`}
                      >
                        <FiCheckCircle size={14} />
                      </div>
                    )}

                    <Card.Body
                      className={`p-3 ${
                        isSelected
                          ? styles.selectedPadding
                          : styles.normalPadding
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div
                          className={`flex-grow-1 ${styles.couponContentWidth}`}
                        >
                          {/* Coupon code with border */}
                          <div className="mb-3">
                            <span
                              className={`d-inline-flex align-items-center px-2 py-1 ${styles.couponCode}`}
                            >
                              <FiPercent className="me-1" size={12} />
                              {coupon.code}
                            </span>
                          </div>

                          <div
                            className={`fw-semibold mb-1 text-dark ${styles.couponTitle}`}
                          >
                            {coupon.title}
                          </div>
                          <div
                            className={`text-muted mb-2 ${styles.couponDescription}`}
                          >
                            {coupon.description}
                          </div>

                          <div
                            className={`d-flex align-items-center text-muted mb-2 ${styles.couponExpiry}`}
                          >
                            <FiClock className="me-1" size={10} />
                            Valid till{" "}
                            {new Date(coupon.expiryDate).toLocaleDateString()}
                          </div>

                          <div className={`text-muted ${styles.couponTerms}`}>
                            • {coupon.terms[0]}
                          </div>
                        </div>

                        <div
                          className={`text-end ms-3 ${styles.couponSavingsWidth}`}
                        >
                          {isApplicable ? (
                            <div>
                              <div
                                className="text-success fw-bold"
                                style={{ fontSize: "13px" }}
                              >
                                Save
                              </div>
                              <div
                                className="text-success fw-bold"
                                style={{ fontSize: "14px" }}
                              >
                                {formatCurrency(savings)}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                              >
                                Min.
                              </div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "12px", fontWeight: "500" }}
                              >
                                {formatCurrency(coupon.minAmount)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <div className="w-100">
            {selectedCoupons.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-semibold">Maximum Savings:</span>
                <span className="fw-bold text-success fs-5">
                  {formatCurrency(totalSavings)}
                </span>
              </div>
            )}
            <Button
              variant="dark"
              className="w-100 py-2"
              onClick={handleApplyCoupons}
              disabled={selectedCoupons.length === 0}
            >
              APPLY{" "}
              {selectedCoupons.length > 0 ? `(${selectedCoupons.length})` : ""}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
