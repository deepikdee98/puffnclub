"use client";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";

const TermsOfService = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={12} className="mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">Terms of Service</h1>
            <p className="lead text-muted">Last updated: January 1, 2024</p>
          </div>

          <Alert variant="info" className="mb-4">
            <Alert.Heading className="h6">Important Notice</Alert.Heading>
            Please read these Terms of Service carefully before using our
            website. By accessing or using ShopEase, you agree to be bound by
            these terms.
          </Alert>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3 p-md-5">
              <section className="mb-5">
                <h3 className="fw-bold mb-3">1. Acceptance of Terms</h3>
                <p className="text-muted">
                  By accessing and using ShopEase ("we," "our," or "us"), you
                  accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">2. Description of Service</h3>
                <p className="text-muted mb-3">
                  ShopEase is an e-commerce platform that allows users to:
                </p>
                <ul className="text-muted">
                  <li>Browse and purchase products from our catalog</li>
                  <li>Create user accounts and manage orders</li>
                  <li>Leave product reviews and ratings</li>
                  <li>Access customer support services</li>
                  <li>Receive promotional communications (with consent)</li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">3. User Accounts</h3>
                <h6 className="fw-bold mb-2">Account Creation</h6>
                <p className="text-muted mb-3">
                  To make purchases, you must create an account with accurate
                  and complete information. You are responsible for maintaining
                  the confidentiality of your account credentials.
                </p>

                <h6 className="fw-bold mb-2">Account Responsibilities</h6>
                <ul className="text-muted mb-3">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information as needed</li>
                  <li>Protect your password and account security</li>
                  <li>Notify us immediately of unauthorized use</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">4. Orders and Payment</h3>
                <h6 className="fw-bold mb-2">Order Acceptance</h6>
                <p className="text-muted mb-3">
                  All orders are subject to acceptance and availability. We
                  reserve the right to refuse or cancel orders at our
                  discretion, including but not limited to:
                </p>
                <ul className="text-muted mb-3">
                  <li>Product unavailability</li>
                  <li>Pricing errors</li>
                  <li>Suspected fraudulent activity</li>
                  <li>Violation of these terms</li>
                </ul>

                <h6 className="fw-bold mb-2">Pricing and Payment</h6>
                <ul className="text-muted">
                  <li>
                    All prices are in USD and subject to change without notice
                  </li>
                  <li>Payment is due at the time of order placement</li>
                  <li>
                    We accept major credit cards and other specified payment
                    methods
                  </li>
                  <li>
                    You authorize us to charge your payment method for all fees
                  </li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">5. Shipping and Delivery</h3>
                <p className="text-muted mb-3">
                  We will make every effort to deliver products within the
                  estimated timeframes, but delivery dates are not guaranteed.
                  Risk of loss and title pass to you upon delivery to the
                  shipping carrier.
                </p>
                <ul className="text-muted">
                  <li>Shipping costs are calculated at checkout</li>
                  <li>International orders may be subject to customs duties</li>
                  <li>
                    Delivery times may vary based on location and shipping
                    method
                  </li>
                  <li>
                    We are not responsible for shipping delays beyond our
                    control
                  </li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">6. Returns and Refunds</h3>
                <p className="text-muted mb-3">
                  We want you to be satisfied with your purchase. Our return
                  policy includes:
                </p>
                <ul className="text-muted">
                  <li>30-day return window from delivery date</li>
                  <li>Items must be in original condition and packaging</li>
                  <li>
                    Some items may not be eligible for return (perishables,
                    personalized items)
                  </li>
                  <li>Return shipping costs may apply</li>
                  <li>Refunds processed within 5-10 business days</li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">7. User Conduct</h3>
                <p className="text-muted mb-3">You agree not to:</p>
                <ul className="text-muted">
                  <li>Use our service for any unlawful purpose</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful or malicious code</li>
                  <li>Interfere with the proper functioning of our website</li>
                  <li>Impersonate others or provide false information</li>
                  <li>Engage in fraudulent activities</li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">8. Intellectual Property</h3>
                <p className="text-muted">
                  The content on ShopEase, including but not limited to text,
                  graphics, logos, images, and software, is protected by
                  copyright, trademark, and other intellectual property laws.
                  You may not reproduce, distribute, or create derivative works
                  without our express written permission.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">9. Privacy</h3>
                <p className="text-muted">
                  Your privacy is important to us. Please review our Privacy
                  Policy, which also governs your use of our services, to
                  understand our practices regarding the collection and use of
                  your personal information.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">10. Disclaimers</h3>
                <div className="bg-warning bg-opacity-10 p-3 rounded mb-3">
                  <p className="text-muted mb-0">
                    <strong>
                      OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF
                      ANY KIND.
                    </strong>
                    We disclaim all warranties, express or implied, including
                    but not limited to warranties of merchantability, fitness
                    for a particular purpose, and non-infringement.
                  </p>
                </div>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">11. Limitation of Liability</h3>
                <p className="text-muted">
                  In no event shall ShopEase be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including but not limited to loss of profits, data, or
                  business interruption, arising out of your use of our
                  services.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">12. Indemnification</h3>
                <p className="text-muted">
                  You agree to indemnify and hold harmless ShopEase and its
                  affiliates from any claims, damages, or expenses arising from
                  your use of our services or violation of these terms.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">13. Termination</h3>
                <p className="text-muted">
                  We may terminate or suspend your account and access to our
                  services at any time, with or without notice, for conduct that
                  we believe violates these terms or is harmful to other users
                  or our business interests.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">14. Governing Law</h3>
                <p className="text-muted">
                  These terms shall be governed by and construed in accordance
                  with the laws of [Your State/Country], without regard to its
                  conflict of law provisions. Any disputes shall be resolved in
                  the courts of [Your Jurisdiction].
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold mb-3">15. Changes to Terms</h3>
                <p className="text-muted">
                  We reserve the right to modify these terms at any time.
                  Changes will be effective upon posting to our website. Your
                  continued use of our services after changes are posted
                  constitutes acceptance of the modified terms.
                </p>
              </section>

              <div className="bg-light p-4 rounded">
                <h5 className="fw-bold mb-3">Contact Information</h5>
                <p className="text-muted mb-2">
                  If you have questions about these Terms of Service, please
                  contact us:
                </p>
                <ul className="list-unstyled text-muted mb-0">
                  <li>
                    <strong>Email:</strong> legal@shopease.com
                  </li>
                  <li>
                    <strong>Phone:</strong> 1-800-SHOPEASE
                  </li>
                  <li>
                    <strong>Address:</strong> 123 Commerce Street, Suite 100,
                    Business City, BC 12345
                  </li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TermsOfService;
