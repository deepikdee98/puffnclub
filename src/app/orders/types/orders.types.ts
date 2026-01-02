/**
 * Orders Types
 * TypeScript type definitions for the Orders feature
 */

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount?: number;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  // New fields for redesign
  exchangeEligibleUntil?: string;
  returnEligibleUntil?: string;
  reviewSubmitted?: boolean;
}

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    category: string;
    images: string[];
  };
  variant?: {
    size?: string;
    color?: string;
    sku?: string;
  };
  quantity: number;
  price: number;
  total: number;
  // For exchange/return
  availableSizes?: string[];
  availableColors?: Color[];
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Color {
  name: string;
  hexCode: string;
  image?: string;
}

export interface TrackingStage {
  label: string;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
  message?: string;
  location?: string;
}

export interface OrderTracking {
  order: Order;
  currentStage: number;
  stages: TrackingStage[];
  estimatedDelivery?: string;
  carrier?: string;
  trackingNumber?: string;
}

export interface Review {
  _id?: string;
  product: string;
  customer: string;
  order: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExchangeRequest {
  _id?: string;
  order: string;
  product: string;
  customer: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  reason?: string;
  newSize: string;
  newColor: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // For tracking
  currentStage?: number;
  stages?: TrackingStage[];
}

export interface ReturnRequest {
  _id?: string;
  order: string;
  product: string;
  customer: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  reason?: string;
  photos?: string[];
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // For tracking
  currentStage?: number;
  stages?: TrackingStage[];
}

export type OrderAction =
  | 'track'
  | 'cancel'
  | 'return'
  | 'exchange'
  | 'review'
  | 'share'
  | 'download_invoice';

export interface OrderCardProps {
  order: Order;
  onAction: (orderId: string, action: OrderAction) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
