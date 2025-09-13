'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService, Cart, CartItem, AddToCartData } from '../services/cartService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (data: AddToCartData) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await cartService.getCart();
      setCart(response.cart);
      console.log('refreshCart: cart from backend', response.cart);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      // Don't show error toast for cart fetch failures
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (data: AddToCartData) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartService.addToCart(data);
      setCart(response.cart);
      console.log('addToCart: cart from backend', response.cart);
      toast.success('Item added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item to cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await cartService.updateCartItem(itemId, { quantity });
      setCart(response.cart);
      toast.success('Cart updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await cartService.removeFromCart(itemId);
      setCart(response.cart);
      toast.success('Item removed from cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      await cartService.clearCart();
      setCart({ customer: '', items: [], totalItems: 0, totalAmount: 0 });
      toast.success('Cart cleared!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCartCount = (): number => {
    return cart?.totalItems || 0;
  };

  const getCartTotal = (): number => {
    return cart?.totalAmount || 0;
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    getCartCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};