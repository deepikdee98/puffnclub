"use client";

import { ChangeEvent } from "react";
import { Row, Col, Card, Button, Form, Table, Badge } from "react-bootstrap";
import { Controller, Control, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { FiUpload, FiX } from "react-icons/fi";
import { ProductFormData, SizeStock } from "../schemas/productValidation";

interface VariantCardProps {
  control: Control<ProductFormData>;
  index: number;
  remove: (index: number) => void;
  errors: FieldErrors<ProductFormData>;
  availableSizes: string[];
  availableColors: string[];
  isLoading: boolean;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

export default function VariantCard({
  control,
  index,
  remove,
  errors,
  availableSizes,
  availableColors,
  isLoading,
  watch,
  setValue,
}: VariantCardProps) {
  const variantImages = watch(`variants.${index}.imagePreviews`);
  const sizeStocks = watch(`variants.${index}.sizeStocks`) || [];

  // Initialize size stocks if empty
  const initializeSizeStocks = () => {
    if (sizeStocks.length === 0) {
      const initialSizeStocks = availableSizes.map((size) => ({
        size,
        stock: 0,
        available: false,
      }));
      setValue(`variants.${index}.sizeStocks`, initialSizeStocks, {
        shouldValidate: true,
      });
    }
  };

  // Calculate total stock
  const updateTotalStock = () => {
    const total = sizeStocks.reduce((sum, sizeStock) => sum + (sizeStock.stock || 0), 0);
    setValue(`variants.${index}.totalStock`, total, { shouldValidate: true });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);

      // Store actual files
      const currentImages = watch(`variants.${index}.images`) || [];
      setValue(
        `variants.${index}.images`,
        [...currentImages, ...newFiles] as File[],
        { shouldValidate: true }
      );

      // Create preview URLs for display
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const newPreview = e.target.result as string;
            const currentPreviews =
              watch(`variants.${index}.imagePreviews`) || [];
            setValue(
              `variants.${index}.imagePreviews`,
              [...currentPreviews, newPreview],
              { shouldValidate: true }
            );
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (imgIndex: number) => {
    const currentPreviews = watch(`variants.${index}.imagePreviews`) || [];
    const newPreviews = currentPreviews.filter((_, i) => i !== imgIndex);
    setValue(`variants.${index}.imagePreviews`, newPreviews, {
      shouldValidate: true,
    });

    const currentImages = watch(`variants.${index}.images`) || [];
    const newImages = currentImages.filter((_, i) => i !== imgIndex);
    setValue(`variants.${index}.images`, newImages, { shouldValidate: true });
  };

  const updateSizeStock = (size: string, stock: number) => {
    const currentSizeStocks = watch(`variants.${index}.sizeStocks`) || [];
    const updatedSizeStocks = currentSizeStocks.map((sizeStock) =>
      sizeStock.size === size
        ? { ...sizeStock, stock, available: stock > 0 }
        : sizeStock
    );
    setValue(`variants.${index}.sizeStocks`, updatedSizeStocks, {
      shouldValidate: true,
    });
    
    // Update total stock
    const total = updatedSizeStocks.reduce((sum, sizeStock) => sum + (sizeStock.stock || 0), 0);
    setValue(`variants.${index}.totalStock`, total, { shouldValidate: true });
  };

  const getSizeStock = (size: string): number => {
    const sizeStock = sizeStocks.find((ss) => ss.size === size);
    return sizeStock ? sizeStock.stock : 0;
  };

  // Initialize size stocks on first render
  if (sizeStocks.length === 0) {
    initializeSizeStocks();
  }

  return (
    <Card className="mb-4 border">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Variant #{index + 1}</h6>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => remove(index)}
          disabled={isLoading}
        >
          Remove
        </Button>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Color *</Form.Label>
              <Controller
                name={`variants.${index}.color`}
                control={control}
                render={({ field }) => (
                  <Form.Select
                    {...field}
                    isInvalid={!!errors.variants?.[index]?.color}
                    disabled={isLoading}
                  >
                    <option value="">Select color</option>
                    {availableColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
              {errors.variants?.[index]?.color && (
                <Form.Control.Feedback type="invalid">
                  {errors.variants[index]?.color?.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Total Stock</Form.Label>
              <Controller
                name={`variants.${index}.totalStock`}
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="number"
                    disabled
                    value={field.value || 0}
                    className="bg-light"
                  />
                )}
              />
              <Form.Text className="text-muted">
                Auto-calculated from size stocks below
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Stock by Size *</Form.Label>
          <Table size="sm" bordered>
            <thead className="bg-light">
              <tr>
                <th>Size</th>
                <th>Stock Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {availableSizes.map((size) => (
                <tr key={size}>
                  <td className="fw-bold">{size}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="0"
                      value={getSizeStock(size)}
                      onChange={(e) =>
                        updateSizeStock(size, parseInt(e.target.value) || 0)
                      }
                      disabled={isLoading}
                      size="sm"
                    />
                  </td>
                  <td>
                    <Badge
                      bg={getSizeStock(size) > 0 ? "success" : "secondary"}
                      className="text-capitalize"
                    >
                      {getSizeStock(size) > 0 ? "Available" : "Out of Stock"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {errors.variants?.[index]?.sizeStocks && (
            <div className="text-danger mt-2 small">
              {errors.variants[index]?.sizeStocks?.message}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Variant Images *</Form.Label>
          <Controller
            name={`variants.${index}.imagePreviews`}
            control={control}
            render={({ field: { value } }) => (
              <>
                <div className="border-2 border-dashed border-light rounded p-3 text-center mb-3">
                  <FiUpload size={24} className="text-muted mb-2" />
                  <p className="text-muted mb-2">
                    Upload images for this specific color variant
                  </p>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="d-none"
                    id={`imageUpload-${index}`}
                  />
                  <Button
                    variant="outline-primary"
                    as="label"
                    htmlFor={`imageUpload-${index}`}
                    className="cursor-pointer"
                  >
                    Choose Images
                  </Button>
                </div>

                {value && value.length > 0 && (
                  <div className="row g-3">
                    {value.map((image: string, imgIndex: number) => (
                      <div key={imgIndex} className="col-md-3">
                        <div className="position-relative">
                          <img
                            src={image}
                            alt={`Variant ${index + 1} - Image ${imgIndex + 1}`}
                            className="img-fluid rounded"
                            style={{
                              aspectRatio: "1",
                              objectFit: "cover",
                              height: "120px",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(imgIndex)}
                          >
                            <FiX size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          />
          {errors.variants?.[index]?.images && (
            <Form.Text className="text-danger">
              {errors.variants[index]?.images?.message}
            </Form.Text>
          )}
        </Form.Group>
      </Card.Body>
    </Card>
  );
}