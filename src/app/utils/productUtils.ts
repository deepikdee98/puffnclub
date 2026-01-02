import { Product, ProductVariant } from '../services/productService';

/**
 * Normalizes product data to ensure arrays are always defined
 * and extracts images/sizes from variants when main arrays are empty
 */
export function normalizeProductData(product: Product): Product {
  // Extract images from variants if main images array is empty
  let images = product.images || [];
  if (images.length === 0 && product.variants && product.variants.length > 0) {
    // Collect all images from variants
    const variantImages = product.variants.reduce((acc: string[], variant: ProductVariant) => {
      if (variant.images && variant.images.length > 0) {
        acc.push(...variant.images);
      }
      return acc;
    }, []);
    images = Array.from(new Set(variantImages)); // Remove duplicates
  }

  // Extract available sizes from variants if main availableSizes array is empty
  let availableSizes = product.availableSizes || [];
  if (availableSizes.length === 0 && product.variants && product.variants.length > 0) {
    // Collect all sizes from variants
    const variantSizes = product.variants.reduce((acc: string[], variant: ProductVariant) => {
      if (variant.sizes && variant.sizes.length > 0) {
        acc.push(...variant.sizes);
      }
      return acc;
    }, []);
    availableSizes = Array.from(new Set(variantSizes)); // Remove duplicates
  }

  return {
    ...product,
    images,
    tags: product.tags || [],
    availableSizes
  };
}

/**
 * Normalizes an array of products
 */
export function normalizeProductsData(products: Product[]): Product[] {
  return products.map(normalizeProductData);
}