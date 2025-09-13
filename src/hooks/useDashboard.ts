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
      const response = await dashboardAPI.getMetrics() as unknown as DashboardMetrics | { data?: DashboardMetrics };
      const metricsData = (response as any)?.data ?? response;
      setMetrics(metricsData as DashboardMetrics);
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
      const response = await dashboardAPI.getRecentOrders(5) as unknown as any;
      
      // Handle different response formats
      let ordersData: any[] = [];
      if (response && typeof response === 'object' && 'data' in response) {
        ordersData = (response as any).data;
      } else if (Array.isArray(response)) {
        ordersData = response as any[];
      } else if (response && typeof response === 'object' && 'orders' in response) {
        ordersData = (response as any).orders;
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
        }) as unknown as any;
        
        if (fallbackResponse && typeof fallbackResponse === 'object' && 'data' in fallbackResponse && (fallbackResponse as any).data?.orders) {
          setRecentOrders((fallbackResponse as any).data.orders);
        } else if (fallbackResponse && typeof fallbackResponse === 'object' && 'orders' in fallbackResponse) {
          setRecentOrders((fallbackResponse as any).orders);
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
      const response = await dashboardAPI.getTopProducts(4) as unknown as any;
      
      // Handle different response formats
      let productsData: any[] = [];
      if (response && typeof response === 'object' && 'data' in response) {
        productsData = (response as any).data;
      } else if (Array.isArray(response)) {
        productsData = response as any[];
      } else if (response && typeof response === 'object' && 'products' in response) {
        productsData = (response as any).products;
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