"use client";

import { Row, Col, Card, Form } from "react-bootstrap";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { FiDollarSign } from "react-icons/fi";
import { ProductFormData } from "../schemas/productValidation";

interface PricingFormProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  isLoading: boolean;
}

export default function PricingForm({
  control,
  errors,
  isLoading,
}: PricingFormProps) {
  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Header className="bg-light border-0">
        <h5 className="mb-0">
          <FiDollarSign className="me-2" />
          Pricing
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Price *</Form.Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    isInvalid={!!errors.price}
                    disabled={isLoading}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              />
              {errors.price && (
                <Form.Control.Feedback type="invalid">
                  {errors.price.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Compare Price</Form.Label>
              <Controller
                name="comparePrice"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    isInvalid={!!errors.comparePrice}
                    disabled={isLoading}
                    value={
                      field.value === null || field.value === undefined
                        ? ""
                        : field.value
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value)
                      )
                    }
                  />
                )}
              />
              {errors.comparePrice && (
                <Form.Control.Feedback type="invalid">
                  {errors.comparePrice?.message}
                </Form.Control.Feedback>
              )}
              <Form.Text className="text-muted">
                Original price for discount display
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}