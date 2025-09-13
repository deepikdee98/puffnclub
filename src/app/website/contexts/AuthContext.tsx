'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, Customer } from '../services/authService';
import { toast } from 'react-toastify';

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateCustomer: (customer: Customer) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('website_token');
        if (token) {
          // Verify token by getting profile
          const response = await authService.getProfile();
          setCustomer(response.customer);
        }
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem('website_token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('customer');
        localStorage.removeItem('user_info');
        localStorage.removeItem('user_mobile');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setCustomer(response.customer);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);
      setCustomer(response.customer);
      toast.success('Registration successful!');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCustomer(null);
    // Clear OTP-related data
    localStorage.removeItem('user_info');
    localStorage.removeItem('user_mobile');
    localStorage.removeItem('customer');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully');
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomer(updatedCustomer);
    localStorage.setItem('customer', JSON.stringify(updatedCustomer));
  };

  const value: AuthContextType = {
    customer,
    isAuthenticated: !!customer,
    isLoading,
    login,
    register,
    logout,
    updateCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};