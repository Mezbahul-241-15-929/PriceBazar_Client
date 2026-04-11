# Complete Express.js API Documentation - PriceBazar

## Base URL
```
http://localhost:3000
```

---

## Review API Endpoints

### 1. GET All Reviews for a Product
**Endpoint:** `GET /api/reviews/:productId`

**Description:** Fetch all reviews for a specific product

**Parameters:**
- `productId` (string, URL param) - The ID of the product

**Response:**
```json
[
  {
    "_id": "ObjectId",
    "productId": "string",
    "userId": "string",
    "author": "string",
    "email": "string",
    "text": "string",
    "rating": 5,
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:** 
- `200` - Success
- `500` - Server error

---

### 2. POST Create New Review
**Endpoint:** `POST /api/reviews`

**Description:** Create a new review (one per user per product)

**Request Body:**
```json
{
  "productId": "string",
  "userId": "string",
  "author": "string",
  "email": "string",
  "text": "string",
  "rating": 5
}
```

**Response (Success):**
```json
{
  "message": "Review added successfully",
  "_id": "ObjectId",
  "review": { ...review object }
}
```

**Response (Error - Existing Review):**
```json
{
  "error": "You have already reviewed this product"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Missing required fields
- `409` - User already has a review for this product
- `500` - Server error

---

### 3. PUT Update Review
**Endpoint:** `PUT /api/reviews/:id`

**Description:** Update an existing review (author only)

**Parameters:**
- `id` (string, URL param) - The review ID

**Request Body:**
```json
{
  "email": "string",
  "text": "string",
  "rating": 5
}
```

**Response:**
```json
{
  "message": "Review updated successfully",
  "_id": "ObjectId"
}
```

**Status Codes:**
- `200` - Updated successfully
- `404` - Review not found
- `403` - Not authorized (email mismatch)
- `500` - Server error

---

### 4. DELETE Review
**Endpoint:** `DELETE /api/reviews/:id`

**Description:** Delete a review (author only)

**Parameters:**
- `id` (string, URL param) - The review ID

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "message": "Review deleted successfully",
  "_id": "ObjectId"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `404` - Review not found
- `403` - Not authorized (email mismatch)
- `500` - Server error

---

## Watchlist API Endpoints

### 1. GET User's Watchlist (Enriched with Product Details)
**Endpoint:** `GET /api/watchlist/:userId`

**Description:** Fetch user's watchlist with full product details

**Parameters:**
- `userId` (string, URL param) - The user's Firebase UID

**Response:**
```json
{
  "userId": "string",
  "products": ["productId1", "productId2", ...],
  "watchlistItems": [
    {
      "_id": "ObjectId",
      "name": "string",
      "itemName": "string",
      "marketName": "string",
      "price": 999.99,
      "image": "string (URL)",
      "description": "string",
      "vendor": "string",
      "addedDate": "2025-01-01T00:00:00.000Z",
      ...other product fields
    }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "itemCount": 3
}
```

**Status Codes:**
- `200` - Success (returns empty watchlistItems if no products)
- `500` - Server error

---

### 2. POST Add Product to Watchlist
**Endpoint:** `POST /api/watchlist`

**Description:** Add a product to user's watchlist

**Request Body:**
```json
{
  "userId": "string",
  "productId": "string"
}
```

**Response (New Watchlist):**
```json
{
  "message": "Added to watchlist",
  "_id": "ObjectId (watchlist ID)",
  "watchlistId": "ObjectId"
}
```

**Response (Existing Watchlist):**
```json
{
  "message": "Added to watchlist",
  "productId": "string",
  "totalItems": 4
}
```

**Response (Error - Already in Watchlist):**
```json
{
  "error": "Product already in watchlist"
}
```

**Status Codes:**
- `201` - Created new watchlist
- `200` - Added to existing watchlist
- `400` - Missing userId or productId
- `409` - Product already in watchlist
- `500` - Server error

---

### 3. DELETE Remove Product from Watchlist
**Endpoint:** `DELETE /api/watchlist/:userId/:productId`

**Description:** Remove a product from user's watchlist

**Parameters:**
- `userId` (string, URL param) - The user's Firebase UID
- `productId` (string, URL param) - The product ID to remove

**Response:**
```json
{
  "message": "Removed from watchlist",
  "productId": "string",
  "modifiedCount": 1
}
```

**Status Codes:**
- `200` - Deleted successfully
- `400` - Missing userId or productId
- `404` - Watchlist not found
- `500` - Server error

---

## System Health

### GET Health Check
**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "Server is running"
}
```

---

## Database Collections

### reviews Collection
```javascript
{
  _id: ObjectId,
  productId: String,
  userId: String,
  author: String,
  email: String,
  text: String,
  rating: Number (1-5),
  timestamp: Date
}
```

### watchlist Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  products: [String], // Array of product IDs
  createdAt: Date,
  updatedAt: Date (optional)
}
```

### products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  itemName: String,
  marketName: String,
  price: Number,
  image: String,
  description: String,
  vendor: String,
  ...other fields
}
```

---

## Error Handling

### Common Error Responses

**400 - Bad Request:**
```json
{
  "error": "Missing required fields"
}
```

**403 - Forbidden:**
```json
{
  "error": "Not authorized"
}
```

**404 - Not Found:**
```json
{
  "error": "Resource not found"
}
```

**409 - Conflict:**
```json
{
  "error": "Resource already exists"
}
```

**500 - Server Error:**
```json
{
  "error": "Error message"
}
```

---

## Frontend Integration Example

### React Hook for Watchlist

```javascript
// Fetch watchlist
const response = await axios.get(
  `http://localhost:3000/api/watchlist/${user.uid}`
);
const { watchlistItems } = response.data;

// Add to watchlist
await axios.post('http://localhost:3000/api/watchlist', {
  userId: user.uid,
  productId: product._id
});

// Remove from watchlist
await axios.delete(
  `http://localhost:3000/api/watchlist/${user.uid}/${productId}`
);
```

---

## Testing with cURL

### Get Watchlist
```bash
curl http://localhost:3000/api/watchlist/prjoELc7Gif3bLczLhqKLl7M1dU2
```

### Add to Watchlist
```bash
curl -X POST http://localhost:3000/api/watchlist \
  -H "Content-Type: application/json" \
  -d '{"userId":"prjoELc7Gif3bLczLhqKLl7M1dU2","productId":"69d97a62fa140b2c127c17ec"}'
```

### Remove from Watchlist
```bash
curl -X DELETE \
  http://localhost:3000/api/watchlist/prjoELc7Gif3bLczLhqKLl7M1dU2/69d97a62fa140b2c127c17ec
```

---

## Implementation Notes

### Key Features:
1. ✅ Enriched watchlist GET endpoint returns full product details
2. ✅ One review per user per product constraint
3. ✅ Author-only edit/delete for reviews
4. ✅ Product ID validation for watchlist
5. ✅ Automatic handling of new vs existing watchlists
6. ✅ Prevents duplicate products in watchlist
7. ✅ Returns total item count for watchlist

### API Response Flow:
- **GET /api/watchlist/:userId**
  - Returns both product IDs AND full product details
  - Frontend can directly use watchlistItems without additional API calls
  - Simplifies frontend data matching logic

### Database Indexes (Recommended):
```javascript
// Reviews
db.collection('reviews').createIndex({ productId: 1, userId: 1 }, { unique: true })
db.collection('reviews').createIndex({ timestamp: -1 })

// Watchlist
db.collection('watchlist').createIndex({ userId: 1 }, { unique: true })
```

