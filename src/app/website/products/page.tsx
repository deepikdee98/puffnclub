"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Pagination,
} from "react-bootstrap";
import { FiStar, FiFilter, FiSearch, FiX } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/app/components";
import {
  productService,
  Product,
  ProductFilters,
  ProductsResponse,
} from "../services/productService";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { toast } from "react-toastify";
import { normalizeProductsData } from "../utils/productUtils";
import { FadeUpOnScroll, FlipYOnScroll } from "../constants/FadeUpOnScroll";
import { reviewService } from "../services/reviewService";
import styles from "./page.module.scss";
import MobileLoginPopup from "../auth/login-new/components/MobileLoginPopup";
import OtpPopup from "../auth/login-new/components/OtpPopup";
import { API_ENDPOINTS, setAuthToken } from "../services/api";

// Category mapping for display names and API values
// Values must match backend category names in your DB
const categoryMapping = {
  "T-shirts": { display: "T-shirts", value: "T-Shirt" },
  Hoodies: { display: "Hoodies", value: "Hoodies" },
  "Sweat shirts": { display: "Sweat shirts", value: "Sweat_Shirts" },
} as const;

type CategoryKey = keyof typeof categoryMapping;

const categories = Object.keys(categoryMapping);

const sizes = [
  { label: "Small", value: "S" },
  { label: "Medium", value: "M" },
  { label: "Large", value: "L" },
  { label: "Extra Large", value: "XL" },
];

