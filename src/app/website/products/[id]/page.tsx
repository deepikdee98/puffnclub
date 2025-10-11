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
  const router = useRouter();

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

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductById(params.id as string);
      if (response.product) {
        // Normalize product data to ensure arrays are always defined
        const normalizedProduct = normalizeProductData(response.product);

        setProduct(normalizedProduct);
        
        // Fetch review stats for related products
        const relatedProductsWithReviews = await Promise.all(
          (response.relatedProducts || []).map(async (product: Product) => {
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
        
        setRelatedProducts(relatedProductsWithReviews);

        // Check if product is in wishlist
        setIsWishlisted(isInWishlist(normalizedProduct._id));

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
      toast.error("Please login to add items to cart");
      router.push("/website/auth/login");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleWishlist = async () => {
    try {
      if (!product) return;

      if (!isAuthenticated) {
        toast.error("Please login to add items to wishlist");
        router.push("/website/auth/login");

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
    if (!variant?.sizes) return [];
    const isAvailable = (variant.stock ?? 0) > 0; // optional nuance
    return variant.sizes.map((s) => ({ size: s, available: isAvailable }));
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
                product={product}
                getDiscountPercentage={getDiscountPercentage}
              />

              <ColorSelector
                variants={product.variants || []}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />

              <SizeSelector
                sizes={getAvailableSizesForColor(selectedColor)}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
              />

              <QuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />

              <ProductActions
                selectedSize={selectedSize}
                isWishlisted={isWishlisted}
                onGoToCart={handleAddToCart}
                onWishlistToggle={handleWishlist}
              />

              <DeliveryInfo />

              {/* Stock Status */}
              <div className="mt-3">
                <Badge
                  bg={product.totalStock > 0 ? "success" : "danger"}
                  className="px-3 py-2"
                >
                  {product.totalStock > 0
                    ? `${product.totalStock} items in stock`
                    : "Out of stock"}
                </Badge>
              </div>
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
    </div>
  );
}
