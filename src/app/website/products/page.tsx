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
  Dropdown,
  Pagination,
} from "react-bootstrap";
import {
  FiGrid,
  FiList,
  FiHeart,
  FiShoppingBag,
  FiStar,
  FiFilter,
} from "react-icons/fi";
import Link from "next/link";
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

// Category mapping for display names and API values
// Values must match backend category names in your DB
const categoryMapping = {
  All: { display: "All", value: "" },
  "T-Shirts": { display: "T-Shirts", value: "T-Shirt" },
  "Oversize T-Shirts": {
    display: "Oversize T-Shirts",
    value: "Over_Size",
  },
};

const categories = Object.keys(categoryMapping);

const brands = [
  "All",
  "StyleCraft",
  "UrbanStyle",
  "Floral Fashion",
  "ComfortWalk",
  "TrendyWear",
];
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Above $200", min: 200, max: Infinity },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [pagination, setPagination] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      // 1) First, try to match backend names directly (e.g., T-Shirt, Over_Size)
      const direct = Object.entries(categoryMapping).find(
        ([_, m]) => m.value.toLowerCase() === categoryParam.toLowerCase()
      );
      if (direct) {
        setSelectedCategory(direct[0]);
        return;
      }

      // 2) Accept slugs like "t-shirt" or "over-size" or variations
      const normalized = categoryParam.toLowerCase().replace(/\s+|-|_/g, '');
      if (normalized.includes('oversize')) {
        setSelectedCategory('Oversize T-Shirts');
        return;
      }
      if (normalized.includes('tshirt')) {
        setSelectedCategory('T-Shirts');
        return;
      }

      // 3) Fallback: if unknown, keep "All"
      setSelectedCategory('All');
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
    selectedBrand,
    selectedPriceRange,
    sortBy,
  ]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters: ProductFilters = {
        page: currentPage,
        limit: productsPerPage,
        sortBy:
          sortBy === "name"
            ? "name"
            : sortBy === "price-low"
            ? "price"
            : sortBy === "price-high"
            ? "price"
            : "createdAt",
        sortOrder: sortBy === "price-high" ? "desc" : "asc",
      };

      if (selectedCategory !== "All") {
        filters.category =
          categoryMapping[selectedCategory]?.value || selectedCategory;
      }

      if (selectedPriceRange.min > 0) {
        filters.minPrice = selectedPriceRange.min;
      }
      if (selectedPriceRange.max < Infinity) {
        filters.maxPrice = selectedPriceRange.max;
      }

      console.log("Filters:", filters);
      let response: ProductsResponse;
      const rawCategoryParam = searchParams.get("category");

      if (rawCategoryParam) {
        console.log("Using category endpoint with raw param:", rawCategoryParam);
        response = await productService.getProductsByCategory(rawCategoryParam, {
          ...filters,
          category: undefined,
        });
      } else if (selectedCategory !== "All") {
        const apiCategory = categoryMapping[selectedCategory]?.value || selectedCategory;
        console.log("Using category endpoint with mapped value:", apiCategory);
        response = await productService.getProductsByCategory(apiCategory, {
          ...filters,
          category: undefined,
        });
      } else {
        console.log("Using generic products endpoint");
        response = await productService.getProducts(filters);
      }

      console.log("Products response:", response);

      // Normalize products data to ensure arrays are always defined
      const normalizedProducts = normalizeProductsData(response.products || []);

      setProducts(normalizedProducts);
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
  const { addToWishlist } = useWishlist();

  const handleAddToWishlist = async (productId: string) => {
    try {
      await addToWishlist({ productId });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
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

  return (
    <Container className="py-4">
      <Row>
        {/* Filters Sidebar */}
        <Col lg={3} className="mb-4 d-none">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 d-flex align-items-center">
                <FiFilter className="me-2" />
                Filters
              </h5>
            </Card.Header>
            <Card.Body>
              {/* Category Filter */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Category</h6>
                {categories.map((category) => (
                  <Form.Check
                    key={category}
                    type="radio"
                    name="category"
                    id={`category-${category}`}
                    label={category}
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="mb-2"
                  />
                ))}
              </div>

              {/* Brand Filter */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Brand</h6>
                {brands.map((brand) => (
                  <Form.Check
                    key={brand}
                    type="radio"
                    name="brand"
                    id={`brand-${brand}`}
                    label={brand}
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(brand)}
                    className="mb-2"
                  />
                ))}
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Price Range</h6>
                {priceRanges.map((range, index) => (
                  <Form.Check
                    key={index}
                    type="radio"
                    name="price"
                    id={`price-${index}`}
                    label={range.label}
                    checked={selectedPriceRange === range}
                    onChange={() => setSelectedPriceRange(range)}
                    className="mb-2"
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Products Section */}
        <Col lg={12}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-1">Products</h4>
              <p className="text-muted mb-0">
                {pagination?.totalProducts || products.length} products found
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              {/* Sort Dropdown */}
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  Sort by
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSortBy("name")}>
                    Name
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy("price-low")}>
                    Price: Low to High
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy("price-high")}>
                    Price: High to Low
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy("rating")}>
                    Rating
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* View Mode Toggle */}
              <div className="btn-group" role="group">
                <Button
                  variant={viewMode === "grid" ? "dark" : "outline-secondary"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <FiGrid />
                </Button>
                <Button
                  variant={viewMode === "list" ? "dark" : "outline-secondary"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <FiList />
                </Button>
              </div>
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
                  <Col
                    key={product._id}
                    lg={viewMode === "grid" ? 3 : 12}
                    md={viewMode === "grid" ? 6 : 12}
                    className="mb-4"
                  >
                    <FlipYOnScroll>
                      <Link
                        className="text-decoration-none"
                        href={`/website/products/${product._id}`}
                      >
                        <Card
                          className={`border-0 shadow-sm h-100 product-card ${
                            viewMode === "list" ? "flex-row" : ""
                          }`}
                        >
                          <div
                            className={`position-relative ${
                              viewMode === "list" ? "flex-shrink-0" : ""
                            }`}
                          >
                            <Card.Img
                              variant="top"
                              src={
                                product.images?.[0] ||
                                "https://via.placeholder.com/300x300"
                              }
                              style={{
                                // height: viewMode === "list" ? "200px" : "300px",
                                width: viewMode === "list" ? "200px" : "100%",
                                objectFit: "cover",
                              }}
                            />
                            {product.tags?.length > 0 && (
                              <Badge
                                bg={
                                  product.tags.includes("Sale")
                                    ? "danger"
                                    : product.tags.includes("New Arrival")
                                    ? "success"
                                    : "primary"
                                }
                                className="position-absolute top-0 start-0 m-2"
                              >
                                {product.tags[0]}
                              </Badge>
                            )}
                            <div className="product-actions position-absolute top-0 end-0 m-2">
                              <Button
                                variant="light"
                                size="sm"
                                className="rounded-circle"
                                onClick={() => handleAddToWishlist(product._id)}
                              >
                                <FiHeart size={16} />
                              </Button>
                            </div>
                          </div>
                          <Card.Body
                            className={
                              viewMode === "list"
                                ? "d-flex flex-column justify-content-between"
                                : ""
                            }
                          >
                            <div>
                              <Card.Title className="h6 mb-2">
                                <Link
                                  href={`/website/products/${product._id}`}
                                  className="text-decoration-none text-dark"
                                >
                                  {product.name}
                                </Link>
                              </Card.Title>
                              <div className="d-flex align-items-center mb-2">
                                <div className="me-2">{renderStars(4.5)}</div>
                                <small className="text-muted">(4.5)</small>
                              </div>
                              <p className="text-muted small mb-2">
                                {product.brand}
                              </p>
                              {viewMode === "list" && (
                                <div className="mb-2">
                                  <small className="text-muted">
                                    Available sizes:{" "}
                                  </small>
                                  {product.availableSizes.map((size, index) => (
                                    <Badge
                                      key={size}
                                      bg="light"
                                      text="dark"
                                      className="me-1"
                                    >
                                      {size}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <span className="fw-bold text-dark">
                                  Rs. {product.price}
                                </span>
                                {product.comparePrice && (
                                  <small className="text-muted text-decoration-line-through ms-2">
                                    Rs. {product.comparePrice}
                                  </small>
                                )}
                              </div>
                              <Button
                                as="a"
                                href={`/website/products/${product._id}`}
                                variant="dark"
                                size="sm"
                              >
                                <FiShoppingBag size={14} />
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Link>
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
    </Container>
  );
}
