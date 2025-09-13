"use client";

import { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import { FiPackage } from "react-icons/fi";
import { productsAPI } from "@/lib/api";

// Import components
import { EditProductHeader } from "./components/ui/EditProductHeader";
import { BasicInfoForm } from "./components/forms/BasicInfoForm";
import { PricingInventoryForm } from "./components/forms/PricingInventoryForm";
import { SEOForm } from "./components/forms/SEOForm";
import { ProductStatusForm } from "./components/forms/ProductStatusForm";
import VariantsSection from "./components/forms/VariantsSection";
import { TagsManager } from "./components/forms/TagsManager";
import { useProductForm } from "./components/hooks/useProductForm";

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  comparePrice?: number;
  status: string;
  featured: boolean;
  tags: string[];
  variants: ProductVariant[];
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductVariant {
  color: string;
  stock: number;
  sizes: string[];
  images: File[];
  imagePreviews: string[];
  existingImages: string[];
}

// Mock product data with variants format
const mockProducts = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    sku: "TSH001",
    category: "T-Shirts",
    brand: "StyleCraft",
    price: 29.99,
    comparePrice: 39.99,
    status: "active",
    featured: true,
    tags: ["New Arrival", "Trending"],
    variants: [
      {
        color: "Blue",
        stock: 150,
        sizes: ["S", "M", "L", "XL"],
        images: [],
        imagePreviews: [],
        existingImages: [
          "https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400",
          "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400",
          "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        ],
      },
    ],
    description:
      "Premium quality cotton t-shirt with comfortable fit. Perfect for casual wear and everyday comfort. Made from 100% organic cotton with sustainable manufacturing processes.",
    metaTitle: "Premium Cotton T-Shirt - StyleCraft",
    metaDescription:
      "Shop our premium cotton t-shirt collection. Comfortable, stylish, and sustainable.",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Denim Jacket Classic",
    sku: "JKT002",
    category: "Jackets",
    brand: "UrbanStyle",
    price: 89.99,
    comparePrice: 120.0,
    status: "active",
    featured: false,
    tags: ["Sale"],
    variants: [
      {
        color: "Dark Blue",
        stock: 45,
        sizes: ["M", "L", "XL"],
        images: [],
        imagePreviews: [],
        existingImages: [
          "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400",
        ],
      },
    ],
    description:
      "Classic denim jacket with vintage styling. Perfect for layering and adding a casual touch to any outfit.",
    metaTitle: "Classic Denim Jacket - UrbanStyle",
    metaDescription:
      "Vintage-style denim jacket perfect for any casual outfit.",
    createdAt: "2024-01-14T16:20:00Z",
    updatedAt: "2024-01-14T16:20:00Z",
  },
];

