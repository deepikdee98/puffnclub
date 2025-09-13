"use client";

import { useState, useEffect } from "react";
import { Card, Button, Table, Badge } from "react-bootstrap";
import { FiPlus, FiPackage, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { formatCurrency, formatRelativeTime } from "@/utils/helpers";
import { productsAPI } from "@/lib/api";
import { toast } from "react-toastify";

// Helper function to transform API response
const transformProduct = (product: any) => {
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/default-image.png";
    // Log for debugging
    if (typeof window !== 'undefined') {
      console.log("Checking image path:", imagePath);
    }
    // Only rewrite if NOT a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, treat as local file and rewrite
    const filename = imagePath.split("/").pop();
    return `http://localhost:8080/uploads/${filename}`;
  };

  // Get image from variants or fallback to legacy images
  let productImage = "https://via.placeholder.com/150x150?text=No+Image";
  if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
    productImage = getImageUrl(product.variants[0].images[0]);
  } else if (product.images && product.images.length > 0) {
    productImage = getImageUrl(product.images[0]);
  }

  // Calculate total stock from variants or use legacy stock
  let totalStock = 0;
  if (product.variants && product.variants.length > 0) {
    totalStock = product.variants.reduce((sum: number, variant: any) => sum + (variant.stock || 0), 0);
  } else {
    totalStock = product.stockQuantity || product.stock || 0;
  }

  return {
    ...product,
    id: product._id || product.id,
    image: productImage,
    stock: totalStock,
    status: product.status?.toLowerCase() || "draft",
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getProducts();
        const transformedProducts = (response || []).map(transformProduct);
        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
        setProducts([]); // Set empty array instead of mock data
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Product Management</h1>
          <p className="text-muted mb-0">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/dashboard/products/add" passHref>
            <Button variant="primary">
              <FiPlus className="me-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <FiPackage size={48} className="text-muted mb-3" />
              <h6 className="text-muted">No Products Found</h6>
              <p className="text-muted mb-4">
                No products have been added yet.
              </p>
              <Link href="/admin/dashboard/products/add" passHref>
                <Button variant="primary">
                  <FiPlus className="me-2" />
                  Add First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="rounded me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <div className="fw-medium">{product.name}</div>
                            <small className="text-muted">
                              {product.brand}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code className="bg-light px-2 py-1 rounded">
                          {product.sku}
                        </code>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <div>
                          <span className="fw-medium">
                            {formatCurrency(product.price)}
                          </span>
                          {product.comparePrice && (
                            <div>
                              <small className="text-muted text-decoration-line-through">
                                {formatCurrency(product.comparePrice)}
                              </small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            product.stock > 10
                              ? "bg-success"
                              : product.stock > 0
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td>
                        <Badge
                          bg={
                            product.status === "active"
                              ? "success"
                              : product.status === "inactive"
                              ? "secondary"
                              : "warning"
                          }
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link
                            href={`/admin/dashboard/products/${product.id}`}
                            passHref
                          >
                            <Button
                              variant="outline-primary"
                              size="sm"
                              title="View Product"
                            >
                              <FiEye size={14} />
                            </Button>
                          </Link>
                          <Link
                            href={`/admin/dashboard/products/${product.id}/edit`}
                            passHref
                          >
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Edit Product"
                            >
                              <FiEdit size={14} />
                            </Button>
                          </Link>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Delete Product"
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to delete ${product.name}?`
                                )
                              ) {
                                toast.info(
                                  "Delete functionality will be implemented soon"
                                );
                              }
                            }}
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
