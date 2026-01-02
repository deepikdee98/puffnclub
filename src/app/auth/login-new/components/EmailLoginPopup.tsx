import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailLoginSchema } from "../schemas/validationSchemas";
import styles from "./MobileLoginPopup.module.scss";

interface EmailFormData {
  email: string;
}

interface EmailLoginPopupProps {
  show: boolean;
  onHide: () => void;
  onOtpRequested: (email: string) => void;
  loading?: boolean;
}

export default function EmailLoginPopup({
  show,
  onHide,
  onOtpRequested,
  loading = false,
}: EmailLoginPopupProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EmailFormData>({
    resolver: yupResolver(emailLoginSchema),
    mode: "onChange",
  });

  // Reset form when modal is closed
  useEffect(() => {
    if (!show) {
      reset();
    }
  }, [show, reset]);

  const handleClose = () => {
    reset();
    onHide();
  };

  const onSubmit = (data: EmailFormData) => {
    onOtpRequested(data.email);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="p-4 position-relative">
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close"
          disabled={loading}
        >
          <FiX size={20} />
        </button>

        <h5 className="fw-bold mb-2">Log in with Email</h5>
        <div className="text-muted mb-3" style={{ fontSize: 14 }}>
          Enter your email address
        </div>

        {/* Development Mode Notice */}
        {process.env.NODE_ENV === 'development' && (
          <div 
            className="alert alert-info py-2 px-3 mb-3" 
            style={{ fontSize: 13, backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff' }}
          >
            <strong>📧 Development Mode:</strong> OTP will be logged in the backend console. Check your terminal for the OTP code.
          </div>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Control
              {...register("email")}
              className="shadow-none"
              type="email"
              placeholder="Email address"
              isInvalid={!!errors.email}
              disabled={loading}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button
            type="submit"
            variant="dark"
            className="w-100"
            disabled={!isValid || loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Sending OTP...
              </>
            ) : (
              "Get OTP"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}