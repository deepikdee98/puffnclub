"use client";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import "./PrivacyPolicy.scss";

const PrivacyPolicy = () => {
  return (
    <>
      <Container className="py-4">
        {/* Back Navigation */}
        <Row>
          <Col lg={10} className="mx-auto">
            <Link
              href="/website"
              className="back-link d-inline-flex align-items-center text-decoration-none mb-4"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="me-2"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-dark fw-semibold">Privacy Policy</span>
            </Link>
          </Col>
        </Row>

        {/* Main Content */}
        <Row>
          <Col lg={10} className="mx-auto">
            <div className="d-flex justify-content-end align-items-center mb-4">
              <span className="fw-semibold me-2">Effective Date:</span>
              <span className="text-muted">[Insert Date]</span>
            </div>

            <div className="mb-5">
              <p className="text-muted">
                At Puffin Club, your privacy is very important to us. This
                Privacy Policy explains how we collect, use, and protect your
                personal information when you visit our website{" "}
                <a
                  href="https://www.puffinclub.com"
                  className="text-success text-decoration-none"
                >
                  www.puffinclub.com
                </a>{" "}
                or make a purchase from us.
              </p>
            </div>

            {/* Information We Collect */}
            <section className="mb-4">
              <h5 className="fw-semibold mb-3">Information We Collect</h5>
              <p className="text-muted mb-2">
                Personal Information: Name, email address, phone number,
                shipping & billing address.
              </p>
              <p className="text-muted mb-2">
                Payment Information: Processed securely via third-party payment
                gateways.
              </p>
              <p className="text-muted mb-2">
                Account Information: Login details if you create an account.
              </p>
              <p className="text-muted">
                Website Usage Data: Cookies, IP address, browser type, site
                interactions.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-4">
              <h5 className="fw-semibold mb-3">How We Use Your Information</h5>
              <p className="text-muted mb-2">Process and fulfill orders.</p>
              <p className="text-muted mb-2">
                Communicate order updates and support inquiries.
              </p>
              <p className="text-muted mb-2">
                Improve our website, services, and user experience.
              </p>
              <p className="text-muted mb-2">
                Send promotional offers and updates (opt-out anytime).
              </p>
              <p className="text-muted">Comply with legal obligations.</p>
            </section>

            {/* Data Security */}
            <section className="mb-4">
              <h5 className="fw-semibold mb-3">Data Security</h5>
              <p className="text-muted mb-2">
                We implement industry-standard encryption, firewalls, and
                security measures to protect your personal data.
              </p>
              <p className="text-muted">
                However, no online transmission method is 100% secure.
              </p>
            </section>

            {/* Sharing Your Information */}
            <section className="mb-4">
              <h5 className="fw-semibold mb-3">Sharing Your Information</h5>
              <p className="text-muted mb-2">
                We respect your privacy and do not sell or rent your personal
                data. Your information may only be shared with:
              </p>
              <p className="text-muted mb-2">
                Shipping partners (for order delivery).
              </p>
              <p className="text-muted mb-2">
                Payment gateways (for secure transactions).
              </p>
              <p className="text-muted">
                Legal authorities (if required by law).
              </p>
            </section>

            {/* Cookies */}
            <section className="mb-4">
              <h5 className="fw-semibold mb-3">Cookies</h5>
              <p className="text-muted mb-2">
                Our website uses cookies to personalise your browsing
                experience, analyse traffic, and improve site performance.
              </p>
              <p className="text-muted">
                You can manage or disable cookies in your browser settings.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-4">
              <h5 className="fw-semibold mb-3">Your Rights</h5>
              <p className="text-muted mb-2">
                Access the personal information we hold about you.
              </p>
              <p className="text-muted mb-2">Request corrections or updates.</p>
              <p className="text-muted">
                Request deletion of your data, subject to legal obligations.
              </p>
            </section>

            {/* Contact Us */}
            <section className="mb-5">
              <h5 className="fw-semibold mb-3">Contact Us</h5>
              <div className="d-flex align-items-start mb-2">
                <Image
                  src="/images/mail-icon.svg"
                  alt="Email"
                  width={20}
                  height={20}
                  className="me-2 mt-1 flex-shrink-0"
                />
                <span className="text-muted">support@puffinclub.com</span>
              </div>
              <div className="d-flex align-items-start">
                <Image
                  src="/images/globe-icon.svg"
                  alt="Website"
                  width={20}
                  height={20}
                  className="me-2 mt-1 flex-shrink-0"
                />
                <span className="text-muted">www.puffinclub.com</span>
              </div>
            </section>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
