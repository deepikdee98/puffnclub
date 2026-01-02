import { apiClient, dashboardAPI, productsAPI, ordersAPI, categoriesAPI, homepageAPI } from './api';
import { toast } from 'react-toastify';
import { DashboardMetrics, RecentOrder, TopProduct, SalesChartData, RecentActivity } from '@/types/dashboard';
import type { ProductsResponse } from '@/app/services/productService';

// Local SimpleProduct type used by admin sample data
interface SimpleProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  status: string;
  featured: boolean;
  tags: string[];
  image: string;
  createdAt: string;
}

// Sample/Mock data for fallback
export const sampleData: {
  metrics: DashboardMetrics;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  products: any[];
  orders: any[];
  categories: any[];
  salesChart: SalesChartData;
  recentActivity: RecentActivity[];
} = {
  // Dashboard metrics
  metrics: {
    revenue: {
      today: 12450,
      week: 87300,
      month: 342100,
      growth: 12.5,
      trend: "up",
    },
    orders: {
      total: 1247,
      pending: 23,
      processing: 45,
      completed: 1156,
      cancelled: 23,
      growth: 8.3,
      trend: "up",
    },
    customers: {
      total: 8934,
      new: 156,
      returning: 8778,
      growth: 15.2,
      trend: "up",
    },
    products: {
      total: 456,
      active: 423,
      inactive: 33,
      lowStock: 12,
      growth: -2.1,
      trend: "down",
    },
  },

  // Recent orders
  recentOrders: [
    {
      id: "12345",
      customer: "John Doe",
      email: "john@example.com",
      total: 299.99,
      status: "completed",
      date: "2024-01-15T10:30:00Z",
    },
    {
      id: "12346",
      customer: "Jane Smith",
      email: "jane@example.com",
      total: 149.5,
      status: "processing",
      date: "2024-01-15T09:15:00Z",
    },
    {
      id: "12347",
      customer: "Bob Johnson",
      email: "bob@example.com",
      total: 89.99,
      status: "pending",
      date: "2024-01-15T08:45:00Z",
    },
    {
      id: "12348",
      customer: "Alice Brown",
      email: "alice@example.com",
      total: 199.99,
      status: "shipped",
      date: "2024-01-14T16:20:00Z",
    },
    {
      id: "12349",
      customer: "Charlie Wilson",
      email: "charlie@example.com",
      total: 349.99,
      status: "completed",
      date: "2024-01-14T14:10:00Z",
    },
  ],

  // Top products
  topProducts: [
    {
      id: "1",
      name: "iPhone 15 Pro",
      category: "Electronics",
      sales: 234,
      revenue: 234000,
      stock: 45,
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: "2",
      name: "MacBook Air M2",
      category: "Electronics",
      sales: 156,
      revenue: 187200,
      stock: 23,
      image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: "3",
      name: "AirPods Pro",
      category: "Electronics",
      sales: 345,
      revenue: 86250,
      stock: 78,
      image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: "4",
      name: "iPad Pro",
      category: "Electronics",
      sales: 123,
      revenue: 98400,
      stock: 34,
      image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
  ],

  // Products
  products: [
    {
      id: "1",
      name: "Premium Cotton T-Shirt",
      sku: "TSH001",
      category: "T-Shirts",
      brand: "StyleCraft",
      price: 29.99,
      comparePrice: 39.99,
      stock: 150,
      status: "active",
      featured: true,
      tags: ["New Arrival", "Trending"],
      image: "https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Denim Jacket Classic",
      sku: "JKT002",
      category: "Jackets",
      brand: "UrbanStyle",
      price: 89.99,
      comparePrice: 120.0,
      stock: 45,
      status: "active",
      featured: false,
      tags: ["Sale"],
      image: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-14T16:20:00Z",
    },
    {
      id: "3",
      name: "Summer Floral Dress",
      sku: "DRS003",
      category: "Dresses",
      brand: "FloralFashion",
      price: 65.99,
      comparePrice: null,
      stock: 0,
      status: "inactive",
      featured: false,
      tags: ["Out of Stock"],
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-13T12:15:00Z",
    },
    {
      id: "4",
      name: "Casual Sneakers",
      sku: "SHO004",
      category: "Shoes",
      brand: "ComfortWalk",
      price: 79.99,
      comparePrice: 99.99,
      stock: 75,
      status: "active",
      featured: true,
      tags: ["Trending", "Best Seller"],
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100",
      createdAt: "2024-01-12T09:45:00Z",
    },
  ],

  // Orders
  orders: [
    {
      id: "12345",
      orderNumber: "ORD-12345",
      customer: {
        name: "John Doe",
        email: "john@example.com",
      },
      items: 3,
      total: 299.99,
      status: "completed",
      paymentStatus: "paid",
      date: "2024-01-15T10:30:00Z",
    },
    {
      id: "12346",
      orderNumber: "ORD-12346",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
      },
      items: 1,
      total: 149.5,
      status: "processing",
      paymentStatus: "paid",
      date: "2024-01-15T09:15:00Z",
    },
    {
      id: "12347",
      orderNumber: "ORD-12347",
      customer: {
        name: "Bob Johnson",
        email: "bob@example.com",
      },
      items: 2,
      total: 89.99,
      status: "pending",
      paymentStatus: "pending",
      date: "2024-01-15T08:45:00Z",
    },
    {
      id: "12348",
      orderNumber: "ORD-12348",
      customer: {
        name: "Alice Brown",
        email: "alice@example.com",
      },
      items: 4,
      total: 199.99,
      status: "shipped",
      paymentStatus: "paid",
      date: "2024-01-14T16:20:00Z",
    },
    {
      id: "12349",
      orderNumber: "ORD-12349",
      customer: {
        name: "Charlie Wilson",
        email: "charlie@example.com",
      },
      items: 1,
      total: 349.99,
      status: "delivered",
      paymentStatus: "paid",
      date: "2024-01-14T14:10:00Z",
    },
  ],

  // Categories
  categories: [
    { id: "1", name: "T-Shirts", slug: "t-shirts", count: 45 },
    { id: "2", name: "Jackets", slug: "jackets", count: 23 },
    { id: "3", name: "Dresses", slug: "dresses", count: 67 },
    { id: "4", name: "Shoes", slug: "shoes", count: 34 },
    { id: "5", name: "Electronics", slug: "electronics", count: 89 },
  ],

  // Sales chart data
  salesChart: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
      }
    ]
  },

  // Recent activity
  recentActivity: [
    {
      id: "1",
      type: "order",
      message: "New order #12345 received",
      time: "2 minutes ago",
      icon: "shopping-cart",
    },
    {
      id: "2",
      type: "product",
      message: "Product 'iPhone 15 Pro' updated",
      time: "5 minutes ago",
      icon: "package",
    },
    {
      id: "3",
      type: "customer",
      message: "New customer registered",
      time: "10 minutes ago",
      icon: "user",
    },
  ],
};

