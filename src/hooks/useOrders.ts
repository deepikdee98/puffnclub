import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '@/lib/api';
import { Order, OrdersResponse } from '@/types';
import { toast } from 'react-toastify';

interface UseOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  statistics: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
  };
  filters: {
    status?: string;
    paymentStatus?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy: string;
    sortOrder: string;
  };
  refetch: () => void;
  updateOrderStatus: (orderId: string, status: string, paymentStatus?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

export const useOrders = (params: UseOrdersParams = {}): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchOrders = useCallback(async () => {
    // Check if user is authenticated before making API call
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    
    if (!token) {
      setLoading(false);
      setError('Authentication required. Please login to view orders.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersAPI.getOrders(params) as unknown as {
        success?: boolean;
        data?: {
          orders: Order[];
          pagination: any;
          statistics: any;
          filters: any;
        };
        orders?: Order[];
        pagination?: any;
      };
      
      if (response?.success && response.data) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination || pagination);
        setStatistics(response.data.statistics || statistics);
        setFilters(response.data.filters || filters);
      } else if (Array.isArray(response?.orders)) {
        setOrders(response.orders);
        setPagination(response.pagination || pagination);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch orders';
      setError(errorMessage);
      
      // Don't show toast for auth errors, let the component handle it
      if (!errorMessage.includes('Unauthorized') && !errorMessage.includes('Authentication')) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.status,
    params.paymentStatus,
    params.search,
    params.sortBy,
    params.sortOrder,
    params.startDate,
    params.endDate,
  ]);

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const updateData: { status?: string; paymentStatus?: string } = { status };
      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }

      const response = await ordersAPI.updateOrderStatus(orderId, updateData) as unknown as { success?: boolean; message?: string };
      
      if (response.success) {
        toast.success('Order status updated successfully');
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: status as any, paymentStatus: (paymentStatus as any) || order.paymentStatus }
              : order
          )
        );
      } else {
        throw new Error(response?.message || 'Failed to update order status');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update order status';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const response = await ordersAPI.deleteOrder(orderId) as unknown as { success?: boolean; message?: string };
      
      if (response.success) {
        toast.success('Order deleted successfully');
        // Remove the order from local state
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        // Update statistics
        setStatistics(prev => ({
          ...prev,
          totalOrders: prev.totalOrders - 1,
        }));
      } else {
        throw new Error(response?.message || 'Failed to delete order');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete order';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    pagination,
    statistics,
    filters,
    refetch: fetchOrders,
    updateOrderStatus,
    deleteOrder,
  };
};

export default useOrders;