import { apiRequest, API_ENDPOINTS } from './api';

export interface ProductVariant {
  _id?: string;
  color: string;
  stock: number;
  sizes: string[];
  images: string[];
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  brand: string;
  color: string;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  status: string;
  isFeatured: boolean;
  availableSizes: string[];
  tags: string[];
  images: string[];
  variants?: ProductVariant[];
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
  features?: string[];
  rating?: number;
  reviewsCount?: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  discountEndDate?: string;
  discountStartDate?: string;
  discountCode?: string;
  discountDescription?: string;
  discountAmount?: number;
  discountPercentage?: number;
  discountValidUntil?: string;
  discountApplied?: boolean;
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'success' | 'danger' |
      'warning' | 'info' | 'light' | 'dark';
  };
  reviews?: {
    rating: number;
    comment: string;  // Add this line for the review's comment field   
  }[];
  [key: string]: any; // Allow additional properties
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FeaturedProductsResponse {
  products: Product[];
}

export interface ProductByIdResponse {
  product: Product;
  relatedProducts: Product[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  sizes?: string | string[];
  colors?: string | string[];
}

export const productService = {
  // Get all products with filters and pagination
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const url = `${API_ENDPOINTS.WEBSITE.PRODUCTS}?${queryParams.toString()}`;
    return apiRequest<ProductsResponse>(url);
  },

  // Get featured products
  getFeaturedProducts: async (limit?: number): Promise<FeaturedProductsResponse> => {
    const queryParams = limit ? `?limit=${limit}` : '';
    const url = `${API_ENDPOINTS.WEBSITE.FEATURED_PRODUCTS}${queryParams}`;
    return apiRequest<FeaturedProductsResponse>(url);
  },

  // Get product by ID
  getProductById: async (id: string): Promise<ProductByIdResponse> => {
    const url = API_ENDPOINTS.WEBSITE.PRODUCT_BY_ID(id);
    return apiRequest<ProductByIdResponse>(url);
  },

  // Get products by category
  getProductsByCategory: async (
    category: string,
    filters: Omit<ProductFilters, 'category'> = {}
  ): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const url = `${API_ENDPOINTS.WEBSITE.PRODUCTS_BY_CATEGORY(category)}?${queryParams.toString()}`;
    return apiRequest<ProductsResponse>(url);
  },

  // Search products
  searchProducts: async (
    query: string,
    filters: Omit<ProductFilters, 'search'> = {}
  ): Promise<ProductsResponse> => {
    const queryParams = new URLSearchParams({ q: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const url = `${API_ENDPOINTS.WEBSITE.SEARCH_PRODUCTS}?${queryParams.toString()}`;
    return apiRequest<ProductsResponse>(url);
  },
};