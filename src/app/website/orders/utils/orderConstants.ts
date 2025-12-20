/**
 * Order Constants
 * Configuration and constant values for the Orders feature
 */

import type { TrackingStage } from '../types/orders.types';

// Order status labels and colors
export const ORDER_STATUS = {
  pending: {
    label: 'Pending',
    color: '#FFA500',
    bgColor: '#FFF3E0',
  },
  confirmed: {
    label: 'Confirmed',
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  processing: {
    label: 'Processing',
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  shipped: {
    label: 'Shipped',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
  delivered: {
    label: 'Delivered',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#F44336',
    bgColor: '#FFEBEE',
  },
} as const;

// Payment status
export const PAYMENT_STATUS = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
} as const;

// Available sizes
export const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

// Tracking timeline stages for order
export const ORDER_TRACKING_STAGES: string[] = [
  'Item Ordered',
  'Order Packed',
  'Delivery Partner',
  'Out for Delivery',
  'Item Delivered',
];

// Tracking timeline stages for exchange
export const EXCHANGE_TRACKING_STAGES: string[] = [
  'Exchange product request',
  'Return Product',
  'Exchange Product Verification',
  'Exchange Product Dispatched',
  'Out for Delivery',
  'Item Delivered',
];

// Tracking timeline stages for return
export const RETURN_TRACKING_STAGES: string[] = [
  'Return product request',
  'Pickup Scheduled',
  'Product Picked Up',
  'Return Verification',
  'Refund Initiated',
  'Refund Completed',
];

// Exchange/Return eligibility period (in days)
export const EXCHANGE_RETURN_PERIOD = 7; // 7 days after delivery

// Review rating options
export const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

// Currency
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

// Date format
export const DATE_FORMAT = 'MMM DD, YYYY';
export const DATETIME_FORMAT = 'MMM DD, YYYY hh:mm A';

// API Endpoints
export const API_ENDPOINTS = {
  orders: '/api/website/orders',
  orderById: (id: string) => `/api/website/orders/${id}`,
  cancelOrder: (id: string) => `/api/website/orders/${id}/cancel`,
  trackOrder: (id: string) => `/api/website/orders/${id}/tracking`,
  reviewOrder: (id: string) => `/api/website/orders/${id}/review`,
  exchangeOrder: (id: string) => `/api/website/orders/${id}/exchange`,
  returnOrder: (id: string) => `/api/website/orders/${id}/return`,
  shareOrder: (id: string) => `/api/website/orders/${id}/share`,
} as const;

// Modal types
export const MODAL_TYPES = {
  REVIEW: 'review',
  EXCHANGE: 'exchange',
  RETURN: 'return',
  CANCEL: 'cancel',
  SHARE: 'share',
  EXCHANGE_DETAILS: 'exchange_details',
  RETURN_DETAILS: 'return_details',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  ORDER_CANCELLED: 'Order cancelled successfully',
  REVIEW_SUBMITTED: 'Thank you for your review!',
  EXCHANGE_REQUESTED: 'Exchange request submitted successfully',
  RETURN_REQUESTED: 'Return request submitted successfully',
  ORDER_SHARED: 'Order details shared successfully',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  ORDER_NOT_FOUND: 'Order not found',
  CANNOT_CANCEL: 'Cannot cancel order after dispatch',
  EXCHANGE_PERIOD_EXPIRED: 'Exchange period has expired',
  RETURN_PERIOD_EXPIRED: 'Return period has expired',
  ALREADY_REVIEWED: 'You have already reviewed this product',
  NETWORK_ERROR: 'Network error. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;
