import { apiRequest, API_ENDPOINTS } from './api';
import { Product } from './productService';
import { Address } from './authService';

export interface OrderItem {
  _id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  total: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateOrderData {
  items: {
    product: string;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  }[];
  shippingAddress: Omit<Address, '_id'>;
  billingAddress: Omit<Address, '_id'>;
  paymentMethod: string;
  notes?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}

export const orderService = {
  // Get customer's orders
  getOrders: async (filters: OrderFilters = {}): Promise<OrdersResponse> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const url = `${API_ENDPOINTS.WEBSITE.ORDERS.GET}?${queryParams.toString()}`;
    return apiRequest<OrdersResponse>(url);
  },

  // Create new order
  createOrder: async (data: CreateOrderData): Promise<{ message: string; order: Order }> => {
    return apiRequest<{ message: string; order: Order }>(
      API_ENDPOINTS.WEBSITE.ORDERS.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<{ order: Order }> => {
    return apiRequest<{ order: Order }>(API_ENDPOINTS.WEBSITE.ORDERS.GET_BY_ID(orderId));
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<{ message: string; order: Order }> => {
    return apiRequest<{ message: string; order: Order }>(
      API_ENDPOINTS.WEBSITE.ORDERS.CANCEL(orderId),
      {
        method: 'PUT',
      }
    );
  },
};