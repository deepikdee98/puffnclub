"use client";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container className="py-5">
      {/* Hero Section */}
      <Row className="mb-5">
        <Col lg={12} className="mx-auto text-center">
          <h1 className="display-4 fw-bold mb-4">About ShopEase</h1>
          <p className="lead text-muted">
            Your trusted partner in online shopping since 2020. We're committed
            to bringing you the best products at unbeatable prices with
            exceptional customer service.
          </p>
        </Col>
      </Row>

      {/* Mission & Vision */}
      <Row className="mb-5">
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-3 p-md-5">
              <h3 className="fw-bold mb-3">Our Mission</h3>
              <p className="text-muted">
                To provide customers with an exceptional online shopping
                experience by offering high-quality products, competitive
                prices, and outstanding customer service. We strive to make
                shopping convenient, enjoyable, and accessible to everyone.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <h3 className="fw-bold mb-3">Our Vision</h3>
              <p className="text-muted">
                To become the leading e-commerce platform that connects
                customers with the products they love while supporting local and
                global businesses. We envision a future where online shopping is
                sustainable, ethical, and beneficial for all.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Our Story */}
      <Row className="mb-5">
        <Col lg={10} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3 p-md-5">
              <h2 className="fw-bold mb-4 text-center">Our Story</h2>
              <p className="text-muted mb-4">
                ShopEase was founded in 2020 with a simple idea: make online
                shopping easier, faster, and more enjoyable for everyone. What
                started as a small team of passionate entrepreneurs has grown
                into a thriving e-commerce platform serving thousands of
                customers worldwide.
              </p>
              <p className="text-muted mb-4">
                Our journey began when our founders noticed the challenges
                customers faced while shopping online - from finding quality
                products to dealing with poor customer service. They set out to
                create a platform that would solve these problems and provide a
                seamless shopping experience.
              </p>
              <p className="text-muted">
                Today, we're proud to offer over 10,000 products from trusted
                brands and independent sellers, with a focus on quality,
                affordability, and customer satisfaction. Our commitment to
                excellence has earned us the trust of customers across the
                globe.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Values */}
      <Row className="mb-5">
        <Col lg={12}>
          <h2 className="fw-bold text-center mb-5">Our Values</h2>
          <Row>
            <Col md={3} className="mb-4">
              <div className="text-center">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-shield-check fs-3"></i>
                </div>
                <h5 className="fw-bold">Trust</h5>
                <p className="text-muted small">
                  We build trust through transparency, reliability, and
                  consistent delivery of our promises.
                </p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="text-center">
                <div
                  className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-heart fs-3"></i>
                </div>
                <h5 className="fw-bold">Customer First</h5>
                <p className="text-muted small">
                  Every decision we make is centered around providing the best
                  experience for our customers.
                </p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="text-center">
                <div
                  className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-lightbulb fs-3"></i>
                </div>
                <h5 className="fw-bold">Innovation</h5>
                <p className="text-muted small">
                  We continuously innovate to improve our platform and shopping
                  experience.
                </p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="text-center">
                <div
                  className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-globe fs-3"></i>
                </div>
                <h5 className="fw-bold">Sustainability</h5>
                <p className="text-muted small">
                  We're committed to sustainable practices and supporting
                  eco-friendly products.
                </p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Team Section */}
      <Row>
        <Col lg={12}>
          <h2 className="fw-bold text-center mb-5">Meet Our Team</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div
                    className="bg-secondary rounded-circle mx-auto mb-3"
                    style={{ width: "100px", height: "100px" }}
                  ></div>
                  <h5 className="fw-bold">Sarah Johnson</h5>
                  <p className="text-primary mb-2">CEO & Founder</p>
                  <p className="text-muted small">
                    With 15 years of e-commerce experience, Sarah leads our
                    vision for customer-centric innovation.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div
                    className="bg-secondary rounded-circle mx-auto mb-3"
                    style={{ width: "100px", height: "100px" }}
                  ></div>
                  <h5 className="fw-bold">Michael Chen</h5>
                  <p className="text-primary mb-2">CTO</p>
                  <p className="text-muted small">
                    Michael ensures our platform runs smoothly with cutting-edge
                    technology and security.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div
                    className="bg-secondary rounded-circle mx-auto mb-3"
                    style={{ width: "100px", height: "100px" }}
                  ></div>
                  <h5 className="fw-bold">Emily Rodriguez</h5>
                  <p className="text-primary mb-2">
                    Head of Customer Experience
                  </p>
                  <p className="text-muted small">
                    Emily leads our customer service team to ensure every
                    interaction exceeds expectations.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
