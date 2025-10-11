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

    console.log("=".repeat(80));
    console.log("✏️ STARTING PRODUCT UPDATE - EDIT PRODUCT PAGE");
    console.log("=".repeat(80));
    console.log("🆔 Product ID:", productId);
    
    console.log("\n📋 COMPLETE FORM DATA STRUCTURE:");
    console.log(JSON.stringify(data, null, 2));
    
    console.log("\n📊 VARIANTS BREAKDOWN:");
    data.variants.forEach((variant, index) => {
      console.log(`\n--- VARIANT ${index + 1} (EDIT) ---`);
      console.log(`Color: ${variant.color}`);
      console.log(`Total Stock: ${variant.totalStock}`);
      console.log("Size Stocks:");
      variant.sizeStocks.forEach(sizeStock => {
        console.log(`  ${sizeStock.size}: ${sizeStock.stock} units (${sizeStock.available ? 'Available' : 'Out of Stock'})`);
      });
      console.log(`Existing Images: ${variant.existingImages?.length || 0}`);
      console.log(`New Images: ${variant.images.length} files`);
    });
    
    console.log("\n📁 New Image Files:", newImageFiles.length);

    try {
      console.log("\n🔄 CREATING FORMDATA FOR UPDATE API CALL...");
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

      // Process variants data - NEW size-stock format
      if (data.variants && data.variants.length > 0) {
        console.log("\n📊 PROCESSING VARIANTS FOR FORMDATA:");
        data.variants.forEach((variant, index) => {
          console.log(`\n--- Processing Variant ${index} ---`);
          console.log(`Color: ${variant.color}`);
          console.log(`Total Stock: ${variant.totalStock}`);
          
          formData.append(`variants[${index}][color]`, variant.color);
          formData.append(`variants[${index}][totalStock]`, variant.totalStock.toString());

          // Add size stocks - NEW FORMAT
          if (variant.sizeStocks && Array.isArray(variant.sizeStocks)) {
            variant.sizeStocks.forEach((sizeStock, sizeIndex) => {
              formData.append(`variants[${index}][sizeStocks][${sizeIndex}][size]`, sizeStock.size);
              formData.append(`variants[${index}][sizeStocks][${sizeIndex}][stock]`, sizeStock.stock.toString());
              formData.append(`variants[${index}][sizeStocks][${sizeIndex}][available]`, sizeStock.available.toString());
            });
            
            // Also send as JSON string for easier backend parsing
            formData.append(`variants[${index}][sizeStocksJson]`, JSON.stringify(variant.sizeStocks));
            console.log(`Size Stocks JSON: ${JSON.stringify(variant.sizeStocks)}`);
          }

          // Add new image files for this variant
          if (variant.images && variant.images.length > 0) {
            variant.images.forEach((file) => {
              formData.append(`variants[${index}][images]`, file);
            });
            console.log(`New Images: ${variant.images.length} files`);
          }

          // Add existing images information for this variant
          if (variant.existingImages && variant.existingImages.length > 0) {
            formData.append(`variants[${index}][existingImages]`, JSON.stringify(variant.existingImages));
            console.log(`Existing Images: ${variant.existingImages.length} images`);
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

      console.log("\n📤 FORMDATA CONTENTS SUMMARY (EDIT):");
      console.log("📋 Basic Fields:");
      console.log(`- name: ${formData.get('name')}`);
      console.log(`- sku: ${formData.get('sku')}`);
      console.log(`- category: ${formData.get('category')}`);
      console.log(`- price: ${formData.get('price')}`);
      console.log(`- status: ${formData.get('status')}`);
      console.log(`- tags: ${formData.get('tags')}`);
      
      console.log("\n📊 Variants in FormData (EDIT):");
      data.variants.forEach((variant, index) => {
        console.log(`\n--- VARIANT ${index} FORMDATA (EDIT) ---`);
        console.log(`variants[${index}][color]: ${formData.get(`variants[${index}][color]`)}`);
        console.log(`variants[${index}][totalStock]: ${formData.get(`variants[${index}][totalStock]`)}`);
        console.log(`variants[${index}][sizeStocksJson]: ${formData.get(`variants[${index}][sizeStocksJson]`)}`);
        console.log(`variants[${index}][existingImages]: ${formData.get(`variants[${index}][existingImages]`)}`);
        
        console.log("Individual Size Stocks (EDIT):");
        variant.sizeStocks.forEach((sizeStock, sizeIndex) => {
          console.log(`  variants[${index}][sizeStocks][${sizeIndex}][size]: ${formData.get(`variants[${index}][sizeStocks][${sizeIndex}][size]`)}`);
          console.log(`  variants[${index}][sizeStocks][${sizeIndex}][stock]: ${formData.get(`variants[${index}][sizeStocks][${sizeIndex}][stock]`)}`);
          console.log(`  variants[${index}][sizeStocks][${sizeIndex}][available]: ${formData.get(`variants[${index}][sizeStocks][${sizeIndex}][available]`)}`);
        });
      });

      console.log("\n🌐 CALLING API: productsAPI.updateProduct()");
      console.log("API Endpoint: PUT /api/products/{id} (or similar)");
      console.log("Content-Type: multipart/form-data");

      // Update product via API with progress tracking
      const result = await productsAPI.updateProduct(
        productId,
        formData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      console.log("\n✅ UPDATE API RESPONSE RECEIVED:");
      console.log("Update result:", result);

      // Reset upload state
      setUploadProgress(0);

      toast.success("Product updated successfully!");
      router.push(`/admin/dashboard/products/${productId}`);
    } catch (error: any) {
      console.log("\n❌ UPDATE API ERROR OCCURRED:");
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      // Extract error message
      let errorMessage = "Failed to update product. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      console.log(`Final error message shown to user: "${errorMessage}"`);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      console.log("=".repeat(80));
      console.log("🏁 EDIT PRODUCT API CALL COMPLETED");
      console.log("=".repeat(80));
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