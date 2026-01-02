"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { otpService } from "../../services/otpService";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const email = sessionStorage.getItem('otpEmail') || "";
    const sessionId = sessionStorage.getItem('otpSessionId') || "";
    setEmail(email);
    setSessionId(sessionId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!email || !sessionId) {
        setError("Missing email or session ID for OTP verification.");
        setLoading(false);
        return;
      }
      console.log("Verifying OTP with:", { email, sessionId, otp }); // Debug log
      const response = await otpService.verifyOtp({ email, otp, sessionId });
      setSuccess("OTP verified successfully!");
      setTimeout(() => router.push("/website"), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
      console.error("OTP verification error:", err); // Debug log
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h3 className="fw-bold">Verify OTP</h3>
                <p className="text-muted">Enter the OTP sent to your email</p>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </Button>
                {/* For demo/testing: fields to set email/sessionId manually */}
                <Form.Group className="mb-2 mt-3">
                  <Form.Label>Email (for demo)</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Session ID (for demo)</Form.Label>
                  <Form.Control
                    type="text"
                    value={sessionId}
                    onChange={e => setSessionId(e.target.value)}
                    placeholder="Enter session ID"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
