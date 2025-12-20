const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Website endpoints
  WEBSITE: {
    PRODUCTS: `${API_BASE_URL}/website/products`,
    FEATURED_PRODUCTS: `${API_BASE_URL}/website/products/featured`,
    PRODUCT_BY_ID: (id: string) => `${API_BASE_URL}/website/product/${id}`,
    PRODUCTS_BY_CATEGORY: (category: string) => `${API_BASE_URL}/website/products/category/${category}`,
    SEARCH_PRODUCTS: `${API_BASE_URL}/website/products/search`,
    BANNERS: `${API_BASE_URL}/website/banners`,
    NEWSLETTER_SUBSCRIBE: `${API_BASE_URL}/website/newsletter/subscribe`,
    CONTACT: `${API_BASE_URL}/website/contact`,

    // Categories (public)
    CATEGORIES_DROPDOWN: `${API_BASE_URL}/categories/dropdown`,
    CATEGORY_BY_SLUG: (slug: string) => `${API_BASE_URL}/categories/slug/${slug}`,
    CATEGORIES: `${API_BASE_URL}/categories/`,
    // Auth endpoints
    AUTH: {
      REGISTER: `${API_BASE_URL}/website/auth/register`,
      LOGIN: `${API_BASE_URL}/website/auth/login`,
      PROFILE: `${API_BASE_URL}/website/auth/profile`,
      UPDATE_PROFILE: `${API_BASE_URL}/website/auth/profile`,
      CHANGE_PASSWORD: `${API_BASE_URL}/website/auth/change-password`,
      FORGOT_PASSWORD: `${API_BASE_URL}/website/auth/forgot-password`,
      RESET_PASSWORD: `${API_BASE_URL}/website/auth/reset-password`,
      // OTP endpoints
      SEND_OTP: `${API_BASE_URL}/website/auth/send-otp`,
      VERIFY_OTP: `${API_BASE_URL}/website/auth/verify-otp`,
      RESEND_OTP: `${API_BASE_URL}/website/auth/resend-otp`,
    },
    
    // Cart endpoints
    CART: {
      GET: `${API_BASE_URL}/website/cart`,
      ADD: `${API_BASE_URL}/website/cart/add`,
      UPDATE_ITEM: (itemId: string) => `${API_BASE_URL}/website/cart/item/${itemId}`,
      REMOVE_ITEM: (itemId: string) => `${API_BASE_URL}/website/cart/item/${itemId}`,
      CLEAR: `${API_BASE_URL}/website/cart/clear`,
    },
    
    // Wishlist endpoints
    WISHLIST: {
      GET: `${API_BASE_URL}/website/wishlist`,
      ADD: `${API_BASE_URL}/website/wishlist/add`,
      REMOVE: (itemId: string) => `${API_BASE_URL}/website/wishlist/item/${itemId}`,
      CLEAR: `${API_BASE_URL}/website/wishlist/clear`,
    },

    // Address endpoints
    ADDRESSES: {
      BASE: `${API_BASE_URL}/website/addresses`,
      LIST: `${API_BASE_URL}/website/addresses`,
      ADD: `${API_BASE_URL}/website/addresses`,
      UPDATE: (addressId: string) => `${API_BASE_URL}/website/addresses/${addressId}`,
      DELETE: (addressId: string) => `${API_BASE_URL}/website/addresses/${addressId}`,
      SET_DEFAULT: (addressId: string) => `${API_BASE_URL}/website/addresses/${addressId}/default`,
    },
    
    // Orders endpoints
    ORDERS: {
      GET: `${API_BASE_URL}/website/orders`,
      CREATE: `${API_BASE_URL}/website/orders`,
      GET_BY_ID: (orderId: string) => `${API_BASE_URL}/website/orders/${orderId}`,
      CANCEL: (orderId: string) => `${API_BASE_URL}/website/orders/${orderId}/cancel`,
    },
    
    // Coupon endpoints
    COUPONS: {
      GET_ACTIVE: `${API_BASE_URL}/coupons/active`,
      VALIDATE: `${API_BASE_URL}/coupons/validate`,
    },
    
    // Shipping & Delivery endpoints (Shiprocket)
    SHIPPING: {
      GET_RATES: `${API_BASE_URL}/website/shipping/rates`,
      CHECK_SERVICEABILITY: (pincode: string) => `${API_BASE_URL}/website/shipping/serviceability/${pincode}`,
    },
    
    // Order tracking endpoint
    ORDER_TRACKING: (orderId: string) => `${API_BASE_URL}/website/orders/${orderId}/tracking`,
    
    // Exchange & Return endpoints
    EXCHANGE_RETURNS: {
      LIST: `${API_BASE_URL}/website/exchange-returns`,
      GET_BY_ID: (requestId: string) => `${API_BASE_URL}/website/exchange-returns/${requestId}`,
      CANCEL: (requestId: string) => `${API_BASE_URL}/website/exchange-returns/${requestId}/cancel`,
      EXCHANGE: (orderId: string) => `${API_BASE_URL}/website/orders/${orderId}/exchange`,
      RETURN: (orderId: string) => `${API_BASE_URL}/website/orders/${orderId}/return`,
    },
  },
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('website_token');
  }
  return null;
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('website_token', token);
  }
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('website_token');
  }
};

// Helper function to create headers with auth token
export const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API request function
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // If URL starts with /api/, prepend the base URL
  const fullUrl = url.startsWith('/api/') 
    ? `${API_BASE_URL.replace('/api', '')}${url}`
    : url;

  const defaultOptions: RequestInit = {
    headers: createAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(fullUrl, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};