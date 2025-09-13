// Global type definitions for the admin panel

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  revenue: {
    today: number;
    week: number;
    month: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
    lowStock: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: Category;
  brand: Brand;
  variants: ProductVariant[];
  images: ProductImage[];
  seo: SEOMetadata;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  price: number;
  comparePrice?: number;
  inventory: number;
  sku: string;
  images: string[];
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  isMain: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  isActive: boolean;
  order: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  metaImage?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  paymentTypeDisplay?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  product: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  total?: string;
  productDetails?: {
    _id: string;
    name: string;
    sku: string;
    description: string;
    category: string;
    brand: string;
    color: string;
    price: number;
    comparePrice: number;
    stockQuantity: number;
    status: string;
    isFeatured: boolean;
    availableSizes: string[];
    tags: string[];
    images: string[];
    metaTitle: string;
    metaDescription: string;
    createdAt: string;
  };
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
  totalSpent: number;
  createdAt: Date;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
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
  };
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Processing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Completed' 
  | 'Cancelled';

export interface PaymentInfo {
  method: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
  currency: string;
}

export interface ShippingInfo {
  method: string;
  cost: number;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  address: Address;
}

export interface OrderTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface OrderEvent {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  user?: User;
}

export interface HomePageSection {
  id: string;
  type: 'hero' | 'featured' | 'category' | 'banner' | 'products';
  title: string;
  content: any;
  order: number;
  isActive: boolean;
  settings: SectionSettings;
}

export interface SectionSettings {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  customCSS?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}