'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { wishlistService, Wishlist, WishlistItem, AddToWishlistData } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface WishlistContextType {
  wishlist: Wishlist | null;
  isLoading: boolean;
  addToWishlist: (data: AddToWishlistData) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  getWishlistCount: () => number;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlist(null);
    }
  }, [isAuthenticated]);

  const refreshWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await wishlistService.getWishlist();
      setWishlist(response.wishlist);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      // Don't show error toast for wishlist fetch failures
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (data: AddToWishlistData) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🛒 Adding to wishlist:', data);
      console.log('🛒 Product ID being sent:', data.productId);
      const response = await wishlistService.addToWishlist(data);
      console.log('✅ Wishlist add response:', response);
      setWishlist(response.wishlist);
      toast.success('Item added to wishlist!');
    } catch (error: any) {
      console.error('❌ Wishlist add error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        productId: data.productId,
        error: error
      });
      toast.error(error.message || 'Failed to add item to wishlist');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated || !wishlist) return;

    try {
      setIsLoading(true);
      
      // Find the wishlist item by product ID
      const wishlistItem = wishlist.items.find(item => item.product._id === productId);
      if (!wishlistItem) {
        throw new Error('Item not found in wishlist');
      }

      const response = await wishlistService.removeFromWishlist(wishlistItem._id);
      setWishlist(response.wishlist);
      toast.success('Item removed from wishlist!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item from wishlist');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearWishlist = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await wishlistService.clearWishlist();
      setWishlist(response.wishlist);
      toast.success('Wishlist cleared!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear wishlist');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getWishlistCount = (): number => {
    return wishlist?.totalItems || 0;
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist?.items.some(item => item.product._id === productId) || false;
  };

  const value: WishlistContextType = {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    refreshWishlist,
    getWishlistCount,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};