// Helper function to transform API response to support variants
const transformProduct = (product: any) => {
  console.log("Transforming product for edit:", product);
  
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/400x400?text=No+Image";
    
    // If it's already a full URL (like Cloudinary), return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Otherwise, treat as local file
    const filename = imagePath.split("/").pop();
    return `http://localhost:8080/uploads/${filename}`;
  };

  // Convert old single-product format to variants format
  let variants = [];
  
  if (product.variants && product.variants.length > 0) {
    // Product already has variants
    console.log("Processing variants:", product.variants);
    variants = product.variants.map((variant: any, index: number) => {
      console.log(`Variant ${index}:`, variant);
      console.log(`Variant ${index} images:`, variant.images);
      
      const existingImages = variant.images && variant.images.length > 0
        ? variant.images.map(getImageUrl)
        : (product.images && product.images.length > 0
          ? product.images.map(getImageUrl)
          : ["https://via.placeholder.com/400x400?text=No+Image"]);
      
      console.log(`Variant ${index} processed existingImages:`, existingImages);
      
      return {
        color: variant.color || "Not specified",
        stock: variant.stock || variant.stockQuantity || 0,
        sizes: variant.sizes || variant.availableSizes || [],
        images: [], // New images will be added here
        imagePreviews: [], // New image previews will be added here
        existingImages: existingImages,
      };
    });
  } else {
    // Convert legacy single-product format to variants
    variants = [{
      color: product.color || "Not specified",
      stock: product.stockQuantity || product.stock || 0,
      sizes: product.availableSizes || product.sizes || [],
      images: [],
      imagePreviews: [],
      existingImages: product.images && product.images.length > 0
        ? product.images.map(getImageUrl)
        : ["https://via.placeholder.com/400x400?text=No+Image"],
    }];
  }

  return {
    ...product,
    id: product._id || product.id,
    variants,
    status: product.status?.toLowerCase() || "draft",
    comparePrice: product.comparePrice || undefined,
    tags: product.tags || [],
    metaTitle: product.metaTitle || "",
    metaDescription: product.metaDescription || "",
  };
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [pageLoading, setPageLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [hasImageChanges, setHasImageChanges] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  // Use the custom hook
  const {
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
  } = useProductForm(params.id as string);

  const watchedTags = watch("tags");

  // Load product data (same logic as original)
  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) {
        console.error("No product ID provided");
        setPageLoading(false);
        return;
      }

      setPageLoading(true);
      console.log("Fetching product with ID:", params.id);

      let timeoutId: NodeJS.Timeout | null = null;

      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.warn("API call timed out, falling back to mock data");
        toast.error("Request timed out, using fallback data");

        // Use mock data
        const foundProduct = mockProducts.find((p) => p.id === params.id);
        if (foundProduct) {
          console.log("Using mock product after timeout:", foundProduct);
          setProduct(foundProduct);

          reset({
            name: foundProduct.name,
            description: foundProduct.description,
            sku: foundProduct.sku,
            category: foundProduct.category,
            brand: foundProduct.brand,
            price: foundProduct.price,
            comparePrice: foundProduct.comparePrice,
            variants: foundProduct.variants || [],
            tags: foundProduct.tags,
            status: foundProduct.status as "active" | "inactive" | "draft",
            featured: foundProduct.featured,
            metaTitle: foundProduct.metaTitle || "",
            metaDescription: foundProduct.metaDescription || "",
          });
        } else {
          console.error("Product not found in mock data either");
          toast.error("Product not found");
          router.push("/admin/dashboard/products");
        }
        setPageLoading(false);
        timeoutId = null;
      }, 10000); // 10 second timeout

      try {
        console.log("Making API call to fetch product...");

        // Fetch product data from API
        const response = await productsAPI.getProduct(params.id as string);

        // Clear timeout since API call succeeded
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        console.log("API response received:", response);

        if (response) {
          const transformedProduct = transformProduct(response);
          console.log("Transformed product:", transformedProduct);

          setProduct(transformedProduct);

          // Pre-fill form with product data
          reset({
            name: transformedProduct.name,
            description: transformedProduct.description,
            sku: transformedProduct.sku,
            category: transformedProduct.category,
            brand: transformedProduct.brand,
            price: transformedProduct.price,
            comparePrice: transformedProduct.comparePrice,
            variants: transformedProduct.variants || [],
            tags: transformedProduct.tags,
            status: transformedProduct.status as
              | "active"
              | "inactive"
              | "draft",
            featured: transformedProduct.featured,
            metaTitle: transformedProduct.metaTitle || "",
            metaDescription: transformedProduct.metaDescription || "",
          });

          console.log("Product data loaded successfully");
        } else {
          // Clear timeout
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          console.error("API returned empty response");
          toast.error("Product not found");
          router.push("/admin/dashboard/products");
        }
      } catch (error) {
        // Clear timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        console.error("Error fetching product:", error);

        // Check if it's a network/server error
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "ECONNREFUSED"
        ) {
          console.warn("Server appears to be down, using mock data");
          toast.warn("Server unavailable, using sample data");
        } else {
          console.warn("API failed, falling back to mock data");
          toast.error("Failed to fetch product details, using fallback data");
        }

        // Fallback to mock data for development
        const foundProduct = mockProducts.find((p) => p.id === params.id);
        if (foundProduct) {
          console.log("Using mock product:", foundProduct);

          setProduct(foundProduct);

          // Pre-fill form with mock data
          reset({
            name: foundProduct.name,
            description: foundProduct.description,
            sku: foundProduct.sku,
            category: foundProduct.category,
            brand: foundProduct.brand,
            price: foundProduct.price,
            comparePrice: foundProduct.comparePrice,
            variants: foundProduct.variants || [],
            tags: foundProduct.tags,
            status: foundProduct.status as "active" | "inactive" | "draft",
            featured: foundProduct.featured,
            metaTitle: foundProduct.metaTitle || "",
            metaDescription: foundProduct.metaDescription || "",
          });
        } else {
          console.error("Product not found in mock data either");
          toast.error("Product not found");
          router.push("/admin/dashboard/products");
        }
      } finally {
        console.log("Setting pageLoading to false");
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router, reset]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isLoading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isLoading]);


  // Tag handling functions
  const toggleTag = (tag: string) => {
    if (watchedTags.includes(tag)) {
      setValue(
        "tags",
        watchedTags.filter((t) => t !== tag),
        { shouldDirty: true }
      );
    } else {
      setValue("tags", [...watchedTags, tag], { shouldDirty: true });
    }
  };

  const addCustomTag = (tag: string) => {
    setValue("tags", [...watchedTags, tag], { shouldDirty: true });
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true }
    );
  };


  // Submit handlers
  const handleSave = () => {
    handleSubmit((data) => onSubmit(data, []))();
  };

  const handleSaveAsDraft = () => {
    setValue("status", "draft");
    handleSubmit((data) => onSubmit(data, []))();
  };

  if (pageLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-5">
        <FiPackage size={48} className="text-muted mb-3" />
        <h5 className="text-muted">Product Not Found</h5>
        <p className="text-muted mb-4">
          The product you're trying to edit doesn't exist.
        </p>
        <Button variant="primary" as="a" href="/admin/dashboard/products">
          Back to Products
        </Button>
      </div>
    );
  }

  // Debug form state
  console.log("Edit page form state:", {
    isDirty,
    isValid,
    hasImageChanges,
    isLoading,
    errors: Object.keys(errors).length > 0 ? errors : "No errors"
  });

  return (
    <div>
      <EditProductHeader
        productId={params.id as string}
        isDirty={isDirty}
        hasImageChanges={hasImageChanges}
        isLoading={isLoading}
        isValid={isValid}
        uploadProgress={uploadProgress}
        errors={errors}
        onSave={handleSave}
        onSaveAsDraft={handleSaveAsDraft}
      />

      <Form
        onSubmit={handleSubmit((data) => onSubmit(data, newImageFiles))}
        noValidate
      >
        <Row>
          <Col lg={8}>
            <BasicInfoForm
              control={control}
              errors={errors}
              isLoading={isLoading}
            />
            <PricingInventoryForm
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
              fieldArray={variantsFieldArray}
            />
            <SEOForm control={control} errors={errors} isLoading={isLoading} />
          </Col>

          <Col lg={4}>
            <ProductStatusForm
              control={control}
              errors={errors}
              isLoading={isLoading}
            />
            <TagsManager
              selectedTags={watchedTags}
              onToggleTag={toggleTag}
              onAddCustomTag={addCustomTag}
              onRemoveTag={removeTag}
              errors={errors}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
}
