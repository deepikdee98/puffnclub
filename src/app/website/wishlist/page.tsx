"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FiHeart, FiStar } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { LoadingSpinner } from "@/app/components";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { FlipYOnScroll } from "../constants/FadeUpOnScroll";
import MobileLoginPopup from "../auth/login-new/components/MobileLoginPopup";
import OtpPopup from "../auth/login-new/components/OtpPopup";
import { API_ENDPOINTS, setAuthToken } from "../services/api";

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { wishlist, isLoading, refreshWishlist, removeFromWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  // Login popup state
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

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

  // Login popup handlers
  const handleOtpRequested = async (mobile: string) => {
    setLoginLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.WEBSITE.AUTH.SEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setSessionId(data.sessionId);
      setOtpMobile(mobile);
      setShowLoginPopup(false);
      setShowOtpPopup(true);
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      toast.error(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOtpConfirm = async (otp: string) => {
    setLoginLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.WEBSITE.AUTH.VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          mobile: otpMobile,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid OTP");
      }

      if (data.token) {
        setAuthToken(data.token);

        if (data.user) {
          localStorage.setItem("website_user", JSON.stringify(data.user));
        }

        setShowOtpPopup(false);
        toast.success("Login successful!");

        // Reload to update auth context
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      toast.error(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOtpResend = async () => {
    setLoginLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.WEBSITE.AUTH.RESEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          mobile: otpMobile,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      toast.success(data.message || "OTP resent successfully!");
    } catch (err: any) {
      console.error("Error resending OTP:", err);
      toast.error(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Not logged in state
  if (!isAuthenticated) {
    return (
      <>
        <Container className="py-5">
          <div className="text-center">
            <div className="mb-4">
              <FiHeart size={80} className="text-muted" />
            </div>
            <h3 className="mb-3">Please Log In</h3>
            <p className="text-muted mb-4">
              You need to be logged in to view your wishlist
            </p>
            <Button
              onClick={() => setShowLoginPopup(true)}
              variant="dark"
              size="lg"
            >
              Login / Sign Up
            </Button>
          </div>
        </Container>

        {/* Login Popups */}
        <MobileLoginPopup
          show={showLoginPopup}
          onHide={() => setShowLoginPopup(false)}
          onOtpRequested={handleOtpRequested}
          loading={loginLoading}
        />

        <OtpPopup
          show={showOtpPopup}
          onHide={() => setShowOtpPopup(false)}
          onConfirm={handleOtpConfirm}
          onResend={handleOtpResend}
          identifier={otpMobile}
          loading={loginLoading}
        />
      </>
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
          <div className="mb-4">
            <h2 className="mb-1 fw-semibold">My Wishlist</h2>
            <p className="text-muted mb-0">
              Keep track of what you love and purchase later.
            </p>
          </div>

          {/* Wishlist Items */}
          <Row>
            {items.map(({ _id, product }) => (
              <Col lg={4} md={4} sm={6} key={_id} className="mb-4">
                <FlipYOnScroll>
                  <div className="wishlist-item">
                    {/* Product Image */}
                    <div className="position-relative mb-3">
                      <Link href={`/website/products/${product._id}`}>
                        <img
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/400x400"
                          }
                          alt={product.name}
                          className="w-100 cursor-pointer"
                          style={{
                            objectFit: "cover",
                            aspectRatio: "1/1",
                            borderRadius: "8px",
                          }}
                        />
                      </Link>

                      {/* Wishlist Heart Icon */}
                      <button
                        className="position-absolute top-0 end-0 m-3 border-0 bg-transparent"
                        onClick={() => handleRemove(product._id)}
                        title="Remove from Wishlist"
                        style={{ cursor: "pointer" }}
                      >
                        <Image
                          src="/images/whishlist-icon.svg"
                          alt="Remove from wishlist"
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="mb-2">
                      <h6
                        className="mb-1"
                        style={{ fontSize: "14px", fontWeight: "500" }}
                      >
                        {product.name}
                      </h6>

                      {/* Star Rating */}
                      <div className="d-flex align-items-center gap-1 mb-2">
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>
                          {product.rating || "4.5"}
                        </span>
                        <FiStar
                          size={14}
                          style={{ fill: "#FFC107", color: "#FFC107" }}
                        />
                      </div>

                      {/* Price */}
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="fw-bold" style={{ fontSize: "16px" }}>
                          ₹ {product.price}
                        </span>
                        {product.compareAtPrice && (
                          <span
                            className="text-muted text-decoration-line-through"
                            style={{ fontSize: "14px" }}
                          >
                            ₹ {product.compareAtPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Bag Button */}
                    <div className="d-grid">
                      {product.inStock !== false ? (
                        <Button
                          variant="dark"
                          onClick={() => moveToBag(product._id)}
                          style={{
                            backgroundColor: "#000",
                            border: "none",
                            padding: "10px",
                            fontSize: "14px",
                          }}
                        >
                          Add to bag
                        </Button>
                      ) : (
                        <Button variant="outline-secondary" disabled>
                          Out of Stock
                        </Button>
                      )}
                    </div>
                  </div>
                </FlipYOnScroll>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
