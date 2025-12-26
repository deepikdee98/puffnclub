"use client";

import { Card, Form, Button, Row, Col, Table } from "react-bootstrap";
import { Controller, Control, FieldErrors, UseFormWatch, UseFormSetValue, useFieldArray } from "react-hook-form";
import { ProductFormData, SizeChartMeasurement } from "../schemas/productValidation";
import { FiUpload, FiX, FiLayers, FiPlus, FiTrash2 } from "react-icons/fi";
import { ChangeEvent, useState, useEffect } from "react";

interface SizeChartUploadProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  isLoading: boolean;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

export default function SizeChartUpload({
  control,
  errors,
  isLoading,
  watch,
  setValue,
}: SizeChartUploadProps) {
  const formUnit = watch("sizeChartUnit") || "inches";
  const [unit, setUnit] = useState<"inches" | "cm">(formUnit as "inches" | "cm");
  
  const imagePreview = watch("sizeChartImagePreview");

  // Sync unit state with form value
  useEffect(() => {
    if (formUnit && formUnit !== unit) {
      setUnit(formUnit as "inches" | "cm");
    }
  }, [formUnit, unit]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizeChartMeasurements",
  });

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("sizeChartImage", file, { shouldValidate: true });

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setValue("sizeChartImagePreview", e.target.result as string, {
            shouldValidate: true,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("sizeChartImage", null, { shouldValidate: true });
    setValue("sizeChartImagePreview", null, { shouldValidate: true });
  };

  const handleUnitToggle = (newUnit: "inches" | "cm") => {
    setUnit(newUnit);
    setValue("sizeChartUnit", newUnit, { shouldValidate: true });
  };

  const addMeasurementRow = () => {
    append({
      size: "",
      length: 0,
      chest: 0,
      sleeve: 0,
    });
  };

  // Removed updateMeasurement - using Controller instead

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Header className="bg-light border-0">
        <h5 className="mb-0">
          <FiLayers className="me-2" />
          Size Chart
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {/* Image Upload Section */}
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Size Chart Image</Form.Label>
              <div className="border-2 border-dashed border-light rounded p-3 text-center mb-2">
                {imagePreview ? (
                  <div className="position-relative">
                    <img
                      src={imagePreview}
                      alt="Size chart preview"
                      className="img-fluid rounded mb-2"
                      style={{ maxHeight: "300px", width: "100%" }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      onClick={removeImage}
                      disabled={isLoading}
                    >
                      <FiX />
                    </Button>
                  </div>
                ) : (
                  <>
                    <FiUpload size={24} className="text-muted mb-2" />
                    <p className="text-muted mb-2 small">
                      Upload size chart visual guide
                    </p>
                  </>
                )}
                <Controller
                  name="sizeChartImage"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <>
                      <Form.Control
                        {...field}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageUpload(e as ChangeEvent<HTMLInputElement>);
                          onChange(e);
                        }}
                        className="d-none"
                        id="sizeChartImageUpload"
                        disabled={isLoading}
                      />
                      <Button
                        variant="outline-primary"
                        as="label"
                        htmlFor="sizeChartImageUpload"
                        className="cursor-pointer"
                        disabled={isLoading}
                      >
                        {imagePreview ? "Change Image" : "Choose Image"}
                      </Button>
                    </>
                  )}
                />
              </div>
              {errors.sizeChartImage && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {errors.sizeChartImage.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>

          {/* Measurement Table Section */}
          <Col md={8}>
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Label className="mb-0">Size Measurements</Form.Label>
                <div className="d-flex gap-2">
                  {/* Unit Toggle */}
                  <div className="btn-group" role="group">
                    <Button
                      variant={unit === "inches" ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => handleUnitToggle("inches")}
                      disabled={isLoading}
                    >
                      Inches
                    </Button>
                    <Button
                      variant={unit === "cm" ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => handleUnitToggle("cm")}
                      disabled={isLoading}
                    >
                      Cm
                    </Button>
                  </div>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={addMeasurementRow}
                    disabled={isLoading}
                  >
                    <FiPlus className="me-1" />
                    Add Size
                  </Button>
                </div>
              </div>

              {fields.length > 0 ? (
                <Table bordered size="sm" className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Size</th>
                      <th>Length ({unit === "inches" ? "in" : "cm"})</th>
                      <th>Chest ({unit === "inches" ? "in" : "cm"})</th>
                      <th>Sleeve ({unit === "inches" ? "in" : "cm"})</th>
                      <th style={{ width: "60px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id}>
                        <td>
                          <Controller
                            name={`sizeChartMeasurements.${index}.size`}
                            control={control}
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                              <Form.Control
                                {...fieldProps}
                                type="text"
                                placeholder="S, M, L, XL..."
                                value={value || ""}
                                onChange={onChange}
                                disabled={isLoading}
                                size="sm"
                                required
                              />
                            )}
                          />
                        </td>
                        <td>
                          <Controller
                            name={`sizeChartMeasurements.${index}.length`}
                            control={control}
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                              <Form.Control
                                {...fieldProps}
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="0"
                                value={value || ""}
                                onChange={(e) => {
                                  const numValue = parseFloat(e.target.value) || 0;
                                  onChange(numValue);
                                }}
                                disabled={isLoading}
                                size="sm"
                                required
                              />
                            )}
                          />
                        </td>
                        <td>
                          <Controller
                            name={`sizeChartMeasurements.${index}.chest`}
                            control={control}
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                              <Form.Control
                                {...fieldProps}
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="0"
                                value={value || ""}
                                onChange={(e) => {
                                  const numValue = parseFloat(e.target.value) || 0;
                                  onChange(numValue);
                                }}
                                disabled={isLoading}
                                size="sm"
                                required
                              />
                            )}
                          />
                        </td>
                        <td>
                          <Controller
                            name={`sizeChartMeasurements.${index}.sleeve`}
                            control={control}
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                              <Form.Control
                                {...fieldProps}
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="0"
                                value={value || ""}
                                onChange={(e) => {
                                  const numValue = parseFloat(e.target.value) || 0;
                                  onChange(numValue);
                                }}
                                disabled={isLoading}
                                size="sm"
                                required
                              />
                            )}
                          />
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => remove(index)}
                            disabled={isLoading}
                          >
                            <FiTrash2 />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center p-4 border border-dashed rounded">
                  <p className="text-muted mb-2">No size measurements added yet</p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addMeasurementRow}
                    disabled={isLoading}
                  >
                    <FiPlus className="me-1" />
                    Add First Size
                  </Button>
                </div>
              )}

              {errors.sizeChartMeasurements && (
                <Form.Control.Feedback type="invalid" className="d-block mt-2">
                  {errors.sizeChartMeasurements.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
