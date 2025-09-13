import { toast } from 'react-toastify';
import {
  websiteApiClient,
  websiteAuthAPI,
  websiteProductsAPI,
  websiteCartAPI,
  websiteWishlistAPI,
  websiteOrdersAPI,
  websiteContactAPI,
} from './websiteApi';

// Mock data for fallback
export const mockWebsiteData = {
  // Featured products for homepage
  featuredProducts: [
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      comparePrice: 39.99,
      image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      reviews: 128,
      badge: 'Trending',
      category: 'T-Shirts',
      brand: 'StyleCraft',
    },
    {
      id: '2',
      name: 'Denim Jacket Classic',
      price: 89.99,
      comparePrice: 120.00,
      image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 95,
      badge: 'Sale',
      category: 'Jackets',
      brand: 'UrbanStyle',
    },
    {
      id: '3',
      name: 'Summer Floral Dress',
      price: 65.99,
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.3,
      reviews: 67,
      badge: 'New',
      category: 'Dresses',
      brand: 'FloralFashion',
    },
    {
      id: '4',
      name: 'Casual Sneakers',
      price: 79.99,
      comparePrice: 99.99,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviews: 203,
      badge: 'Best Seller',
      category: 'Shoes',
      brand: 'ComfortWalk',
    }
  ],

  // All products for products page
  products: [
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      comparePrice: 39.99,
      image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      reviews: 128,
      category: 'T-Shirts',
      brand: 'StyleCraft',
      color: 'Blue',
      sizes: ['S', 'M', 'L', 'XL'],
      badge: 'Trending',
      description: 'Premium quality cotton t-shirt with comfortable fit.',
      images: [
        'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      stock: 50,
      featured: true,
    },
    {
      id: '2',
      name: 'Denim Jacket Classic',
      price: 89.99,
      comparePrice: 120.00,
      image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 95,
      category: 'Jackets',
      brand: 'UrbanStyle',
      color: 'Dark Blue',
      sizes: ['M', 'L', 'XL'],
      badge: 'Sale',
      description: 'Classic denim jacket perfect for casual wear.',
      images: [
        'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      stock: 25,
      featured: true,
    },
    {
      id: '3',
      name: 'Summer Floral Dress',
      price: 65.99,
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.3,
      reviews: 67,
      category: 'Dresses',
      brand: 'FloralFashion',
      color: 'Floral Print',
      sizes: ['S', 'M', 'L'],
      badge: 'New',
      description: 'Beautiful floral dress perfect for summer occasions.',
      images: [
        'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      stock: 30,
      featured: false,
    },
    {
      id: '4',
      name: 'Casual Sneakers',
      price: 79.99,
      comparePrice: 99.99,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviews: 203,
      category: 'Shoes',
      brand: 'ComfortWalk',
      color: 'White',
      sizes: ['7', '8', '9', '10'],
      badge: 'Best Seller',
      description: 'Comfortable casual sneakers for everyday wear.',
      images: [
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      stock: 40,
      featured: true,
    },
    {
      id: '5',
      name: 'Leather Handbag',
      price: 149.99,
      image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      reviews: 89,
      category: 'Accessories',
      brand: 'LuxeBags',
      color: 'Black',
      sizes: ['One Size'],
      description: 'Elegant leather handbag for professional and casual use.',
      images: [
        'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      stock: 15,
      featured: false,
    },
    {
      id: '6',
      name: 'Formal Shirt',
      price: 45.99,
      comparePrice: 59.99,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.2,
      reviews: 156,
      category: 'Shirts',
      brand: 'FormalWear',
      color: 'White',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      description: 'Professional formal shirt for business occasions.',
      images: [
        'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      stock: 35,
      featured: false,
    }
  ],

  // Categories
  categories: [
    { id: '1', name: 'T-Shirts', slug: 't-shirts', count: 25 },
    { id: '2', name: 'Jackets', slug: 'jackets', count: 15 },
    { id: '3', name: 'Dresses', slug: 'dresses', count: 30 },
    { id: '4', name: 'Shoes', slug: 'shoes', count: 20 },
    { id: '5', name: 'Accessories', slug: 'accessories', count: 18 },
    { id: '6', name: 'Shirts', slug: 'shirts', count: 22 },
  ],

  // Cart items
  cartItems: [
    {
      id: '1',
      productId: '1',
      name: 'Premium Cotton T-Shirt',
      brand: 'StyleCraft',
      price: 29.99,
      comparePrice: 39.99,
      image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=200',
      color: 'Blue',
      size: 'L',
      quantity: 2,
      deliveryDate: '2024-01-20',
    },
    {
      id: '2',
      productId: '4',
      name: 'Casual Sneakers',
      brand: 'ComfortWalk',
      price: 79.99,
      comparePrice: 99.99,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200',
      color: 'White',
      size: '9',
      quantity: 1,
      deliveryDate: '2024-01-22',
    }
  ],

  // Wishlist items
  wishlistItems: [
    {
      id: '1',
      productId: '3',
      name: 'Summer Floral Dress',
      price: 65.99,
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=200',
      brand: 'FloralFashion',
      addedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      productId: '5',
      name: 'Leather Handbag',
      price: 149.99,
      image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=200',
      brand: 'LuxeBags',
      addedAt: '2024-01-14T16:20:00Z',
    }
  ],

  // Orders
  orders: [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      status: 'delivered',
      paymentStatus: 'paid',
      total: 139.97,
      items: [
        {
          productId: '1',
          name: 'Premium Cotton T-Shirt',
          quantity: 2,
          price: 29.99,
          size: 'L',
          color: 'Blue',
        },
        {
          productId: '4',
          name: 'Casual Sneakers',
          quantity: 1,
          price: 79.99,
          size: '9',
          color: 'White',
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '+1 (555) 123-4567',
      },
      orderDate: '2024-01-10T10:30:00Z',
      deliveryDate: '2024-01-15T14:20:00Z',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      status: 'processing',
      paymentStatus: 'paid',
      total: 65.99,
      items: [
        {
          productId: '3',
          name: 'Summer Floral Dress',
          quantity: 1,
          price: 65.99,
          size: 'M',
          color: 'Floral Print',
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '+1 (555) 123-4567',
      },
      orderDate: '2024-01-18T09:15:00Z',
      estimatedDelivery: '2024-01-25T00:00:00Z',
    }
  ]
};

// Website data service with API calls and fallback to mock data
export const websiteDataService = {
  // Products
  async getFeaturedProducts(limit: number = 8): Promise<any[]> {
    try {
      const response = await websiteProductsAPI.getFeaturedProducts(limit) as unknown as { products?: any[] } | any[];
      if (Array.isArray(response)) return response;
      return (response as any).products || response;
    } catch (error) {
      console.warn('Failed to fetch featured products from API, using mock data:', error);
      toast.warn('Using sample data - backend not connected');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockWebsiteData.featuredProducts.slice(0, limit);
    }
  },

  async getProducts(params?: any): Promise<any> {
    try {
      const response = await websiteProductsAPI.getProducts(params);
      return response;
    } catch (error) {
      console.warn('Failed to fetch products from API, using mock data:', error);
      toast.warn('Using sample data - backend not connected');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredProducts = [...mockWebsiteData.products];
      
      // Apply filters
      if (params?.category && params.category !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.category === params.category);
      }
      
      if (params?.search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(params.search.toLowerCase()) ||
          p.category.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      if (params?.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice);
      }
      
      if (params?.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice);
      }
      
      // Apply sorting
      if (params?.sortBy) {
        filteredProducts.sort((a, b) => {
          switch (params.sortBy) {
            case 'price':
              return params.sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
            case 'name':
              return params.sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
            case 'rating':
              return params.sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
            default:
              return 0;
          }
        });
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      return {
        products: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredProducts.length / limit),
          totalProducts: filteredProducts.length,
          hasNextPage: endIndex < filteredProducts.length,
          hasPrevPage: page > 1,
        }
      };
    }
  },

  async getProduct(id: string): Promise<any> {
    try {
      const response = await websiteProductsAPI.getProduct(id);
      return response;
    } catch (error) {
      console.warn('Failed to fetch product from API, using mock data:', error);
      toast.warn('Using sample data - backend not connected');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const product = mockWebsiteData.products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      
      const relatedProducts = mockWebsiteData.products
        .filter(p => p.id !== id && p.category === product.category)
        .slice(0, 4);
      
      return {
        product,
        relatedProducts
      };
    }
  },

  async searchProducts(query: string, params?: any): Promise<any> {
    try {
      const response = await websiteProductsAPI.searchProducts(query, params);
      return response;
    } catch (error) {
      console.warn('Failed to search products from API, using mock data:', error);
      toast.warn('Using sample data - backend not connected');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const filteredProducts = mockWebsiteData.products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        products: filteredProducts,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: filteredProducts.length,
          hasNextPage: false,
          hasPrevPage: false,
        }
      };
    }
  },

  // Cart
  async getCart(): Promise<any> {
    try {
      const response = await websiteCartAPI.getCart();
      return response;
    } catch (error) {
      console.warn('Failed to fetch cart from API, using mock data:', error);
      toast.warn('Using sample data - backend not connected');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { items: mockWebsiteData.cartItems };
    }
  },

  async addToCart(item: any): Promise<any> {
    try {
      const response = await websiteCartAPI.addToCart(item);
      toast.success('Item added to cart');
      return response;
    } catch (error) {
      console.warn('Failed to add to cart via API, using mock behavior:', error);
      toast.success('Item added to cart (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }
  },

  async updateCartItem(itemId: string, data: { quantity: number }): Promise<any> {
    try {
      const response = await websiteCartAPI.updateCartItem(itemId, data);
      toast.success('Cart updated');
      return response;
    } catch (error) {
      console.warn('Failed to update cart via API, using mock behavior:', error);
      toast.success('Cart updated (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
  },

  async removeFromCart(itemId: string): Promise<any> {
    try {
      const response = await websiteCartAPI.removeFromCart(itemId);
      toast.success('Item removed from cart');
      return response;
    } catch (error) {
      console.warn('Failed to remove from cart via API, using mock behavior:', error);
      toast.success('Item removed from cart (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
  },

  // Wishlist
  async getWishlist(): Promise<any> {
    try {
      const response = await websiteWishlistAPI.getWishlist();
      return response;
    } catch (error) {
      console.warn('Failed to fetch wishlist from API, using mock data:', error);
      toast.warn('Using sample data - backend not connected');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { items: mockWebsiteData.wishlistItems };
    }
  },

  async addToWishlist(productId: string): Promise<any> {
    try {
      const response = await websiteWishlistAPI.addToWishlist(productId);
      toast.success('Item added to wishlist');
      return response;
    } catch (error) {
      console.warn('Failed to add to wishlist via API, using mock behavior:', error);
      toast.success('Item added to wishlist (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }
  },

  async removeFromWishlist(itemId: string): Promise<any> {
    try {
      const response = await websiteWishlistAPI.removeFromWishlist(itemId);
      toast.success('Item removed from wishlist');
      return response;
    } catch (error) {
      console.warn('Failed to remove from wishlist via API, using mock behavior:', error);
      toast.success('Item removed from wishlist (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
  },

  // Orders
  async getOrders(params?: any): Promise<any> {
    try {
      const response = await websiteOrdersAPI.getOrders(params);
      return response;
    } catch (error) {
      console.warn('Failed to fetch orders from API, using mock data:', error);
      toast.warn('Using sample data - backend not connected');
      await new Promise(resolve => setTimeout(resolve, 400));
      return { orders: mockWebsiteData.orders };
    }
  },

  async getOrder(orderId: string): Promise<any> {
    try {
      const response = await websiteOrdersAPI.getOrder(orderId);
      return response;
    } catch (error) {
      console.warn('Failed to fetch order from API, using mock data:', error);
      toast.warn('Using sample data - backend not connected');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const order = mockWebsiteData.orders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');
      return { order };
    }
  },

  async createOrder(orderData: any): Promise<any> {
    try {
      const response = await websiteOrdersAPI.createOrder(orderData);
      toast.success('Order placed successfully!');
      return response;
    } catch (error) {
      console.warn('Failed to create order via API, using mock behavior:', error);
      toast.success('Order placed successfully! (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        order: { 
          id: Date.now().toString(), 
          orderNumber: `ORD-${Date.now()}`,
          ...orderData 
        } 
      };
    }
  },

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<any> {
    try {
      const response = await websiteAuthAPI.login(credentials) as unknown as { token?: string; refreshToken?: string } & Record<string, any>;
      
      // Store token
      if (response?.token) {
        localStorage.setItem('customer_token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('customer_refresh_token', response.refreshToken);
        }
      }
      
      toast.success('Login successful!');
      return response;
    } catch (error) {
      console.warn('Failed to login via API, using mock behavior:', error);
      toast.success('Login successful! (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock token storage
      const mockToken = 'mock_customer_token_' + Date.now();
      localStorage.setItem('customer_token', mockToken);
      
      return { 
        success: true, 
        token: mockToken,
        customer: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: credentials.email,
        }
      };
    }
  },

  async register(userData: any): Promise<any> {
    try {
      const response = await websiteAuthAPI.register(userData) as unknown as { token?: string; refreshToken?: string } & Record<string, any>;
      
      // Store token
      if (response?.token) {
        localStorage.setItem('customer_token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('customer_refresh_token', response.refreshToken);
        }
      }
      
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      console.warn('Failed to register via API, using mock behavior:', error);
      toast.success('Registration successful! (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock token storage
      const mockToken = 'mock_customer_token_' + Date.now();
      localStorage.setItem('customer_token', mockToken);
      
      return { 
        success: true, 
        token: mockToken,
        customer: {
          id: Date.now().toString(),
          ...userData,
        }
      };
    }
  },

  async logout(): Promise<any> {
    try {
      await websiteAuthAPI.logout();
    } catch (error) {
      console.warn('Failed to logout via API, proceeding with local logout:', error);
    }
    
    // Clear tokens
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_refresh_token');
    sessionStorage.removeItem('customer_token');
    
    toast.success('Logged out successfully');
    return { success: true };
  },

  // Contact
  async submitContactForm(formData: any): Promise<any> {
    try {
      const response = await websiteContactAPI.submitContactForm(formData);
      toast.success('Message sent successfully!');
      return response;
    } catch (error) {
      console.warn('Failed to submit contact form via API, using mock behavior:', error);
      toast.success('Message sent successfully! (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    }
  },

  async subscribeNewsletter(data: any): Promise<any> {
    try {
      const response = await websiteContactAPI.subscribeNewsletter(data);
      toast.success('Successfully subscribed to newsletter!');
      return response;
    } catch (error) {
      console.warn('Failed to subscribe to newsletter via API, using mock behavior:', error);
      toast.success('Successfully subscribed to newsletter! (demo mode)');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }
  },
};

export default websiteDataService;