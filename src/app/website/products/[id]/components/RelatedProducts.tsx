"use client";

import { Row, Col, Card, Button } from "react-bootstrap";
import { FiStar } from "react-icons/fi";
import Link from "next/link";

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  formatCurrency: (amount: number) => string;
  renderStars: (rating: number) => React.ReactNode;
}

export default function RelatedProducts({
  products,
  formatCurrency,
  renderStars,
}: RelatedProductsProps) {
  return (
    <Row className="mt-5">
      <Col>
        {/* <h4 className="mb-4 text-dark fw-bold">You might also like</h4> */}
        <Row>
          {products.map((product) => (
            <Col lg={3} md={6} key={product.id} className="mb-4">
              <Card className="border-0 shadow-sm h-100 product-card">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="product-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0">
                    <Button variant="dark" size="sm">
                      Quick View
                    </Button>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="h6 mb-2">
                    <Link
                      href={`/website/products/${product.id}`}
                      className="text-decoration-none text-dark"
                    >
                      {product.name}
                    </Link>
                  </Card.Title>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-dark">
                      {formatCurrency(product.price)}
                    </span>
                    <div className="d-flex align-items-center">
                      {renderStars(product.rating)}
                      <span className="ms-1 small text-muted">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
