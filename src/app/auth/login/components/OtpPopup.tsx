import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styles from "../style.module.scss";

interface OtpPopupProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (otp: string) => void;
  onResend: () => void;
}

export default function OtpPopup({
  show,
  onHide,
  onConfirm,
  onResend,
}: OtpPopupProps) {
  const [otp, setOtp] = useState(Array(6).fill(""));

  // Handle digit input
  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return; // Only digit or empty
    const nextOtp = [...otp];
    nextOtp[index] = val;
    setOtp(nextOtp);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="p-4">
        <h5 className="fw-bold mb-2">Enter OTP</h5>
        <div className="text-muted mb-3" style={{ fontSize: 14 }}>
          OTP has sent to your registered mobile number
        </div>
        <div className="d-flex gap-2 justify-content-center mb-3">
          {otp.map((val, idx) => (
            <Form.Control
              key={idx}
              type="text"
              value={val}
              inputMode="numeric"
              maxLength={1}
              className={`text-center ${styles.otpInput}`}
              onChange={(e) => handleChange(idx, e.target.value)}
              style={{ width: 38, height: 48, fontSize: 20 }}
            />
          ))}
        </div>
        <div className="mb-3 text-center" style={{ fontSize: 13 }}>
          If you haven't received the OTP?{" "}
          <span
            className="text-decoration-underline cursor-pointer"
            style={{ color: "#222", cursor: "pointer" }}
            onClick={onResend}
          >
            Resent OTP
          </span>
        </div>
        <Button
          variant="dark"
          className="w-100"
          onClick={() => onConfirm(otp.join(""))}
        >
          Confirm
        </Button>
      </Modal.Body>
    </Modal>
  );
}
