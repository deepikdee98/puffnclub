"use client";

import { ChangeEvent } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { Controller, Control, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { FiUpload, FiX } from "react-icons/fi";
import { ProductFormData } from "../schemas/productValidation";

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

  const toggleSize = (size: string) => {
    const currentSizes = watch(`variants.${index}.sizes`) || [];
    if (currentSizes.includes(size)) {
      setValue(
        `variants.${index}.sizes`,
        currentSizes.filter((s) => s !== size),
        { shouldValidate: true }
      );
    } else {
      setValue(`variants.${index}.sizes`, [...currentSizes, size], {
        shouldValidate: true,
      });
    }
  };

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
              <Form.Label>Stock Quantity *</Form.Label>
              <Controller
                name={`variants.${index}.stock`}
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="number"
                    min="0"
                    placeholder="0"
                    isInvalid={!!errors.variants?.[index]?.stock}
                    disabled={isLoading}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                )}
              />
              {errors.variants?.[index]?.stock && (
                <Form.Control.Feedback type="invalid">
                  {errors.variants[index]?.stock?.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Available Sizes *</Form.Label>
          <Controller
            name={`variants.${index}.sizes`}
            control={control}
            render={({ field: { value } }) => (
              <div className="d-flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <Button
                    key={size}
                    variant={
                      value?.includes(size) ? "primary" : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => toggleSize(size)}
                    type="button"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            )}
          />
          {errors.variants?.[index]?.sizes && (
            <div className="text-danger mt-2 small">
              {errors.variants[index]?.sizes?.message}
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