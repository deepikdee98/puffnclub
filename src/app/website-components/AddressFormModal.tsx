"use client";

import { useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema - name/phone are read-only, only validate address fields
const addressSchema = yup.object().shape({
  // Read-only fields (not validated, just for display)
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  phoneNumber: yup.string().optional(),

  // Editable address fields
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Please enter a valid 6-digit pincode"),

  townCity: yup
    .string()
    .required("Town/City is required")
    .min(2, "Town/City must be at least 2 characters")
    .max(50, "Town/City must not exceed 50 characters")
    .trim(),

  houseNo: yup
    .string()
    .required("House no/Flat no/Block is required")
    .min(1, "This field is required")
    .trim(),

  locality: yup
    .string()
    .required("Locality, building, street is required")
    .min(5, "Locality must be at least 5 characters")
    .trim(),

  state: yup.string().optional(),

  isDefault: yup.boolean().default(false),
});

export interface AddressFormData {
  // Read-only display fields (from customer)
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;

  // Editable address fields
  pincode: string;
  townCity: string;
  houseNo: string;
  locality: string;
  state?: string;
  isDefault: boolean;
}

export interface Address extends AddressFormData {
  id: string;
}

interface AddressFormModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (address: AddressFormData) => Promise<void>;
  editingAddress?: Address | null;
  isLoading?: boolean;
  customerName?: string; // Customer's full name for display
  customerPhone?: string; // Customer's phone for display
}

export default function AddressFormModal({
  show,
  onHide,
  onSave,
  editingAddress,
  isLoading = false,
  customerName = "",
  customerPhone = "",
}: AddressFormModalProps) {
  const isEditMode = !!editingAddress;

  // Split customer name for display
  const [firstName, ...lastNameParts] = customerName.split(" ");
  const lastName = lastNameParts.join(" ");

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
      firstName: firstName || "",
      lastName: lastName || "",
      phoneNumber: customerPhone || "",
      pincode: "",
      townCity: "",
      houseNo: "",
      locality: "",
      state: "",
      isDefault: false,
    },
  });

  // Reset form when modal opens/closes or editing address changes
  useEffect(() => {
    if (show) {
      if (editingAddress) {
        // Pre-fill form with editing address data
        reset({
          firstName: firstName || "",
          lastName: lastName || "",
          phoneNumber: customerPhone || "",
          pincode: editingAddress.pincode,
          townCity: editingAddress.townCity,
          houseNo: editingAddress.houseNo,
          locality: editingAddress.locality,
          state: editingAddress.state || "",
          isDefault: editingAddress.isDefault,
        });
      } else {
        // Reset form for new address
        reset({
          firstName: firstName || "",
          lastName: lastName || "",
          phoneNumber: customerPhone || "",
          pincode: "",
          townCity: "",
          houseNo: "",
          locality: "",
          state: "",
          isDefault: false,
        });
      }
    }
  }, [show, editingAddress, reset, firstName, lastName, customerPhone]);

  const onSubmit = async (data: AddressFormData) => {
    clearErrors();
    try {
      await onSave(data);
      // Modal will be closed by parent component after successful save
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
      contentClassName="shadow-none"
    >
      <Modal.Header className="border-0 pb-2">
        <div className="w-100">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1">
                {isEditMode ? "Edit Address" : "Add Address"}
              </h5>
              <small className="text-muted">
                Fill up the form to add address for shipping
              </small>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
              style={{ fontSize: "0.75rem", boxShadow: "none !important" }}
            />
          </div>
        </div>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body className="pt-3">
          <div className="bg-light p-4 rounded">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="mb-0">Please add your address details below</h6>
            </div>

            {/* Display root-level errors */}
            {errors.root && (
              <div className="alert alert-danger mb-3" role="alert">
                {errors.root.message}
              </div>
            )}

            <Row>
              {/* First Name - READ ONLY */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">First Name</Form.Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder=""
                        disabled={true}
                        readOnly
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #e0e0e0",
                          cursor: "not-allowed",
                        }}
                      />
                    )}
                  />
                  <Form.Text className="text-muted small">
                    From your profile
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Last Name - READ ONLY */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Last name</Form.Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder=""
                        disabled={true}
                        readOnly
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #e0e0e0",
                          cursor: "not-allowed",
                        }}
                      />
                    )}
                  />
                  <Form.Text className="text-muted small">
                    From your profile
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {/* Phone Number - READ ONLY */}
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Phone Number</Form.Label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="tel"
                        placeholder=""
                        disabled={true}
                        readOnly
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #e0e0e0",
                          cursor: "not-allowed",
                        }}
                      />
                    )}
                  />
                  <Form.Text className="text-muted small">
                    From your profile. Update in Profile Settings if needed.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {/* Pincode */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">
                    Pincode <span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder=""
                        isInvalid={!!errors.pincode}
                        disabled={isLoading}
                        maxLength={6}
                        onInput={(e: any) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e0e0e0",
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

              {/* Town/City */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">
                    Town/City <span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    name="townCity"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder=""
                        isInvalid={!!errors.townCity}
                        disabled={isLoading}
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e0e0e0",
                        }}
                      />
                    )}
                  />
                  {errors.townCity && (
                    <Form.Control.Feedback type="invalid">
                      {errors.townCity.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {/* House no/Flat no/Block */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">
                    House no/Flat no/Block{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    name="houseNo"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder=""
                        isInvalid={!!errors.houseNo}
                        disabled={isLoading}
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e0e0e0",
                        }}
                      />
                    )}
                  />
                  {errors.houseNo && (
                    <Form.Control.Feedback type="invalid">
                      {errors.houseNo.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              {/* Locality, building, street */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">
                    Locality, building, street{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Controller
                    name="locality"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder=""
                        isInvalid={!!errors.locality}
                        disabled={isLoading}
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e0e0e0",
                        }}
                      />
                    )}
                  />
                  {errors.locality && (
                    <Form.Control.Feedback type="invalid">
                      {errors.locality.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* Default Address Checkbox */}
            <Controller
              name="isDefault"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Form.Check
                  type="checkbox"
                  id="isDefault"
                  label="Save this as the default address."
                  checked={value}
                  onChange={onChange}
                  disabled={isLoading}
                  className="mb-0"
                />
              )}
            />
          </div>
          <div className="d-flex gap-2 pt-4 justify-content-end">
            <Button
              type="submit"
              variant="outline-dark"
              disabled={isLoading || !isDirty || !isValid}
              style={{ minWidth: "140px" }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
            <Button
              type="button"
              variant="dark"
              onClick={handleClose}
              disabled={isLoading}
              style={{ minWidth: "100px" }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
