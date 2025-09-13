'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FiMail, FiPhone, FiMapPin, FiUser, FiMessageSquare } from 'react-icons/fi';
import { contactService, ContactFormData } from '../services/contactService';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactService.submitContactForm(formData);
      setSuccess(true);
      toast.success('Your message has been sent successfully!');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="bg-dark text-white py-5">
        <Container>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
            <p className="lead">We'd love to hear from you. Get in touch with us!</p>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          {/* Contact Information */}
          <Col lg={4} className="mb-5">
            <h3 className="mb-4">Get in Touch</h3>
            <p className="text-muted mb-4">
              Have a question, suggestion, or just want to say hello? We're here to help!
            </p>

            <div className="contact-info">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-wrapper bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px' }}>
                  <FiMapPin size={20} />
                </div>
                <div>
                  <h6 className="mb-1">Address</h6>
                  <p className="text-muted mb-0">123 Fashion Street, Style City, SC 12345</p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <div className="icon-wrapper bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px' }}>
                  <FiPhone size={20} />
                </div>
                <div>
                  <h6 className="mb-1">Phone</h6>
                  <p className="text-muted mb-0">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="icon-wrapper bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px' }}>
                  <FiMail size={20} />
                </div>
                <div>
                  <h6 className="mb-1">Email</h6>
                  <p className="text-muted mb-0">info@puffnclub.com</p>
                </div>
              </div>

              <div className="business-hours">
                <h6 className="mb-3">Business Hours</h6>
                <div className="text-muted">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Contact Form */}
          <Col lg={8}>
            <Card className="border-0 shadow-lg">
              <Card.Body className="p-4">
                <h3 className="mb-4">Send us a Message</h3>

                {success && (
                  <Alert variant="success" className="mb-4">
                    <strong>Thank you!</strong> Your message has been sent successfully. 
                    We'll get back to you within 24 hours.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name *</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                            className="ps-5"
                          />
                          <FiUser className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name *</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                            className="ps-5"
                          />
                          <FiUser className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="ps-5"
                          />
                          <FiMail className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className="ps-5"
                          />
                          <FiPhone className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Subject *</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                        required
                        className="ps-5"
                      />
                      <FiMessageSquare className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide details about your inquiry..."
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="dark"
                    size="lg"
                    className="px-4"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mt-5">
          <Col>
            <div className="text-center mb-4">
              <h3>Frequently Asked Questions</h3>
              <p className="text-muted">Quick answers to common questions</p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h5>What are your shipping policies?</h5>
                <p className="text-muted mb-0">
                  We offer free shipping on orders over $50. Standard shipping takes 3-5 business days,
                  and express shipping is available for 1-2 day delivery.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h5>What is your return policy?</h5>
                <p className="text-muted mb-0">
                  We accept returns within 30 days of purchase. Items must be unworn, unwashed,
                  and in original condition with tags attached.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h5>How can I track my order?</h5>
                <p className="text-muted mb-0">
                  Once your order ships, you'll receive a tracking number via email.
                  You can also track your orders in your account dashboard.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <h5>Do you offer international shipping?</h5>
                <p className="text-muted mb-0">
                  Currently, we only ship within the United States. We're working on
                  expanding to international shipping soon.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}