"use client";

import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { contactService } from "../services/contactService";

// Validation schema matching Figma design
const contactSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("you must fill the required field")
    .min(2, "First name must be at least 2 characters")
    .trim(),
  lastName: yup
    .string()
    .required("you must fill the required field")
    .min(2, "Last name must be at least 2 characters")
    .trim(),
  phone: yup
    .string()
    .required("you must fill the required field")
    .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  email: yup
    .string()
    .required("you must fill the required field")
    .email("Please enter a valid email address")
    .trim()
    .lowercase(),
  reason: yup
    .string()
    .required("you must fill the required field")
    .min(10, "Reason must be at least 10 characters")
    .trim(),
});

interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  reason: string;
}

export default function ContactUsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      reason: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);

    try {
      await contactService.submitContactForm({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        subject: "Schedule a Call",
        message: data.reason,
      });

      toast.success("Request submitted successfully! We'll contact you soon.");
      reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-white py-5">
      <Container>
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="mb-2  d-flex gap-2">
            {" "}
            <button
              onClick={() => router.back()}
              className="btn btn-link text-dark p-0 mb-2 text-decoration-none d-flex align-items-center"
              style={{ fontSize: "1rem" }}
            >
              <IoChevronBack size={24} />
            </button>
            Contact Us
          </h2>
          <p className="text-muted mb-0">
            We're here to help—get in touch with us anytime.
          </p>
        </div>

        <Row className="g-4">
          {/* Left Column - Form */}
          <Col lg={6}>
            <div
              className="bg-light  p-4 p-md-5"
              style={{ borderRadius: "25px" }}
            >
              <h5 className="mb-4">Fill the form to schedule a call</h5>

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* First Name and Last Name */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className={`small ${
                          errors.firstName ? "text-danger" : ""
                        }`}
                      >
                        First name <span className="text-danger">*</span>
                      </Form.Label>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            type="text"
                            placeholder=""
                            isInvalid={!!errors.firstName}
                            disabled={isLoading}
                            className="border-dark"
                          />
                        )}
                      />
                      {errors.firstName && (
                        <div className="text-danger small mt-1 fw-semibold">
                          {errors.firstName.message}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className={`small ${
                          errors.lastName ? "text-danger" : ""
                        }`}
                      >
                        Last name <span className="text-danger">*</span>
                      </Form.Label>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            type="text"
                            placeholder=""
                            isInvalid={!!errors.lastName}
                            disabled={isLoading}
                            className="border-dark"
                          />
                        )}
                      />
                      {errors.lastName && (
                        <div className="text-danger small mt-1 fw-semibold">
                          {errors.lastName.message}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Phone Number */}
                <Form.Group className="mb-3">
                  <Form.Label
                    className={`small ${errors.phone ? "text-danger" : ""}`}
                  >
                    Phone number <span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="tel"
                        placeholder=""
                        isInvalid={!!errors.phone}
                        disabled={isLoading}
                        className="border-dark"
                        maxLength={10}
                        onInput={(e: any) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                      />
                    )}
                  />
                  {errors.phone && (
                    <div className="text-danger small mt-1 fw-semibold">
                      {errors.phone.message}
                    </div>
                  )}
                </Form.Group>

                {/* Email Address */}
                <Form.Group className="mb-3">
                  <Form.Label
                    className={`small ${errors.email ? "text-danger" : ""}`}
                  >
                    E-mail Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="email"
                        placeholder=""
                        isInvalid={!!errors.email}
                        disabled={isLoading}
                        className="border-dark"
                      />
                    )}
                  />
                  {errors.email && (
                    <div className="text-danger small mt-1 fw-semibold">
                      {errors.email.message}
                    </div>
                  )}
                </Form.Group>

                {/* Reason */}
                <Form.Group className="mb-4">
                  <Form.Label
                    className={`small ${errors.reason ? "text-danger" : ""}`}
                  >
                    Reason to schedule a call{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        as="textarea"
                        rows={4}
                        placeholder=""
                        isInvalid={!!errors.reason}
                        disabled={isLoading}
                        className="border-dark"
                        style={{ resize: "none" }}
                      />
                    )}
                  />
                  {errors.reason && (
                    <div className="text-danger small mt-1 fw-semibold">
                      {errors.reason.message}
                    </div>
                  )}
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="dark"
                    size="lg"
                    disabled={isLoading}
                    className="py-2"
                  >
                    {isLoading ? "Submitting..." : "Submit request"}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          {/* Right Column - Help Text */}
          <Col lg={6}>
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center px-4">
              {/* Headphone Icon */}
              <div className="mb-4">
                <Image
                  src="/images/headphoneicon.svg"
                  alt="Headphones"
                  width={80}
                  height={80}
                />
              </div>

              {/* Help Text */}
              <p className="text-muted mb-4" style={{ maxWidth: "400px" }}>
                Please share your request with a required information. We will
                contact you as soon as possible. Thank you for reaching out—we
                appreciate your patience.
              </p>

              {/* Support Email */}
              <div className="text-muted d-flex align-items-center gap-2">
                <Image
                  src="/images/globe-icon.svg"
                  alt="Globe"
                  width={16}
                  height={16}
                />
                <span>support@puffnclub.com</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
