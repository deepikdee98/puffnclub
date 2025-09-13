import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '@/lib/api';
import { Order } from '@/types';
import { toast } from 'react-toastify';

interface UsePendingOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateOrderStatus: (orderId: string, status: string, paymentStatus?: string) => Promise<void>;
}

export const usePendingOrders = (): UsePendingOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingOrders = useCallback(async () => {
    // Check if user is authenticated before making API call
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    
    if (!token) {
      setLoading(false);
      setError('Authentication required. Please login to view pending orders.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersAPI.getPendingOrders();
      
      console.log('Pending orders API response:', response);
      
      if (response.success) {
        // Handle different response structures
        const ordersData = response.data?.orders || response.data || response.orders || [];
        const ordersArray = Array.isArray(ordersData) ? ordersData : [];
        
        // Debug: Log payment statuses
        console.log('Payment statuses found:', ordersArray.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
          status: order.status
        })));
        
        setOrders(ordersArray);
      } else {
        throw new Error(response.message || 'Failed to fetch pending orders');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch pending orders';
      setError(errorMessage);
      
      // Don't show toast for auth errors, let the component handle it
      if (!errorMessage.includes('Unauthorized') && !errorMessage.includes('Authentication')) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const updateData: { status?: string; paymentStatus?: string } = { status };
      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }

      const response = await ordersAPI.updateOrderStatus(orderId, updateData);
      
      if (response.success) {
        toast.success('Order status updated successfully');
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: status as any, paymentStatus: paymentStatus as any || order.paymentStatus }
              : order
          ).filter(order => 
            // Remove from pending list if status is no longer pending
            status === 'Pending' || order._id !== orderId
          )
        );
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update order status';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchPendingOrders,
    updateOrderStatus,
  };
};

export default usePendingOrders;