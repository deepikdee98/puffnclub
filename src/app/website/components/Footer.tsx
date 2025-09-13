"use client";

import { Container, Row, Col } from "react-bootstrap";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <Container>
        <Row>
          {/* Company Info */}
          <Col md={3} className="mb-4">
            <h5 className="fw-bold mb-3">PUFFN CLUB</h5>
            <p className="text-white fw-light small">
              Your trusted online shopping destination for fashion, electronics,
              and lifestyle products.
            </p>
            <div className="d-flex gap-3">
              <Link href="#" className="text-white fw-light">
                <FiFacebook size={20} />
              </Link>
              <Link href="#" className="text-white fw-light">
                <FiTwitter size={20} />
              </Link>
              <Link href="#" className="text-white fw-light">
                <FiInstagram size={20} />
              </Link>
              <Link href="#" className="text-white fw-light">
                <FiYoutube size={20} />
              </Link>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2} className="mb-4">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  href="/"
                  className="text-white fw-light text-decoration-none small"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/products"
                  className="text-white fw-light text-decoration-none small"
                >
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/aboutus"
                  className="text-white fw-light text-decoration-none small"
                >
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/contactus"
                  className="text-white fw-light text-decoration-none small"
                >
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/faq"
                  className="text-white fw-light text-decoration-none small"
                >
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/privacy"
                  className="text-white fw-light text-decoration-none small"
                >
                  Privacy
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/terms-of-services"
                  className="text-white fw-light text-decoration-none small"
                >
                  Terms of Services
                </Link>
              </li>
            </ul>
          </Col>

          {/* Categories */}
          <Col md={2} className="mb-4">
            <h6 className="fw-bold mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  href="/website/products?category=T-Shirt"
                  className="text-white fw-light text-decoration-none small"
                >
                  Regular Tshirts
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/products?category=Over_Size"
                  className="text-white fw-light text-decoration-none small"
                >
                  Over Sized Tshirts
                </Link>
              </li>
            </ul>
          </Col>

          {/* Customer Service */}
          <Col md={2} className="mb-4">
            <h6 className="fw-bold mb-3">Customer Service</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  href="/website/help"
                  className="text-white fw-light text-decoration-none small"
                >
                  Help Center
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/faq#returns"
                  className="text-white fw-light text-decoration-none small"
                >
                  Returns
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/shipping"
                  className="text-white fw-light text-decoration-none small"
                >
                  Shipping Info
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/website/orders"
                  className="text-white fw-light text-decoration-none small"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={3} className="mb-4">
            <h6 className="fw-bold mb-3">Contact Info</h6>
            <p className="text-white fw-light small mb-2">
              📧 support@store.com
            </p>
            <p className="text-white fw-light small mb-2">
              📞 +1 (555) 123-4567
            </p>
            <p className="text-white fw-light small mb-2">
              📍 123 Shopping Street, City, State 12345
            </p>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-white small mb-0">
              © 2024 STORE. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <Link
              href="/website/privacy"
              className="text-white text-decoration-none small me-3"
            >
              Privacy Policy
            </Link>
            <Link
              href="/website/terms"
              className="text-white text-decoration-none small"
            >
              Terms of Service
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
