import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

// Create axios instance for website API
const websiteApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for website API
websiteApi.interceptors.request.use(
  (config: any) => {
    // Try to get customer token from localStorage first, then sessionStorage, then cookies
    const token = localStorage.getItem('customer_token') || 
                  sessionStorage.getItem('customer_token') || 
                  Cookies.get('customer_token');
    
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

// Response interceptor for website API
websiteApi.interceptors.response.use(
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
          localStorage.removeItem('customer_token');
          sessionStorage.removeItem('customer_token');
          Cookies.remove('customer_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/website/login';
          }
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('Access denied. Please login to continue.');
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

// Website API client
export const websiteApiClient = {
  // Generic methods
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    websiteApi.get(url, config).then((response) => response.data),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    websiteApi.post(url, data, config).then((response) => response.data),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    websiteApi.put(url, data, config).then((response) => response.data),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    websiteApi.patch(url, data, config).then((response) => response.data),
    
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    websiteApi.delete(url, config).then((response) => response.data),
};

// Website Authentication API
export const websiteAuthAPI = {
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
  }) =>
    websiteApiClient.post('/website/auth/register', userData),
    
  login: (credentials: { email: string; password: string }) =>
    websiteApiClient.post('/website/auth/login', credentials),
    
  logout: () =>
    websiteApiClient.post('/website/auth/logout'),
    
  refreshToken: (refreshToken: string) =>
    websiteApiClient.post('/website/auth/refresh-token', { refreshToken }),
    
  getProfile: () =>
    websiteApiClient.get('/website/auth/profile'),
    
  updateProfile: (profileData: any) =>
    websiteApiClient.put('/website/auth/profile', profileData),
};

// Website Products API
export const websiteProductsAPI = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }) =>
    websiteApiClient.get('/website/products', { params }),
    
  getFeaturedProducts: (limit: number = 8) =>
    websiteApiClient.get(`/website/products/featured?limit=${limit}`),
    
  getProductsByCategory: (category: string, params?: any) =>
    websiteApiClient.get(`/website/products/category/${category}`, { params }),
    
  searchProducts: (query: string, params?: any) =>
    websiteApiClient.get(`/website/products/search?q=${query}`, { params }),
    
  getProduct: (id: string) =>
    websiteApiClient.get(`/website/product/${id}`),
};

// Website Cart API
export const websiteCartAPI = {
  getCart: () =>
    websiteApiClient.get('/website/cart'),
    
  addToCart: (item: {
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
  }) =>
    websiteApiClient.post('/website/cart/add', item),
    
  updateCartItem: (itemId: string, data: { quantity: number }) =>
    websiteApiClient.put(`/website/cart/item/${itemId}`, data),
    
  removeFromCart: (itemId: string) =>
    websiteApiClient.delete(`/website/cart/item/${itemId}`),
    
  clearCart: () =>
    websiteApiClient.delete('/website/cart/clear'),
};

// Website Wishlist API
export const websiteWishlistAPI = {
  getWishlist: () =>
    websiteApiClient.get('/website/wishlist'),
    
  addToWishlist: (productId: string) =>
    websiteApiClient.post('/website/wishlist/add', { productId }),
    
  removeFromWishlist: (itemId: string) =>
    websiteApiClient.delete(`/website/wishlist/item/${itemId}`),
    
  clearWishlist: () =>
    websiteApiClient.delete('/website/wishlist/clear'),
    
  moveToCart: (itemId: string, data: {
    quantity: number;
    size?: string;
    color?: string;
  }) =>
    websiteApiClient.post(`/website/wishlist/move-to-cart/${itemId}`, data),
};

// Website Orders API
export const websiteOrdersAPI = {
  createOrder: (orderData: {
    items: Array<{
      productId: string;
      quantity: number;
      size?: string;
      color?: string;
    }>;
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
    notes?: string;
  }) =>
    websiteApiClient.post('/website/orders', orderData),
    
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    websiteApiClient.get('/website/orders', { params }),
    
  getOrder: (orderId: string) =>
    websiteApiClient.get(`/website/orders/${orderId}`),
    
  cancelOrder: (orderId: string, reason: string) =>
    websiteApiClient.put(`/website/orders/${orderId}/cancel`, {
      cancellationReason: reason
    }),
};

// Website Contact API
export const websiteContactAPI = {
  submitContactForm: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) =>
    websiteApiClient.post('/website/contact', formData),
    
  subscribeNewsletter: (data: {
    email: string;
    firstName?: string;
    lastName?: string;
  }) =>
    websiteApiClient.post('/website/newsletter/subscribe', data),
    
  unsubscribeNewsletter: (email: string) =>
    websiteApiClient.post('/website/newsletter/unsubscribe', { email }),
};

export default websiteApi;