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
        color: yup.string().required("Color is required"),
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
        images: yup.array(),
        existingImages: yup.array(),
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
    )
    .test(
      "variant-images",
      "Each variant must have at least one image",
      function (value) {
        if (!value) return true;
        return value.every((variant: any) => {
          const hasExistingImages = variant.existingImages && variant.existingImages.length > 0;
          const hasNewImages = variant.images && variant.images.length > 0;
          return hasExistingImages || hasNewImages;
        });
      }
    ),
  tags: yup.array().of(yup.string().defined()).max(5, "Maximum 5 tags allowed"),
  status: yup
    .string()
    .oneOf(["active", "inactive", "draft"], "Invalid status")
    .required("Status is required"),
  featured: yup.boolean(),
  metaTitle: yup.string().max(60, "Meta title must not exceed 60 characters"),
  metaDescription: yup
    .string()
    .max(160, "Meta description must not exceed 160 characters"),
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
  existingImages?: string[]; // For edit mode - existing images from API
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
  status: "active" | "inactive" | "draft";
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
}