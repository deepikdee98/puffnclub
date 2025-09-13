"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { contactService } from "../services/contactService";
import {
  FiPhone,
  FiMail,
  FiClock,
  FiMapPin,
  FiSend,
  FiMessageCircle,
  FiHeadphones,
  FiUser,
  FiSmartphone,
} from "react-icons/fi";

// Validation schema
const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim(),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim()
    .lowercase(),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
    .length(10, "Mobile number must be exactly 10 digits"),
  subject: yup.string().required("Please select a subject"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters")
    .trim(),
});

interface ContactFormData {
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
}

const subjectOptions = [
  { value: "", label: "Select a subject" },
  { value: "order-inquiry", label: "Order Inquiry" },
  { value: "product-question", label: "Product Question" },
  { value: "shipping-delivery", label: "Shipping & Delivery" },
  { value: "returns-refunds", label: "Returns & Refunds" },
  { value: "payment-billing", label: "Payment & Billing" },
  { value: "technical-support", label: "Technical Support" },
  { value: "feedback-suggestion", label: "Feedback & Suggestions" },
  { value: "partnership-business", label: "Partnership & Business" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setError,
    clearErrors,
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    clearErrors();
    setShowSuccess(false);

    try {
      // Split name into first and last name
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await contactService.submitContactForm({
        firstName,
        lastName,
        email: data.email,
        phone: data.mobile,
        subject: data.subject,
        message: data.message,
      });

      // Show success message
      setShowSuccess(true);

      // Reset form
      reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setError("root", {
        type: "manual",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page bg-light min-vh-100 py-5">
      <Container>
        {/* Page Header */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-5 fw-bold mb-3">Contact Us</h1>
            <p className="lead text-muted">
              We're here to help! Get in touch with our customer support team
              for any questions, concerns, or feedback about your shopping
              experience.
            </p>
          </Col>
        </Row>

        <Row>
          {/* Contact Information */}
          <Col lg={4} className="mb-4">
            {/* Customer Support */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div
                    className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <FiHeadphones size={28} />
                  </div>
                  <h5 className="fw-bold">Customer Support</h5>
                </div>

                <div className="contact-info">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FiPhone className="text-dark" size={18} />
                    </div>
                    <div>
                      <div className="fw-semibold">Phone Support</div>
                      <div className="text-muted">+91 1800-123-4567</div>
                      <small className="text-success">Toll-free</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FiMail className="text-dark" size={18} />
                    </div>
                    <div>
                      <div className="fw-semibold">Email Support</div>
                      <div className="text-muted">support@store.com</div>
                      <small className="text-info">24/7 Available</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div
                      className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FiClock className="text-dark" size={18} />
                    </div>
                    <div>
                      <div className="fw-semibold">Working Hours</div>
                      <div className="text-muted">
                        Mon - Sat: 9:00 AM - 8:00 PM
                      </div>
                      <small className="text-muted">
                        Sunday: 10:00 AM - 6:00 PM
                      </small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Company Address */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div
                    className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <FiMapPin size={28} />
                  </div>
                  <h5 className="fw-bold">Our Office</h5>
                </div>

                <div className="text-center">
                  <address className="mb-3">
                    <strong>STORE Headquarters</strong>
                    <br />
                    123 Business District
                    <br />
                    Tech Park, Building A<br />
                    Bangalore, Karnataka 560001
                    <br />
                    India
                  </address>

                  <Button variant="outline-dark" size="sm" className="mb-3">
                    <FiMapPin className="me-2" />
                    View on Google Maps
                  </Button>
                </div>

                {/* Google Maps Embed */}
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="200"
                    style={{ border: 0, borderRadius: "8px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="STORE Office Location"
                  ></iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Form */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div
                    className="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <FiMessageCircle size={28} />
                  </div>
                  <h4 className="fw-bold">Send us a Message</h4>
                  <p className="text-muted mb-0">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </div>

                {/* Success Message */}
                {showSuccess && (
                  <Alert variant="success" className="mb-4">
                    <div className="d-flex align-items-center">
                      <FiSend className="me-2" />
                      <div>
                        <strong>Message sent successfully!</strong>
                        <div className="small">
                          We'll get back to you within 24 hours.
                        </div>
                      </div>
                    </div>
                  </Alert>
                )}

                {/* Error Message */}
                {errors.root && (
                  <Alert variant="danger" className="mb-4">
                    {errors.root.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <FiUser className="me-2" />
                          Full Name *
                        </Form.Label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              type="text"
                              placeholder="Enter your full name"
                              isInvalid={!!errors.name}
                              disabled={isLoading}
                              className="py-2"
                            />
                          )}
                        />
                        {errors.name && (
                          <Form.Control.Feedback type="invalid">
                            {errors.name.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <FiMail className="me-2" />
                          Email Address *
                        </Form.Label>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              type="email"
                              placeholder="Enter your email address"
                              isInvalid={!!errors.email}
                              disabled={isLoading}
                              className="py-2"
                            />
                          )}
                        />
                        {errors.email && (
                          <Form.Control.Feedback type="invalid">
                            {errors.email.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <FiSmartphone className="me-2" />
                          Mobile Number *
                        </Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 fw-bold">
                            +91
                          </span>
                          <Controller
                            name="mobile"
                            control={control}
                            render={({ field }) => (
                              <Form.Control
                                {...field}
                                type="tel"
                                placeholder="Enter 10-digit mobile number"
                                className="border-start-0 ps-0 py-2"
                                isInvalid={!!errors.mobile}
                                disabled={isLoading}
                                maxLength={10}
                                onInput={(e: any) => {
                                  // Only allow numbers
                                  e.target.value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.mobile && (
                          <div className="text-danger small mt-1">
                            {errors.mobile.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Subject *
                        </Form.Label>
                        <Controller
                          name="subject"
                          control={control}
                          render={({ field }) => (
                            <Form.Select
                              {...field}
                              isInvalid={!!errors.subject}
                              disabled={isLoading}
                              className="py-2"
                            >
                              {subjectOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        />
                        {errors.subject && (
                          <Form.Control.Feedback type="invalid">
                            {errors.subject.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Message *</Form.Label>
                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          as="textarea"
                          rows={5}
                          placeholder="Please describe your inquiry in detail..."
                          isInvalid={!!errors.message}
                          disabled={isLoading}
                          style={{ resize: "vertical" }}
                        />
                      )}
                    />
                    {errors.message && (
                      <Form.Control.Feedback type="invalid">
                        {errors.message.message}
                      </Form.Control.Feedback>
                    )}
                    <Form.Text className="text-muted">
                      Please provide as much detail as possible to help us
                      assist you better.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="dark"
                      size="lg"
                      disabled={isLoading || !isDirty || !isValid}
                      className="py-3"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <FiSend className="me-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      We typically respond within 24 hours during business days.
                    </small>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Support Options */}
        <Row className="mt-5">
          <Col lg={12}>
            <Card className="border-0 bg-dark text-white">
              <Card.Body className="p-4 p-md-5">
                <Row className="text-center justify-content-center">
                  <Col md={5} className="mb-4 mb-md-0">
                    <div className="mb-3">
                      <FiPhone size={40} className="text-white" />
                    </div>
                    <h5 className="fw-bold">Quick Call</h5>
                    <p className="mb-2">Need immediate assistance?</p>
                    <Button variant="outline-light" size="sm">
                      Call Now: +91 1800-123-4567
                    </Button>
                  </Col>

                  {/* <Col md={4} className="mb-4 mb-md-0">
                    <div className="mb-3">
                      <FiMessageCircle size={40} className="text-white" />
                    </div>
                    <h5 className="fw-bold">Live Chat</h5>
                    <p className="mb-2">Chat with our support team</p>
                    <Button variant="outline-light" size="sm">
                      Start Live Chat
                    </Button>
                  </Col> */}

                  <Col md={5}>
                    <div className="mb-3">
                      <FiMail size={40} className="text-white" />
                    </div>
                    <h5 className="fw-bold">Email Support</h5>
                    <p className="mb-2">Send us an email anytime</p>
                    <Button variant="outline-light" size="sm">
                      support@store.com
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Link */}
        <Row className="mt-4">
          <Col lg={12} className="text-center">
            <p className="text-muted">
              Looking for quick answers? Check out our{" "}
              <a
                href="/website/faq"
                className="text-decoration-none fw-semibold"
              >
                Frequently Asked Questions
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
