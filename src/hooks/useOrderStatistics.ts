import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api';

interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

interface UseOrderStatisticsReturn {
  statistics: OrderStatistics;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useOrderStatistics = (): UseOrderStatisticsReturn => {
  const [statistics, setStatistics] = useState<OrderStatistics>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    
    if (!token) {
      setLoading(false);
      setError('Authentication required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch basic statistics from the orders API
      const response = await ordersAPI.getOrders({ limit: 1 }); // Just get 1 order to get statistics
      
      if (response.success && response.data.statistics) {
        setStatistics({
          totalOrders: response.data.statistics.totalOrders || 0,
          pendingOrders: response.data.statistics.pendingOrders || 0,
          processingOrders: 0, // Not provided by API yet
          shippedOrders: 0, // Not provided by API yet
          deliveredOrders: 0, // Not provided by API yet
          completedOrders: response.data.statistics.completedOrders || 0,
          cancelledOrders: 0, // Not provided by API yet
          totalRevenue: response.data.statistics.totalRevenue || 0,
        });
      } else {
        throw new Error('Failed to fetch statistics');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch statistics';
      setError(errorMessage);
      
      // Set default values on error
      setStatistics({
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const refetch = () => {
    fetchStatistics();
  };

  return {
    statistics,
    loading,
    error,
    refetch,
  };
};