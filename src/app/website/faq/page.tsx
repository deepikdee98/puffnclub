"use client";
import {
  Container,
  Row,
  Col,
  Accordion,
  Card,
  InputGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useState } from "react";
import { LoadingSpinner } from "@/app/components";
import { FAQCategory } from "../services/faqService";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [faqData, setFaqData] = useState<FAQCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const staticFaqData = [
    {
      category: "Orders & Payment",
      questions: [
        {
          question: "How do I place an order?",
          answer:
            "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping information, and complete payment to finalize your order.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are processed securely through encrypted connections.",
        },
        {
          question: "Can I modify or cancel my order after placing it?",
          answer:
            "You can modify or cancel your order within 1 hour of placing it by contacting our customer service team. After this time, orders may have already been processed and shipped.",
        },
        {
          question: "How do I track my order?",
          answer:
            "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.",
        },
      ],
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          question: "How much does shipping cost?",
          answer:
            "Shipping costs vary based on your location, order value, and shipping method. Standard shipping is free on orders over $50. Express and overnight options are available for an additional fee.",
        },
        {
          question: "How long does delivery take?",
          answer:
            "Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days, and overnight delivery is available for next-day service. International orders may take 7-14 business days.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to over 100 countries worldwide. International shipping costs and delivery times vary by destination. Some restrictions may apply to certain products or countries.",
        },
        {
          question: "What if my package is lost or damaged?",
          answer:
            "If your package is lost or arrives damaged, please contact us immediately. We'll work with our shipping partners to investigate and provide a replacement or full refund.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy from the date of delivery. Items must be in original condition with tags attached. Some items like perishables, personalized products, and intimate apparel cannot be returned.",
        },
        {
          question: "How do I return an item?",
          answer:
            "To return an item, log into your account, go to order history, and select 'Return Item.' Print the prepaid return label and drop off the package at any authorized shipping location.",
        },
        {
          question: "When will I receive my refund?",
          answer:
            "Refunds are processed within 3-5 business days after we receive your returned item. The refund will be credited to your original payment method and may take an additional 3-7 business days to appear.",
        },
        {
          question: "Can I exchange an item for a different size or color?",
          answer:
            "Yes, we offer exchanges for different sizes or colors within 30 days. The exchange process is similar to returns - simply select 'Exchange' instead of 'Return' when processing your request.",
        },
      ],
    },
    {
      category: "Account & Privacy",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "Click 'Sign Up' at the top of any page and provide your email address, create a password, and fill in your basic information. You'll receive a confirmation email to verify your account.",
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer:
            "Click 'Forgot Password' on the sign-in page and enter your email address. We'll send you a link to reset your password. Follow the instructions in the email to create a new password.",
        },
        {
          question: "How do you protect my personal information?",
          answer:
            "We use industry-standard encryption and security measures to protect your data. We never sell your personal information to third parties. Please review our Privacy Policy for detailed information.",
        },
        {
          question: "Can I delete my account?",
          answer:
            "Yes, you can delete your account by contacting customer service or through your account settings. Note that this action is permanent and cannot be undone.",
        },
      ],
    },
    {
      category: "Products & Inventory",
      questions: [
        {
          question: "How do I know if an item is in stock?",
          answer:
            "Product availability is shown on each product page. If an item is out of stock, you can sign up for email notifications when it becomes available again.",
        },
        {
          question: "Do you restock sold-out items?",
          answer:
            "We regularly restock popular items, but availability depends on the manufacturer and seasonal factors. Sign up for restock notifications to be alerted when items become available.",
        },
        {
          question: "Can I get notified when a product goes on sale?",
          answer:
            "Yes! You can create a wishlist and enable sale notifications for items you're interested in. We'll email you when prices drop or items go on sale.",
        },
        {
          question: "Are your product photos accurate?",
          answer:
            "We strive to display accurate product photos and descriptions. However, colors may vary slightly due to monitor settings. If you're not satisfied with your purchase, our return policy applies.",
        },
      ],
    },
  ];

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-3">
        <Col lg={12} className="mx-auto text-center">
          <h1 className="display-4 fw-bold mb-4">Frequently Asked Questions</h1>
          <p className="lead text-muted">
            Find answers to common questions about ShopEase. Can't find what
            you're looking for? Contact our support team for personalized help.
          </p>
        </Col>
      </Row>

      {/* FAQ Sections */}
      <Row>
        <Col lg={10} className="mx-auto">
          {staticFaqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-5">
              <h3 className="fw-bold mb-4 text-primary">{category.category}</h3>
              <Accordion>
                {category.questions.map((item, index) => (
                  <Accordion.Item
                    key={index}
                    eventKey={`${categoryIndex}-${index}`}
                  >
                    <Accordion.Header>
                      <strong>{item.question}</strong>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className="text-muted mb-0">{item.answer}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          ))}
        </Col>
      </Row>

      {/* Contact Support */}
      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <Card className="border-0 bg-light">
            <Card.Body className="text-center p-5">
              <h4 className="fw-bold mb-3">Still need help?</h4>
              <p className="text-muted mb-4">
                Our customer support team is here to help you with any questions
                or concerns.
              </p>
              <Row>
                <Col md={4} className="mb-3">
                  <div className="text-center">
                    <i className="bi bi-envelope fs-3 text-primary mb-2"></i>
                    <h6 className="fw-bold">Email Support</h6>
                    <p className="text-muted small mb-2">
                      support@shopease.com
                    </p>
                    <small className="text-muted">
                      Response within 24 hours
                    </small>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="text-center">
                    <i className="bi bi-telephone fs-3 text-success mb-2"></i>
                    <h6 className="fw-bold">Phone Support</h6>
                    <p className="text-muted small mb-2">1-800-SHOPEASE</p>
                    <small className="text-muted">Mon-Fri 9AM-8PM EST</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default FAQ;
