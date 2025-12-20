/**
 * Order Helper Functions
 * Utility functions for order operations
 */

import type { Order, OrderAction, TrackingStage } from '../types/orders.types';
import { ORDER_STATUS, CURRENCY_SYMBOL, EXCHANGE_RETURN_PERIOD } from './orderConstants';

/**
 * Format price to Indian Rupees
 */
export const formatPrice = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN')}`;
};

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return dateObj.toLocaleDateString('en-IN', options);
};

/**
 * Get order status label and styling
 */
export const getOrderStatus = (status: Order['orderStatus']) => {
  return ORDER_STATUS[status] || ORDER_STATUS.pending;
};

/**
 * Get primary action button for order based on status
 */
export const getOrderAction = (order: Order): { label: string; action: OrderAction } => {
  switch (order.orderStatus) {
    case 'pending':
    case 'confirmed':
    case 'processing':
    case 'shipped':
      return { label: 'Track Order', action: 'track' };
    case 'delivered':
      return { label: 'Return / Exchange', action: 'exchange' };
    case 'cancelled':
      return { label: 'View Details', action: 'track' };
    default:
      return { label: 'Track Order', action: 'track' };
  }
};

/**
 * Check if order can be cancelled
 */
export const canCancelOrder = (order: Order): boolean => {
  return ['pending', 'confirmed', 'processing'].includes(order.orderStatus);
};

/**
 * Check if order can be exchanged/returned
 */
export const canExchangeOrReturn = (order: Order): boolean => {
  if (order.orderStatus !== 'delivered') return false;
  if (!order.deliveredAt) return false;

  const deliveryDate = new Date(order.deliveredAt);
  const currentDate = new Date();
  const daysSinceDelivery = Math.floor(
    (currentDate.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceDelivery <= EXCHANGE_RETURN_PERIOD;
};

/**
 * Check if order can be reviewed
 */
export const canReviewOrder = (order: Order): boolean => {
  return order.orderStatus === 'delivered' && !order.reviewSubmitted;
};

/**
 * Get delivery status text for order card
 */
export const getDeliveryStatusText = (order: Order): string => {
  switch (order.orderStatus) {
    case 'pending':
    case 'confirmed':
    case 'processing':
      return order.estimatedDelivery
        ? `Est Delivery: ${formatDate(order.estimatedDelivery)}`
        : 'Processing';
    case 'shipped':
      return order.estimatedDelivery
        ? `Est Delivery: ${formatDate(order.estimatedDelivery)}`
        : 'In Transit';
    case 'delivered':
      return order.deliveredAt
        ? `Delivered on ${formatDate(order.deliveredAt)}`
        : 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Status Unknown';
  }
};

/**
 * Get first product from order items
 */
export const getFirstProduct = (order: Order) => {
  return order.items[0];
};

/**
 * Get product image URL
 */
export const getProductImage = (order: Order): string => {
  const firstProduct = getFirstProduct(order);
  if (firstProduct?.product?.images && firstProduct.product.images.length > 0) {
    return firstProduct.product.images[0];
  }
  return '/default-image.png';
};

/**
 * Get product name
 */
export const getProductName = (order: Order): string => {
  const firstProduct = getFirstProduct(order);
  return firstProduct?.product?.name || 'Product';
};

/**
 * Get product size
 */
export const getProductSize = (order: Order): string => {
  const firstProduct = getFirstProduct(order);
  return firstProduct?.variant?.size || 'N/A';
};

/**
 * Get product quantity
 */
export const getProductQuantity = (order: Order): number => {
  const firstProduct = getFirstProduct(order);
  return firstProduct?.quantity || 1;
};

/**
 * Get product price
 */
export const getProductPrice = (order: Order): number => {
  const firstProduct = getFirstProduct(order);
  return firstProduct?.price || 0;
};

/**
 * Get additional items count
 */
export const getAdditionalItemsCount = (order: Order): number => {
  return order.items.length > 1 ? order.items.length - 1 : 0;
};

/**
 * Calculate current tracking stage from order status
 */
export const getCurrentTrackingStage = (order: Order): number => {
  switch (order.orderStatus) {
    case 'pending':
    case 'confirmed':
      return 1; // Item Ordered
    case 'processing':
      return 2; // Order Packed
    case 'shipped':
      return 3; // Delivery Partner / Out for Delivery
    case 'delivered':
      return 5; // Item Delivered
    case 'cancelled':
      return 1; // Stay at first stage
    default:
      return 1;
  }
};

/**
 * Generate tracking stages from order data
 */
export const generateTrackingStages = (order: Order): TrackingStage[] => {
  const stages: TrackingStage[] = [
    {
      label: 'Item Ordered',
      status: 'completed',
      timestamp: formatDate(order.createdAt),
      message: 'Item Ordered on ' + formatDate(order.createdAt) + ' and sent to the dispatch',
    },
    {
      label: 'Order Packed',
      status: 'pending',
      message: 'Order is packed and sent to the delivery partner',
    },
    {
      label: 'Delivery Partner',
      status: 'pending',
      message: 'Delivery partner receives the product and will out for delivery',
    },
    {
      label: 'Out for Delivery',
      status: 'pending',
      message: 'Product is out for delivery and will reach out in estimated',
    },
    {
      label: 'Estimated delivery',
      status: 'pending',
      timestamp: order.estimatedDelivery ? formatDate(order.estimatedDelivery) : undefined,
      message: order.estimatedDelivery
        ? 'Order will be in your in any time to your doorstep'
        : 'Estimated delivery date pending',
    },
  ];

  // Update stages based on order status
  const currentStage = getCurrentTrackingStage(order);

  stages.forEach((stage, index) => {
    if (index < currentStage - 1) {
      stage.status = 'completed';
    } else if (index === currentStage - 1) {
      stage.status = 'active';
    } else {
      stage.status = 'pending';
    }
  });

  // Update based on specific statuses
  if (order.orderStatus === 'processing') {
    stages[1].status = 'completed';
    stages[1].message = 'Order is packed and sent to the delivery partner';
  }

  if (order.orderStatus === 'shipped') {
    stages[1].status = 'completed';
    stages[2].status = 'completed';
    stages[3].status = 'active';
  }

  if (order.orderStatus === 'delivered' && order.deliveredAt) {
    stages.forEach((stage, index) => {
      if (index < 4) stage.status = 'completed';
    });
    stages[4].status = 'completed';
    stages[4].label = 'Item Delivered';
    stages[4].timestamp = formatDate(order.deliveredAt);
    stages[4].message = 'Order delivered as per the estimated delivery';
  }

  return stages;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get order short ID (last 8 characters)
 */
export const getShortOrderId = (orderId: string): string => {
  return orderId.slice(-8).toUpperCase();
};
