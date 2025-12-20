"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import { FiTwitter, FiFacebook, FiInstagram, FiMail } from "react-icons/fi";
import styles from "./NewFooter.module.scss";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setEmail("");
  };

  return (
    <footer className={styles.footer}>
      {/* Desktop Footer */}
      <div className={`${styles.desktopFooter} bg-white py-5`}>
        <div className="container py-5">
          <div className="row justify-content-center align-items-start gx-4 gy-4">
            {/* Logo and Social */}
            <div
              className={classNames(
                "col-12 col-md-6 col-lg-3",
                styles.footerColumn
              )}
            >
              <div className="d-flex flex-column align-items-center">
                <Image
                  src="/images/footerlogo.svg"
                  alt="PUFFN CLUB"
                  width={140}
                  height={80}
                  className="object-fit-contain"
                />
                <div className="d-flex gap-3 mt-3">
                  <Link href="#" className={styles.socialLink}>
                    <FiFacebook size={20} />
                  </Link>
                  <Link href="#" className={styles.socialLink}>
                    <FiTwitter size={20} />
                  </Link>
                  <Link href="#" className={styles.socialLink}>
                    <FiInstagram size={20} />
                  </Link>
                </div>
                <div
                  className={classNames(
                    styles.contactEmail,
                    "text-center mt-3"
                  )}
                >
                  puffnclub@gmail.com
                </div>
              </div>
            </div>

            {/* Navigation Links (with divider) */}
            <div
              className={classNames(
                "col-12 col-md-6 col-lg-4 d-flex text-center flex-column justify-content-center align-items-center gap-3",
                styles.footerColumn,
                styles.withDivider
              )}
            >
              <Link
                href="/website"
                className={classNames(
                  styles.footerLink,
                  "text-secondary text-decoration-none"
                )}
              >
                Home
              </Link>
              <Link
                href="/website/collections"
                className={classNames(
                  styles.footerLink,
                  "text-secondary text-decoration-none"
                )}
              >
                New Collection
              </Link>
              <Link
                href="/website/products"
                className={classNames(
                  styles.footerLink,
                  "text-secondary text-decoration-none"
                )}
              >
                Products
              </Link>
              <Link
                href="/website/aboutus"
                className={classNames(
                  styles.footerLink,
                  "text-secondary text-decoration-none"
                )}
              >
                About us
              </Link>
            </div>

            {/* Newsletter Signup (with divider) */}
            <div
              className={classNames(
                "col-12 col-md-8 col-lg-5 px-4 px-md-5 text-center text-md-start",
                styles.footerColumn,
                styles.withDivider
              )}
            >
              <h3 className="mb-2">Join the Club</h3>
              <p
                className="text-secondary mb-3"
                style={{ fontSize: "14px", lineHeight: "1.5" }}
              >
                Sign up for our newsletter and never miss a drop. Be the first
                to know about new drops, exclusive offers, and limited Puffn
                Club editions.
              </p>
              <form
                onSubmit={handleSubscribe}
                className={styles.subscribeForm + " d-flex"}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  required
                />
                <button type="submit" className={styles.subscribeButton}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className={styles.mobileFooter}>
        {/* Navigation Links */}
        <div className={styles.mobileNavSection}>
          <Link href="/website" className={styles.mobileNavLink}>
            Home
          </Link>
          <Link href="/website/collections" className={styles.mobileNavLink}>
            New Collection
          </Link>
          <Link href="/website/products" className={styles.mobileNavLink}>
            Products
          </Link>
          <Link href="/website/aboutus" className={styles.mobileNavLink}>
            About us
          </Link>
        </div>

        {/* Newsletter Section */}
        <div className={styles.mobileNewsletterSection}>
          <h3 className={styles.mobileNewsletterTitle}>Join the Club</h3>
          <p className={styles.mobileNewsletterText}>
            Sign up for our newsletter and never miss a drop. Be the first to
            know about new drops, exclusive offers, and limited Puffn Club
            editions.
          </p>
          <form
            onSubmit={handleSubscribe}
            className={styles.mobileSubscribeForm}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.mobileEmailInput}
              required
            />
            <button type="submit" className={styles.mobileSubscribeButton}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
        </div>

        {/* Black Footer Bottom */}
        <div className={styles.mobileFooterBottom}>
          <Image
            src="/images/footermobilelogo.svg"
            alt="PUFFN CLUB"
            width={100}
            height={30}
            className={styles.mobileFooterLogo}
          />
          <div className={styles.mobileSocialIcons}>
            <Link href="#" className={styles.mobileSocialLink}>
              <FiFacebook size={18} />
            </Link>
            <Link href="#" className={styles.mobileSocialLink}>
              <FiTwitter size={18} />
            </Link>
            <Link href="#" className={styles.mobileSocialLink}>
              <FiInstagram size={18} />
            </Link>
            <Link href="#" className={styles.mobileSocialLink}>
              <FiMail size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
