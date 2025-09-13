"use client";

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  Modal,
} from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiUpload,
  FiImage,
  FiArrowUp,
  FiArrowDown,
  FiGlobe,
  FiLink,
  FiType,
  FiX,
} from "react-icons/fi";
import { useBanners, Banner, BannerFormData } from "@/hooks/useBanners";

// Validation schema for banner
const bannerSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  subtitle: yup.string().max(200, "Subtitle must not exceed 200 characters"),
  buttonText: yup.string().max(50, "Button text must not exceed 50 characters"),
  buttonLink: yup
    .string()
    .test(
      "url",
      "Please enter a valid URL (e.g., https://example.com)",
      function (value) {
        if (!value || value.trim() === "") return true; // Allow empty values
        const trimmedValue = value.trim();

        // Check for URL duplication pattern
        if (trimmedValue.includes("localhost:3002/admin/dashboard/homepage")) {
          return this.createError({
            message: "Invalid URL format detected. Please enter a clean URL.",
          });
        }

        try {
          const url = new URL(trimmedValue);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      }
    )
    .when("buttonText", (buttonText, schema) =>
      buttonText
        ? schema.required(
            "Button link is required when button text is provided"
          )
        : schema
    ),
  targetUrl: yup
    .string()
    .test(
      "url",
      "Please enter a valid URL (e.g., https://example.com)",
      function (value) {
        if (!value || value.trim() === "") return true; // Allow empty values
        const trimmedValue = value.trim();

        // Check for URL duplication pattern
        if (trimmedValue.includes("localhost:3002/admin/dashboard/homepage")) {
          return this.createError({
            message: "Invalid URL format detected. Please enter a clean URL.",
          });
        }

        try {
          const url = new URL(trimmedValue);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      }
    ),
  isActive: yup.boolean(),
});

// Form validation interface (extends the hook interface)
interface FormBannerData extends BannerFormData {
  image?: File;
}

