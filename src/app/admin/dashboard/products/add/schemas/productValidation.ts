import * as yup from "yup";

export const productSchema = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must not exceed 100 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  sku: yup
    .string()
    .required("SKU is required")
    .matches(
      /^[A-Z0-9]+$/,
      "SKU must contain only uppercase letters and numbers"
    )
    .min(3, "SKU must be at least 3 characters")
    .max(20, "SKU must not exceed 20 characters"),
  category: yup.string().required("Category is required"),
  brand: yup.string().required("Brand is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive")
    .min(0.01, "Price must be at least $0.01"),
  comparePrice: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .nullable()
    .positive("Compare price must be positive")
    .when(["price"], (values: any, schema: any) => {
      const price = values[0];
      return typeof price === "number"
        ? schema.min(price, "Compare price must be higher than regular price")
        : schema;
    }),
  variants: yup
    .array()
    .of(
      yup.object().shape({
        color: yup
          .string()
          .required("Color is required")
          .matches(
            /^#[0-9A-Fa-f]{6}$/,
            "Color must be a valid HEX code (e.g., #FF5733)"
          ),
        sizeStocks: yup
          .array()
          .of(
            yup.object().shape({
              size: yup.string().required("Size is required"),
              stock: yup
                .number()
                .required("Stock quantity is required")
                .integer("Stock must be a whole number")
                .min(0, "Stock cannot be negative"),
              available: yup.boolean().default(false),
            })
          )
          .test(
            "has-available-sizes",
            "At least one size must have stock > 0",
            function (value) {
              if (!value || value.length === 0) return false;
              return value.some((sizeStock) => sizeStock.stock > 0);
            }
          ),
        totalStock: yup.number().min(0, "Total stock cannot be negative"),
        images: yup
          .array()
          .min(1, "At least one image is required for each variant"),
      })
    )
    .min(1, "At least one variant is required")
    .test(
      "unique-colors",
      "Each variant must have a unique color",
      function (value) {
        if (!value) return true;
        const colors = value.map((v) => v.color);
        return new Set(colors).size === colors.length;
      }
    ),
  tags: yup.array().of(yup.string().defined()).max(5, "Maximum 5 tags allowed"),
  status: yup
    .string()
    .oneOf(["Active", "Inactive", "Draft"], "Invalid status")
    .required("Status is required"),
  featured: yup.boolean(),
  metaTitle: yup.string().max(60, "Meta title must not exceed 60 characters"),
  metaDescription: yup
    .string()
    .max(160, "Meta description must not exceed 160 characters"),
  sizeChartImage: yup.mixed<File>().nullable(),
  sizeChartImagePreview: yup.string().nullable(),
  sizeChartMeasurements: yup
    .array()
    .of(
      yup.object().shape({
        size: yup.string().required("Size is required"),
        length: yup
          .number()
          .required("Length is required")
          .positive("Length must be positive"),
        chest: yup
          .number()
          .required("Chest is required")
          .positive("Chest must be positive"),
        sleeve: yup
          .number()
          .required("Sleeve is required")
          .positive("Sleeve must be positive"),
      })
    )
    .nullable(),
  sizeChartUnit: yup
    .string()
    .oneOf(["inches", "cm"], "Unit must be inches or cm")
    .nullable(),
});

export interface SizeStock {
  size: string;
  stock: number;
  available: boolean;
}

export interface Variant {
  id?: string;
  color: string;
  sizeStocks: SizeStock[];
  totalStock: number;
  images: File[];
  imagePreviews: string[];
}

export interface SizeChartMeasurement {
  size: string;
  length: number;
  chest: number;
  sleeve: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  comparePrice?: number | null;
  variants: Variant[];
  tags: string[];
  status: "Active" | "Inactive" | "Draft" | "";
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  sizeChartImage?: File | null;
  sizeChartImagePreview?: string | null;
  sizeChartMeasurements?: SizeChartMeasurement[];
  sizeChartUnit?: "inches" | "cm";
}