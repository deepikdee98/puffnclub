"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiHeart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import styles from "./NewHeader.module.scss";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MobileLoginPopup from "../auth/login-new/components/MobileLoginPopup";
import OtpPopup from "../auth/login-new/components/OtpPopup";
import classNames from "classnames";
import { API_ENDPOINTS, setAuthToken } from "../services/api";
import { toast } from "react-toastify";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { customer, isAuthenticated, logout } = useAuth();
  const [cartCount] = useState(3); // Replace with actual cart count
  const [wishlistCount] = useState(5); // Replace with actual wishlist count

  const handleLogout = async () => {
    await logout();
    router.push("/website");
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
      toast.error(err.message || "Failed to send OTP. Please try again.");
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
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/website");
          window.location.reload(); // Reload to update auth context
        }, 1000);
      }
    } catch (err: any) {
      console.error("❌ Error verifying OTP:", err);
      setError(err.message || "Invalid OTP. Please try again.");
      toast.error(err.message || "Invalid OTP. Please try again.");
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

      toast.success(data.message || "OTP resent successfully!");
    } catch (err: any) {
      console.error("❌ Error resending OTP:", err);
      setError(err.message || "Failed to resend OTP. Please try again.");
      toast.error(err.message || "Failed to resend OTP. Please try again.");
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
          {/* Desktop Header */}
          <div className={`d-none d-lg-flex justify-content-between align-items-center`}>
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
            <div className="d-flex align-items-center gap-4">
              <Link
                href="/website"
                className="text-dark text-decoration-none fs-6"
              >
                Home
              </Link>
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
                href="/website/contactus"
                className="text-dark text-decoration-none fs-6"
              >
                Contact Us
              </Link>
            </div>

            {/* Desktop Icons */}
            <div className="d-flex align-items-center gap-4">
              {/* Wishlist */}
              <Link
                href="/website/wishlist"
                className="text-dark position-relative"
              >
                <FiHeart size={20} />
              </Link>

              {/* Cart */}
              <Link
                href="/website/cart"
                className="text-dark position-relative"
              >
                <Image
                  src="/images/cart-icon.svg"
                  alt="Cart"
                  width={20}
                  height={20}
                />
              </Link>

              {/* Desktop Profile Dropdown */}
              <div className={`position-relative ${styles.profileDropdown}`}>
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
          </div>

          {/* Mobile Header */}
          <div className={`d-flex d-lg-none justify-content-between align-items-center ${styles.mobileHeader}`}>
            {/* Left: Hamburger Menu */}
            <button
              className="btn btn-link text-dark p-0 border-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <FiMenu size={24} />
            </button>

            {/* Center: Logo */}
            <Link
              href="/website"
              className="text-decoration-none d-flex align-items-center"
            >
              <Image
                src="/images/logo.svg"
                alt="PUFFN CLUB"
                height={30}
                width={120}
                className="object-fit-contain"
              />
            </Link>

            {/* Right: Search, Cart and Profile */}
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-link text-dark p-0 border-0"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              <Link
                href="/website/cart"
                className="text-dark position-relative"
              >
                <Image
                  src="/images/cart-icon.svg"
                  alt="Cart"
                  width={20}
                  height={20}
                />
              </Link>

              <Link
                href="/website/profile"
                className="text-dark"
              >
                <Image
                  src="/images/profile-icon.svg"
                  alt="Profile"
                  width={20}
                  height={20}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Off-Canvas Menu */}
      <div className={`${styles.offcanvas} ${mobileMenuOpen ? styles.offcanvasOpen : ''}`}>
        <div className={styles.offcanvasHeader}>
          <Link
            href="/website"
            className="text-decoration-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/images/logo.svg"
              alt="PUFFN CLUB"
              height={35}
              width={140}
              className="object-fit-contain"
            />
          </Link>
          <button
            className="btn btn-link text-dark p-0 border-0"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className={styles.offcanvasBody}>
          <Link
            href="/website"
            className={styles.offcanvasLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/images/home-menuicon.svg"
              alt=""
              width={20}
              height={20}
              className={styles.menuIcon}
            />
            Home
          </Link>
          <Link
            href="/website/products"
            className={styles.offcanvasLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/images/products-menuicon.svg"
              alt=""
              width={20}
              height={20}
              className={styles.menuIcon}
            />
            Products
          </Link>
          <Link
            href="/website/collections"
            className={styles.offcanvasLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/images/collections-menuicon.svg"
              alt=""
              width={20}
              height={20}
              className={styles.menuIcon}
            />
            New Collection
          </Link>
          <Link
            href="/website/wishlist"
            className={styles.offcanvasLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiHeart size={20} className={styles.menuIcon} />
            Wishlist
          </Link>
          <Link
            href="/website/contactus"
            className={styles.offcanvasLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              src="/images/contact-menuicon.svg"
              alt=""
              width={20}
              height={20}
              className={styles.menuIcon}
            />
            Contact
          </Link>
        </div>
      </div>

      {/* Overlay for Off-Canvas */}
      {mobileMenuOpen && (
        <div
          className={styles.offcanvasOverlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

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
