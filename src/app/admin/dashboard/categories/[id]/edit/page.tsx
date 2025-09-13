"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FiArrowLeft, FiSave, FiUpload, FiX, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { categoryService, Category, CategoryFormData } from "@/lib/categoryService";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parentCategories, setParentCategories] = useState<Pick<Category, "_id" | "name" | "slug">[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [category, setCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    parentCategory: "",
    isActive: true,
    sortOrder: 0,
    metaTitle: "",
    metaDescription: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      if (!params?.id || Array.isArray(params.id)) {
        toast.error("Invalid category id");
        router.push("/admin/dashboard/categories");
        return;
      }
      try {
        setLoading(true);
        const [cats, data] = await Promise.all([
          categoryService.getCategoriesForDropdown(),
          categoryService.getCategoryById(params.id as string),
        ]);
        setParentCategories(cats);
        setCategory(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          parentCategory: (data.parentCategory as any)?._id || "",
          isActive: data.isActive,
          sortOrder: data.sortOrder ?? 0,
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
        });
        setImagePreview(data.image || "");
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP)");
      return;
    }
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image file size must be less than 2MB");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined }));
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (formData.name.trim().length < 2) newErrors.name = "Category name must be at least 2 characters";
    if (formData.description && formData.description.length > 500)
      newErrors.description = "Description must be less than 500 characters";
    if (formData.metaTitle && formData.metaTitle.length > 100)
      newErrors.metaTitle = "Meta title must be less than 100 characters";
    if (formData.metaDescription && formData.metaDescription.length > 200)
      newErrors.metaDescription = "Meta description must be less than 200 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      setSaving(true);
      await categoryService.updateCategory(category._id, {
        ...formData,
        parentCategory: formData.parentCategory || undefined,
      });
      toast.success("Category updated successfully!");
      router.push("/admin/dashboard/categories");
    } catch (e) {
      console.error("Failed to update category:", e);
      // Service already shows toast
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!category) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Category not found.</Alert>
      </Container>
    );
  }

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
            <div>
              <h2 className="mb-0">Edit Category</h2>
              <p className="text-muted mb-0">Update category details</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Form onSubmit={onSubmit}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Basic Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Category Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter category name"
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Parent Category</Form.Label>
                      <Form.Select
                        name="parentCategory"
                        value={formData.parentCategory}
                        onChange={handleInputChange}
                      >
                        <option value="">No Parent (Root Category)</option>
                        {(Array.isArray(parentCategories) ? parentCategories : []).map((pc) => (
                          <option key={pc._id} value={pc._id}>
                            {pc.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter category description (optional)"
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Category Image</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <div className="d-flex align-items-start gap-3">
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                      />
                      <Button
                        variant="outline-primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={saving}
                      >
                        <FiUpload size={16} className="me-2" />
                        Choose Image
                      </Button>
                      <small className="d-block text-muted mt-1">
                        Max file size: 2MB. Formats: JPEG, PNG, WebP
                      </small>
                    </div>

                    {imagePreview ? (
                      <div className="position-relative">
                        <img
                          src={(imagePreview.startsWith("http") || imagePreview.startsWith("data:")) ? imagePreview : (() => {
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
                            const origin = apiUrl.replace(/\/?api\/?$/, "");
                            const after = imagePreview.split(/\/uploads\//).pop();
                            if (after && after !== imagePreview) return `${origin}/uploads/${after}`;
                            const fname = imagePreview.split(/[\/\\]/).pop();
                            return `${origin}/uploads/${fname}`;
                          })()}
                          alt="Category preview"
                          className="img-thumbnail"
                          style={{ width: 100, height: 100, objectFit: "cover" }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          style={{ transform: "translate(50%, -50%)" }}
                          onClick={removeImage}
                          disabled={saving}
                        >
                          <FiX size={12} />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light border rounded"
                        style={{ width: 100, height: 100 }}
                      >
                        <FiImage className="text-muted" size={24} />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Settings</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sort Order</Form.Label>
                      <Form.Control
                        type="number"
                        name="sortOrder"
                        value={formData.sortOrder}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                      />
                      <Form.Text className="text-muted">
                        Lower numbers appear first
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="isActive"
                        label="Active"
                        checked={!!formData.isActive}
                        onChange={handleInputChange}
                      />
                      <Form.Text className="text-muted">
                        Inactive categories won't be visible on the website
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">SEO Settings</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Meta Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    placeholder="Enter meta title (optional)"
                    isInvalid={!!errors.metaTitle}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.metaTitle}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Meta Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    placeholder="Enter meta description (optional)"
                    isInvalid={!!errors.metaDescription}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.metaDescription}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>

            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => router.push("/admin/dashboard/categories")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="me-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}