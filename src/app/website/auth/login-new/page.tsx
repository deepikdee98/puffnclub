"use client";

import { useState } from "react";
import { Container, Row, Col, Tab, Nav, Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";
import MobileLoginPopup from "./components/MobileLoginPopup";
import EmailLoginPopup from "./components/EmailLoginPopup";
import OtpPopup from "./components/OtpPopup";
import { API_ENDPOINTS, setAuthToken } from "@/app/website/services/api";

type LoginMethod = "phone" | "email";

export default function LoginNewPage() {
  const router = useRouter();
  
  // Modal visibility states
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  
  // Authentication states
  const [activeTab, setActiveTab] = useState<LoginMethod>("phone");
  const [sessionId, setSessionId] = useState<string>("");
  const [identifier, setIdentifier] = useState<string>(""); // Phone or Email
  const [identifierType, setIdentifierType] = useState<"mobile" | "email">("mobile");
  
  // Loading and message states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Handle Phone Login - Send OTP
  const handlePhoneOtpRequest = async (mobile: string) => {
    console.log("🔵 handlePhoneOtpRequest called with mobile:", mobile);
    console.log("🔵 API Endpoint:", API_ENDPOINTS.WEBSITE.AUTH.SEND_OTP);
    
    setLoading(true);
    setError("");
    
    try {
      console.log("🔵 Sending request to backend...");
      const response = await fetch(API_ENDPOINTS.WEBSITE.AUTH.SEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mobile: mobile  // Backend expects 'mobile' field
        }),
      });

      console.log("🔵 Response received:", response.status, response.statusText);
      const data = await response.json();
      console.log("🔵 Response data:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      // Store session info
      setSessionId(data.sessionId);
      setIdentifier(mobile);
      setIdentifierType("mobile");
      
      // Close phone modal and open OTP modal
      setShowPhoneModal(false);
      setShowOtpModal(true);
      setSuccess(data.message || "OTP sent successfully!");
      
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Login - Send OTP
  const handleEmailOtpRequest = async (email: string) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(API_ENDPOINTS.WEBSITE.AUTH.SEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email  // Backend expects 'email' field
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      // Store session info
      setSessionId(data.sessionId);
      setIdentifier(email);
      setIdentifierType("email");
      
      // Close email modal and open OTP modal
      setShowEmailModal(false);
      setShowOtpModal(true);
      setSuccess(data.message || "OTP sent successfully!");
      
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpVerification = async (otp: string) => {
    setLoading(true);
    setError("");
    
    try {
      // Backend expects 'mobile' or 'email' field, not 'identifier'
      const requestBody: any = {
        sessionId,
        otp,
      };
      
      if (identifierType === "mobile") {
        requestBody.mobile = identifier;
      } else {
        requestBody.email = identifier;
      }
      
      const response = await fetch(API_ENDPOINTS.WEBSITE.AUTH.VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid OTP");
      }

      // Store auth token
      if (data.token) {
        setAuthToken(data.token);
        
        // Store user data if available
        if (data.user) {
          localStorage.setItem("website_user", JSON.stringify(data.user));
        }
        
        setSuccess(data.message || "Login successful! Redirecting...");
        
        // Close modal and redirect
        setShowOtpModal(false);
        setTimeout(() => {
          router.push("/website");
        }, 1000);
      }
      
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Backend expects 'mobile' or 'email' field, not 'identifier'
      const requestBody: any = {
        sessionId,
      };
      
      if (identifierType === "mobile") {
        requestBody.mobile = identifier;
      } else {
        requestBody.email = identifier;
      }
      
      const response = await fetch(API_ENDPOINTS.WEBSITE.AUTH.RESEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      // Update session ID if backend returns a new one
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setSuccess(data.message || "OTP resent successfully!");
      
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <div className="bg-white p-4 p-md-5 rounded shadow">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2">Welcome Back</h2>
              <p className="text-muted">Login to continue shopping</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" dismissible onClose={() => setSuccess("")}>
                {success}
              </Alert>
            )}

            {/* Tab Navigation */}
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k as LoginMethod)}
            >
              <Nav variant="pills" className="mb-4 justify-content-center">
                <Nav.Item>
                  <Nav.Link eventKey="phone" className="px-4">
                    Phone Number
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="email" className="px-4">
                    Email Address
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                {/* Phone Login Tab */}
                <Tab.Pane eventKey="phone">
                  <div className="text-center">
                    <p className="mb-3">Login with your phone number</p>
                    <button
                      className="btn btn-dark w-100"
                      onClick={() => setShowPhoneModal(true)}
                    >
                      Continue with Phone
                    </button>
                  </div>
                </Tab.Pane>

                {/* Email Login Tab */}
                <Tab.Pane eventKey="email">
                  <div className="text-center">
                    <p className="mb-3">Login with your email address</p>
                    <button
                      className="btn btn-dark w-100"
                      onClick={() => setShowEmailModal(true)}
                    >
                      Continue with Email
                    </button>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-muted">
                By continuing, you agree to our{" "}
                <a href="/terms" className="text-decoration-none">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-decoration-none">
                  Privacy Policy
                </a>
              </small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Modals */}
      <MobileLoginPopup
        show={showPhoneModal}
        onHide={() => setShowPhoneModal(false)}
        onOtpRequested={handlePhoneOtpRequest}
        loading={loading}
      />

      <EmailLoginPopup
        show={showEmailModal}
        onHide={() => setShowEmailModal(false)}
        onOtpRequested={handleEmailOtpRequest}
        loading={loading}
      />

      <OtpPopup
        show={showOtpModal}
        onHide={() => setShowOtpModal(false)}
        onConfirm={handleOtpVerification}
        onResend={handleResendOtp}
        identifier={identifier}
        loading={loading}
      />
    </Container>
  );
}