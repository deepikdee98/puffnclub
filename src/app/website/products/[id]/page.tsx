"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Breadcrumb,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import { FiStar } from "react-icons/fi";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components";
import { productService, Product } from "../../services/productService";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { toast } from "react-toastify";
import { normalizeProductData } from "../../utils/productUtils";
import { reviewService } from "../../services/reviewService";
import ProductImageGallery from "./components/ProductImageGallery";
import ProductInfo from "./components/ProductInfo";
import ColorSelector from "./components/ColorSelector";
import SizeSelector from "./components/SizeSelector";
import QuantitySelector from "./components/QuantitySelector";
import ProductActions from "./components/ProductActions";
import DeliveryInfo from "./components/DeliveryInfo";
import RelatedProducts from "./components/RelatedProducts";
import styles from "./styles.module.scss";
import classNames from "classnames";
import ProductDescriptionAndReviews from "./components/ProductDescriptionAndReviews";
import ProductAdditionalDetails from "./components/ProductAdditionalDetails";
import MobileLoginPopup from "../../auth/login-new/components/MobileLoginPopup";
import OtpPopup from "../../auth/login-new/components/OtpPopup";
import { API_ENDPOINTS, setAuthToken } from "../../services/api";
import SizeChartModal from "./components/SizeChartModal";

