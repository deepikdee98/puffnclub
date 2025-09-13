"use client";

import { useState, useEffect } from "react";
import { Row, Col, Card, Button, Badge, Table, Modal } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiImage,
  FiEye,
  FiStar,
} from "react-icons/fi";
import Link from "next/link";
import { formatCurrency, formatRelativeTime } from "@/utils/helpers";
import { productsAPI } from "@/lib/api";
import { toast } from "react-toastify";

// Mock product data (same as in products page)
const mockProducts = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    sku: "TSH001",
    category: "T-Shirts",
    brand: "StyleCraft",
    color: "Blue",
    price: 29.99,
    comparePrice: 39.99,
    stock: 150,
    status: "active",
    featured: true,
    tags: ["New Arrival", "Trending"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Premium quality cotton t-shirt with comfortable fit. Perfect for casual wear and everyday comfort. Made from 100% organic cotton with sustainable manufacturing processes.",
    images: [
      "https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
    ],
    metaTitle: "Premium Cotton T-Shirt - StyleCraft",
    metaDescription:
      "Shop our premium cotton t-shirt collection. Comfortable, stylish, and sustainable.",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Denim Jacket Classic",
    sku: "JKT002",
    category: "Jackets",
    brand: "UrbanStyle",
    color: "Dark Blue",
    price: 89.99,
    comparePrice: 120.0,
    stock: 45,
    status: "active",
    featured: false,
    tags: ["Sale"],
    sizes: ["M", "L", "XL"],
    description:
      "Classic denim jacket with vintage styling. Perfect for layering and adding a casual touch to any outfit.",
    images: [
      "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400",
    ],
    metaTitle: "Classic Denim Jacket - UrbanStyle",
    metaDescription:
      "Vintage-style denim jacket perfect for any casual outfit.",
    createdAt: "2024-01-14T16:20:00Z",
    updatedAt: "2024-01-14T16:20:00Z",
  },
];

