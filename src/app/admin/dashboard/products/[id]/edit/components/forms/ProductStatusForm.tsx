import { Form } from "react-bootstrap";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { FormCard } from "../ui/FormCard";
import { ProductFormData } from "../../schemas/productValidation";

interface ProductStatusFormProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  isLoading: boolean;
}

export function ProductStatusForm({ control, errors, isLoading }: ProductStatusFormProps) {
  return (
    <FormCard title="Product Status">
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
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
    </FormCard>
  );
}