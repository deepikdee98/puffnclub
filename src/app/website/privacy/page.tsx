"use client";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";

const PrivacyPolicy = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={12} className="mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3">Privacy Policy</h1>
            <p className="lead text-muted">Last updated: January 1, 2024</p>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3 p-md-5">
              <div className="mb-4">
                <p className="text-muted">
                  At ShopEase, we take your privacy seriously. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard
                  your information when you visit our website and use our
                  services.
                </p>
              </div>

              <Accordion defaultActiveKey="0" className="mb-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <strong>1. Information We Collect</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <h6 className="fw-bold mb-3">Personal Information</h6>
                    <ul className="text-muted mb-3">
                      <li>Name, email address, phone number</li>
                      <li>Billing and shipping addresses</li>
                      <li>
                        Payment information (processed securely by our payment
                        partners)
                      </li>
                      <li>Account preferences and settings</li>
                    </ul>

                    <h6 className="fw-bold mb-3">
                      Automatically Collected Information
                    </h6>
                    <ul className="text-muted">
                      <li>IP address and browser information</li>
                      <li>Device information and operating system</li>
                      <li>Usage data and website interactions</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <strong>2. How We Use Your Information</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted mb-3">
                      We use the information we collect to:
                    </p>
                    <ul className="text-muted">
                      <li>Process and fulfill your orders</li>
                      <li>Provide customer support and respond to inquiries</li>
                      <li>Send order confirmations and shipping updates</li>
                      <li>Improve our website and services</li>
                      <li>Personalize your shopping experience</li>
                      <li>Send marketing communications (with your consent)</li>
                      <li>Prevent fraud and ensure security</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <strong>3. Information Sharing and Disclosure</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted mb-3">
                      We may share your information in the following
                      circumstances:
                    </p>
                    <ul className="text-muted">
                      <li>
                        <strong>Service Providers:</strong> With trusted
                        third-party vendors who help us operate our business
                      </li>
                      <li>
                        <strong>Payment Processing:</strong> With secure payment
                        processors to handle transactions
                      </li>
                      <li>
                        <strong>Shipping Partners:</strong> With delivery
                        companies to fulfill your orders
                      </li>
                      <li>
                        <strong>Legal Requirements:</strong> When required by
                        law or to protect our rights
                      </li>
                      <li>
                        <strong>Business Transfers:</strong> In case of merger,
                        acquisition, or sale of assets
                      </li>
                    </ul>
                    <p className="text-muted mt-3">
                      <strong>
                        We never sell your personal information to third parties
                        for marketing purposes.
                      </strong>
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <strong>4. Data Security</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted mb-3">
                      We implement appropriate security measures to protect your
                      information:
                    </p>
                    <ul className="text-muted">
                      <li>SSL encryption for data transmission</li>
                      <li>Secure servers and data centers</li>
                      <li>Regular security audits and monitoring</li>
                      <li>Access controls and employee training</li>
                      <li>PCI DSS compliance for payment processing</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    <strong>5. Your Rights and Choices</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted mb-3">
                      You have the following rights regarding your personal
                      information:
                    </p>
                    <ul className="text-muted">
                      <li>
                        <strong>Access:</strong> Request a copy of your personal
                        data
                      </li>
                      <li>
                        <strong>Update:</strong> Correct or update your
                        information
                      </li>
                      <li>
                        <strong>Delete:</strong> Request deletion of your
                        account and data
                      </li>
                      <li>
                        <strong>Opt-out:</strong> Unsubscribe from marketing
                        communications
                      </li>
                      <li>
                        <strong>Portability:</strong> Export your data in a
                        portable format
                      </li>
                      <li>
                        <strong>Restrict:</strong> Limit how we process your
                        information
                      </li>
                    </ul>
                    <p className="text-muted mt-3">
                      To exercise these rights, please contact us at
                      privacy@shopease.com
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                  <Accordion.Header>
                    <strong>6. Cookies and Tracking</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted mb-3">
                      We use cookies and similar technologies to:
                    </p>
                    <ul className="text-muted mb-3">
                      <li>Remember your preferences and login information</li>
                      <li>Analyze website traffic and usage patterns</li>
                      <li>Provide personalized content and recommendations</li>
                      <li>Enable social media features and advertising</li>
                    </ul>
                    <p className="text-muted">
                      You can manage cookie preferences through your browser
                      settings or our cookie consent tool.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="6">
                  <Accordion.Header>
                    <strong>7. Children's Privacy</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted">
                      Our services are not intended for children under 13 years
                      of age. We do not knowingly collect personal information
                      from children under 13. If we become aware that we have
                      collected personal information from a child under 13, we
                      will take steps to delete such information.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="7">
                  <Accordion.Header>
                    <strong>8. International Data Transfers</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted">
                      Your information may be transferred to and processed in
                      countries other than your country of residence. We ensure
                      appropriate safeguards are in place to protect your
                      personal information in accordance with applicable data
                      protection laws.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="8">
                  <Accordion.Header>
                    <strong>9. Changes to This Privacy Policy</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted">
                      We may update this Privacy Policy from time to time. We
                      will notify you of any material changes by posting the new
                      Privacy Policy on our website and updating the "Last
                      updated" date. Your continued use of our services after
                      any changes constitutes acceptance of the updated policy.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <div className="bg-light p-4 rounded">
                <h5 className="fw-bold mb-3">Contact Us</h5>
                <p className="text-muted mb-2">
                  If you have any questions about this Privacy Policy, please
                  contact us:
                </p>
                <ul className="list-unstyled text-muted">
                  <li>
                    <strong>Email:</strong> privacy@shopease.com
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

export default PrivacyPolicy;
