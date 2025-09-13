"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { FiShoppingBag, FiUser, FiHeart, FiMenu } from "react-icons/fi";
import Link from "next/link";
import styles from "./Header.module.scss";
import classNames from "classnames";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [cartCount] = useState(3); // Mock cart count
  const [wishlistCount] = useState(5); // Mock wishlist count
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const closeDropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  // Use AuthContext for reactive auth state
  const { customer, logout } = useAuth();

  const handleMouseEnter = () => {
    if (closeDropdownTimeout.current)
      clearTimeout(closeDropdownTimeout.current);
    setProfileDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeDropdownTimeout.current = setTimeout(() => {
      setProfileDropdownOpen(false);
    }, 200); // 200ms delay
  };

  return (
    <Navbar
      bg="dark"
      expand="lg"
      className={classNames("shadow sticky-top", styles.navbar)}
      collapseOnSelect
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} href="/" className="fw-bold fs-3 text-dark">
          PUFFN CLUB
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle className="bg-white" aria-controls="basic-navbar-nav">
          <FiMenu className="text-dark" />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="mx-auto">
            <Nav.Link
              as={Link}
              href="/website"
              className="text-white fw-medium"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/website/products"
              className="text-white fw-medium"
            >
              Products
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/website/products?category=T-Shirt"
              className="text-white fw-medium"
            >
              Regular Tshirts
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/website/products?category=Over_Size"
              className="text-white fw-medium"
            >
              Over Sized Tshirts
            </Nav.Link>
          </Nav>

          {/* User Actions */}
          <div className="d-flex align-items-center gap-2">
            {/* Wishlist */}
            <Nav.Link
              as={Link}
              href="/website/wishlist"
              className="text-white text-center position-relative me-2"
            >
              <FiHeart size={20} /> <br />
              Wishlist
            </Nav.Link>

            {/* Shopping Cart */}
            <Nav.Link
              as={Link}
              href="/website/cart"
              className="text-white text-center position-relative me-3"
            >
              <FiShoppingBag size={20} /> <br />
              Cart
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="/website/profile"
              className="text-white d-block d-md-none text-center position-relative me-3"
            >
              <FiUser size={20} />
              <br />
              Profile
            </Nav.Link>

            {/* Profile dropdown remains unchanged */}
            <div
              className={
                styles.profileDropdown +
                (profileDropdownOpen ? " " + styles.show : "") +
                " text-white d-none d-md-block"
              }
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              tabIndex={0}
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <div className="border-0 p-0">
                <FiUser size={20} />
                <br />
                Profile
              </div>
              <div
                className={classNames(
                  "text-start p-3",
                  styles.profileDropdownMenu
                )}
                style={{ display: "block" }}
              >
                {customer ? (
                  <div className="text-dark fw-bold d-flex flex-column align-items-start justify-content-start me-3">
                    <span
                      style={{ fontSize: "0.8rem" }}
                      className="text-success"
                    >
                      Hello {customer.firstName}
                    </span>
                    <span style={{ fontSize: "0.8rem" }}>{customer.phone}</span>
                  </div>
                ) : (
                  <Nav.Link
                    as={Link}
                    href="/website/auth/login"
                    className="text-danger fw-bold text-start me-3"
                  >
                    Login / Sign Up
                  </Nav.Link>
                )}
                <Dropdown.Item
                  className="pb-1 text-dark"
                  as={Link}
                  href="/website/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item
                  className="pb-1 text-dark"
                  as={Link}
                  href="/website/orders"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  My Orders
                </Dropdown.Item>
                <Dropdown.Item
                  className="pb-1 text-dark"
                  as={Link}
                  href="/website/wishlist"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  Wishlist
                </Dropdown.Item>
                <Dropdown.Item
                  className="pb-1 text-dark"
                  as={Link}
                  href="/website/contactus"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  Contact Us
                </Dropdown.Item>
                {customer && (
                  <Dropdown.Item
                    className="py-1 border-top text-danger fw-bold"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    href="/website"
                  >
                    Logout
                  </Dropdown.Item>
                )}
              </div>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
