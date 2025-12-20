# Orders Feature - Backend API Specifications

This document outlines the backend APIs that need to be implemented for the Orders redesign feature.

## 🔐 Authentication
All endpoints require authentication via Bearer token in the header:
```
Authorization: Bearer {token}
```

---

## 📦 API Endpoints Required

### 1. Submit Product Review

**Endpoint:** `POST /api/website/orders/:orderId/review`

**Description:** Submit a review/rating for a product in an order

**Request Body:**
```json
{
  "productId": "product_id_here",
  "rating": 5,
  "comment": "Great product! Loved it..."
}
```

**Validation:**
- `productId`: Required, must be a valid product ID from the order
- `rating`: Required, integer between 1-5
- `comment`: Required, string, min 10 chars, max 500 chars

**Response (Success - 201):**
```json
{
  "message": "Review submitted successfully",
  "review": {
    "_id": "review_id",
    "product": "product_id",
    "customer": "customer_id",
    "order": "order_id",
    "rating": 5,
    "comment": "Great product! Loved it...",
    "createdAt": "2025-12-09T10:30:00Z",
    "updatedAt": "2025-12-09T10:30:00Z"
  }
}
```

**Error Responses:**
- `400`: Order not delivered yet or already reviewed
- `401`: Unauthorized
- `404`: Order or product not found

**Business Logic:**
- Only allow reviews for delivered orders
- One review per product per customer
- Update order's `reviewSubmitted` flag to `true`

---

### 2. Submit Exchange Request

**Endpoint:** `POST /api/website/orders/:orderId/exchange`

**Description:** Submit a request to exchange a product

**Request Body:**
```json
{
  "productId": "product_id_here",
  "newSize": "L",
  "newColor": "Black",
  "reason": "Size too small",
  "notes": "Optional additional notes"
}
```

**Validation:**
- `productId`: Required
- `newSize`: Required, must be a valid size
- `newColor`: Required, must be a valid color
- `reason`: Optional, string
- `notes`: Optional, string

**Response (Success - 201):**
```json
{
  "message": "Exchange request submitted successfully",
  "exchangeRequest": {
    "_id": "exchange_id",
    "order": "order_id",
    "product": "product_id",
    "customer": "customer_id",
    "status": "pending",
    "newSize": "L",
    "newColor": "Black",
    "reason": "Size too small",
    "notes": "",
    "createdAt": "2025-12-09T10:30:00Z",
    "updatedAt": "2025-12-09T10:30:00Z"
  }
}
```

**Business Logic:**
- Only allow exchanges for delivered orders
- Check if within exchange period (7 days after delivery)
- Create ExchangeRequest record
- Optionally send email/notification to admin

---

### 3. Submit Return Request

**Endpoint:** `POST /api/website/orders/:orderId/return`

**Description:** Submit a request to return a product

**Request Body:**
```json
{
  "productId": "product_id_here",
  "reason": "Product damaged",
  "photos": ["url1", "url2"],
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "accountHolderName": "John Doe"
  },
  "notes": "Optional notes"
}
```

**Validation:**
- `productId`: Required
- `reason`: Optional
- `photos`: Optional, array of image URLs
- `bankDetails`: Optional, for refund processing
- `notes`: Optional

**Response (Success - 201):**
```json
{
  "message": "Return request submitted successfully",
  "returnRequest": {
    "_id": "return_id",
    "order": "order_id",
    "product": "product_id",
    "customer": "customer_id",
    "status": "pending",
    "reason": "Product damaged",
    "createdAt": "2025-12-09T10:30:00Z"
  }
}
```

**Business Logic:**
- Only allow returns for delivered orders
- Check if within return period (7 days after delivery)
- Create ReturnRequest record
- Send email/notification to admin

---

### 4. Get Order Tracking Details (Enhanced)

**Endpoint:** `GET /api/website/orders/:orderId/tracking`

**Description:** Get detailed tracking information for an order