// Data service with API calls and fallback to sample data
export const dataService = {
  // Dashboard data
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get<DashboardMetrics>('/admin/dashboard/metrics');
      return response;
    } catch (error) {
      console.warn('Failed to fetch dashboard metrics from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 500));
      return sampleData.metrics;
    }
  },

  async getRecentOrders(limit: number = 10): Promise<RecentOrder[]> {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get<RecentOrder[]>(`/admin/dashboard/recent-orders?limit=${limit}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch recent orders from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 300));
      return sampleData.recentOrders.slice(0, limit);
    }
  },

  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get<TopProduct[]>(`/admin/dashboard/top-products?limit=${limit}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch top products from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 400));
      return sampleData.topProducts.slice(0, limit);
    }
  },

  async getSalesChart(period: string = '6months') {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get(`/admin/dashboard/sales-chart?period=${period}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch sales chart from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 600));
      return sampleData.salesChart;
    }
  },

  async getRecentActivity() {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get('/admin/dashboard/recent-activity');
      return response;
    } catch (error) {
      console.warn('Failed to fetch recent activity from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 350));
      return sampleData.recentActivity;
    }
  },

  // Products data
  async getProducts(params?: any): Promise<any> {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get<ProductsResponse>('/products', { params });
      return response;
    } catch (error) {
      console.warn('Failed to fetch products from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 500));
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const total = sampleData.products.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;
      const end = start + limit;
      const paged = sampleData.products.slice(start, end) as unknown as SimpleProduct[];
      return {
        products: paged,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }
  },

  async getProduct(id: string): Promise<SimpleProduct> {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get<SimpleProduct>(`/products/${id}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch product from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 300));
      const product = sampleData.products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    }
  },

  async createProduct(data: Partial<SimpleProduct>): Promise<SimpleProduct> {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.post<SimpleProduct>('/products', data);
      toast.success('Product created successfully');
      return response;
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 800));
      const newProduct: SimpleProduct = {
        id: Date.now().toString(),
        name: data.name || '',
        sku: data.sku || '',
        category: data.category || '',
        brand: data.brand || '',
        price: data.price || 0,
        comparePrice: data.comparePrice,
        stock: data.stock || 0,
        status: data.status || 'draft',
        featured: data.featured || false,
        tags: data.tags || [],
        image: data.image || '',
        createdAt: new Date().toISOString(),
      };
      return newProduct;
    }
  },

  async updateProduct(id: string, data: Partial<SimpleProduct>): Promise<SimpleProduct> {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.put<SimpleProduct>(`/products/${id}`, data);
      toast.success('Product updated successfully');
      return response;
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        id,
        name: data.name || '',
        sku: data.sku || '',
        category: data.category || '',
        brand: data.brand || '',
        price: data.price || 0,
        comparePrice: data.comparePrice ?? null,
        stock: data.stock || 0,
        status: data.status || 'draft',
        featured: data.featured || false,
        tags: data.tags || [],
        image: data.image || '',
        createdAt: data.createdAt || new Date().toISOString(),
      };
    }
  },

  async deleteProduct(id: string) {
    try {
      // Try to connect to localhost backend first
      await apiClient.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 400));
      throw error;
    }
  },

  // Orders data
  async getOrders(params?: any) {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get('/orders', { params });
      return response;
    } catch (error) {
      console.warn('Failed to fetch orders from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: sampleData.orders,
        total: sampleData.orders.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
      };
    }
  },

  async getOrder(id: string) {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get(`/orders/${id}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch order from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 300));
      const order = sampleData.orders.find(o => o.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
  },

  async updateOrderStatus(id: string, status: string) {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.patch(`/orders/${id}/status`, { status });
      toast.success('Order status updated successfully');
      return response;
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 400));
      return { id, status };
    }
  },

  // Categories data
  async getCategories() {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.get('/categories');
      return response;
    } catch (error) {
      console.warn('Failed to fetch categories from API, using sample data:', error);
      toast.warn('Using sample data - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 300));
      return sampleData.categories;
    }
  },

  async createCategory(data: any) {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.post('/categories', data);
      toast.success('Category created successfully');
      return response;
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error('Failed to create category - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCategory = {
        id: Date.now().toString(),
        ...data,
        count: 0,
      };
      return newCategory;
    }
  },

  async updateCategory(id: string, data: any) {
    try {
      // Try to connect to localhost backend first
      const response = await apiClient.put(`/categories/${id}`, data);
      toast.success('Category updated successfully');
      return response;
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error('Failed to update category - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 400));
      return { id, ...data };
    }
  },

  async deleteCategory(id: string) {
    try {
      // Try to connect to localhost backend first
      await apiClient.delete(`/categories/${id}`);
      toast.success('Category deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category - backend not connected');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 300));
      throw error;
    }
  },
};

export default dataService;