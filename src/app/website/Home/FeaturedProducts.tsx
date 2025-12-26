"use client";

import React, { useEffect } from "react";
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
  useEffect(() => {
    console.log("Featured Products received:", products);
    console.log("Number of products:", products.length);
    if (products.length > 0) {
      console.log("First product:", products[0]);
      console.log(
        "Product images:",
        products.map((p) => ({ name: p.name, image: p.images?.[0] }))
      );
    }
  }, [products]);
  return (
    <div className={styles.featuredProductsContainer}>
      <Row className="mb-5">
        <Col>
          <h2
            className="text-center font-bebas mb-3"
            style={{ fontSize: "2.5rem", letterSpacing: "-0.5px" }}
          >
            OUR BEST PICKS FOR YOU
          </h2>
          <p
            className="text-center text-muted"
            style={{ fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}
          >
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
        <Row className="justify-content-center g-4">
          {products.slice(0, 4).map((product) => (
            <Col
              lg={4}
              md={6}
              xs={6}
              key={product._id}
              className={`d-flex flex-column ${styles.productCard}`}
            >
              <div className={styles.imageWrapper}>
                <Link
                  className="text-dark text-decoration-none"
                  href={`/website/products/${product._id}`}
                  passHref
                >
                  <img
                    src={
                      product.images?.[0] ||
                      "https://via.placeholder.com/300x300"
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
              </div>

              <div className={`w-100 ${styles.productInfo}`}>
                <Link
                  className="text-dark text-decoration-none"
                  href={`/website/products/${product._id}`}
                  passHref
                >
                  <div className={`mb-2 ${styles.productNameRatingContainer}`}>
                    <strong className={styles.productName}>
                      {product.name}
                    </strong>

                    {product.rating &&
                      product.rating > 0 &&
                      product.reviewCount &&
                      product.reviewCount > 0 && (
                        <div className={styles.ratingBadge}>
                          <span className={styles.ratingText}>
                            {product.rating.toFixed(1)}
                          </span>
                          <FiStar className={styles.ratingIcon} size={12} />
                        </div>
                      )}
                  </div>
                </Link>

                <div className={styles.priceContainer}>
                  <span className={styles.currentPrice}>₹ {product.price}</span>
                  {product.comparePrice && (
                    <span className={styles.comparePrice}>
                      ₹ {product.comparePrice}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
      <Row className="mt-5">
        <Col className="text-center">
          <Button
            as="a"
            href="/website/products"
            variant="outline-dark"
            className={`${styles.viewMoreBtn}`}
          >
            View more ≫
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FeaturedProducts;