export default function HomepageManagementPage() {
  // Use the custom hook for banner management
  const {
    banners,
    loading: bannersLoading,
    error: bannersError,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    moveBanner,
  } = useBanners();

  // Local state for UI
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setError,
    clearErrors,
    getValues,
  } = useForm<FormBannerData>({
    resolver: yupResolver(bannerSchema) as any,
    mode: "onChange",
    defaultValues: {
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
      targetUrl: "",
      isActive: true,
    },
  });

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      // For existing banners, show the current image from server
      setUploadedImage(
        `${
          process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
          "http://localhost:8080"
        }/${banner.image}`
      );
      setSelectedImageFile(null);
      reset({
        title: banner.title,
        subtitle: banner.subtitle || "",
        buttonText: banner.buttonText || "",
        buttonLink: banner.buttonLink || "",
        targetUrl: banner.targetUrl || "",
        isActive: banner.isActive,
      });
    } else {
      setEditingBanner(null);
      setUploadedImage("");
      setSelectedImageFile(null);
      reset({
        title: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        targetUrl: "",
        isActive: true,
      });
    }
    setUploadProgress(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setUploadedImage("");
    setSelectedImageFile(null);
    setUploadProgress(0);
    reset();
  };

  const onSubmit = async (data: FormBannerData) => {
    console.log("Form submission started with data:", data);

    // For new banners, require image file
    // For existing banners, image is optional (keep existing if not changed)
    if (!editingBanner && !selectedImageFile) {
      console.log("No image file selected for new banner");
      setError("root", {
        type: "manual",
        message: "Please upload a banner image",
      });
      return;
    }

    setIsLoading(true);
    clearErrors();

    try {
      // Clean URLs to prevent localhost admin URL issues
      const cleanUrl = (url: string) => {
        if (!url) return "";
        const trimmed = url.trim();
        // Only remove if it's exactly the admin dashboard URL (auto-filled by browser)
        if (
          trimmed === "http://localhost:3000/admin/dashboard/homepage" ||
          trimmed === "http://localhost:3002/admin/dashboard/homepage" ||
          trimmed === "https://localhost:3000/admin/dashboard/homepage" ||
          trimmed === "https://localhost:3002/admin/dashboard/homepage"
        ) {
          return "";
        }
        return trimmed;
      };

      const bannerData: BannerFormData = {
        title: data.title,
        subtitle: data.subtitle || "",
        buttonText: data.buttonText || "",
        buttonLink: cleanUrl(data.buttonLink || ""),
        targetUrl: cleanUrl(data.targetUrl || ""),
        isActive: data.isActive,
        image: selectedImageFile || undefined,
      };

      console.log("Banner data prepared:", {
        ...bannerData,
        image: bannerData.image ? `File: ${bannerData.image.name}` : "No image",
      });

      // Log FormData contents for debugging
      if (bannerData.image) {
        console.log("Image file details:", {
          name: bannerData.image.name,
          size: bannerData.image.size,
          type: bannerData.image.type,
        });
      }

      let result: Banner | null = null;

      if (editingBanner) {
        console.log("Updating existing banner:", editingBanner._id);
        // Update existing banner
        result = await updateBanner(
          editingBanner._id,
          bannerData,
          setUploadProgress
        );
      } else {
        console.log("Creating new banner");
        // Create new banner
        result = await createBanner(bannerData, setUploadProgress);
      }

      console.log("Banner operation result:", result);

      if (result) {
        closeModal();
      }
    } catch (error) {
      console.error("Banner save error:", error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      // Check if it's an API error with response data
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as any;
        console.error("API Error Response:", apiError.response?.data);
        console.error("API Error Status:", apiError.response?.status);
      }

      setError("root", {
        type: "manual",
        message: "Failed to save banner. Please check the console for details.",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleBannerStatus = async (bannerId: string) => {
    await toggleBannerStatus(bannerId);
  };

  const handleMoveBanner = async (
    bannerId: string,
    direction: "up" | "down"
  ) => {
    await moveBanner(bannerId, direction);
  };

  const handleDeleteBanner = async () => {
    if (selectedBanner) {
      const success = await deleteBanner(selectedBanner._id);
      if (success) {
        setShowDeleteModal(false);
        setSelectedBanner(null);
      }
    }
  };

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Homepage Management</h1>
          <p className="text-muted mb-0">Manage homepage banners and sliders</p>
        </div>
        <Button variant="primary" onClick={() => openModal()}>
          <FiPlus className="me-2" />
          Add Banner
        </Button>
      </div>

      {/* Banners Section */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FiImage className="me-2" />
              Homepage Banners
            </h5>
            <Badge bg="primary">{banners.length} banners</Badge>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {bannersError && (
            <div className="alert alert-danger m-3">
              <strong>Error:</strong> {bannersError}
            </div>
          )}

          {bannersLoading && sortedBanners.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h6 className="text-muted">Loading banners...</h6>
            </div>
          ) : sortedBanners.length === 0 ? (
            <div className="text-center py-5">
              <FiImage size={48} className="text-muted mb-3" />
              <h6 className="text-muted">No Banners Found</h6>
              <p className="text-muted mb-4">
                Create your first homepage banner to get started.
              </p>
              <Button variant="primary" onClick={() => openModal()}>
                <FiPlus className="me-2" />
                Add First Banner
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Order</th>
                    <th>Banner</th>
                    <th>Title</th>
                    <th>Button</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBanners.map((banner, index) => (
                    <tr key={banner._id}>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <span className="fw-bold text-primary">
                            #{banner.order}
                          </span>
                          <div className="d-flex flex-column">
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 lh-1"
                              onClick={() => handleMoveBanner(banner._id, "up")}
                              disabled={index === 0 || bannersLoading}
                            >
                              <FiArrowUp size={12} />
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 lh-1"
                              onClick={() =>
                                handleMoveBanner(banner._id, "down")
                              }
                              disabled={
                                index === sortedBanners.length - 1 ||
                                bannersLoading
                              }
                            >
                              <FiArrowDown size={12} />
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <img
                          src={`${
                            process.env.NEXT_PUBLIC_API_URL?.replace(
                              "/api",
                              ""
                            ) || "http://localhost:8080"
                          }/${banner.image}`}
                          alt={banner.title}
                          className="rounded"
                          style={{
                            width: "80px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>
                        <div>
                          <h6 className="mb-1">{banner.title}</h6>
                          {banner.subtitle && (
                            <small className="text-muted">
                              {banner.subtitle}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        {banner.buttonText ? (
                          <div>
                            <Badge bg="info" className="mb-1">
                              {banner.buttonText}
                            </Badge>
                            {banner.buttonLink && (
                              <div>
                                <small className="text-muted d-flex align-items-center">
                                  <FiLink size={12} className="me-1" />
                                  {banner.buttonLink}
                                </small>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">No button</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Badge
                            bg={banner.isActive ? "success" : "secondary"}
                            className="me-2"
                          >
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0"
                            onClick={() => handleToggleBannerStatus(banner._id)}
                            disabled={bannersLoading}
                          >
                            {banner.isActive ? (
                              <FiEye className="text-success" size={18} />
                            ) : (
                              <FiEyeOff className="text-muted" size={18} />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openModal(banner)}
                            title="Edit Banner"
                            disabled={bannersLoading}
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setSelectedBanner(banner);
                              setShowDeleteModal(true);
                            }}
                            title="Delete Banner"
                            disabled={bannersLoading}
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

      {/* Banner Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingBanner ? "Edit Banner" : "Add New Banner"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit as any)} noValidate>
          <Modal.Body>
            {errors.root && (
              <div className="alert alert-danger mb-3">
                {errors.root.message}
              </div>
            )}

            {/* Image Upload */}
            <div className="mb-4">
              <Form.Label>Banner Image *</Form.Label>
              <div className="border-2 border-dashed border-light rounded p-4 text-center">
                {uploadedImage ? (
                  <div className="position-relative">
                    <img
                      src={uploadedImage}
                      alt="Banner preview"
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: "200px" }}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2"
                      onClick={() => {
                        setUploadedImage("");
                        setSelectedImageFile(null);
                      }}
                    >
                      <FiX size={14} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <FiUpload size={32} className="text-muted mb-2" />
                    <p className="text-muted mb-2">Upload banner image</p>
                  </>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="d-none"
                  id="bannerImageUpload"
                />
                <Button
                  variant="outline-primary"
                  as="label"
                  htmlFor="bannerImageUpload"
                  className="cursor-pointer"
                  disabled={isLoading}
                >
                  {uploadedImage ? "Change Image" : "Choose Image"}
                </Button>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">Uploading...</small>
                    <small className="text-muted">{uploadProgress}%</small>
                  </div>
                  <div className="progress" style={{ height: "4px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${uploadProgress}%` }}
                      aria-valuenow={uploadProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder="Enter banner title"
                        isInvalid={!!errors.title}
                        disabled={isLoading}
                      />
                    )}
                  />
                  {errors.title && (
                    <Form.Control.Feedback type="invalid">
                      {errors.title.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subtitle</Form.Label>
                  <Controller
                    name="subtitle"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder="Enter banner subtitle"
                        isInvalid={!!errors.subtitle}
                        disabled={isLoading}
                      />
                    )}
                  />
                  {errors.subtitle && (
                    <Form.Control.Feedback type="invalid">
                      {errors.subtitle.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Button Text</Form.Label>
                  <Controller
                    name="buttonText"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder="e.g., Shop Now"
                        isInvalid={!!errors.buttonText}
                        disabled={isLoading}
                      />
                    )}
                  />
                  {errors.buttonText && (
                    <Form.Control.Feedback type="invalid">
                      {errors.buttonText.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Button Link</Form.Label>
                  <Controller
                    name="buttonLink"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="url"
                        placeholder="https://example.com/page"
                        isInvalid={!!errors.buttonLink}
                        disabled={isLoading}
                        autoComplete="off"
                      />
                    )}
                  />
                  {errors.buttonLink && (
                    <Form.Control.Feedback type="invalid">
                      {errors.buttonLink.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Target URL (Banner Click)</Form.Label>
              <Controller
                name="targetUrl"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="url"
                    placeholder="https://example.com/target-page"
                    isInvalid={!!errors.targetUrl}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                )}
              />
              {errors.targetUrl && (
                <Form.Control.Feedback type="invalid">
                  {errors.targetUrl.message}
                </Form.Control.Feedback>
              )}
              <Form.Text className="text-muted">
                URL to navigate when banner is clicked (optional)
              </Form.Text>
            </Form.Group>

            <Controller
              name="isActive"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Form.Check
                  type="checkbox"
                  id="isActive"
                  label="Active (visible on homepage)"
                  checked={value}
                  onChange={onChange}
                  disabled={isLoading}
                />
              )}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={closeModal}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !isDirty || !isValid}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                <>{editingBanner ? "Update Banner" : "Create Banner"}</>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

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
          <p>
            Are you sure you want to delete the banner{" "}
            <strong>"{selectedBanner?.title}"</strong>?
          </p>
          <p className="text-muted mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteBanner}>
            Delete Banner
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
