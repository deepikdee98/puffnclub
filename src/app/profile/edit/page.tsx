"use client";

import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";

// Validation schema
const editProfileSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .trim(),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .trim(),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  alternatePhone: yup
    .string()
    .optional()
    .test('is-valid-phone', 'Please enter a valid 10-digit mobile number', function(value) {
      if (!value || value.length === 0) return true;
      return /^[6-9]\d{9}$/.test(value);
    }),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim()
    .lowercase(),
  dateOfBirth: yup.string().optional(),
  city: yup.string().optional().trim(),
  country: yup.string().optional().trim(),
});

interface EditProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  alternatePhone?: string | undefined;
  email: string;
  dateOfBirth?: string | undefined;
  city?: string | undefined;
  country?: string | undefined;
}

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { customer, updateCustomer } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileFormData>({
    resolver: yupResolver(editProfileSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      alternatePhone: "",
      email: "",
      dateOfBirth: "",
      city: "",
      country: "",
    },
  });

  // Populate form with customer data
  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        phone: customer.phone || "",
        email: customer.email || "",
        dateOfBirth: customer.dateOfBirth || "",
        alternatePhone: "",
        city: "",
        country: "",
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: EditProfileFormData) => {
    setIsLoading(true);

    try {
      const response = await authService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
      });

      // Update customer in auth context
      if (updateCustomer) {
        updateCustomer(response.customer);
      }

      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <div className="min-vh-100 bg-white py-5">
      <Container>
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="mb-2 d-flex gap-2 align-items-center">
            <button
              onClick={() => router.back()}
              className="btn btn-link text-dark p-0 text-decoration-none d-flex align-items-center"
              style={{ fontSize: "1rem" }}
            >
              <IoChevronBack size={24} />
            </button>
            Edit Profile
          </h2>
          <p className="text-muted mb-0">
            Make changes to your information anytime with ease.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-light p-4 p-md-5" style={{ borderRadius: "25px" }}>
          {/* Form Header with Buttons */}
          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
            <h5 className="mb-0">
              Edit your profile to ensure all your details are current.
            </h5>
            <div className="d-done d-lg-flex gap-2">
              <Button
                variant="outline-dark"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                style={{ borderRadius: "8px" }}
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
              <Button
                variant="dark"
                onClick={handleCancel}
                disabled={isLoading}
                style={{ borderRadius: "8px" }}
              >
                Cancel
              </Button>
            </div>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* First Name and Last Name */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3 mb-md-0">
                  <Form.Label className="small">First Name</Form.Label>
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
                      />
                    )}
                  />
                  {errors.firstName && (
                    <div className="text-danger small mt-1">
                      {errors.firstName.message}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small">Last name</Form.Label>
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
                      />
                    )}
                  />
                  {errors.lastName && (
                    <div className="text-danger small mt-1">
                      {errors.lastName.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Phone Number and Alternate Phone Number */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3 mb-md-0">
                  <Form.Label className="small">Phone Number</Form.Label>
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
                    <div className="text-danger small mt-1">
                      {errors.phone.message}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small">
                    Alternate Phone Number
                  </Form.Label>
                  <Controller
                    name="alternatePhone"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="tel"
                        placeholder=""
                        isInvalid={!!errors.alternatePhone}
                        disabled={isLoading}
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
                  {errors.alternatePhone && (
                    <div className="text-danger small mt-1">
                      {errors.alternatePhone.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Email Address and Date of Birth */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3 mb-md-0">
                  <Form.Label className="small">E-mail Address</Form.Label>
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
                      />
                    )}
                  />
                  {errors.email && (
                    <div className="text-danger small mt-1">
                      {errors.email.message}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small">Date of Birth</Form.Label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="date"
                        placeholder=""
                        isInvalid={!!errors.dateOfBirth}
                        disabled={isLoading}
                      />
                    )}
                  />
                  {errors.dateOfBirth && (
                    <div className="text-danger small mt-1">
                      {errors.dateOfBirth.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* City and Country */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3 mb-md-0">
                  <Form.Label className="small">City</Form.Label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder=""
                        isInvalid={!!errors.city}
                        disabled={isLoading}
                      />
                    )}
                  />
                  {errors.city && (
                    <div className="text-danger small mt-1">
                      {errors.city.message}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small">Country</Form.Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder=""
                        isInvalid={!!errors.country}
                        disabled={isLoading}
                      />
                    )}
                  />
                  {errors.country && (
                    <div className="text-danger small mt-1">
                      {errors.country.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <div className="d-flex d-lg-none pt-3 gap-2">
            <Button
              variant="outline-dark"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              style={{ borderRadius: "8px" }}
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
            <Button
              variant="dark"
              onClick={handleCancel}
              disabled={isLoading}
              style={{ borderRadius: "8px" }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
