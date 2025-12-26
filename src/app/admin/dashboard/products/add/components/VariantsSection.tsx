"use client";

import { Card, Button, Form } from "react-bootstrap";
import { Control, FieldErrors, UseFormWatch, UseFormSetValue, UseFieldArrayReturn } from "react-hook-form";
import { ProductFormData } from "../schemas/productValidation";
import { availableSizes, availableColors } from "../constants/productConstants";
import VariantCard from "./VariantCard";

interface VariantsSectionProps {
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  isLoading: boolean;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  fieldArray: UseFieldArrayReturn<ProductFormData, "variants", "id">;
}

export default function VariantsSection({
  control,
  errors,
  isLoading,
  watch,
  setValue,
  fieldArray,
}: VariantsSectionProps) {
  const { fields, append, remove } = fieldArray;

  const createNewVariant = () => {
    const initialSizeStocks = availableSizes.map((size) => ({
      size,
      stock: 0,
      available: false,
    }));

    append({
      color: "#000000",
      sizeStocks: initialSizeStocks,
      totalStock: 0,
      images: [],
      imagePreviews: [],
    });
  };

  return (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Header className="bg-light border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Color Variants</h5>
        <Button
          variant="primary"
          size="sm"
          onClick={createNewVariant}
          disabled={isLoading}
        >
          Add Color Variant
        </Button>
      </Card.Header>
      <Card.Body>
        {fields.map((field, index) => (
          <VariantCard
            key={field.id}
            control={control}
            index={index}
            remove={remove}
            errors={errors}
            availableSizes={availableSizes}
            availableColors={availableColors}
            isLoading={isLoading}
            watch={watch}
            setValue={setValue}
          />
        ))}
        {errors.variants && !fields.length && (
          <Form.Text className="text-danger">
            {errors.variants.message}
          </Form.Text>
        )}
      </Card.Body>
    </Card>
  );
}