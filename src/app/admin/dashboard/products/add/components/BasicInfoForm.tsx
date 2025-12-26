"use client";

import { Row, Col, Card, Form } from "react-bootstrap";
import { Controller, Control, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { FiPackage } from "react-icons/fi";
import { ProductFormData } from "../schemas/productValidation";
import { brands } from "../constants/productConstants";
import { useEffect, useState } from "react";
import { categoryService } from "@/lib/categoryService";
import SizeChartUpload from "./SizeChartUpload";

interface BasicInfoFormProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  isLoading: boolean;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

export default function BasicInfoForm({
  control,
  errors,
  isLoading,
  watch,
  setValue,
}: BasicInfoFormProps) {
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setCategoriesLoading(true);
        const cats = await categoryService.getCategoriesForDropdown();
        if (isMounted) setCategoryOptions(cats as any);
      } catch (e) {
        // Errors are already toasted in service; keep silent here
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-light border-0">
          <h5 className="mb-0">
            <FiPackage className="me-2" />
            Basic Information
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name *</Form.Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="Enter product name"
                      isInvalid={!!errors.name}
                      disabled={isLoading}
                    />
                  )}
                />
                {errors.name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.name.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>SKU *</Form.Label>
                <Controller
                  name="sku"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="e.g., TSH001"
                      isInvalid={!!errors.sku}
                      disabled={isLoading}
                      style={{ textTransform: "uppercase" }}
                    />
                  )}
                />
                {errors.sku && (
                  <Form.Control.Feedback type="invalid">
                    {errors.sku.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  as="textarea"
                  rows={4}
                  placeholder="Enter product description"
                  isInvalid={!!errors.description}
                  disabled={isLoading}
                />
              )}
            />
            {errors.description && (
              <Form.Control.Feedback type="invalid">
                {errors.description.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      {...field}
                      isInvalid={!!errors.category}
                      disabled={isLoading || categoriesLoading}
                    >
                      <option value="">{categoriesLoading ? "Loading categories..." : "Select category"}</option>
                      {!categoriesLoading &&
                        categoryOptions.map((c) => (
                          <option key={c._id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                    </Form.Select>
                  )}
                />
                {errors.category && (
                  <Form.Control.Feedback type="invalid">
                    {errors.category.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Brand *</Form.Label>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      {...field}
                      isInvalid={!!errors.brand}
                      disabled={isLoading}
                    >
                      <option value="">Select brand</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                />
                {errors.brand && (
                  <Form.Control.Feedback type="invalid">
                    {errors.brand.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <SizeChartUpload
        control={control}
        errors={errors}
        isLoading={isLoading}
        watch={watch}
        setValue={setValue}
      />
    </>
  );
}