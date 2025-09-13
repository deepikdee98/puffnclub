"use client";

import { useState, useEffect } from "react";
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
import { LoadingSpinner } from "@/app/components";
import { productService, Product } from "./services/productService";
import { bannerService, Banner } from "./services/bannerService";
import { contactService } from "./services/contactService";
import { apiRequest, API_ENDPOINTS } from "./services/api";
import { useWishlist } from "./contexts/WishlistContext";
import { normalizeProductData } from "./utils/productUtils";
import { toast } from "react-toastify";
import {
  FlipXOnScroll,
  FlipYOnScroll,
  ZoomInOnScroll,
} from "./constants/FadeUpOnScroll";

// Categories loaded from API
type CategoryItem = { _id: string; name: string; slug: string; image?: string };

export default function HomePage() {
  const { addToWishlist } = useWishlist();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadFeaturedProducts(),
      loadBanners(),
      loadCategories(),
    ]);
  };

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await apiRequest<CategoryItem[]>(
        API_ENDPOINTS.WEBSITE.CATEGORIES_DROPDOWN
      );
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getFeaturedProducts(4);
      // Normalize product data to ensure arrays are always defined
      const normalizedProducts = response.products.map(normalizeProductData);
      setFeaturedProducts(normalizedProducts);
    } catch (error) {
      console.error("Error loading featured products:", error);
      toast.error("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  const loadBanners = async () => {
    try {
      setBannersLoading(true);
      // Using API data instead of mock data
      const response = await bannerService.getBanners();
      setBanners(response.banners);
      console.log("🎯 Website: Successfully loaded banners from API");
    } catch (error) {
      console.error("❌ Error loading banners from API:", error);
      toast.error("Failed to load banners");
    } finally {
      setBannersLoading(false);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      await addToWishlist({ productId });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleSubscribeNewsletter = async (email: string) => {
    try {
      await contactService.subscribeNewsletter({ email });
      toast.success("Successfully subscribed to newsletter!");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Failed to subscribe to newsletter");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const renderStars = (rating: number = 4.5) => {
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
      {bannersLoading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "500px" }}
        >
          <LoadingSpinner />
        </div>
      ) : banners.length > 0 ? (
        <Carousel className="hero-carousel" indicators={false}>
          {banners.map((banner) => (
            <Carousel.Item key={banner._id}>
              <div
                className="hero-slide d-flex align-items-center justify-content-center text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "500px",
                }}
              >
                <Container>
                  <Row className="justify-content-center text-center">
                    <Col lg={8}>
                      <h1 className="display-4 fw-bold mb-3">{banner.title}</h1>
                      <p className="lead mb-4">{banner.subtitle}</p>
                      {banner.buttonText && (
                        <Button
                          as="a"
                          href={banner.buttonLink}
                          variant="light"
                          size="lg"
                          className="px-4 py-2"
                        >
                          {banner.buttonText} <FiArrowRight className="ms-2" />
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Container>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div
          className="hero-slide d-flex align-items-center justify-content-center text-white bg-dark"
          style={{ height: "500px" }}
        >
          <Container>
            <Row className="justify-content-center text-center">
              <Col lg={8}>
                <h1 className="display-4 fw-bold mb-3">Welcome to PuffnClub</h1>
                <p className="lead mb-4">
                  Discover the latest trends in fashion
                </p>
                <Button
                  as="a"
                  href="/website/products"
                  variant="light"
                  size="lg"
                  className="px-4 py-2"
                >
                  Shop Now <FiArrowRight className="ms-2" />
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      )}

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
        <Row className="justify-content-center">
          {categoriesLoading ? (
            <Col className="text-center">
              <LoadingSpinner />
            </Col>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <Col lg={5} md={6} key={category._id} className="mb-4">
                <ZoomInOnScroll>
                  <Card className="border-0 shadow-sm h-100 category-card">
                    <div className="position-relative overflow-hidden">
                      <Card.Img
                        variant="top"
                        src={category.image || "/default-image.png"}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <div className="category-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <Button
                          as="a"
                          href={`/website/products?category=${encodeURIComponent(
                            category.name
                          )}`}
                          variant="light"
                          className="fw-bold"
                        >
                          Shop Now
                        </Button>
                      </div>
                    </div>
                    <Card.Body className="text-center">
                      <Card.Title className="fw-bold">
                        {category.name}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </ZoomInOnScroll>
              </Col>
            ))
          ) : (
            <Col className="text-center text-muted">
              No categories available
            </Col>
          )}
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
        {loading ? (
          <Row>
            <Col className="text-center">
              <LoadingSpinner />
            </Col>
          </Row>
        ) : featuredProducts.length === 0 ? (
          <Row>
            <Col className="text-center py-5">
              <FiShoppingBag size={60} className="text-muted mb-3" />
              <h5 className="text-muted">No Featured Products Available</h5>
              <p className="text-muted mb-4">
                Check back later for new arrivals
              </p>
              <Button variant="dark" as="a" href="/website/products">
                Browse All Products
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>
            {featuredProducts.map((product) => (
              <Col lg={3} md={6} key={product._id} className="mb-4">
                <FlipYOnScroll>
                  <Card className="border-0 shadow-sm h-100 product-card">
                    <Button
                      as="a"
                      href={`/website/products/${product._id}`}
                      size="sm"
                      className="bg-white border-white"
                    >
                      <div className="position-relative">
                        <Card.Img
                          className="object-fit-cover"
                          variant="top"
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/300x300"
                          }
                        />
                        {product.tags?.length > 0 && (
                          <Badge
                            bg={
                              product.tags.includes("Sale")
                                ? "danger"
                                : product.tags.includes("New Arrival")
                                ? "success"
                                : "primary"
                            }
                            className="position-absolute top-0 start-0 m-2"
                          >
                            {product.tags[0]}
                          </Badge>
                        )}
                        <div className="product-actions position-absolute top-0 end-0 m-2">
                          <Button
                            variant="light"
                            size="sm"
                            className="rounded-circle me-1"
                            onClick={() => handleAddToWishlist(product._id)}
                          >
                            <FiHeart size={16} />
                          </Button>
                        </div>
                      </div>
                      <Card.Body>
                        <Card.Title className="h6 mb-2">
                          {product.name}
                        </Card.Title>
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-2">{renderStars()}</div>
                          <small className="text-muted">(4.5)</small>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <span className="fw-bold text-dark">
                              Rs. {product.price}
                            </span>
                            {product.comparePrice && (
                              <small className="text-muted text-decoration-line-through ms-2">
                                Rs. {product.comparePrice}
                              </small>
                            )}
                          </div>
                          <Button
                            as="a"
                            href={`/website/products/${product._id}`}
                            variant="dark"
                            size="sm"
                          >
                            <FiShoppingBag size={14} />
                          </Button>
                        </div>
                      </Card.Body>
                    </Button>
                  </Card>
                </FlipYOnScroll>
              </Col>
            ))}
          </Row>
        )}
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
      {/* <di className="bg-dark text-white py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={6}>
              <h3 className="fw-bold mb-3">Stay Updated</h3>
              <p className="mb-4">
                Subscribe to our newsletter for the latest updates and exclusive
                offers
              </p>
              <div className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  id="newsletter-email"
                />
                <Button
                  variant="light"
                  onClick={() => {
                    const emailInput = document.getElementById(
                      "newsletter-email"
                    ) as HTMLInputElement;
                    if (emailInput?.value) {
                      handleSubscribeNewsletter(emailInput.value);
                      emailInput.value = "";
                    }
                  }}
                >
                  Subscribe
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </di> */}
    </div>
  );
}