// Category mapping for display names and API values
const categoryMapping = {
  tshirts: { display: "T-Shirts", value: "tshirts" },
  oversizesTshirts: { display: "Oversize T-Shirts", value: "oversizesTshirts" },
};

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const router = useRouter();

  // Login popup state
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "cart" | "wishlist" | null
  >(null);

  // Size chart modal state
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // Update wishlist status when product changes or wishlist context updates
  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [product, isInWishlist]);

  // Reset added to cart state when size, color, or quantity changes
  useEffect(() => {
    setIsAddedToCart(false);
  }, [selectedSize, selectedColor, quantity]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductById(params.id as string);
      console.log("response", response);
      if (response.product) {
        // Normalize product data to ensure arrays are always defined
        const normalizedProduct = normalizeProductData(response.product);

        setProduct(normalizedProduct);

        // Fetch review stats for related products
        const relatedProductsWithReviews = await Promise.all(
          (response.relatedProducts || []).map(async (product: Product) => {
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

        setRelatedProducts(relatedProductsWithReviews);

        // Check if product is in wishlist
        setIsWishlisted(isInWishlist(normalizedProduct._id));

        // Reset added to cart state for new product
        setIsAddedToCart(false);

        // Set default color from variants if not already set
        if (
          !selectedColor &&
          normalizedProduct.variants &&
          normalizedProduct.variants.length > 0
        ) {
          setSelectedColor(normalizedProduct.variants[0].color);
        } else if (normalizedProduct.color) {
          setSelectedColor(normalizedProduct.color);
        }
        if (normalizedProduct.availableSizes?.length > 0) {
          setSelectedSize(normalizedProduct.availableSizes[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
          size={16}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(<FiStar key="half" className="text-warning" size={16} />);
    }

    return stars;
  };
  const handleAddToCart = async () => {
    console.log("Add to Cart clicked", {
      product,
      selectedSize,
      selectedColor,
      quantity,
    });
    if (!product) return;

    const sizesForColor = getAvailableSizesForColor(selectedColor);
    if (!selectedSize && sizesForColor.length > 0) {
      toast.error("Please select a size");
      return;
    }

    if (!isAuthenticated) {
      setPendingAction("cart");
      setShowLoginPopup(true);
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
      setIsAddedToCart(true);
      toast.success("Item added to bag!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleGoToCart = () => {
    router.push("/website/cart");
  };

  const handleWishlist = async () => {
    try {
      if (!product) return;

      if (!isAuthenticated) {
        setPendingAction("wishlist");
        setShowLoginPopup(true);
        return;
      }

      if (isWishlisted) {
        await removeFromWishlist(product._id);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({ productId: product._id });
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const getDiscountPercentage = () => {
    if (product?.comparePrice) {
      return Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      );
    }
    return 0;
  };

  // Helper function to get display name for category
  const getCategoryDisplayName = (category: string) => {
    const mapping = categoryMapping as Record<
      string,
      { display: string; value: string }
    >;
    return mapping[category]?.display || category;
  };

  const getAvailableSizesForColor = (color: string) => {
    if (!product?.variants) return [];
    const variant = product.variants.find((v) => v.color === color);
    if (!variant) return [];

    // Handle new structure with sizeStocks
    const variantAny = variant as any;
    if (
      variantAny.sizeStocks &&
      Array.isArray(variantAny.sizeStocks) &&
      variantAny.sizeStocks.length > 0
    ) {
      return variantAny.sizeStocks.map((sizeStock: any) => ({
        size: sizeStock.size,
        available: sizeStock.available || (sizeStock.stock ?? 0) > 0,
      }));
    }

    // Handle legacy structure with sizes array
    if (
      variant.sizes &&
      Array.isArray(variant.sizes) &&
      variant.sizes.length > 0
    ) {
      const isAvailable = (variant.stock ?? 0) > 0;
      return variant.sizes.map((s) => ({ size: s, available: isAvailable }));
    }

    return [];
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-3 text-muted">Loading product details...</p>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h4 className="text-dark">Product not found</h4>
          <p className="text-muted">
            The product you're looking for doesn't exist.
          </p>
          <Button as="a" href="/website/products" variant="dark">
            Back to Products
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="product-detail-page bg-white">
      <Container className="pt-4 pb-0">
        {/* Breadcrumb */}

        <Row>
          {/* Product Images */}
          <Col lg={6} className="mb-4">
            <div className="p-0">
              <ProductImageGallery
                variants={product.variants || []}
                selectedColor={selectedColor}
                productName={product.name}
                badge={
                  product.tags?.includes("New")
                    ? "New"
                    : product.tags?.includes("Best Seller")
                    ? "Best Seller"
                    : undefined
                }
                isWishlisted={isWishlisted}
                onWishlistToggle={handleWishlist}
              />
            </div>
          </Col>
          {/* Product Details */}
          <Col lg={6}>
            {/* <Card className="border-0 shadow-sm h-100"> */}
            <div className="p-4">
              <ProductInfo
                product={{
                  name: product.name,
                  price: product.price,
                  comparePrice: product.comparePrice,
                  sku: product.sku || "",
                  brand: product.brand,
                  category: product.category,
                }}
                getDiscountPercentage={getDiscountPercentage}
              />

              <SizeSelector
                sizes={getAvailableSizesForColor(selectedColor)}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                onSizeChartClick={() => setShowSizeChart(true)}
              />

              {/* <QuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              /> */}

              <ProductActions
                selectedSize={selectedSize}
                isWishlisted={isWishlisted}
                isAddedToCart={isAddedToCart}
                onAddToBag={handleAddToCart}
                onGoToCart={handleGoToCart}
                onWishlistToggle={handleWishlist}
              />

              <DeliveryInfo />

              {/* Stock Status */}
              {/* <div className="mt-3">
                <Badge
                  bg={product.totalStock > 0 ? "success" : "danger"}
                  className="px-3 py-2"
                >
                  {product.totalStock > 0
                    ? `${product.totalStock} items in stock`
                    : "Out of stock"}
                </Badge>
              </div> */}
              <ProductAdditionalDetails
                product={product}
                selectedColor={selectedColor}
              />
            </div>
            {/* </Card> */}
          </Col>
        </Row>

        <ProductDescriptionAndReviews
          description={product.description}
          productId={product._id}
        />

        {/* Related Products */}
        <RelatedProducts
          products={relatedProducts.map((p) => ({
            id: p.id || p._id || "",
            name: p.name || "",
            price: p.price ?? 0,
            image: p.primaryImage || "",
            rating: p.rating ?? 0,
            reviews: p.reviewCount ?? 0,
          }))}
          formatCurrency={formatCurrency}
          renderStars={renderStars}
        />
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

      {/* Size Chart Modal */}
      <SizeChartModal
        show={showSizeChart}
        onHide={() => setShowSizeChart(false)}
      />
    </div>
  );
}
