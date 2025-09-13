# Backend Integration Setup

This project is configured to work with a backend API with automatic fallback to sample data.

## Quick Setup

### 1. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and update the API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 2. Enable Backend Connection
In `src/lib/dataService.ts`, uncomment the API calls and comment the sample data:

**Before (Sample Data Mode):**
```typescript
async getDashboardMetrics() {
  try {
    // Uncomment the line below to use localhost API:
    // const data = await apiClient.get('/dashboard/metrics');
    
    // For now, simulate API call delay and return sample data
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleData.metrics;
  } catch (error) {
    // ...
  }
}
```

**After (API Mode):**
```typescript
async getDashboardMetrics() {
  try {
    // Uncomment the line below to use localhost API:
    const data = await apiClient.get('/dashboard/metrics');
    return data;
    
    // For now, simulate API call delay and return sample data
    // await new Promise(resolve => setTimeout(resolve, 500));
    // return sampleData.metrics;
  } catch (error) {
    // ...
  }
}
```

### 3. Required Backend Endpoints

Your backend should provide these endpoints:

#### Dashboard
- `GET /dashboard/metrics` - Dashboard statistics
- `GET /dashboard/recent-orders?limit=5` - Recent orders
- `GET /dashboard/top-products?limit=4` - Top selling products
- `GET /dashboard/sales-chart?period=7d` - Sales chart data
- `GET /dashboard/recent-activity` - Recent activity feed

#### Products
- `GET /products` - List products (with pagination)
- `GET /products/{id}` - Get single product
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

#### Orders
- `GET /orders` - List orders (with pagination)
- `GET /orders/{id}` - Get single order
- `PATCH /orders/{id}/status` - Update order status

#### Categories
- `GET /categories` - List categories
- `POST /categories` - Create category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

## Sample Data Structure

The application includes comprehensive sample data that shows the expected API response format:

### Dashboard Metrics Response
```json
{
  "revenue": {
    "today": 12450,
    "week": 87300,
    "month": 342100,
    "growth": 12.5,
    "trend": "up"
  },
  "orders": {
    "total": 1247,
    "pending": 23,
    "processing": 45,
    "completed": 1156,
    "cancelled": 23,
    "growth": 8.3,
    "trend": "up"
  },
  "customers": {
    "total": 8934,
    "new": 156,
    "returning": 8778,
    "growth": 15.2,
    "trend": "up"
  },
  "products": {
    "total": 456,
    "active": 423,
    "inactive": 33,
    "lowStock": 12,
    "growth": -2.1,
    "trend": "down"
  }
}
```

### Products Response
```json
{
  "data": [
    {
      "id": "1",
      "name": "Premium Cotton T-Shirt",
      "sku": "TSH001",
      "category": "T-Shirts",
      "brand": "StyleCraft",
      "price": 29.99,
      "comparePrice": 39.99,
      "stock": 150,
      "status": "active",
      "featured": true,
      "tags": ["New Arrival", "Trending"],
      "image": "https://example.com/image.jpg",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 456,
  "page": 1,
  "limit": 10
}
```

## Features

### ✅ Automatic Fallback
- Uses sample data when backend is unavailable
- Shows toast notifications about connection status
- Graceful error handling

### ✅ Loading States
- Loading indicators during API calls
- Smooth transitions between states

### ✅ Error Handling
- Network error detection
- User-friendly error messages
- Console logging for debugging

### ✅ Authentication
- JWT token support
- Automatic token refresh
- Secure cookie storage

## Development vs Production

### Development Mode (Current)
- ✅ Sample data enabled by default
- ✅ API calls commented out
- ✅ Warning notifications when using sample data
- ✅ Simulated API delays for realistic UX

### Production Mode (After Backend Setup)
- ✅ Real API calls enabled
- ✅ Sample data as fallback only
- ✅ Error logging and monitoring
- ✅ Performance optimizations

## Testing the Integration

1. **Start your backend server** on `http://localhost:3001`
2. **Update environment variables** in `.env.local`
3. **Uncomment API calls** in `src/lib/dataService.ts`
4. **Run the application**: `npm run dev`
5. **Check browser console** for connection status
6. **Verify data loading** from your backend

## Troubleshooting

### Common Issues

**CORS Errors**
```javascript
// Add to your backend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Authentication Issues**
- Check JWT token format
- Verify token expiration
- Ensure proper cookie settings

**Data Format Mismatch**
- Compare API response with sample data structure
- Check field names and types
- Verify nested object structure

### Debug Mode
Set `NODE_ENV=development` in `.env.local` for detailed logging.

## Next Steps

1. ✅ **Current State**: Sample data working
2. 🔄 **Next**: Set up your backend API
3. 🔄 **Then**: Update environment variables
4. 🔄 **Finally**: Uncomment API calls

The application is ready to use with sample data and can be easily connected to your backend when ready!