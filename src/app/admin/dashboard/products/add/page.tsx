"use client";

import { useState } from "react";
import { Row, Col, Button, Form, Alert } from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { productsAPI } from "@/lib/api";
import { productSchema, ProductFormData } from "./schemas/productValidation";
import BasicInfoForm from "./components/BasicInfoForm";
import PricingForm from "./components/PricingForm";
import VariantsSection from "./components/VariantsSection";
import SEOForm from "./components/SEOForm";
import ProductStatusForm from "./components/ProductStatusForm";
import TagsSection from "./components/TagsSection";


export default function AddProductPage() {
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
      status: "",
      featured: false,
      metaTitle: "",
      metaDescription: "",
      sizeChartImage: null,
      sizeChartImagePreview: null,
      sizeChartMeasurements: [],
      sizeChartUnit: "inches",
    },
  });

  const fieldArray = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit = async (data: ProductFormData): Promise<void> => {
    setIsLoading(true);
    clearErrors();

    try {
      console.log("=".repeat(80));
      console.log("🚀 STARTING PRODUCT CREATION - ADD PRODUCT PAGE");
      console.log("=".repeat(80));
      
      console.log("📋 COMPLETE FORM DATA STRUCTURE:");
      console.log(JSON.stringify(data, null, 2));
      
      console.log("\n📊 VARIANTS BREAKDOWN:");
      data.variants.forEach((variant, index) => {
        console.log(`\n--- VARIANT ${index + 1} ---`);
        console.log(`Color: ${variant.color}`);
        console.log(`Total Stock: ${variant.totalStock}`);
        console.log("Size Stocks:");
        variant.sizeStocks.forEach(sizeStock => {
          console.log(`  ${sizeStock.size}: ${sizeStock.stock} units (${sizeStock.available ? 'Available' : 'Out of Stock'})`);
        });
        console.log(`Images: ${variant.images.length} files`);
      });

      // Create FormData object
      const formData = new FormData();

      console.log("\n🔄 CREATING FORMDATA FOR API CALL...");

      // Add all basic product fields to FormData
      console.log("Processing basic fields:", {
        name: typeof data.name, nameValue: data.name,
        description: typeof data.description, descriptionValue: data.description,
        sku: typeof data.sku, skuValue: data.sku,
        category: typeof data.category, categoryValue: data.category,
        brand: typeof data.brand, brandValue: data.brand,
        price: typeof data.price, priceValue: data.price,
        comparePrice: typeof data.comparePrice, comparePriceValue: data.comparePrice,
        status: typeof data.status, statusValue: data.status,
        featured: typeof data.featured, featuredValue: data.featured,
        tags: typeof data.tags, tagsValue: data.tags
      });

      try {
        console.log("Appending basic fields to FormData...");
        formData.append("name", String(data.name || ''));
        console.log("✓ name appended");
        
        formData.append("sku", String(data.sku || ''));
        console.log("✓ sku appended");
        
        formData.append("description", String(data.description || ''));
        console.log("✓ description appended");
        
        formData.append("category", String(data.category || ''));
        console.log("✓ category appended");
        
        formData.append("brand", String(data.brand || ''));
        console.log("✓ brand appended");
        
        formData.append("price", String(data.price || 0));
        console.log("✓ price appended");
        
        if (data.comparePrice) {
          console.log("Appending comparePrice:", data.comparePrice, typeof data.comparePrice);
          formData.append("comparePrice", String(data.comparePrice));
          console.log("✓ comparePrice appended");
        }
        
        formData.append("status", String(data.status || ''));
        console.log("✓ status appended");
        
  formData.append("isFeatured", String(data.featured || false));
  console.log("✓ isFeatured appended");
        
        const tagsString = Array.isArray(data.tags) ? data.tags.join(",") : String(data.tags || '');
        console.log("Tags to append:", tagsString);
        formData.append("tags", tagsString);
        console.log("✓ tags appended");
        
        if (data.metaTitle) {
          formData.append("metaTitle", String(data.metaTitle));
          console.log("✓ metaTitle appended");
        }
        if (data.metaDescription) {
          formData.append("metaDescription", String(data.metaDescription));
          console.log("✓ metaDescription appended");
        }

        // Add size chart data
        if (data.sizeChartImage && data.sizeChartImage instanceof File) {
          formData.append("sizeChartImage", data.sizeChartImage);
          console.log("✓ sizeChartImage appended");
        }
        if (data.sizeChartUnit) {
          formData.append("sizeChartUnit", data.sizeChartUnit);
          console.log("✓ sizeChartUnit appended:", data.sizeChartUnit);
        }
        if (data.sizeChartMeasurements && Array.isArray(data.sizeChartMeasurements) && data.sizeChartMeasurements.length > 0) {
          formData.append("sizeChartMeasurements", JSON.stringify(data.sizeChartMeasurements));
          console.log("✓ sizeChartMeasurements appended:", data.sizeChartMeasurements);
        }
        
        console.log("All basic fields appended successfully");
      } catch (error) {
        console.error("Error appending basic fields:", error);
        throw error;
      }

      // Add variants data with new size-stock structure
      console.log("Processing variants for FormData:", data.variants);
      data.variants.forEach((variant, index) => {
        console.log(`Processing variant ${index}:`, variant);
        console.log(`Variant ${index} detailed:`, {
          color: { type: typeof variant.color, value: variant.color },
          sizeStocks: { type: typeof variant.sizeStocks, value: variant.sizeStocks, isArray: Array.isArray(variant.sizeStocks) },
          totalStock: { type: typeof variant.totalStock, value: variant.totalStock },
          images: { type: typeof variant.images, value: variant.images, isArray: Array.isArray(variant.images), length: variant.images?.length }
        });

        try {
          // Ensure all values are properly converted to strings
          const color = String(variant.color || '');
          const totalStock = String(variant.totalStock || 0);
          
          console.log(`Appending variant ${index} data:`, { color, totalStock });

          formData.append(`variants[${index}][color]`, color);
          formData.append(`variants[${index}][totalStock]`, totalStock);

          // Add size stocks
          if (variant.sizeStocks && Array.isArray(variant.sizeStocks)) {
            variant.sizeStocks.forEach((sizeStock, sizeIndex) => {
              formData.append(`variants[${index}][sizeStocks][${sizeIndex}][size]`, String(sizeStock.size));
              formData.append(`variants[${index}][sizeStocks][${sizeIndex}][stock]`, String(sizeStock.stock || 0));
              formData.append(`variants[${index}][sizeStocks][${sizeIndex}][available]`, String(sizeStock.available || false));
            });
            
            // Also send as JSON string for easier backend parsing
            formData.append(`variants[${index}][sizeStocksJson]`, JSON.stringify(variant.sizeStocks));
          }

          // Add variant images
          if (variant.images && Array.isArray(variant.images)) {
            variant.images.forEach((file, fileIndex) => {
              // Accept only Blob/File objects; skip strings or other types
              const isBlobLike = file && typeof file === 'object' && ((file as any) instanceof Blob);
              if (isBlobLike) {
                const f = file as Blob & { name?: string };
                console.log(`Adding image ${fileIndex} for variant ${index}:`, f?.name || '(blob)');
                formData.append(`variants[${index}][images]`, f);
              } else {
                console.warn(`Skipping non-File image in variant ${index}, image ${fileIndex}:`, file);
              }
            });
          }
        } catch (error) {
          console.error(`Error processing variant ${index}:`, error);
          throw error;
        }
      });
      // DO NOT append the entire variants array or object to FormData!

      console.log("\n📤 FORMDATA CONTENTS SUMMARY:");
      console.log("📋 Basic Fields:");
      console.log(`- name: ${formData.get('name')}`);
      console.log(`- sku: ${formData.get('sku')}`);
      console.log(`- category: ${formData.get('category')}`);
      console.log(`- price: ${formData.get('price')}`);
      console.log(`- status: ${formData.get('status')}`);
      console.log(`- tags: ${formData.get('tags')}`);
      
      console.log("\n📊 Variants in FormData:");
      data.variants.forEach((variant, index) => {
        console.log(`\n--- VARIANT ${index} FORMDATA ---`);
        console.log(`variants[${index}][color]: ${formData.get(`variants[${index}][color]`)}`);
        console.log(`variants[${index}][totalStock]: ${formData.get(`variants[${index}][totalStock]`)}`);
        console.log(`variants[${index}][sizeStocksJson]: ${formData.get(`variants[${index}][sizeStocksJson]`)}`);
        
        console.log("Individual Size Stocks:");
        variant.sizeStocks.forEach((sizeStock, sizeIndex) => {
          console.log(`  variants[${index}][sizeStocks][${sizeIndex}][size]: ${formData.get(`variants[${index}][sizeStocks][${sizeIndex}][size]`)}`);
          console.log(`  variants[${index}][sizeStocks][${sizeIndex}][stock]: ${formData.get(`variants[${index}][sizeStocks][${sizeIndex}][stock]`)}`);
          console.log(`  variants[${index}][sizeStocks][${sizeIndex}][available]: ${formData.get(`variants[${index}][sizeStocks][${sizeIndex}][available]`)}`);
        });
      });

      console.log("\n🌐 CALLING API: productsAPI.createProduct()");
      console.log("API Endpoint: POST /api/products (or similar)");
      console.log("Content-Type: multipart/form-data");

      // Call API with progress tracking
      const response = await productsAPI.createProduct(
        formData,
        (progress: number) => {
          setUploadProgress(progress);
        }
      );

      console.log("\n✅ API RESPONSE RECEIVED:");
      console.log("Response:", response);

      console.log("Product created:", response);
      toast.success("Product created successfully!");

      // Reset form and redirect
      reset();
      setUploadProgress(0);
      router.push("/admin/dashboard/products");
    } catch (error: any) {
      console.log("\n❌ API ERROR OCCURRED:");
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      // Handle specific error messages from backend
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create product. Please try again.";

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
      console.log("🏁 ADD PRODUCT API CALL COMPLETED");
      console.log("=".repeat(80));
    }
  };


  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center mb-2">
            <Button
              variant="outline-secondary"
              className="p-0 me-3"
              as="a"
              href="/admin/dashboard/products"
            >
              <FiArrowLeft size={20} />
            </Button>
            <h1 className="h3 mb-0">Add New Product</h1>
          </div>
          <p className="text-muted mb-0">Create a new product for your store</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            as="a"
            href="/admin/dashboard/products"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || !isDirty || !isValid}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {uploadProgress > 0
                  ? `Uploading... ${uploadProgress}%`
                  : "Creating..."}
              </>
            ) : (
              <>
                <FiSave className="me-2" />
                Create Product
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Display root-level errors */}
      {errors.root && (
        <Alert variant="danger" className="mb-4">
          {errors.root.message}
        </Alert>
      )}

  <Form onSubmit={e => { e.preventDefault(); handleSubmit(onSubmit)(e); }} noValidate>
        <Row>
          <Col lg={8}>
            <BasicInfoForm
              control={control}
              errors={errors}
              isLoading={isLoading}
              watch={watch}
              setValue={setValue}
            />

            <PricingForm
              control={control}
              errors={errors}
              isLoading={isLoading}
            />

            <VariantsSection
              control={control}
              errors={errors}
              isLoading={isLoading}
              watch={watch}
              setValue={setValue}
              fieldArray={fieldArray}
            />

            <SEOForm
              control={control}
              errors={errors}
              isLoading={isLoading}
            />
          </Col>

          <Col lg={4}>
            <ProductStatusForm
              control={control}
              errors={errors}
              isLoading={isLoading}
            />

            <TagsSection
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
}
