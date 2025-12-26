"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Carousel,
} from "react-bootstrap";
import { FiArrowRight, FiStar, FiHeart, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components";
import { productService, Product } from "./services/productService";
import { bannerService, Banner } from "./services/bannerService";
import { contactService } from "./services/contactService";
import { apiRequest, API_ENDPOINTS, setAuthToken } from "./services/api";
import { useWishlist } from "./contexts/WishlistContext";
import { useAuth } from "./contexts/AuthContext";
import { normalizeProductData } from "./utils/productUtils";
import { toast } from "react-toastify";
import { reviewService } from "./services/reviewService";
import {
  FlipXOnScroll,
  FlipYOnScroll,
  ZoomInOnScroll,
} from "./constants/FadeUpOnScroll";
import Categories from "./Home/Categories";
import FeaturedProducts from "./Home/FeaturedProducts";
import HeroCarousel from "./Home/HeroCarousel";
import BrandStory from "./Home/BrandStory";
import ClubStatementBanner from "./Home/ClubStatementBanner";
import JoinClubBanner from "./Home/JoinClubBanner";
import MobileLoginPopup from "./auth/login-new/components/MobileLoginPopup";
import OtpPopup from "./auth/login-new/components/OtpPopup";

// Categories loaded from API
type CategoryItem = { _id: string; name: string; slug: string; image?: string };

export default function HomePage() {
  const { addToWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Login popup state
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadFeaturedProducts(),
      loadBanners(),
      loadCategories(),
    ]);
  };

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await apiRequest<CategoryItem[]>(
        API_ENDPOINTS.WEBSITE.CATEGORIES_DROPDOWN
      );
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getFeaturedProducts(4);
      // Normalize product data to ensure arrays are always defined
      const normalizedProducts = response.products.map(normalizeProductData);
      
      // Fetch review stats for each product
      const productsWithReviews = await Promise.all(
        normalizedProducts.map(async (product) => {
          try {
            const reviewStats = await reviewService.getProductReviewStats(product._id);
            return {
              ...product,
              rating: reviewStats.averageRating || 0,
              reviewCount: reviewStats.totalReviews || 0,
            };
          } catch (error) {
            console.error(`Error loading reviews for product ${product._id}:`, error);
            return {
              ...product,
              rating: 0,
              reviewCount: 0,
            };
          }
        })
      );
      
      setFeaturedProducts(productsWithReviews);
    } catch (error) {
      console.error("Error loading featured products:", error);
      toast.error("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

  const loadBanners = async () => {
    try {
      setBannersLoading(true);
      // Using API data instead of mock data
      const response = await bannerService.getBanners();
      setBanners(response.banners);
      console.log("🎯 Website: Successfully loaded banners from API");
    } catch (error) {
      console.error("❌ Error loading banners from API:", error);
      toast.error("Failed to load banners");
    } finally {
      setBannersLoading(false);
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

  const handleAddToWishlist = async (productId: string) => {
    try {
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }

      await addToWishlist({ productId });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleSubscribeNewsletter = async (email: string) => {
    try {
      await contactService.subscribeNewsletter({ email });
      toast.success("Successfully subscribed to newsletter!");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Failed to subscribe to newsletter");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const renderStars = (rating: number = 4.5) => {
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

  return (
    <div className="homepage">
      {/* Hero Carousel */}
      <HeroCarousel banners={banners} loading={bannersLoading} />
      {/* Categories Section */}
      <Container className="">
        <Categories categories={categories} loading={categoriesLoading} />
      </Container>
      {/* Our Best Picks For You */}
      <Container className="pb-5">
        <FeaturedProducts
          loading={loading}
          products={featuredProducts}
          handleAddToWishlist={handleAddToWishlist}
        />
      </Container>
      <ClubStatementBanner />
      <BrandStory />
      <JoinClubBanner />

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
    </div>
  );
}
