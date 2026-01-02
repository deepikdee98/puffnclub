import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styles from "./MobileLoginPopup.module.scss";

interface MobileLoginPopupProps {
  show: boolean;
  onHide: () => void;
  onOtpRequested: (mobile: string) => void;
}

export default function MobileLoginPopup({
  show,
  onHide,
  onOtpRequested,
}: MobileLoginPopupProps) {
  const [mobile, setMobile] = useState("");

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="p-4">
        <h5 className="fw-bold mb-2">Log in</h5>
        <div className="text-muted mb-3" style={{ fontSize: 14 }}>
          Quick Login with Your Mobile number
        </div>
        <Form.Group className="mb-3">
          <Form.Control
            type="tel"
            placeholder="Phone number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="dark"
          className="w-100"
          onClick={() => onOtpRequested(mobile)}
        >
          Get OTP
        </Button>
      </Modal.Body>
    </Modal>
  );
}
