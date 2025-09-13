import { apiRequest, API_ENDPOINTS } from './api';
import { Product } from './productService';

export interface WishlistItem {
  _id: string;
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  customer: string;
  items: WishlistItem[];
  totalItems: number;
}

export interface WishlistResponse {
  wishlist: Wishlist;
}

export interface AddToWishlistData {
  productId: string;
  color?: string;
  size?: string;
}

export const wishlistService = {
  // Get customer's wishlist
  getWishlist: async (): Promise<WishlistResponse> => {
    return apiRequest<WishlistResponse>(API_ENDPOINTS.WEBSITE.WISHLIST.GET);
  },

  // Add item to wishlist
  addToWishlist: async (data: AddToWishlistData): Promise<{ message: string; wishlist: Wishlist }> => {
    return apiRequest<{ message: string; wishlist: Wishlist }>(
      API_ENDPOINTS.WEBSITE.WISHLIST.ADD,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Remove item from wishlist
  removeFromWishlist: async (itemId: string): Promise<{ message: string; wishlist: Wishlist }> => {
    return apiRequest<{ message: string; wishlist: Wishlist }>(
      API_ENDPOINTS.WEBSITE.WISHLIST.REMOVE(itemId),
      {
        method: 'DELETE',
      }
    );
  },

  // Clear entire wishlist
  clearWishlist: async (): Promise<{ message: string; wishlist: Wishlist }> => {
    return apiRequest<{ message: string; wishlist: Wishlist }>(
      API_ENDPOINTS.WEBSITE.WISHLIST.CLEAR,
      {
        method: 'DELETE',
      }
    );
  },
};