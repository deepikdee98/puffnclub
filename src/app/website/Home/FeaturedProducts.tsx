"use client";

import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { FiHeart, FiStar, FiShoppingBag } from "react-icons/fi";
import { LoadingSpinner } from "@/app/components";
import styles from "./style.module.scss";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  price: number;
  comparePrice?: number;
}

interface FeaturedProductsProps {
  loading: boolean;
  products: Product[];
  handleAddToWishlist: (productId: string) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  loading,
  products,
  handleAddToWishlist,
}) => {
  return (
    <div className={styles.featuredProductsContainer}>
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">OUR BEST PICKS FOR YOU</h2>
          <p className="text-center text-muted">
            Discover versatile staples and bold statement pieces designed
            <br />
            to elevate your style, season after season.
          </p>
        </Col>
      </Row>
      {loading ? (
        <Row>
          <Col className="text-center">
            <LoadingSpinner />
          </Col>
        </Row>
      ) : products.length === 0 ? (
        <Row>
          <Col className="text-center py-5">
            <FiShoppingBag size={60} className="text-muted mb-3" />
            <h5 className="text-muted">No Best Picks Available</h5>
            <p className="text-muted mb-4">
              Check back later for new arrivals.
            </p>
            <Button variant="dark" as="a" href="/website/products">
              Browse All Products
            </Button>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-center">
          {/* {products.slice(0, 3).map((product) => (
            <Col
              lg={4}
              md={6}
              xs={12}
              key={product._id}
              className="mb-4 d-flex flex-column align-items-center"
            >
              <div
                style={{
                  width: "100%",
                  position: "relative",
                  marginBottom: 12,
                }}
              >
                <img
                  src={
                    product.images?.[0] || "https://via.placeholder.com/300x300"
                  }
                  alt={product.name}
                  className={styles.productImage}
                />
                <button
                  type="button"
                  className={styles.wishlistBtn}
                  onClick={() => handleAddToWishlist(product._id)}
                  aria-label="Add to wishlist"
                >
                  <FiHeart size={20} />
                </button>
              </div>
              <div className="w-100 px-1">
                <div
                  className="d-flex align-items-center mb-1"
                  style={{ minHeight: "28px" }}
                >
                  <strong className="flex-grow-1">{product.name}</strong>
                  <span style={{ fontSize: 15, marginLeft: 8 }}>
                    {product.rating || 4.5}
                  </span>
                  <FiStar className="text-warning ms-1" size={15} />
                </div>
                <div>
                  <span className="fw-bold text-dark">₹ {product.price}</span>
                  {product.comparePrice && (
                    <span className="text-muted text-decoration-line-through ms-2">
                      ₹ {product.comparePrice}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          ))} */}
          {products.slice(0, 3).map((product) => (
            <Col
              lg={4}
              md={6}
              xs={12}
              key={product._id}
              className="mb-4 d-flex flex-column align-items-center"
            >
              <Link
                className="text-dark text-decoration-none"
                href={`/website/products/${product._id}`}
                passHref
              >
                <img
                  src={
                    product.images?.[0] || "https://via.placeholder.com/300x300"
                  }
                  alt={product.name}
                  className={styles.productImage}
                />
              </Link>

              <button
                type="button"
                className={styles.wishlistBtn}
                onClick={() => handleAddToWishlist(product._id)}
                aria-label="Add to wishlist"
              >
                <FiHeart size={20} />
              </button>

              <div className="w-100 px-1 mt-2">
                <Link
                  className="text-dark text-decoration-none"
                  href={`/website/products/${product._id}`}
                  passHref
                >
                  <div
                    className="d-flex align-items-center mb-1"
                    style={{ minHeight: "28px" }}
                  >
                    <strong className="flex-grow-1">{product.name}</strong>
                    {product.rating && product.rating > 0 ? (
                      <>
                        <span style={{ fontSize: 15, marginLeft: 8 }}>
                          {product.rating.toFixed(1)}
                        </span>
                        <FiStar className="text-warning ms-1" size={15} />
                        {product.reviewCount && product.reviewCount > 0 && (
                          <span
                            className="text-muted ms-1"
                            style={{ fontSize: 13 }}
                          >
                            ({product.reviewCount})
                          </span>
                        )}
                      </>
                    ) : (
                      <span
                        className="text-muted"
                        style={{ fontSize: 13, marginLeft: 8 }}
                      >
                        No reviews yet
                      </span>
                    )}
                  </div>
                </Link>

                <div>
                  <span className="fw-bold text-dark">₹ {product.price}</span>
                  {product.comparePrice && (
                    <span className="text-muted text-decoration-line-through ms-2">
                      ₹ {product.comparePrice}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
      <Row>
        <Col className="text-center">
          <Button
            as="a"
            href="/website/products"
            variant="dark"
            className="mt-2 px-4"
          >
            View more →
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FeaturedProducts;
