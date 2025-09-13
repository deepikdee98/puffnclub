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
        setRelatedProducts(response.relatedProducts || []);

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

  // const handleAddToCart = async () => {
  //     console.log("Add to Cart clicked", { product, selectedSize, selectedColor, quantity });
  //   if (!product) return;

  //   if (!selectedSize && product.availableSizes && product.availableSizes.length > 0) {
  //     toast.error("Please select a size");
  //     return;
  //   }

  //   if (!isAuthenticated) {
  //     toast.error("Please login to add items to cart");
  //     return;
  //   }

  //   try {
  //     await addToCart({
  //       productId: product._id,
  //       quantity,
  //       size: selectedSize,
  //       color: selectedColor,
  //     });
  //   } catch (error) {
  //     console.error("Error adding to cart:", error);
  //   }
  // };
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
    const mapping = categoryMapping as Record<string, { display: string; value: string }>;
    return mapping[category]?.display || category;
  };

  // Get available sizes for selected color
  // const getAvailableSizesForColor = (color: string) => {
  //   if (!product?.variants) return [];

  //   const variant = product.variants.find((v) => v.color === color);
  //   if (!variant?.sizes) return [];

  //   return variant.sizes.map((size) => ({
  //     size,
  //     available: true, // You can enhance this based on stock per size if needed
  //   }));
  // };
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
    <div className="product-detail-page bg-light">
      <Container className="py-4">
        {/* Breadcrumb */}
        <Breadcrumb
          className={classNames(
            "mb-4 bg-white p-3 rounded",
            styles.breadCrumbDetails
          )}
        >
          <Breadcrumb.Item href="/website" className="text-dark">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/website/products" className="text-dark">
            Products
          </Breadcrumb.Item>
          <Breadcrumb.Item
            href={
              product?.category
                ? `/website/products?category=${product.category}`
                : "/website/products"
            }
            className="text-dark"
          >
            {product?.category
              ? getCategoryDisplayName(product.category)
              : "Category"}
          </Breadcrumb.Item>
          <Breadcrumb.Item active className="text-muted">
            {product?.name || "Product"}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          {/* Product Images */}
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
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
              </Card.Body>
            </Card>
          </Col>

          {/* Product Details */}
          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <ProductInfo
                  product={product}
                  formatCurrency={formatCurrency}
                  renderStars={renderStars}
                  getDiscountPercentage={getDiscountPercentage}
                />

                <ColorSelector
                  variants={product.variants || []}
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                />

                <SizeSelector
                  // sizes={
                  //   Array.isArray(product.availableSizes)
                  //     ? product.availableSizes
                  //     : []
                  // }
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
                  onAddToCart={handleAddToCart}
                  onWishlistToggle={handleWishlist}
                />

                <DeliveryInfo
                  deliveryInfo={{
                    freeDelivery: true,
                    deliveryTime: "2-3 days",
                    returnPolicy: "30 days easy return",
                  }}
                />

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
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Product Information Tabs */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k || "description")}
                  className={classNames(
                    "mb-4 border-bottom",
                    styles.productTabs
                  )}
                >
                  <Tab eventKey="description" title="Product Details">
                    <div className="py-3">
                      <h5 className="fw-bold mb-3">Description</h5>
                      <p className="text-muted mb-4">{product.description}</p>

                      {/* Key Features - Show tags if no features */}
                      {product.tags && product.tags.length > 0 && (
                        <>
                          <h6 className="fw-bold mb-3">Tags:</h6>
                          <Row>
                            {product.tags.map((tag: string, index: number) => (
                              <Col md={6} key={index} className="mb-2">
                                <div className="d-flex align-items-center">
                                  <span className="text-success me-2">✓</span>
                                  <span>{tag}</span>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </>
                      )}
                    </div>
                  </Tab>

                  <Tab eventKey="specifications" title="Specifications">
                    <div className="py-3">
                      <h5 className="fw-bold mb-4">Product Specifications</h5>
                      <Row>
                        <Col md={6} className="mb-3">
                          <div className="d-flex border-bottom pb-2">
                            <strong
                              className="me-3 text-dark"
                              style={{ minWidth: "140px" }}
                            >
                              SKU:
                            </strong>
                            <span className="text-muted">{product.sku}</span>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="d-flex border-bottom pb-2">
                            <strong
                              className="me-3 text-dark"
                              style={{ minWidth: "140px" }}
                            >
                              Brand:
                            </strong>
                            <span className="text-muted">{product.brand}</span>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="d-flex border-bottom pb-2">
                            <strong
                              className="me-3 text-dark"
                              style={{ minWidth: "140px" }}
                            >
                              Category:
                            </strong>
                            <span className="text-muted">
                              {product.category}
                            </span>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="d-flex border-bottom pb-2">
                            <strong
                              className="me-3 text-dark"
                              style={{ minWidth: "140px" }}
                            >
                              Available Colors:
                            </strong>
                            <span className="text-muted">
                              {product.availableColors?.join(", ")}
                            </span>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="d-flex border-bottom pb-2">
                            <strong
                              className="me-3 text-dark"
                              style={{ minWidth: "140px" }}
                            >
                              Available Sizes:
                            </strong>
                            <span className="text-muted">
                              {product.availableSizes?.join(", ")}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Tab>

                  {/* Reviews tab hidden - can be enabled later */}
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Related Products */}
        <RelatedProducts
          products={relatedProducts.map((p) => ({
            id: p.id || p._id || "",
            name: p.name || "",
            price: p.price ?? 0,
            image:
              Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "",
            rating: p.rating ?? 0,
            reviews: Array.isArray(p.reviews)
              ? p.reviews.length
              : p.reviews ?? 0,
          }))}
          formatCurrency={formatCurrency}
          renderStars={renderStars}
        />
      </Container>
    </div>
  );
}
