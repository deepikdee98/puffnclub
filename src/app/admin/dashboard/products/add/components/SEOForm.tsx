"use client";

import { Card, Form } from "react-bootstrap";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { ProductFormData } from "../schemas/productValidation";

interface SEOFormProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  isLoading: boolean;
}

export default function SEOForm({
  control,
  errors,
  isLoading,
}: SEOFormProps) {
  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Header className="bg-light border-0">
        <h5 className="mb-0">SEO Settings</h5>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Meta Title</Form.Label>
          <Controller
            name="metaTitle"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                placeholder="SEO title for search engines"
                isInvalid={!!errors.metaTitle}
                disabled={isLoading}
              />
            )}
          />
          {errors.metaTitle && (
            <Form.Control.Feedback type="invalid">
              {errors.metaTitle?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Meta Description</Form.Label>
          <Controller
            name="metaDescription"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                as="textarea"
                rows={3}
                placeholder="SEO description for search engines"
                isInvalid={!!errors.metaDescription}
                disabled={isLoading}
              />
            )}
          />
          {errors.metaDescription && (
            <Form.Control.Feedback type="invalid">
              {errors.metaDescription?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </Card.Body>
    </Card>
  );
}