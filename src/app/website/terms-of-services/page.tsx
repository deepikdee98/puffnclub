"use client";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import "./TermsOfService.scss";

const TermsOfService = () => {
  return (
    <Container className="py-4">
      {/* Back Navigation */}
      <Row>
        <Col lg={10} className="mx-auto">
          <Link
            href="/"
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
            <span>Terms and Condition</span>
          </Link>
        </Col>
      </Row>

      {/* Main Content - Terms and Condition Section */}
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="d-flex justify-content-end align-items-center mb-4">
            <span className="fw-semibold me-2">Effective Date:</span>
            <span className="text-muted">[Insert Date]</span>
          </div>

          <div className="mb-5">
            <p className="text-muted">
              Welcome to Puffin Club! By using our website{" "}
              <a
                href="https://puffinclub.com"
                className="text-success text-decoration-none"
              >
                www.puffinclub.com
              </a>
              , you agree to comply with the following terms and conditions:
            </p>
          </div>

          {/* Eligibility */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Eligibility</h5>
            <p className="text-muted">
              You must be at least 18 years old to use this website or make a
              purchase.
            </p>
          </section>

          {/* Account Responsibilities */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Account Responsibilities</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                You are responsible for maintaining the confidentiality of your
                account and password.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Puffin Club reserves the right to suspend or terminate accounts
                for misuse or fraudulent activity.
              </li>
            </ul>
          </section>

          {/* Orders and Payments */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Orders and Payments</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                All orders are subject to acceptance and availability.
                Fulfillment must be completed at checkout.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Puffin Club reserves the right to cancel any order due to
                pricing errors, stock issues, or suspected fraud.
              </li>
            </ul>
          </section>

          {/* Shipping and Delivery */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Shipping and Delivery</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                We aim to ship promptly, but delays may occur due to third-party
                couriers.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Puffin Club is not liable for lost or misplaced items once in
                the care of a shipping partner.
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Intellectual Property</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                All content on Puffin Club, including images, product designs,
                and descriptions, is our property.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                You may not copy or misuse our content without written
                permission.
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Limitation of Liability</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Puffin Club is not responsible for indirect, incidental, or
                consequential damages.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Our liability is limited to the value of the purchased product.
              </li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Prohibited Activities</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Using this website for unlawful purposes.
              </li>
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Engaging in fraudulent activity or misrepresentation.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Interfering with the website's security or functionality.
              </li>
            </ul>
          </section>

          {/* Governing Law */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Governing Law</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                These Terms are governed by the laws of [Your Jurisdiction].
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Disputes are resolved in the courts of that jurisdiction.
              </li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Changes to Terms</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Puffin Club may update these Terms at any time.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Continued use of the website constitutes acceptance of the
                updated terms.
              </li>
            </ul>
          </section>

          {/* Contact Us */}
          <section className="mb-5">
            <h5 className="fw-bold mb-3">Contact Us</h5>
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

      {/* Refund & Return Policy Section */}
      <Row>
        <Col lg={10} className="mx-auto">
          <hr className="my-5" />

          <div className="d-flex justify-content-end align-items-center mb-4">
            <span className="fw-semibold me-2">Effective Date:</span>
            <span className="text-muted">[Insert Date]</span>
          </div>

          <section className="mb-4">
            <h4 className="fw-bold mb-4">Refund & Return Policy</h4>
            <p className="text-muted mb-4">
              At Puffin Club, we want you to be satisfied with your purchases.
            </p>
            <p className="text-muted">
              Please review our return and refund terms:
            </p>
          </section>

          {/* Return Eligibility */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Return Eligibility</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Returns are accepted only for damaged or defective products.
              </li>
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>A mandatory
                unboxing video, along with clear visibility of the received item
                eligibility.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Items must be unused, unwashed, and in original packaging with
                all tags intact.
              </li>
            </ul>
          </section>

          {/* Exchange Policy */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Exchange Policy</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Exchanges are available only for size-related issues.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Defective or damaged items may be exchanged; instead of being
                subject to stock availability.
              </li>
            </ul>
          </section>

          {/* Non-Returnable Items */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Non-Returnable Items</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Products that are not damaged or defective, items without
                unboxing video proof.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Perishable goods or consumables, clearance or sale items, unless
                defective.
              </li>
            </ul>
          </section>

          {/* Refund Process */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Refund Process</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Contact{" "}
                <a
                  href="mailto:support@puffinclub.com"
                  className="text-success text-decoration-none"
                >
                  support@puffinclub.com
                </a>{" "}
                with your order detail and proof.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Refunds are processed within 7-10 business days after
                inspection.
              </li>
            </ul>
          </section>

          {/* Shipping Costs */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Shipping Costs</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                If we return shipping is free one it or not a side.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Customer pays for returns due to personal reasons.
              </li>
            </ul>
          </section>

          {/* Contact Us */}
          <section className="mb-5">
            <h5 className="fw-bold mb-3">Contact Us</h5>
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

      {/* Shipping Policy Section */}
      <Row>
        <Col lg={10} className="mx-auto">
          <hr className="my-5" />

          <div className="d-flex justify-content-end align-items-center mb-4">
            <span className="fw-semibold me-2">Effective Date:</span>
            <span className="text-muted">[Insert Date]</span>
          </div>

          <section className="mb-4">
            <h4 className="fw-bold mb-4">Shipping Policy</h4>
            <p className="text-muted">
              At Puffin Club, we aim to deliver your orders as quickly and
              securely.
            </p>
          </section>

          {/* Order Processing */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Order Processing</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Orders are processed within 3-7 business days, excluding
                weekends and holidays.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                You will receive a confirmation email with a shipping details
                when processed.
              </li>
            </ul>
          </section>

          {/* Delivery Time */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Delivery Time</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Standard Shipping: 5-7 business days.
              </li>
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Express Shipping: 3-5 business days.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Delivery times may vary due to location or courier services.
              </li>
            </ul>
          </section>

          {/* Shipping Charges */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Shipping Charges</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Calculated at checkout, free if shipping may apply for orders
                above a certain value.
              </li>
            </ul>
          </section>

          {/* Lost or Delayed Packages */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Lost or Delayed Packages</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Puffin Club is not liable for delays caused by couriers, weather
                disruptions, or unforeseen circumstances.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Contact{" "}
                <a
                  href="mailto:support@puffinclub.com"
                  className="text-success text-decoration-none"
                >
                  support@puffinclub.com
                </a>{" "}
                for lost or delayed orders.
              </li>
            </ul>
          </section>

          {/* International Shipping */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">International Shipping</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Currently, we only available for [mention countries/regions if
                applicable].
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Delivery times may vary due to customs and local postal
                services.
              </li>
            </ul>
          </section>

          {/* Address Accuracy */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Address Accuracy</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Please ensure shipping address is complete and correct to avoid
                delivery issues.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Puffin Club is not responsible for incorrect addressing leading
                to delivery failures.
              </li>
            </ul>
          </section>

          {/* Tracking Orders */}
          <section className="mb-4">
            <h5 className="fw-bold mb-3">Tracking Orders</h5>
            <ul className="list-unstyled ps-0 mb-0">
              <li className="text-muted mb-2 position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                You will receive a tracking number when your order ships.
              </li>
              <li className="text-muted position-relative ps-3">
                <span className="position-absolute start-0">•</span>
                Track your order via the courier's website for updates.
              </li>
            </ul>
          </section>

          {/* Contact Us */}
          <section className="mb-5">
            <h5 className="fw-bold mb-3">Contact Us</h5>
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
  );
};

export default TermsOfService;
