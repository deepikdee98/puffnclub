import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    // Try to get token from localStorage first, then sessionStorage, then cookies
    const token = localStorage.getItem('admin_token') || 
                  sessionStorage.getItem('admin_token') || 
                  Cookies.get('admin_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache control for better performance
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'max-age=300'; // 5 minutes cache
    }
    
    // For FormData, don't set Content-Type (let browser handle it)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear all tokens and redirect to login
          localStorage.removeItem('admin_token');
          sessionStorage.removeItem('admin_token');
          Cookies.remove('admin_token');
          window.location.href = '/admin/login';
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('Access denied. Insufficient permissions.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err: string) => toast.error(err));
          } else {
            toast.error(data.message || 'Validation error occurred.');
          }
          break;
        case 500:
          toast.error('Internal server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const apiClient = {
  // Generic methods
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.get(url, config).then((response) => response.data),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.post(url, data, config).then((response) => response.data),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.put(url, data, config).then((response) => response.data),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.patch(url, data, config).then((response) => response.data),
    
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.delete(url, config).then((response) => response.data),

  // File upload (POST)
  upload: <T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> =>
    api.post(url, formData, {
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        // 'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }).then((response) => response.data),

  // File upload (PUT)
  uploadPut: <T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> =>
    api.put(url, formData, {
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        // 'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }).then((response) => response.data),
};

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/admin/login', credentials),
    
  logout: () =>
    apiClient.post('/admin/logout'),
    
  refreshToken: () =>
    apiClient.post('/admin/refresh'),
    
  forgotPassword: (email: string) =>
    apiClient.post('/admin/forgot-password', { email }),
    
  resetPassword: (token: string, password: string) =>
    apiClient.post('/admin/reset-password', { token, password }),
};

// Dashboard API
export const dashboardAPI = {
  getMetrics: () =>
    apiClient.get('/admin/dashboard/metrics'),
    
  getSalesChart: (period: string) =>
    apiClient.get(`/admin/dashboard/sales-chart?period=${period}`),
    
  getRecentOrders: (limit: number = 10) =>
    apiClient.get(`/admin/dashboard/recent-orders?limit=${limit}`),
    
  getTopProducts: (limit: number = 10) =>
    apiClient.get(`/admin/dashboard/top-products?limit=${limit}`),
};

// Products API
export const productsAPI = {
  getProducts: (params?: any) =>
    apiClient.get('/products/products', { params }),
    
  getProduct: (id: string) =>
    apiClient.get(`/products/product/${id}`),
    
  createProduct: (formData: FormData, onProgress?: (progress: number) => void) =>
    apiClient.upload('/products/product', formData, onProgress),
    
  updateProduct: (id: string, formData: FormData, onProgress?: (progress: number) => void) =>
    apiClient.uploadPut(`/products/product/${id}`, formData, onProgress),
    
  deleteProduct: (id: string) =>
    apiClient.delete(`/products/product/${id}`),
    
  bulkUpdate: (data: any) =>
    apiClient.post('/products/bulk-update', data),
};

// Categories API
export const categoriesAPI = {
  getCategories: () =>
    apiClient.get('/categories'),
    
  createCategory: (data: any) =>
    apiClient.post('/categories', data),
    
  updateCategory: (id: string, data: any) =>
    apiClient.put(`/categories/${id}`, data),
    
  deleteCategory: (id: string) =>
    apiClient.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  // Get all orders with filtering, pagination, and search
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
  }) =>
    apiClient.get('/adminorder/', { params }),
    
  // Get single order by ID
  getOrder: (id: string) =>
    apiClient.get(`/adminorder/${id}`),
    
  // Get orders by status
  getOrdersByStatus: (status: string) =>
    apiClient.get(`/adminorder/status/${status}`),
    
  // Get pending orders
  getPendingOrders: () =>
    apiClient.get('/adminorder/pending'),
    
  // Get orders by user
  getOrdersByUser: (userId: string) =>
    apiClient.get(`/adminorder/user/${userId}`),
    
  // Get order by order number
  getOrderByNumber: (orderNumber: string) =>
    apiClient.get(`/adminorder/orderNumber/${orderNumber}`),
    
  // Update order status
  updateOrderStatus: (id: string, data: { status?: string; paymentStatus?: string }) =>
    apiClient.put(`/adminorder/${id}/status`, data),
    
  // Delete order
  deleteOrder: (id: string) =>
    apiClient.delete(`/adminorder/${id}`),
    
  // Create new order (user endpoint)
  createOrder: (orderData: any) =>
    apiClient.post('/userOrder/', orderData),
    
  // Debug endpoint
  debugOrderData: () =>
    apiClient.get('/adminorder/debug'),
};

// Banner API
export const bannerAPI = {
  // Get all banners with optional filtering
  getBanners: (params?: {
    status?: 'active' | 'inactive';
    limit?: number;
    page?: number;
  }) =>
    apiClient.get('/banners', { params }),
    
  // Get single banner by ID
  getBanner: (id: string) =>
    apiClient.get(`/banners/${id}`),
    
  // Create new banner
  createBanner: (formData: FormData, onProgress?: (progress: number) => void) =>
    apiClient.upload('/banners', formData, onProgress),
    
  // Update banner
  updateBanner: (id: string, formData: FormData, onProgress?: (progress: number) => void) =>
    apiClient.uploadPut(`/banners/${id}`, formData, onProgress),
    
  // Delete banner
  deleteBanner: (id: string) =>
    apiClient.delete(`/banners/${id}`),
    
  // Toggle banner status
  toggleBannerStatus: (id: string) =>
    apiClient.patch(`/banners/${id}/toggle-status`),
    
  // Reorder banners
  reorderBanners: (banners: { id: string; order: number }[]) =>
    apiClient.post('/banners/reorder', { banners }),
    
  // Move banner up/down
  moveBanner: (id: string, direction: 'up' | 'down') =>
    apiClient.patch(`/banners/${id}/move`, { direction }),
};

// Homepage API (for future use)
export const homepageAPI = {
  getSections: () =>
    apiClient.get('/homepage/sections'),
    
  updateSection: (id: string, data: any) =>
    apiClient.put(`/homepage/sections/${id}`, data),
    
  createSection: (data: any) =>
    apiClient.post('/homepage/sections', data),
    
  deleteSection: (id: string) =>
    apiClient.delete(`/homepage/sections/${id}`),
    
  reorderSections: (sections: { id: string; order: number }[]) =>
    apiClient.post('/homepage/sections/reorder', { sections }),
};

// Coupons API
export const couponsAPI = {
  // Get all coupons with filtering and pagination
  getCoupons: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'active' | 'inactive' | 'expired' | 'scheduled';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) =>
    apiClient.get('/coupons', { params }),
    
  // Get single coupon by ID
  getCoupon: (id: string) =>
    apiClient.get(`/coupons/${id}`),
    
  // Create new coupon
  createCoupon: (data: any) =>
    apiClient.post('/coupons', data),
    
  // Update coupon
  updateCoupon: (id: string, data: any) =>
    apiClient.put(`/coupons/${id}`, data),
    
  // Delete coupon
  deleteCoupon: (id: string) =>
    apiClient.delete(`/coupons/${id}`),
    
  // Toggle coupon status
  toggleCouponStatus: (id: string) =>
    apiClient.patch(`/coupons/${id}/toggle`),
    
  // Validate coupon code
  validateCoupon: (data: {
    code: string;
    orderAmount: number;
    customerId?: string;
    productIds?: string[];
  }) =>
    apiClient.post('/coupons/validate', data),
    
  // Get coupon statistics
  getCouponStats: () =>
    apiClient.get('/coupons/stats'),
};

export default api;