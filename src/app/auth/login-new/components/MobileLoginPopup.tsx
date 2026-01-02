import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { phoneLoginSchema } from "../schemas/validationSchemas";
import styles from "./MobileLoginPopup.module.scss";

interface MobileFormData {
  mobile: string;
}

interface MobileLoginPopupProps {
  show: boolean;
  onHide: () => void;
  onOtpRequested: (mobile: string) => void;
  loading?: boolean;
}

export default function MobileLoginPopup({
  show,
  onHide,
  onOtpRequested,
  loading = false,
}: MobileLoginPopupProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<MobileFormData>({
    resolver: yupResolver(phoneLoginSchema),
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

  const onSubmit = (data: MobileFormData) => {
    onOtpRequested(data.mobile);
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

        <h5 className="fw-bold mb-2">Log in with Phone</h5>
        <div className="text-muted mb-3" style={{ fontSize: 14 }}>
          Enter your 10-digit mobile number
        </div>

        {/* Development Mode Notice */}
        {process.env.NODE_ENV === 'development' && (
          <div 
            className="alert alert-info py-2 px-3 mb-3" 
            style={{ fontSize: 13, backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff' }}
          >
            <strong>📱 Development Mode:</strong> OTP will be logged in the backend console. Check your terminal for the OTP code.
          </div>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Control
              {...register("mobile")}
              className="shadow-none"
              type="tel"
              placeholder="Phone number (10 digits)"
              isInvalid={!!errors.mobile}
              disabled={loading}
              maxLength={10}
            />
            {errors.mobile && (
              <Form.Control.Feedback type="invalid">
                {errors.mobile.message}
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
