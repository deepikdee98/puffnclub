"use client";

import { useEffect } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiMapPin, FiUser, FiPhone } from "react-icons/fi";

// Validation schema
const addressSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim(),

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),

  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must not exceed 200 characters")
    .trim(),

  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters")
    .trim(),

  state: yup
    .string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .max(50, "State must not exceed 50 characters")
    .trim(),

  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Please enter a valid 6-digit pincode"),

  isDefault: yup.boolean().required().default(false),
});

interface AddressFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface Address extends AddressFormData {
  id: string;
}

interface AddressFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (address: AddressFormData) => void;
  editingAddress?: Address | null;
  isLoading?: boolean;
}

export default function AddressForm({
  show,
  onHide,
  onSave,
  editingAddress,
  isLoading = false,
}: AddressFormProps) {
  const isEditMode = !!editingAddress;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setError,
    clearErrors,
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    },
  });

  // Reset form when modal opens/closes or editing address changes
  useEffect(() => {
    if (show) {
      if (editingAddress) {
        // Pre-fill form with editing address data
        reset({
          name: editingAddress.name,
          phone: editingAddress.phone,
          address: editingAddress.address,
          city: editingAddress.city,
          state: editingAddress.state,
          pincode: editingAddress.pincode,
          isDefault: editingAddress.isDefault,
        });
      } else {
        // Reset form for new address
        reset({
          name: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: false,
        });
      }
    }
  }, [show, editingAddress, reset]);

  const onSubmit = async (data: AddressFormData) => {
    clearErrors();
    try {
      await onSave(data);
      onHide();
    } catch (error) {
      console.error("Address save error:", error);
      setError("root", {
        type: "manual",
        message: "Failed to save address. Please try again.",
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onHide();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FiMapPin className="me-2" />
          {isEditMode ? "Edit Address" : "Add New Address"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body>
          {/* Display root-level errors */}
          {errors.root && (
            <Alert variant="danger" className="mb-3">
              {errors.root.message}
            </Alert>
          )}

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
                      placeholder="Enter full name"
                      isInvalid={!!errors.name}
                      disabled={isLoading}
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
                  <FiPhone className="me-2" />
                  Phone Number *
                </Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 fw-bold">
                    +91
                  </span>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        className="border-start-0 ps-0"
                        isInvalid={!!errors.phone}
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
                {errors.phone && (
                  <div className="text-danger small mt-1">
                    {errors.phone.message}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Address *</Form.Label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  as="textarea"
                  rows={3}
                  placeholder="Enter complete address (House/Flat No., Street, Area)"
                  isInvalid={!!errors.address}
                  disabled={isLoading}
                />
              )}
            />
            {errors.address && (
              <Form.Control.Feedback type="invalid">
                {errors.address.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">City *</Form.Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="Enter city"
                      isInvalid={!!errors.city}
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.city && (
                  <Form.Control.Feedback type="invalid">
                    {errors.city.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">State *</Form.Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      {...field}
                      isInvalid={!!errors.state}
                      disabled={isLoading}
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">
                        Arunachal Pradesh
                      </option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                    </Form.Select>
                  )}
                />
                {errors.state && (
                  <Form.Control.Feedback type="invalid">
                    {errors.state.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Pincode *</Form.Label>
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="Enter 6-digit pincode"
                      isInvalid={!!errors.pincode}
                      disabled={isLoading}
                      maxLength={6}
                      onInput={(e: any) => {
                        // Only allow numbers
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                    />
                  )}
                />
                {errors.pincode && (
                  <Form.Control.Feedback type="invalid">
                    {errors.pincode.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Controller
            name="isDefault"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Form.Check
                type="checkbox"
                id="isDefault"
                label="Set as default address"
                checked={value}
                onChange={onChange}
                disabled={isLoading}
                className="mb-3"
              />
            )}
          />

          <div className="bg-light p-3 rounded">
            <small className="text-muted">
              <strong>Note:</strong> Please ensure your address is complete and
              accurate for smooth delivery.
            </small>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="dark"
            disabled={isLoading || !isDirty || !isValid}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              <>{isEditMode ? "Update Address" : "Save Address"}</>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