// Helper function to transform API response
const transformProduct = (product: any) => {
  console.log("Transforming product:", product);

  // Extract all images from variants
  const variantImages: string[] = [];
  const allColors: string[] = [];
  const allSizes: string[] = [];
  let totalStock = 0;

  if (product.variants && Array.isArray(product.variants)) {
    product.variants.forEach((variant: any) => {
      // Collect images from variants
      if (variant.images && Array.isArray(variant.images)) {
        variantImages.push(...variant.images);
      }
      
      // Collect colors
      if (variant.color) {
        allColors.push(variant.color);
      }
      
      // Collect sizes
      if (variant.sizes && Array.isArray(variant.sizes)) {
        allSizes.push(...variant.sizes);
      }
      
      // Sum up stock
      if (typeof variant.stock === 'number') {
        totalStock += variant.stock;
      }
    });
  }

  // Use variant images if available, otherwise fallback to product images
  const productImages = variantImages.length > 0 
    ? variantImages 
    : (product.images && product.images.length > 0 
        ? product.images 
        : ["https://via.placeholder.com/400x400?text=No+Image"]);

  // Remove duplicates from sizes
  const uniqueSizes = [...new Set(allSizes)];

  return {
    ...product,
    id: product._id || product.id,
    images: productImages,
    stock: totalStock || product.stockQuantity || product.stock || 0,
    status: product.status?.toLowerCase() || "draft",
    sizes: uniqueSizes.length > 0 ? uniqueSizes : (product.availableSizes || product.sizes || []),
    colors: allColors.length > 0 ? allColors : (product.color ? [product.color] : ["Not specified"]),
    variants: product.variants || [],
  };
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Fetch product from API
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.getProduct(params.id as string);
        if (response) {
          const transformedProduct = transformProduct(response);
          setProduct(transformedProduct);
        } else {
          toast.error("Product not found");
          router.push("/admin/dashboard/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");

        // Fallback to mock data for development
        const foundProduct = mockProducts.find((p) => p.id === params.id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          router.push("/admin/dashboard/products");
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "draft":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { variant: "danger", text: "Out of Stock" };
    if (stock < 20) return { variant: "warning", text: "Low Stock" };
    return { variant: "success", text: "In Stock" };
  };

  const handleDeleteProduct = async () => {
    setDeleting(true);
    try {
      await productsAPI.deleteProduct(product.id);
      toast.success("Product deleted successfully");
      router.push("/admin/dashboard/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-5">
        <FiPackage size={48} className="text-muted mb-3" />
        <h5 className="text-muted">Product Not Found</h5>
        <p className="text-muted mb-4">
          The product you're looking for doesn't exist.
        </p>
        <Button variant="primary" as="a" href="/admin/dashboard/products">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center mb-2">
            <Button
              variant="outline-secondary"
              className="p-0 me-3"
              as="a"
              href="/admin/dashboard/products"
            >
              <FiArrowLeft size={20} />
            </Button>
            <h1 className="h3 mb-0">Product Details</h1>
          </div>
          <p className="text-muted mb-0">View and manage product information</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            as="a"
            href={`/admin/dashboard/products/${product.id}/edit`}
          >
            <FiEdit className="me-2" />
            Edit Product
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <FiTrash2 className="me-2" />
            Delete
          </Button>
        </div>
      </div>

      <Row>
        <Col lg={8}>
          {/* Product Images */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">
                <FiImage className="me-2" />
                Product Images
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <div className="text-center">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "400px", objectFit: "cover" }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x400?text=Image+Not+Found";
                      }}
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex flex-column gap-2">
                    {product.images.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className={`img-fluid rounded cursor-pointer border ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-light"
                        }`}
                        style={{ height: "80px", objectFit: "cover" }}
                        loading="lazy"
                        onClick={() => setSelectedImage(index)}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                    ))}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Product Information */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">
                <FiPackage className="me-2" />
                Product Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td className="fw-bold" style={{ width: "200px" }}>
                      Product Name:
                    </td>
                    <td>{product.name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">SKU:</td>
                    <td>
                      <code className="text-primary">{product.sku}</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Description:</td>
                    <td>{product.description}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Category:</td>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Brand:</td>
                    <td>{product.brand}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Color:</td>
                    <td>
                      {product.colors && product.colors.length > 0 ? (
                        product.colors.map((color: string) => (
                          <Badge key={color} bg="info" className="me-1">
                            {color}
                          </Badge>
                        ))
                      ) : (
                        <Badge bg="secondary">Not specified</Badge>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Available Sizes:</td>
                    <td>
                      {product.sizes.map((size: string) => (
                        <Badge key={size} bg="secondary" className="me-1">
                          {size}
                        </Badge>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Tags:</td>
                    <td>
                      {product.tags.map((tag: string) => (
                        <Badge key={tag} bg="info" className="me-1">
                          {tag}
                        </Badge>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Created:</td>
                    <td>{formatRelativeTime(product.createdAt)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Last Updated:</td>
                    <td>{formatRelativeTime(product.updatedAt)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* SEO Information */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">SEO Information</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td className="fw-bold" style={{ width: "200px" }}>
                      Meta Title:
                    </td>
                    <td>{product.metaTitle || "Not set"}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Meta Description:</td>
                    <td>{product.metaDescription || "Not set"}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Product Status */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">Product Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Status:</span>
                <Badge
                  bg={getStatusVariant(product.status)}
                  className="text-capitalize"
                >
                  {product.status}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Featured:</span>
                <div className="d-flex align-items-center">
                  <FiStar
                    className={
                      product.featured ? "text-warning me-2" : "text-muted me-2"
                    }
                    size={18}
                    fill={product.featured ? "currentColor" : "none"}
                  />
                  <span>{product.featured ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Visibility:</span>
                <div className="d-flex align-items-center">
                  <FiEye className="text-success me-2" size={18} />
                  <span>Visible</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Pricing */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">
                <FiDollarSign className="me-2" />
                Pricing
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Current Price:</span>
                <span className="h5 text-success mb-0">
                  {formatCurrency(product.price)}
                </span>
              </div>
              {product.comparePrice && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold">Compare Price:</span>
                  <span className="text-muted text-decoration-line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                </div>
              )}
              {product.comparePrice && (
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Discount:</span>
                  <Badge bg="success">
                    {Math.round(
                      ((product.comparePrice - product.price) /
                        product.comparePrice) *
                        100
                    )}
                    % OFF
                  </Badge>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Inventory */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">Inventory</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Stock Quantity:</span>
                <span className="h5 mb-0">{product.stock} units</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Stock Status:</span>
                <Badge bg={getStockStatus(product.stock).variant}>
                  {getStockStatus(product.stock).text}
                </Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Product Variants */}
          {product.variants && product.variants.length > 0 && (
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-light border-0">
                <h5 className="mb-0">Product Variants</h5>
              </Card.Header>
              <Card.Body>
                {product.variants.map((variant: any, index: number) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Variant {index + 1}</h6>
                      <Badge bg="info">{variant.color}</Badge>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted">Stock:</small>
                        <div className="fw-bold">{variant.stock} units</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Sizes:</small>
                        <div>
                          {variant.sizes && variant.sizes.map((size: string) => (
                            <Badge key={size} bg="secondary" className="me-1">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {variant.images && variant.images.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">Images:</small>
                        <div className="d-flex gap-2 mt-1">
                          {variant.images.map((image: string, imgIndex: number) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`${variant.color} variant ${imgIndex + 1}`}
                              className="rounded"
                              style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/50x50?text=No+Image";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  as="a"
                  href={`/admin/dashboard/products/${product.id}/edit`}
                >
                  <FiEdit className="me-2" />
                  Edit Product
                </Button>
                <Button variant="outline-secondary">Duplicate Product</Button>
                <Button variant="outline-warning">Archive Product</Button>
                <Button
                  variant="outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FiTrash2 className="me-2" />
                  Delete Product
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FiTrash2 size={48} className="text-danger mb-3" />
            <h5>Delete Product</h5>
            <p className="text-muted">
              Are you sure you want to delete <strong>{product?.name}</strong>?
              This action cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteProduct}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="me-2" />
                Delete Product
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
