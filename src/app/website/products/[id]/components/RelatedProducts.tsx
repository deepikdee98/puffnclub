import { Row, Col, Button } from "react-bootstrap";
import { FiStar, FiHeart } from "react-icons/fi";
import Link from "next/link";
import styles from "../../../Home/style.module.scss"; // adjust path as needed

export default function RelatedProducts({
  products,
  formatCurrency,
  renderStars,
  handleAddToWishlist,
}: any) {
  return (
    <>
      <Row className="mt-5  align-items-center">
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
      <Row className="pt-3">
        {products.slice(0, 3).map((product: any) => (
          <Col
            lg={4}
            md={6}
            xs={12}
            key={product.id}
            className="mb-4 d-flex flex-column align-items-center"
          >
            <div
              style={{ width: "100%", position: "relative", marginBottom: 8 }}
            >
              <Link href={`/website/products/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                  style={{ cursor: "pointer" }}
                />
              </Link>
              <button
                type="button"
                className={styles.wishlistBtn}
                aria-label="Add to wishlist"
                style={{ right: 12, top: 10 }}
                onClick={() =>
                  handleAddToWishlist && handleAddToWishlist(product.id)
                }
              >
                <FiHeart size={20} />
              </button>
            </div>

            <div className="w-100 px-1 mb-2">
              <Link
                href={`/website/products/${product.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="d-flex align-items-center mb-1">
                  <div className="fw-semibold flex-grow-1">{product.name}</div>
                  {product.rating && product.rating > 0 ? (
                    <>
                      <span className="ms-2">{product.rating.toFixed(1)}</span>
                      <FiStar className="text-warning ms-1" size={15} />
                      {product.reviews && product.reviews > 0 && (
                        <span className="text-muted ms-1" style={{ fontSize: 13 }}>
                          ({product.reviews})
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-muted ms-2" style={{ fontSize: 13 }}>
                      No reviews
                    </span>
                  )}
                </div>
              </Link>
              <div className="d-flex align-items-center">
                <span className="fw-bold text-dark">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-muted text-decoration-line-through ms-2">
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
