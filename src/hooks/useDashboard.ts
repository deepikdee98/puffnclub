import { useState, useEffect } from 'react';
import { dashboardAPI, ordersAPI } from '@/lib/api';
import { toast } from 'react-toastify';

interface DashboardMetrics {
  revenue: {
    today: number;
    week: number;
    month: number;
    growth: number;
    trend: 'up' | 'down';
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    growth: number;
    trend: 'up' | 'down';
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    growth: number;
    trend: 'up' | 'down';
  };
  products: {
    total: number;
    active: number;
    inactive: number;
    lowStock: number;
    growth: number;
    trend: 'up' | 'down';
  };
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  user?: {
    name: string;
    email: string;
  };
  customer?: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard metrics
  const fetchMetrics = async () => {
    try {
      const response = await dashboardAPI.getMetrics();
      setMetrics(response);
    } catch (error: any) {
      console.error('Error fetching metrics:', error);
      // Use fallback metrics if API call fails
      setMetrics({
        revenue: {
          today: 0,
          week: 0,
          month: 0,
          growth: 0,
          trend: 'up',
        },
        orders: {
          total: 0,
          pending: 0,
          processing: 0,
          completed: 0,
          cancelled: 0,
          growth: 0,
          trend: 'up',
        },
        customers: {
          total: 0,
          new: 0,
          returning: 0,
          growth: 0,
          trend: 'up',
        },
        products: {
          total: 0,
          active: 0,
          inactive: 0,
          lowStock: 0,
          growth: 0,
          trend: 'up',
        },
      });
    }
  };

  // Fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      const response = await dashboardAPI.getRecentOrders(5);
      
      // Handle different response formats
      let ordersData = [];
      if (response?.data) {
        ordersData = response.data;
      } else if (Array.isArray(response)) {
        ordersData = response;
      } else if (response?.orders) {
        ordersData = response.orders;
      }
      
      setRecentOrders(ordersData);
    } catch (error: any) {
      console.error('Error fetching recent orders:', error);
      // Try alternative API endpoint
      try {
        const fallbackResponse = await ordersAPI.getOrders({ 
          page: 1, 
          limit: 5, 
          sortBy: 'createdAt', 
          sortOrder: 'desc' 
        });
        
        if (fallbackResponse?.data?.orders) {
          setRecentOrders(fallbackResponse.data.orders);
        } else if (fallbackResponse?.orders) {
          setRecentOrders(fallbackResponse.orders);
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        setError('Failed to load recent orders');
      }
    }
  };

  // Fetch top products
  const fetchTopProducts = async () => {
    try {
      const response = await dashboardAPI.getTopProducts(4);
      
      // Handle different response formats
      let productsData = [];
      if (response?.data) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      } else if (response?.products) {
        productsData = response.products;
      }
      
      setTopProducts(productsData);
    } catch (error: any) {
      console.error('Error fetching top products:', error);
      setTopProducts([]);
    }
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchMetrics(),
        fetchRecentOrders(),
        fetchTopProducts(),
      ]);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = () => {
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    metrics,
    recentOrders,
    topProducts,
    loading,
    error,
    refreshData,
  };
};