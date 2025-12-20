import { Row, Col, Button } from "react-bootstrap";
import { FiStar, FiHeart } from "react-icons/fi";
import Link from "next/link";
import styles from "../../../Home/style.module.scss";

export default function RelatedProducts({
  products,
  formatCurrency,
  renderStars,
  handleAddToWishlist,
}: any) {
  return (
    <>
      <Row className="mt-5 align-items-center">
        <Col xs={8}>
          <h5 className="fw-bold mb-0">You might also like</h5>
        </Col>
        <Col xs={4} className="text-end">
          <Link
            href="/website/products"
            className="fw-medium text-dark text-decoration-none"
          >
            View more →
          </Link>
        </Col>
      </Row>
      <Row className="pt-3 justify-content-center g-4">
        {products.slice(0, 3).map((product: any) => (
          <Col
            lg={4}
            md={6}
            xs={6}
            key={product.id}
            className={`d-flex flex-column ${styles.productCard}`}
          >
            <div className={styles.imageWrapper}>
              <Link
                className="text-dark text-decoration-none"
                href={`/website/products/${product.id}`}
                passHref
              >
                <img
                  src={product.image || "https://via.placeholder.com/300x300"}
                  alt={product.name}
                  className={styles.productImage}
                />
              </Link>
              <button
                type="button"
                className={styles.wishlistBtn}
                aria-label="Add to wishlist"
                onClick={() =>
                  handleAddToWishlist && handleAddToWishlist(product.id)
                }
              >
                <FiHeart size={20} />
              </button>
            </div>

            <div className={`w-100 ${styles.productInfo}`}>
              <Link
                className="text-dark text-decoration-none"
                href={`/website/products/${product.id}`}
                passHref
              >
                <div className={`mb-2 ${styles.productNameRatingContainer}`}>
                  <strong className={styles.productName}>{product.name}</strong>
                  {product.rating && product.rating > 0 && (
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
                <span className={styles.currentPrice}>
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <span className={styles.comparePrice}>
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
}
