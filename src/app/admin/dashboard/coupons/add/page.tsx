"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FiSave, FiArrowLeft, FiPercent, FiDollarSign } from "react-icons/fi";
import { toast } from "react-toastify";
import { couponsAPI } from "@/lib/api";
import styles from "./page.module.scss";

export default function AddCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minimumPurchase: "",
    maximumDiscount: "",
    usageLimit: "",
    perUserLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
    applicableToAll: true,
    firstTimeUserOnly: false,
    freeShipping: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Code validation
    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters";
    } else if (formData.code.length > 20) {
      newErrors.code = "Coupon code must not exceed 20 characters";
    }

    // Discount value validation
    if (!formData.discountValue) {
      newErrors.discountValue = "Discount value is required";
    } else {
      const value = parseFloat(formData.discountValue);
      if (isNaN(value) || value <= 0) {
        newErrors.discountValue = "Discount value must be greater than 0";
      } else if (formData.discountType === "percentage" && value > 100) {
        newErrors.discountValue = "Percentage discount cannot exceed 100%";
      }
    }

    // Date validation
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    // Minimum purchase validation
    if (formData.minimumPurchase) {
      const value = parseFloat(formData.minimumPurchase);
      if (isNaN(value) || value < 0) {
        newErrors.minimumPurchase = "Minimum purchase must be 0 or greater";
      }
    }

    // Maximum discount validation
    if (formData.maximumDiscount) {
      const value = parseFloat(formData.maximumDiscount);
      if (isNaN(value) || value <= 0) {
        newErrors.maximumDiscount = "Maximum discount must be greater than 0";
      }
    }

    // Usage limit validation
    if (formData.usageLimit) {
      const value = parseInt(formData.usageLimit);
      if (isNaN(value) || value < 1) {
        newErrors.usageLimit = "Usage limit must be at least 1";
      }
    }

    // Per user limit validation
    if (formData.perUserLimit) {
      const value = parseInt(formData.perUserLimit);
      if (isNaN(value) || value < 1) {
        newErrors.perUserLimit = "Per user limit must be at least 1";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minimumPurchase: formData.minimumPurchase
          ? parseFloat(formData.minimumPurchase)
          : 0,
        maximumDiscount: formData.maximumDiscount
          ? parseFloat(formData.maximumDiscount)
          : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        perUserLimit: formData.perUserLimit
          ? parseInt(formData.perUserLimit)
          : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        applicableToAll: formData.applicableToAll,
        firstTimeUserOnly: formData.firstTimeUserOnly,
        freeShipping: formData.freeShipping,
      };

      await couponsAPI.createCoupon(payload);
      toast.success("Coupon created successfully");
      router.push("/admin/dashboard/coupons");
    } catch (error: any) {
      console.error("Error creating coupon:", error);
      toast.error(error.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className={styles.addCouponPage}>
      <Row className="mb-4">
        <Col>
          <div className={styles.pageHeader}>
            <div>
              <Button
                variant="link"
                className={styles.backButton}
                onClick={() => router.back()}
              >
                <FiArrowLeft className="me-2" />
                Back to Coupons
              </Button>
              <h1 className={styles.pageTitle}>Create New Coupon</h1>
              <p className={styles.pageSubtitle}>
                Set up a new discount coupon for your customers
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            {/* Basic Information */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Basic Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Coupon Code <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="e.g., SAVE20"
                        isInvalid={!!errors.code}
                        style={{ textTransform: "uppercase" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.code}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        3-20 characters, will be converted to uppercase
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Discount Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleChange}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Brief description of the coupon (optional)"
                        maxLength={200}
                      />
                      <Form.Text className="text-muted">
                        {formData.description.length}/200 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Discount Settings */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Discount Settings</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Discount Value <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          {formData.discountType === "percentage" ? (
                            <FiPercent />
                          ) : (
                            "₹"
                          )}
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="discountValue"
                          value={formData.discountValue}
                          onChange={handleChange}
                          placeholder={
                            formData.discountType === "percentage"
                              ? "e.g., 20"
                              : "e.g., 500"
                          }
                          min="0"
                          step={
                            formData.discountType === "percentage"
                              ? "0.01"
                              : "1"
                          }
                          isInvalid={!!errors.discountValue}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.discountValue}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Minimum Purchase Amount</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>₹</InputGroup.Text>
                        <Form.Control
                          type="number"
                          name="minimumPurchase"
                          value={formData.minimumPurchase}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          step="1"
                          isInvalid={!!errors.minimumPurchase}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.minimumPurchase}
                        </Form.Control.Feedback>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Minimum order value required to use this coupon
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {formData.discountType === "percentage" && (
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Maximum Discount Amount</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>₹</InputGroup.Text>
                          <Form.Control
                            type="number"
                            name="maximumDiscount"
                            value={formData.maximumDiscount}
                            onChange={handleChange}
                            placeholder="No limit"
                            min="0"
                            step="1"
                            isInvalid={!!errors.maximumDiscount}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.maximumDiscount}
                          </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text className="text-muted">
                          Cap the maximum discount amount (optional)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>

            {/* Usage Limits */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Usage Limits</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Total Usage Limit</Form.Label>
                      <Form.Control
                        type="number"
                        name="usageLimit"
                        value={formData.usageLimit}
                        onChange={handleChange}
                        placeholder="Unlimited"
                        min="1"
                        step="1"
                        isInvalid={!!errors.usageLimit}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.usageLimit}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Maximum number of times this coupon can be used
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Per User Limit</Form.Label>
                      <Form.Control
                        type="number"
                        name="perUserLimit"
                        value={formData.perUserLimit}
                        onChange={handleChange}
                        placeholder="Unlimited"
                        min="1"
                        step="1"
                        isInvalid={!!errors.perUserLimit}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.perUserLimit}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Maximum uses per customer
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Validity Period */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Validity Period</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Start Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        isInvalid={!!errors.startDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        End Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        isInvalid={!!errors.endDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Status & Options */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Status & Options</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="isActive"
                    name="isActive"
                    label="Active"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Enable or disable this coupon
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="applicableToAll"
                    name="applicableToAll"
                    label="Applicable to All Products"
                    checked={formData.applicableToAll}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Apply to all products in the store
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="firstTimeUserOnly"
                    name="firstTimeUserOnly"
                    label="First Time Users Only"
                    checked={formData.firstTimeUserOnly}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Restrict to first-time customers
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="freeShipping"
                    name="freeShipping"
                    label="Free Shipping"
                    checked={formData.freeShipping}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Provide free shipping with this coupon
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Preview */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Coupon Preview</h5>
              </Card.Header>
              <Card.Body>
                <div className={styles.couponPreview}>
                  <div className={styles.couponCode}>
                    {formData.code || "COUPON CODE"}
                  </div>
                  <div className={styles.couponDiscount}>
                    {formData.discountValue
                      ? formData.discountType === "percentage"
                        ? `${formData.discountValue}% OFF`
                        : `₹${formData.discountValue} OFF`
                      : "DISCOUNT"}
                  </div>
                  {formData.minimumPurchase && (
                    <div className={styles.couponCondition}>
                      Min. Purchase: ₹{formData.minimumPurchase}
                    </div>
                  )}
                  {formData.description && (
                    <div className={styles.couponDescription}>
                      {formData.description}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Actions */}
            <Card>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiSave className="me-2" />
                        Create Coupon
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}