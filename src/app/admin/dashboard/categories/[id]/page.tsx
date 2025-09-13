"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Table,
} from "react-bootstrap";
import { FiArrowLeft, FiEdit2, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { categoryService, Category } from "@/lib/categoryService";

export default function CategoryDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!params?.id || Array.isArray(params.id)) {
        toast.error("Invalid category id");
        router.push("/admin/dashboard/categories");
        return;
      }
      try {
        setLoading(true);
        const data = await categoryService.getCategoryById(params.id as string);
        setCategory(data);
      } catch (e) {
        console.error("Failed to load category:", e);
        toast.error("Failed to load category");
        router.push("/admin/dashboard/categories");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params?.id, router]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!category) return null;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3 mb-3">
            <Link href="/admin/dashboard/categories" passHref>
              <Button variant="outline-secondary" size="sm">
                <FiArrowLeft size={18} />
              </Button>
            </Link>
            <div className="flex-grow-1">
              <h2 className="mb-0">Category Details</h2>
              <p className="text-muted mb-0">View information for this category</p>
            </div>
            <Link href={`/admin/dashboard/categories/${category._id}/edit`} passHref>
              <Button variant="primary" size="sm">
                <FiEdit2 className="me-2" /> Edit
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Image</h5>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center">
              {category.image ? (
                <img
                  src={(category.image.startsWith("http") || category.image.startsWith("data:")) ? category.image : (() => {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
                    const origin = apiUrl.replace(/\/?api\/?$/, "");
                    const after = category.image.split(/\/uploads\//).pop();
                    if (after && after !== category.image) return `${origin}/uploads/${after}`;
                    const fname = category.image.split(/[\/\\]/).pop();
                    return `${origin}/uploads/${fname}`;
                  })()}
                  alt={category.name}
                  className="img-fluid rounded"
                  style={{ width: 250, height: 250, objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-light border rounded"
                  style={{ width: 250, height: 250 }}
                >
                  <FiImage className="text-muted" size={48} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Details</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <th style={{ width: 200 }}>Name</th>
                    <td><strong>{category.name}</strong></td>
                  </tr>
                  <tr>
                    <th>Slug</th>
                    <td>{category.slug || "—"}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>{category.description || "—"}</td>
                  </tr>
                  <tr>
                    <th>Parent Category</th>
                    <td>{(category.parentCategory as any)?.name || "—"}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <Badge bg={category.isActive ? "success" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <th>Sort Order</th>
                    <td>{category.sortOrder ?? 0}</td>
                  </tr>
                  <tr>
                    <th>Meta Title</th>
                    <td>{category.metaTitle || "—"}</td>
                  </tr>
                  <tr>
                    <th>Meta Description</th>
                    <td>{category.metaDescription || "—"}</td>
                  </tr>
                  <tr>
                    <th>Created</th>
                    <td>{formatDate(category.createdAt)}</td>
                  </tr>
                  <tr>
                    <th>Updated</th>
                    <td>{formatDate(category.updatedAt)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}