"use client";

import { useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FiHeart, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { FlipYOnScroll } from "../constants/FadeUpOnScroll";

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { wishlist, isLoading, refreshWishlist, removeFromWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isAuthenticated) refreshWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove from wishlist");
    }
  };

  const moveToBag = async (productId: string) => {
    if (!wishlist) return;
    try {
      const item = wishlist.items.find((i) => i.product._id === productId);
      if (!item) {
        console.error("Item not found in wishlist for productId:", productId);
        return;
      }

      const payload = {
        productId,
        quantity: 1,
        size: item.product.availableSizes?.[0],
        color: item.product.color,
      };
      console.log("moveToBag payload:", payload, "product:", item.product);
      const result = await addToCart(payload);
      console.log("addToCart result:", result);
      await removeFromWishlist(productId);
      toast.success("Moved to cart");
    } catch (error: any) {
      console.error("moveToBag error:", error);
      toast.error(error.message || "Failed to move to cart");
    }
  };

  // Not logged in state
  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="mb-4">
            <FiHeart size={80} className="text-muted" />
          </div>
          <h3 className="mb-3">Please Log In</h3>
          <p className="text-muted mb-4">
            You need to be logged in to view your wishlist
          </p>
          <Button as="a" href="/website/auth/login" variant="dark" size="lg">
            Login / Sign Up
          </Button>
        </div>
      </Container>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-3 text-muted">Loading your wishlist...</p>
        </div>
      </Container>
    );
  }

  const items = wishlist?.items || [];
  console.log("Wishlist items:", items);

  // Empty wishlist
  if (items.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="mb-4">
            <FiHeart size={80} className="text-muted" />
          </div>
          <h3 className="mb-3">Your Wishlist is Empty</h3>
          <p className="text-muted mb-4">
            Add items that you like to your wishlist. Review them anytime and
            easily move them to the bag.
          </p>
          <Button as="a" href="/website/products" variant="dark" size="lg">
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">My Wishlist</h2>
              <p className="text-muted mb-0">{items.length} items</p>
            </div>
            <Button variant="outline-dark" as="a" href="/website/products">
              Continue Shopping
            </Button>
          </div>

          {/* Wishlist Items */}
          <Row>
            {items.map(({ _id, product }) => (
              <Col lg={3} md={3} sm={6} key={_id} className="mb-4">
                <FlipYOnScroll>
                  <Card className="border-0 shadow-sm h-100 wishlist-card">
                    <div className="position-relative">
                      <Link href={`/website/products/${product._id}`}>
                        <Card.Img
                          className="cursor-pointer object-fit-cover"
                          variant="top"
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/400x400"
                          }
                        />
                      </Link>

                      {/* Product Badge */}
                      {product.tags?.length > 0 && (
                        <Badge
                          bg="dark"
                          className="position-absolute top-0 start-0 m-2"
                        >
                          {product.tags[0]}
                        </Badge>
                      )}

                      {/* Remove Button */}
                      <Button
                        variant="light"
                        className="position-absolute top-0 end-0 m-2 rounded-circle"
                        onClick={() => handleRemove(product._id)}
                        title="Remove from Wishlist"
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    </div>

                    <Card.Body>
                      <div className="mb-2">
                        <h6 className="mb-1 text-truncate">{product.name}</h6>
                        {product.brand && (
                          <small className="text-muted">{product.brand}</small>
                        )}
                      </div>

                      {product.color && (
                        <div className="mb-2">
                          <Badge bg="light" text="dark" className="me-1">
                            {product.color}
                          </Badge>
                        </div>
                      )}

                      <div className="mb-3">
                        <div className="d-flex align-items-center">
                          <span className="fw-bold text-dark me-2">
                            Rs. {product.price}
                          </span>{" "}
                          {product.compareAtPrice && (
                            <>
                              <small className="text-muted text-decoration-line-through me-2">
                                Rs. {product.compareAtPrice}
                              </small>
                              <Badge bg="success" className="small">
                                {Math.round(
                                  ((product.compareAtPrice - product.price) /
                                    product.compareAtPrice) *
                                    100
                                )}
                                % OFF
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="d-grid gap-2">
                        {product.inStock !== false ? (
                          <Button
                            variant="dark"
                            onClick={() => moveToBag(product._id)}
                            className="d-flex align-items-center justify-content-center"
                          >
                            <FiShoppingBag className="me-2" />
                            Move to Bag
                          </Button>
                        ) : (
                          <Button variant="outline-secondary" disabled>
                            Out of Stock
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </FlipYOnScroll>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
