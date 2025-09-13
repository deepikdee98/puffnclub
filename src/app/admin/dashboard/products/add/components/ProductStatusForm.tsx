"use client";

import { Card, Form } from "react-bootstrap";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { ProductFormData } from "../schemas/productValidation";

interface ProductStatusFormProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  isLoading: boolean;
}

export default function ProductStatusForm({
  control,
  errors,
  isLoading,
}: ProductStatusFormProps) {
  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Header className="bg-light border-0">
        <h5 className="mb-0">Product Status</h5>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Status *</Form.Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Form.Select
                {...field}
                isInvalid={!!errors.status}
                disabled={isLoading}
              >
                <option value="">Select Status</option>
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            )}
          />
          {errors.status && (
            <Form.Control.Feedback type="invalid">
              {errors.status.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Controller
          name="featured"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Form.Check
              type="checkbox"
              id="featured"
              label="Featured Product"
              checked={value}
              onChange={onChange}
              disabled={isLoading}
            />
          )}
        />
      </Card.Body>
    </Card>
  );
}