import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { productsAPI } from "@/lib/api";
import { productSchema, ProductFormData } from "../../schemas/productValidation";


export function useProductForm(productId: string) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setError,
    clearErrors,
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema) as any,
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      category: "",
      brand: "",
      price: 0,
      comparePrice: undefined,
      variants: [],
      tags: [],
      status: "draft",
      featured: false,
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Add field array for variants
  const variantsFieldArray = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit = useCallback(async (data: ProductFormData, newImageFiles: File[]): Promise<void> => {
    setIsLoading(true);
    clearErrors();

    console.log("=== EDIT PRODUCT API SUBMISSION ===");
    console.log("Product ID:", productId);
    console.log("Form Data being submitted:", data);
    console.log("New Image Files:", newImageFiles);

    try {
      // Create FormData for API
      const formData = new FormData();

      // Add basic product data
      formData.append("name", data.name || "");
      formData.append("description", data.description || "");
      formData.append("sku", data.sku || "");
      formData.append("category", data.category || "");
      formData.append("brand", data.brand || "");
      formData.append("price", (data.price || 0).toString());
      if (data.comparePrice && data.comparePrice > 0) {
        formData.append("comparePrice", data.comparePrice.toString());
      }
      formData.append("status", data.status || "draft");
      formData.append("isFeatured", (data.featured || false).toString());

      // Process variants data - match server expected format
      if (data.variants && data.variants.length > 0) {
        data.variants.forEach((variant, index) => {
          formData.append(`variants[${index}][color]`, variant.color);
          formData.append(`variants[${index}][stock]`, variant.stock.toString());
          formData.append(`variants[${index}][sizes]`, variant.sizes.join(","));

          // Add new image files for this variant
          if (variant.images && variant.images.length > 0) {
            variant.images.forEach((file) => {
              formData.append(`variants[${index}][images]`, file);
            });
          }

          // Add existing images information for this variant
          if (variant.existingImages && variant.existingImages.length > 0) {
            formData.append(`variants[${index}][existingImages]`, JSON.stringify(variant.existingImages));
          }
        });
      }

      // Add tags as comma-separated string (to match server expectation)
      formData.append("tags", (data.tags || []).join(","));

      // Add SEO data
      if (data.metaTitle) {
        formData.append("metaTitle", data.metaTitle);
      }
      if (data.metaDescription) {
        formData.append("metaDescription", data.metaDescription);
      }

      // Log FormData contents before API call
      console.log("=== FormData being sent to API ===");
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}:`, `[File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      });
      console.log("===============================");

      // Update product via API with progress tracking
      const result = await productsAPI.updateProduct(
        productId,
        formData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      console.log("=== API Response ===");
      console.log("Update result:", result);
      console.log("==================");

      // Reset upload state
      setUploadProgress(0);

      toast.success("Product updated successfully!");
      router.push(`/admin/dashboard/products/${productId}`);
    } catch (error: any) {
      console.error("Product update error:", error);

      // Extract error message
      let errorMessage = "Failed to update product. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [productId, router, setError, clearErrors]);

  return {
    control,
    handleSubmit,
    errors,
    isValid,
    isDirty,
    reset,
    setValue,
    watch,
    isLoading,
    uploadProgress,
    onSubmit,
    variantsFieldArray,
  };
}