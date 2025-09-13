"use client";

import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import {
  FiArrowRight,
  FiSettings,
  FiTrendingUp,
  FiShoppingBag,
  FiMail,
  FiLock,
} from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.scss";

export default function AdminHomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <Container fluid className={styles.adminHomePage}>
      <Row className="min-vh-100">
        {/* Left Section - Admin Panel Info */}
        <Col
          lg={7}
          className={`${styles.leftSection} d-flex align-items-center`}
        >
          <div className={styles.contentWrapper}>
            <div className={styles.heroSection}>
              <h1 className={styles.heroTitle}>E-commerce Admin Panel</h1>
              <p className={styles.heroSubtitle}>
                Comprehensive management system for your online store. Manage
                products, orders, customers, and analytics all in one place.
              </p>

              <div className={styles.featureCards}>
                <Row>
                  <Col md={6} className="mb-4">
                    <Card className={`${styles.featureCard} h-100`}>
                      <Card.Body className="text-center">
                        <div className={styles.featureIcon}>
                          <FiTrendingUp size={32} />
                        </div>
                        <Card.Title className="h6">
                          Dashboard Analytics
                        </Card.Title>
                        <Card.Text className="small">
                          Real-time insights into your business performance.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} className="mb-4">
                    <Card className={`${styles.featureCard} h-100`}>
                      <Card.Body className="text-center">
                        <div className={styles.featureIcon}>
                          <FiShoppingBag size={32} />
                        </div>
                        <Card.Title className="h6">
                          Product Management
                        </Card.Title>
                        <Card.Text className="small">
                          Complete product catalog management.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} className="mb-4">
                    <Card className={`${styles.featureCard} h-100`}>
                      <Card.Body className="text-center">
                        <div className={styles.featureIcon}>
                          <FiSettings size={32} />
                        </div>
                        <Card.Title className="h6">Order Processing</Card.Title>
                        <Card.Text className="small">
                          Streamlined order management system.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} className="mb-4">
                    <Card className={`${styles.featureCard} h-100`}>
                      <Card.Body className="text-center">
                        <div className={styles.featureIcon}>
                          <FiArrowRight size={32} />
                        </div>
                        <Card.Title className="h6">Easy Navigation</Card.Title>
                        <Card.Text className="small">
                          Intuitive interface for efficient workflow.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>

        {/* Right Section - Login Form */}
        <Col
          lg={5}
          className={`${styles.rightSection} d-flex align-items-center justify-content-center`}
        >
          <div className={styles.loginWrapper}>
            <Card className={styles.loginCard}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className={styles.loginTitle}>Admin Login</h2>
                  <p className={styles.loginSubtitle}>
                    Sign in to access your admin dashboard
                  </p>
                </div>

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>
                      <FiMail className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.formControl}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className={styles.formLabel}>
                      <FiLock className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={styles.formControl}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      label="Remember me"
                      className={styles.checkboxCustom}
                    />
                    <Link
                      href="/admin/forgot-password"
                      className={styles.forgotLink}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className={`${styles.loginButton} w-100`}
                  >
                    Sign In
                    <FiArrowRight className="ms-2" />
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className={styles.helpText}>
                    Need help?{" "}
                    <Link href="/admin/support" className={styles.helpLink}>
                      Contact Support
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
