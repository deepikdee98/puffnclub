import { Row, Col, Form } from "react-bootstrap";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { FiDollarSign } from "react-icons/fi";
import { FormCard } from "../ui/FormCard";

interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  comparePrice?: number | null;
  variants: Array<{
    color: string;
    stock: number;
    sizes: string[];
    images: File[];
    imagePreviews: string[];
    existingImages?: string[];
  }>;
  tags: string[];
  status: "active" | "inactive" | "draft";
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

interface PricingInventoryFormProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  isLoading: boolean;
}

export function PricingInventoryForm({ control, errors, isLoading }: PricingInventoryFormProps) {
  return (
    <FormCard title="Pricing" icon={<FiDollarSign />}>
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
                />
              )}
            />
            {errors.comparePrice && (
              <Form.Control.Feedback type="invalid">
                {errors.comparePrice.message}
              </Form.Control.Feedback>
            )}
            <Form.Text className="text-muted">
              Original price for discount display
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
    </FormCard>
  );
}