**Response (Success - 200):**
```json
{
  "order": {
    "_id": "order_id",
    "orderNumber": "FTS234578",
    "orderStatus": "shipped",
    "deliveredAt": null,
    "estimatedDelivery": "2025-12-15",
    "trackingNumber": "TRACK123456",
    "items": [...],
    "total": 499,
    "createdAt": "2025-12-01T10:00:00Z"
  },
  "tracking": {
    "currentStage": 3,
    "stages": [
      {
        "name": "Item Ordered",
        "status": "completed",
        "timestamp": "2025-12-01T10:00:00Z",
        "message": "Item Ordered on Dec 1, 2025 and sent to the dispatch"
      },
      {
        "name": "Order Packed",
        "status": "completed",
        "timestamp": "2025-12-02T14:00:00Z",
        "message": "Order is packed and sent to the delivery partner"
      },
      {
        "name": "Delivery Partner",
        "status": "active",
        "timestamp": "2025-12-03T09:00:00Z",
        "message": "Delivery partner receives the product and will out for delivery"
      },
      {
        "name": "Out for Delivery",
        "status": "pending",
        "message": "Product is out for delivery and will reach out in estimated"
      },
      {
        "name": "Estimated delivery",
        "status": "pending",
        "timestamp": "2025-12-15",
        "message": "Order will be in your in any time to your doorstep"
      }
    ],
    "carrier": "Blue Dart",
    "trackingNumber": "TRACK123456"
  }
}
```

---

### 5. Cancel Exchange Request

**Endpoint:** `PUT /api/website/exchanges/:exchangeId/cancel`

**Description:** Cancel an exchange request

**Response (Success - 200):**
```json
{
  "message": "Exchange request cancelled successfully",
  "exchangeRequest": {
    "_id": "exchange_id",
    "status": "cancelled",
    ...
  }
}
```

---

### 6. Cancel Return Request

**Endpoint:** `PUT /api/website/returns/:returnId/cancel`

**Description:** Cancel a return request

**Response (Success - 200):**
```json
{
  "message": "Return request cancelled successfully",
  "returnRequest": {
    "_id": "return_id",
    "status": "cancelled",
    ...
  }
}
```

---

## 🗄️ Database Models Required

### Review Model
```javascript
{
  _id: ObjectId,
  product: ObjectId (ref: 'Product'),
  customer: ObjectId (ref: 'Customer'),
  order: ObjectId (ref: 'Order'),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ExchangeRequest Model
```javascript
{
  _id: ObjectId,
  order: ObjectId (ref: 'Order'),
  product: ObjectId (ref: 'Product'),
  customer: ObjectId (ref: 'Customer'),
  status: String (pending/approved/rejected/completed/cancelled),
  newSize: String,
  newColor: String,
  reason: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ReturnRequest Model
```javascript
{
  _id: ObjectId,
  order: ObjectId (ref: 'Order'),
  product: ObjectId (ref: 'Product'),
  customer: ObjectId (ref: 'Customer'),
  status: String (pending/approved/rejected/completed/cancelled),
  reason: String,
  photos: [String],
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String
  },
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model Updates
Add these fields to existing Order model:
```javascript
{
  ...existing fields,
  deliveredAt: Date,
  exchangeEligibleUntil: Date,
  returnEligibleUntil: Date,
  reviewSubmitted: Boolean (default: false)
}
```

---

## 🔄 **How Frontend Will Work Once APIs Are Ready:**

1. **User Flow Works Automatically**
   - User visits `/website/orders` → Frontend calls `GET /api/website/orders`
   - User clicks "Track Order" → Frontend calls `GET /api/website/orders/:id`
   - User submits review → Frontend calls `POST /api/website/orders/:id/review`
   - User requests exchange → Frontend calls `POST /api/website/orders/:id/exchange`

2. **No Frontend Code Changes Needed**
   - All API service files are already created
   - All modals already have the service calls
   - Just need to remove `// TODO` comments

3. **Testing After Backend Ready**
   - Login to website
   - Place an order (or use existing order)
   - Visit `/website/orders`
   - Test all actions (review, exchange, cancel)

---

## 📝 **Next Steps:**

### For Backend Team:
1. Implement the 6 API endpoints listed above
2. Create the 3 database models (Review, ExchangeRequest, ReturnRequest)
3. Update Order model with new fields
4. Test APIs using Postman/Thunder Client
5. Inform frontend team when ready

### For Testing (After Backend Ready):
1. Start backend server
2. Login to website
3. Visit `http://localhost:3000/website/orders`
4. Test complete user flow

---

**Questions?** Let me know if you need clarification on any API specification!
