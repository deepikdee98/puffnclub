import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { otpSchema } from "../schemas/validationSchemas";
import styles from "../style.module.scss";

interface OtpFormData {
  otp: string;
}

interface OtpPopupProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (otp: string) => void;
  onResend: () => void;
  identifier?: string; // Phone number or email to display
  loading?: boolean;
}

export default function OtpPopup({
  show,
  onHide,
  onConfirm,
  onResend,
  identifier,
  loading = false,
}: OtpPopupProps) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const {
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
  } = useForm<OtpFormData>({
    resolver: yupResolver(otpSchema),
    mode: "onChange",
  });

  // Reset OTP when modal is closed
  useEffect(() => {
    if (!show) {
      setOtp(Array(6).fill(""));
      setOtpError("");
      setValue("otp", "");
      setCountdown(30);
      setCanResend(false);
    }
  }, [show, setValue]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (!show || countdown === 0) {
      if (countdown === 0) {
        setCanResend(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, countdown]);

  // Handle digit input
  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return; // Only digit or empty
    const nextOtp = [...otp];
    nextOtp[index] = val;
    setOtp(nextOtp);

    // Update form value
    const otpString = nextOtp.join("");
    setValue("otp", otpString);
    setOtpError("");

    // Auto focus next input when digit is entered
    if (val && index < 5) {
      const nextInput = document.querySelector(
        `input[data-otp-index="${index + 1}"]`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  // Handle key events for backspace navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      // If current input is empty, move to previous input
      if (!otp[index] && index > 0) {
        const prevInput = document.querySelector(
          `input[data-otp-index="${index - 1}"]`
        ) as HTMLInputElement;
        prevInput?.focus();
      }
    }
  };

  const handleClose = () => {
    setOtp(Array(6).fill(""));
    setOtpError("");
    setValue("otp", "");
    onHide();
  };

  const handleResend = () => {
    if (canResend) {
      setCountdown(30);
      setCanResend(false);
      onResend();
    }
  };

  const onSubmit = (data: OtpFormData) => {
    if (data.otp.length === 6) {
      onConfirm(data.otp);
    } else {
      setOtpError("Please enter complete 6-digit OTP");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="p-3 text-center p-md-4 position-relative">
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close"
          disabled={loading}
        >
          <FiX size={20} />
        </button>

        <h5 className="fw-bold mb-2">Enter OTP</h5>
        <div className="text-muted mb-3" style={{ fontSize: 14 }}>
          {identifier 
            ? `OTP has been sent to ${identifier}`
            : "OTP has been sent to your registered contact"}
        </div>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex gap-2 gap-md-3 justify-content-center mb-3">
            {otp.map((val, idx) => (
              <Form.Control
                key={idx}
                type="text"
                value={val}
                inputMode="numeric"
                maxLength={1}
                className={`text-center shadow-none ${styles.otpInput} ${
                  otpError ? 'is-invalid' : ''
                }`}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e as any)}
                data-otp-index={idx}
                autoFocus={idx === 0}
                disabled={loading}
              />
            ))}
          </div>
          
          {otpError && (
            <div className="text-danger text-center mb-3" style={{ fontSize: 14 }}>
              {otpError}
            </div>
          )}

          <div className="mb-3 text-center" style={{ fontSize: 13 }}>
            {canResend ? (
              <>
                Didn't receive the OTP?{" "}
                <span
                  className="text-decoration-underline"
                  style={{ color: "#222", cursor: "pointer" }}
                  onClick={handleResend}
                >
                  Resend OTP
                </span>
              </>
            ) : (
              <span className="text-muted">
                Resend OTP in {countdown}s
              </span>
            )}
          </div>
          
          <Button
            type="submit"
            variant="dark"
            className="w-100"
            disabled={otp.some((digit) => digit === "") || loading}
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
                Verifying...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
