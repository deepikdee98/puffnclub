"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiHeart, FiMenu, FiX } from "react-icons/fi";
import styles from "./NewHeader.module.scss";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MobileLoginPopup from "../auth/login-new/components/MobileLoginPopup";
import OtpPopup from "../auth/login-new/components/OtpPopup";
import classNames from "classnames";
import { API_ENDPOINTS, setAuthToken } from "../services/api";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { customer, logout } = useAuth();
  const [cartCount] = useState(3); // Replace with actual cart count
  const [wishlistCount] = useState(5); // Replace with actual wishlist count

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const handleOtpRequested = async (mobile: string) => {
    console.log("🔵 handleOtpRequested called with mobile:", mobile);
    setLoading(true);
    setError("");

    try {
      console.log(
        "🔵 Sending OTP request to:",
        API_ENDPOINTS.WEBSITE.AUTH.SEND_OTP
      );
      const response = await fetch(API_ENDPOINTS.WEBSITE.AUTH.SEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();
      console.log("🔵 Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      // Store session info
      setSessionId(data.sessionId);
      setOtpMobile(mobile);

      // Close login popup and open OTP popup
      setShowLoginPopup(false);
      setShowOtpPopup(true);
    } catch (err: any) {
      console.error("❌ Error sending OTP:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
      alert(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpConfirm = async (otp: string) => {
    console.log("🔵 handleOtpConfirm called with OTP:", otp);
    setLoading(true);
    setError("");

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
      console.log("🔵 Verify OTP Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid OTP");
      }

      // Store auth token
      if (data.token) {
        setAuthToken(data.token);

        // Store user data if available
        if (data.user) {
          localStorage.setItem("website_user", JSON.stringify(data.user));
        }

        // Close modal and redirect
        setShowOtpPopup(false);
        alert("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/website");
          window.location.reload(); // Reload to update auth context
        }, 1000);
      }
    } catch (err: any) {
      console.error("❌ Error verifying OTP:", err);
      setError(err.message || "Invalid OTP. Please try again.");
      alert(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpResend = async () => {
    console.log("🔵 handleOtpResend called for mobile:", otpMobile);
    setLoading(true);
    setError("");

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
      console.log("🔵 Resend OTP Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      // Update session ID if backend returns a new one
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      alert(data.message || "OTP resent successfully!");
    } catch (err: any) {
      console.error("❌ Error resending OTP:", err);
      setError(err.message || "Failed to resend OTP. Please try again.");
      alert(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header
      className="fixed-top start-0 w-100 top-0 bg-white border-bottom"
      style={{ zIndex: 1000 }}
    >
      <nav className="py-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            {/* Logo */}
            <Link
              href="/website"
              className="text-decoration-none d-flex align-items-center"
            >
              <Image
                src="/images/logo.svg"
                alt="PUFFN CLUB"
                height={40}
                width={180}
                className="object-fit-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className={styles.desktopMenu}>
              <div className="d-flex align-items-center gap-4">
                <Link
                  href="/website/products"
                  className="text-dark text-decoration-none fs-6"
                >
                  Products
                </Link>
                <Link
                  href="/website/collections"
                  className="text-dark text-decoration-none fs-6"
                >
                  New Collection
                </Link>
                <Link
                  href="/website/about"
                  className="text-dark text-decoration-none fs-6"
                >
                  About
                </Link>
                <Link
                  href="/website/contactus"
                  className="text-dark text-decoration-none fs-6"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Icons */}
            <div className="d-flex align-items-center gap-4">
              {/* Wishlist - Hidden on mobile */}
              <Link
                href="/website/wishlist"
                className="text-dark position-relative d-none d-lg-block"
              >
                <FiHeart size={20} />
                {/* {wishlistCount > 0 && (
                  <span
                    className={`${styles.cartCount} rounded-circle px-2 py-1`}
                  >
                    {wishlistCount}
                  </span>
                )} */}
              </Link>

              {/* Cart - Hidden on mobile */}
              <Link
                href="/website/cart"
                className="text-dark position-relative d-none d-lg-block"
              >
                <Image
                  src="/images/cart-icon.svg"
                  alt="Cart"
                  width={20}
                  height={20}
                />
                {/* {cartCount > 0 && (
                  <span
                    className={`${styles.cartCount} rounded-circle px-2 py-1`}
                  >
                    {cartCount}
                  </span>
                )} */}
              </Link>

              <div className="position-relative">
                {/* Mobile - Direct link to profile */}
                <Link
                  href="/website/profile"
                  className="btn btn-link text-dark p-0 border-0 d-lg-none"
                >
                  <Image
                    src="/images/profile-icon.svg"
                    alt="Profile"
                    width={20}
                    height={20}
                  />
                </Link>

                {/* Desktop - Profile dropdown */}
                <div className={`d-none d-lg-block ${styles.profileDropdown}`}>
                  <button
                    className={`btn btn-link text-dark p-0 border-0 ${styles.profileDropdownTrigger}`}
                  >
                    <Image
                      src="/images/profile-icon.svg"
                      alt="Profile"
                      width={20}
                      height={20}
                    />
                  </button>

                  {/* Profile Menu - Desktop only */}
                  <div className={styles.profileMenu}>
                    {customer ? (
                      <>
                        <Link
                          href="/website/profile"
                          className={classNames(
                            "text-dark fw-bold",
                            styles.profileMenuItem
                          )}
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`${styles.profileMenuItem} fw-bold text-danger`}
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowLoginPopup(true)}
                        className={classNames(
                          "text-danger fw-bold",
                          styles.profileMenuItem
                        )}
                      >
                        Login
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className={`btn btn-link text-dark p-0 border-0 ${styles.mobileMenu}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="d-flex flex-column gap-3 py-3 mt-3 border-top">
              <Link
                href="/products"
                className="text-dark text-decoration-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-dark text-decoration-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="text-dark text-decoration-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contactus"
                className="text-dark text-decoration-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Login Popups */}
      <MobileLoginPopup
        show={showLoginPopup}
        onHide={() => setShowLoginPopup(false)}
        onOtpRequested={handleOtpRequested}
        loading={loading}
      />

      <OtpPopup
        show={showOtpPopup}
        onHide={() => setShowOtpPopup(false)}
        onConfirm={handleOtpConfirm}
        onResend={handleOtpResend}
        identifier={otpMobile}
        loading={loading}
      />
    </header>
  );
}
