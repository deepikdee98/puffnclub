import { apiRequest, API_ENDPOINTS } from './api';
import { Product } from './productService';

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Cart {
  _id: string;
  customer: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  cart: Cart;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateCartItemData {
  quantity: number;
}

export const cartService = {
  // Get customer's cart
  getCart: async (): Promise<CartResponse> => {
    return apiRequest<CartResponse>(API_ENDPOINTS.WEBSITE.CART.GET);
  },

  // Add item to cart
  addToCart: async (data: AddToCartData): Promise<{ message: string; cart: Cart }> => {
    return apiRequest<{ message: string; cart: Cart }>(
      API_ENDPOINTS.WEBSITE.CART.ADD,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Update cart item quantity
  updateCartItem: async (
    itemId: string,
    data: UpdateCartItemData
  ): Promise<{ message: string; cart: Cart }> => {
    return apiRequest<{ message: string; cart: Cart }>(
      API_ENDPOINTS.WEBSITE.CART.UPDATE_ITEM(itemId),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<{ message: string; cart: Cart }> => {
    return apiRequest<{ message: string; cart: Cart }>(
      API_ENDPOINTS.WEBSITE.CART.REMOVE_ITEM(itemId),
      {
        method: 'DELETE',
      }
    );
  },

  // Clear entire cart
  clearCart: async (): Promise<{ message: string; cart: Cart }> => {
    return apiRequest<{ message: string; cart: Cart }>(
      API_ENDPOINTS.WEBSITE.CART.CLEAR,
      {
        method: 'DELETE',
      }
    );
  },
};