const colors = [
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#00FF00" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Purple", hex: "#800080" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Gray", hex: "#808080" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Cyan", hex: "#00FFFF" },
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 200, max: 599 });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [pagination, setPagination] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Login popup state
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Initialize category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      // Try to match backend names directly
      const direct = (
        Object.entries(categoryMapping) as [
          CategoryKey,
          { display: string; value: string }
        ][]
      ).find(([_, m]) => m.value.toLowerCase() === categoryParam.toLowerCase());

      if (direct) {
        setSelectedCategory(direct[0]);
      }
    }
    // mark initialized after first param parse
    setInitialized(true);
  }, [searchParams]);

  useEffect(() => {
    if (!initialized) return; // wait until URL params parsed
    console.log("selectedCategory:", selectedCategory);
    loadProducts();
  }, [
    initialized,
    currentPage,
    selectedCategory,
    selectedSizes,
    selectedColors,
    selectedAvailability,
    priceRange,
    searchQuery,
  ]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters: ProductFilters = {
        page: currentPage,
        limit: productsPerPage,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (selectedCategory) {
        filters.category =
          categoryMapping[selectedCategory]?.value || selectedCategory;
      }

      if (priceRange.min > 0) {
        filters.minPrice = priceRange.min;
      }
      if (priceRange.max < Infinity) {
        filters.maxPrice = priceRange.max;
      }

      if (searchQuery) {
        filters.search = searchQuery;
      }

      if (selectedSizes.length > 0) {
        filters.sizes = selectedSizes;
      }

      if (selectedColors.length > 0) {
        filters.colors = selectedColors;
      }

      if (selectedAvailability) {
        // Add availability filter
        if (selectedAvailability === "inStock") {
          filters.inStock = true;
        } else if (selectedAvailability === "outOfStock") {
          filters.inStock = false;
        }
      }

      console.log("Filters:", filters);
      let response: ProductsResponse;
      const rawCategoryParam = searchParams.get("category");

      if (rawCategoryParam) {
        console.log(
          "Using category endpoint with raw param:",
          rawCategoryParam
        );
        const { category: _omit, ...rest } = filters as any;
        response = await productService.getProductsByCategory(
          rawCategoryParam,
          rest
        );
      } else if (selectedCategory) {
        const apiCategory =
          categoryMapping[selectedCategory]?.value || selectedCategory;
        console.log("Using category endpoint with mapped value:", apiCategory);
        const { category: _omit2, ...rest2 } = filters as any;
        response = await productService.getProductsByCategory(
          apiCategory,
          rest2
        );
      } else {
        console.log("Using generic products endpoint");
        response = await productService.getProducts(filters);
      }

      console.log("Products response:", response);

      // Normalize products data to ensure arrays are always defined
      const normalizedProducts = normalizeProductsData(response.products || []);

      // Fetch review stats for each product
      const productsWithReviews = await Promise.all(
        normalizedProducts.map(async (product) => {
          try {
            const reviewStats = await reviewService.getProductReviewStats(
              product._id
            );
            return {
              ...product,
              rating: reviewStats.averageRating || 0,
              reviewCount: reviewStats.totalReviews || 0,
            };
          } catch (error) {
            console.error(
              `Error loading reviews for product ${product._id}:`,
              error
            );
            return {
              ...product,
              rating: 0,
              reviewCount: 0,
            };
          }
        })
      );

      setProducts(productsWithReviews);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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

  const handleWishlistToggle = async (productId: string) => {
    try {
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }

      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist({ productId });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      // toast handled in context
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const currentProducts = products;

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(amount);
  // };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar
          key={i}
          className="text-warning"
          fill="currentColor"
          size={14}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(<FiStar key="half" className="text-warning" size={14} />);
    }

    return stars;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      />
    );

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      />
    );

    return <Pagination>{items}</Pagination>;
  };

  // Calculate active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedAvailability) count++;
    count += selectedSizes.length;
    count += selectedColors.length;
    if (priceRange.min !== 0 || priceRange.max !== 2000) count++;
    return count;
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    setMobileSortOpen(false);
    // Here you can add logic to actually sort the products
    // For now, we'll just update the state
  };

  return (
    <Container className="py-4">
      {/* Header Section - Hidden on Mobile */}
      <div className={`mb-5 text-center ${styles.desktopOnly}`}>
        <h2 className="mb-2">Our Products</h2>
        <p className="text-muted mb-0">
          Discover versatile staples and bold statement pieces designed
          <br />
          to elevate your style, season after season.
        </p>
      </div>

      {/* Mobile Search and Filter Section */}
      <div className={`mb-4 ${styles.mobileOnly}`}>
        {/* Search Bar */}
        <div className="position-relative mb-3">
          <FiSearch
            style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#999",
            }}
            size={20}
          />
          <Form.Control
            type="search"
            placeholder="Search for your type"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: "#f5f5f5",
              border: "none",
              padding: "12px 20px 12px 45px",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Filter and Sort Buttons */}
        <div className="d-flex gap-2">
          <Button
            variant="outline-dark"
            onClick={() => setMobileFilterOpen(true)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <FiFilter size={18} />
            Filter
            {getActiveFilterCount() > 0 && (
              <span
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "600",
                  marginLeft: "4px",
                }}
              >
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => setMobileSortOpen(true)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <Image
              src="/images/sort-icon.svg"
              alt="Sort"
              width={16}
              height={16}
            />
            Sort by relevant
          </Button>
        </div>
      </div>

      <Row>
        {/* Filters Sidebar */}
        <Col lg={3} className={`mb-4 pe-3 pe-lg-4 ${styles.filterSidebar}`}>
          {/* Availability Filter */}
          <div
            className="mb-4 pb-4"
            style={{ borderBottom: "1px solid #dee2e6" }}
          >
            <h6 className="mb-3">Availability</h6>
            <Form.Check
              type="checkbox"
              id="availability-instock"
              label="In Stock"
              checked={selectedAvailability === "inStock"}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedAvailability("inStock");
                } else {
                  setSelectedAvailability(null);
                }
              }}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              id="availability-outofstock"
              label="Out of Stock"
              checked={selectedAvailability === "outOfStock"}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedAvailability("outOfStock");
                } else {
                  setSelectedAvailability(null);
                }
              }}
              className="mb-2"
            />
          </div>

          {/* Category Filter */}
          <div
            className="mb-4 pb-4"
            style={{ borderBottom: "1px solid #dee2e6" }}
          >
            <h6 className="mb-3">Category</h6>
            {(categories as CategoryKey[]).map((category) => (
              <Form.Check
                key={category}
                type="checkbox"
                name="category"
                id={`category-${category}`}
                label={category}
                checked={selectedCategory === category}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategory(category);
                  } else {
                    setSelectedCategory(null);
                  }
                }}
                className="mb-2"
              />
            ))}
          </div>

          {/* Size Filter */}
          <div
            className="mb-4 pb-4"
            style={{ borderBottom: "1px solid #dee2e6" }}
          >
            <h6 className="mb-3">Size</h6>
            <div className="d-flex flex-column gap-2">
              {sizes.map((size) => (
                <Form.Check
                  key={size.value}
                  type="checkbox"
                  id={`size-${size.value}`}
                  label={size.label}
                  checked={selectedSizes.includes(size.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSizes([...selectedSizes, size.value]);
                    } else {
                      setSelectedSizes(
                        selectedSizes.filter((s) => s !== size.value)
                      );
                    }
                  }}
                  className="mb-0"
                />
              ))}
            </div>
          </div>

          {/* Colour Filter */}
          <div
            className="mb-4 pb-4"
            style={{ borderBottom: "1px solid #dee2e6" }}
          >
            <h6 className="mb-3">Colour</h6>
            <div className="d-flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    if (selectedColors.includes(color.name)) {
                      setSelectedColors(
                        selectedColors.filter((c) => c !== color.name)
                      );
                    } else {
                      setSelectedColors([...selectedColors, color.name]);
                    }
                  }}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: color.hex,
                    border: selectedColors.includes(color.name)
                      ? "3px solid #000"
                      : color.hex === "#FFFFFF"
                      ? "1px solid #ddd"
                      : "1px solid transparent",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-4">
            <h6 className="mb-3">Price</h6>
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Max {priceRange.min}</span>
                <span className="small text-muted">Min 1999</span>
              </div>
              <Form.Range
                min={0}
                max={1999}
                value={priceRange.max}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  setPriceRange({ min: priceRange.min, max: newMax });
                }}
                className={`mb-2 ${styles.priceRangeSlider}`}
                style={{
                  '--value': `${(priceRange.max / 1999) * 100}%`
                } as React.CSSProperties}
              />
            </div>
            <div className="text-start mt-3">
              <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>
                ₹ {priceRange.min} - ₹ {priceRange.max}
              </span>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div>
            <Button
              className="ms-auto d-block w-100"
              variant="outline-dark"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSizes([]);
                setSelectedColors([]);
                setSelectedAvailability(null);
                setPriceRange({ min: 0, max: 2000 });
                setSearchQuery("");
                setCurrentPage(1);
              }}
              style={{
                padding: "10px 40px",
                borderRadius: "8px",
              }}
            >
              Reset Filters
            </Button>
          </div>
        </Col>

        {/* Products Section */}
        <Col className="ps-3 ps-lg-4" lg={9}>
          {/* Search Bar - Desktop Only */}
          <div className={`mb-4 ${styles.desktopOnly}`}>
            <div className="d-flex gap-2 align-items-center">
              <div className="position-relative flex-grow-1">
                <FiSearch
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                  }}
                  size={20}
                />
                <Form.Control
                  type="search"
                  placeholder="Search for your type"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "none",
                    padding: "12px 20px 12px 45px",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <Button
                variant="dark"
                style={{
                  backgroundColor: "#000",
                  border: "none",
                  padding: "12px 24px",
                  whiteSpace: "nowrap",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Image
                  src="/images/sort-icon.svg"
                  alt="Sort"
                  width={16}
                  height={16}
                />
                Sort by
              </Button>
            </div>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            <div className="text-center py-5">
              <LoadingSpinner />
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No products found</h5>
              <p className="text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <Row>
                {currentProducts.map((product) => (
                  <Col key={product._id} xs={6} lg={6} md={6} sm={6} className="mb-4">
                    <FlipYOnScroll>
                      <div className="product-item">
                        {/* Product Image */}
                        <div className="position-relative mb-3">
                          <Link href={`/website/products/${product._id}`}>
                            <img
                              src={
                                product.primaryImage ||
                                product.images?.[0] ||
                                "https://via.placeholder.com/300x300"
                              }
                              alt={product.name}
                              className="w-100"
                              style={{
                                objectFit: "cover",
                                aspectRatio: "1/1",
                                borderRadius: "8px",
                                cursor: "pointer",
                              }}
                            />
                          </Link>

                          {/* Product Badge/Tag */}
                          {product.tags?.length > 0 && (
                            <Badge
                              bg={
                                product.tags.includes("Sale")
                                  ? "danger"
                                  : product.tags.includes("New Arrival")
                                  ? "success"
                                  : product.tags.includes("Trending")
                                  ? "warning"
                                  : "primary"
                              }
                              className="position-absolute top-0 start-0 m-2"
                              style={{ fontSize: "11px" }}
                            >
                              {product.tags[0]}
                            </Badge>
                          )}

                          {/* Wishlist Icon */}
                          <button
                            className="position-absolute top-0 end-0 m-3 border-0 bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishlistToggle(product._id);
                            }}
                            title={
                              isInWishlist(product._id)
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <Image
                              src={
                                isInWishlist(product._id)
                                  ? "/images/whishlist-icon.svg"
                                  : "/images/add-whislisht.svg"
                              }
                              alt={
                                isInWishlist(product._id)
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                              width={32}
                              height={32}
                            />
                          </button>
                        </div>

                        {/* Product Details */}
                        <Link
                          href={`/website/products/${product._id}`}
                          className="text-decoration-none"
                        >
                          <div className="mb-2">
                            {/* Product Name and Rating Side by Side */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6
                                className="mb-0 text-dark"
                                style={{ fontSize: "14px", fontWeight: "500" }}
                              >
                                {product.name}
                              </h6>

                              {/* Star Rating */}
                              {product.rating && product.rating > 0 && product.reviewCount && product.reviewCount > 0 && (
                                <div className="d-flex align-items-center gap-1">
                                  <span
                                    className="text-dark"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {product.rating.toFixed(1)}
                                  </span>
                                  <FiStar
                                    size={14}
                                    style={{ fill: "#FFC107", color: "#FFC107" }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Price */}
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="fw-bold text-dark"
                                style={{ fontSize: "16px" }}
                              >
                                ₹ {product.price}
                              </span>
                              {product.comparePrice && (
                                <span
                                  className="text-muted text-decoration-line-through"
                                  style={{ fontSize: "14px" }}
                                >
                                  ₹ {product.comparePrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </FlipYOnScroll>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  {renderPagination()}
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Mobile Filter Off-Canvas */}
      <div className={`${styles.filterOffcanvas} ${mobileFilterOpen ? styles.filterOffcanvasOpen : ''}`}>
        <div className={styles.filterOffcanvasHeader}>
          <h5 className={styles.filterOffcanvasTitle}>Filters</h5>
          <button
            className="btn btn-link text-dark p-0 border-0"
            onClick={() => setMobileFilterOpen(false)}
            aria-label="Close filters"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.filterOffcanvasBody}>
          {/* Availability Filter */}
          <div className="mb-4 pb-4" style={{ borderBottom: "1px solid #dee2e6" }}>
            <h6 className="mb-3">Availability</h6>
            <Form.Check
              type="checkbox"
              id="mobile-availability-instock"
              label="In Stock"
              checked={selectedAvailability === "inStock"}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedAvailability("inStock");
                } else {
                  setSelectedAvailability(null);
                }
              }}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              id="mobile-availability-outofstock"
              label="Out of Stock"
              checked={selectedAvailability === "outOfStock"}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedAvailability("outOfStock");
                } else {
                  setSelectedAvailability(null);
                }
              }}
              className="mb-2"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-4 pb-4" style={{ borderBottom: "1px solid #dee2e6" }}>
            <h6 className="mb-3">Category</h6>
            {(categories as CategoryKey[]).map((category) => (
              <Form.Check
                key={category}
                type="checkbox"
                name="mobile-category"
                id={`mobile-category-${category}`}
                label={category}
                checked={selectedCategory === category}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategory(category);
                  } else {
                    setSelectedCategory(null);
                  }
                }}
                className="mb-2"
              />
            ))}
          </div>

          {/* Size Filter */}
          <div className="mb-4 pb-4" style={{ borderBottom: "1px solid #dee2e6" }}>
            <h6 className="mb-3">Size</h6>
            <div className="d-flex flex-column gap-2">
              {sizes.map((size) => (
                <Form.Check
                  key={size.value}
                  type="checkbox"
                  id={`mobile-size-${size.value}`}
                  label={size.label}
                  checked={selectedSizes.includes(size.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSizes([...selectedSizes, size.value]);
                    } else {
                      setSelectedSizes(selectedSizes.filter((s) => s !== size.value));
                    }
                  }}
                  className="mb-0"
                />
              ))}
            </div>
          </div>

          {/* Colour Filter */}
          <div className="mb-4 pb-4" style={{ borderBottom: "1px solid #dee2e6" }}>
            <h6 className="mb-3">Colour</h6>
            <div className="d-flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => {
                    if (selectedColors.includes(color.name)) {
                      setSelectedColors(selectedColors.filter((c) => c !== color.name));
                    } else {
                      setSelectedColors([...selectedColors, color.name]);
                    }
                  }}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: color.hex,
                    border: selectedColors.includes(color.name)
                      ? "3px solid #000"
                      : color.hex === "#FFFFFF"
                      ? "1px solid #ddd"
                      : "1px solid transparent",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-4 pb-4" style={{ borderBottom: "1px solid #dee2e6" }}>
            <h6 className="mb-3">Price</h6>
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Max {priceRange.min}</span>
                <span className="small text-muted">Min 1999</span>
              </div>
              <Form.Range
                min={0}
                max={1999}
                value={priceRange.max}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  setPriceRange({ min: priceRange.min, max: newMax });
                }}
                className={`mb-2 ${styles.priceRangeSlider}`}
                style={{
                  '--value': `${(priceRange.max / 1999) * 100}%`
                } as React.CSSProperties}
              />
            </div>
            <div className="text-start mt-3">
              <span className="fw-semibold" style={{ fontSize: '0.95rem' }}>
                ₹ {priceRange.min} - ₹ {priceRange.max}
              </span>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="mb-3">
            <Button
              className="w-100"
              variant="outline-dark"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSizes([]);
                setSelectedColors([]);
                setSelectedAvailability(null);
                setPriceRange({ min: 0, max: 2000 });
                setSearchQuery("");
                setCurrentPage(1);
              }}
              style={{
                padding: "10px 40px",
                borderRadius: "8px",
              }}
            >
              Reset Filters
            </Button>
          </div>

          {/* Apply Filters Button */}
          <div>
            <Button
              className="w-100"
              variant="dark"
              onClick={() => setMobileFilterOpen(false)}
              style={{
                padding: "10px 40px",
                borderRadius: "8px",
                backgroundColor: "#000",
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for Filter Off-Canvas */}
      {mobileFilterOpen && (
        <div
          className={styles.filterOffcanvasOverlay}
          onClick={() => setMobileFilterOpen(false)}
        />
      )}

      {/* Mobile Sort Dropdown */}
      {mobileSortOpen && (
        <>
          <div
            className={styles.sortOverlay}
            onClick={() => setMobileSortOpen(false)}
          />
          <div className={styles.sortDropdown}>
            <div className={styles.sortHeader}>
              <button
                className={styles.sortCloseBtn}
                onClick={() => setMobileSortOpen(false)}
                aria-label="Close sort"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className={styles.sortOption} onClick={() => handleSortChange("recommended")}>
              Recommended
            </div>
            <div className={styles.sortOption} onClick={() => handleSortChange("whats-new")}>
              Whats new
            </div>
            <div className={styles.sortOption} onClick={() => handleSortChange("price-high-low")}>
              Price high to low
            </div>
            <div className={styles.sortOption} onClick={() => handleSortChange("price-low-high")}>
              Price low to high
            </div>
            <div className={styles.sortOption} onClick={() => handleSortChange("date-old-new")}>
              Date, old to new
            </div>
            <div className={styles.sortOption} onClick={() => handleSortChange("date-new-old")}>
              Date, new to old
            </div>
          </div>
        </>
      )}

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
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-5">
          <LoadingSpinner />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
