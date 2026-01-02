"use client";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Carousel,
} from "react-bootstrap";
import { FiArrowRight, FiStar, FiHeart, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";

// Mock data for homepage
const heroSlides = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends in fashion",
    buttonText: "Shop Now",
    buttonLink: "/website/products",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "New Arrivals",
    subtitle: "Fresh styles just landed",
    buttonText: "Explore",
    buttonLink: "/website/products?filter=new",
  },
];

const featuredProducts = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    comparePrice: 39.99,
    image:
      "https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.5,
    reviews: 128,
    badge: "Trending",
  },
  {
    id: "2",
    name: "Denim Jacket Classic",
    price: 89.99,
    comparePrice: 120.0,
    image:
      "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.8,
    reviews: 95,
    badge: "Sale",
  },
  {
    id: "3",
    name: "Summer Floral Dress",
    price: 65.99,
    image:
      "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.3,
    reviews: 67,
    badge: "New",
  },
  {
    id: "4",
    name: "Casual Sneakers",
    price: 79.99,
    comparePrice: 99.99,
    image:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.6,
    reviews: 203,
    badge: "Best Seller",
  },
];

const categories = [
  {
    id: 1,
    name: "Men's Fashion",
    image:
      "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
    link: "/website/products?category=T-Shirt",
  },
  {
    id: 2,
    name: "Women's Fashion",
    image:
      "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
    link: "/website/products?category=Over_Size",
  },
  {
    id: 3,
    name: "Kids Fashion",
    image:
      "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400",
    link: "/website/products?category=kids",
  },
  {
    id: 4,
    name: "Accessories",
    image:
      "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400",
    link: "/website/products?category=accessories",
  },
];

export default function HomePage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar
          key={i}
          className="text-warning"
          fill="currentColor"
          size={14}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(<FiStar key="half" className="text-warning" size={14} />);
    }

    return stars;
  };

  return (
    <div className="homepage">
      {/* Hero Carousel */}
      <Carousel className="hero-carousel" indicators={false}>
        {heroSlides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <div
              className="hero-slide d-flex align-items-center justify-content-center text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "500px",
              }}
            >
              <Container>
                <Row className="justify-content-center text-center">
                  <Col lg={8}>
                    <h1 className="display-4 fw-bold mb-3">{slide.title}</h1>
                    <p className="lead mb-4">{slide.subtitle}</p>
                    <Button
                      as="a"
                      href={slide.buttonLink}
                      variant="light"
                      size="lg"
                      className="px-4 py-2"
                    >
                      {slide.buttonText} <FiArrowRight className="ms-2" />
                    </Button>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Categories Section */}
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center fw-bold">Shop by Category</h2>
            <p className="text-center text-muted">
              Discover our wide range of products
            </p>
          </Col>
        </Row>
        <Row>
          {categories.map((category) => (
            <Col lg={3} md={6} key={category.id} className="mb-4">
              <Card className="border-0 shadow-sm h-100 category-card">
                <div className="position-relative overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={category.image}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="category-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <Button
                      as="a"
                      href={category.link}
                      variant="light"
                      className="fw-bold"
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="fw-bold">{category.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured Products */}
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center fw-bold">Featured Products</h2>
            <p className="text-center text-muted">
              Handpicked items just for you
            </p>
          </Col>
        </Row>
        <Row>
          {featuredProducts.map((product) => (
            <Col lg={3} md={6} key={product.id} className="mb-4">
              <Card className="border-0 shadow-sm h-100 product-card">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  {product.badge && (
                    <Badge
                      bg={
                        product.badge === "Sale"
                          ? "danger"
                          : product.badge === "New"
                          ? "success"
                          : "primary"
                      }
                      className="position-absolute top-0 start-0 m-2"
                    >
                      {product.badge}
                    </Badge>
                  )}
                  <div className="product-actions position-absolute top-0 end-0 m-2">
                    <Button
                      variant="light"
                      size="sm"
                      className="rounded-circle me-1"
                    >
                      <FiHeart size={16} />
                    </Button>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="h6 mb-2">{product.name}</Card.Title>
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-2">{renderStars(product.rating)}</div>
                    <small className="text-muted">({product.reviews})</small>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="fw-bold text-dark">
                        {formatCurrency(product.price)}
                      </span>
                      {product.comparePrice && (
                        <small className="text-muted text-decoration-line-through ms-2">
                          {formatCurrency(product.comparePrice)}
                        </small>
                      )}
                    </div>
                    <Button
                      as="a"
                      href={`/website/products/${product.id}`}
                      variant="dark"
                      size="sm"
                    >
                      <FiShoppingBag size={14} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row>
          <Col className="text-center">
            <Button
              as="a"
              href="/website/products"
              variant="outline-dark"
              size="lg"
            >
              View All Products <FiArrowRight className="ms-2" />
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Newsletter Section */}
      {/* <div className="bg-dark text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={6}>
              <h3 className="fw-bold mb-3">Stay Updated</h3>
              <p className="mb-4">Subscribe to our newsletter for the latest updates and exclusive offers</p>
              <div className="d-flex gap-2">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email"
                />
                <Button variant="light">Subscribe</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div> */}

      {/* Admin Access Link */}
      <div className="bg-light py-3">
        <Container>
          <Row>
            <Col className="text-center">
              <small className="text-muted">
                Store Management:
                <Link
                  href="/admin/dashboard"
                  className="ms-2 text-decoration-none"
                >
                  Access Admin Panel
                </Link>
              </small>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
