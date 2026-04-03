/*
  PRODUCTS ENDPOINT - Fetch Approved Products
  
  Endpoint: GET /api/products
  Purpose: Fetch approved products with limit
  Query Parameters:
    - status: "approved" (filter by status)
    - limit: 6 (limit number of results)
  
  Example Request:
  GET http://localhost:3000/api/products?status=approved&limit=6
  
  Response (200 OK):
  [
    {
      "_id": "507f1f77bcf86cd799439011",
      "itemName": "Onion",
      "marketName": "Dhaka Central Market",
      "image": "https://...",
      "description": "Fresh organic onions",
      "date": "2026-04-03T10:00:00Z",
      "vendorEmail": "vendor@example.com",
      "vendorName": "Local Farmer",
      "status": "approved",
      "newPrices": [
        {
          "itemName": "Onion",
          "price": 30,
          "date": "2026-04-03T10:00:00Z"
        },
        {
          "itemName": "Onion",
          "price": 28,
          "date": "2026-04-02T10:00:00Z"
        }
      ],
      "createdAt": "2026-04-03T10:00:00Z",
      "updatedAt": "2026-04-03T10:00:00Z"
    }
    // ... more products (max 6)
  ]
  
  Error Response (500):
  {
    "message": "Error fetching products"
  }
*/

// IMPLEMENTATION FOR EXPRESS SERVER (app.js or routes file):

/*
app.get('/api/products', async (req, res) => {
    try {
        const { status = 'approved', limit = 6 } = req.query;
        
        // Convert limit to number
        const limitNum = parseInt(limit) || 6;
        
        // Build query based on status filter
        let query = {};
        if (status) {
            query.status = status;
        }
        
        // Fetch products from database with limit and sort by date (newest first)
        const products = await db.collection('products')
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .toArray();
        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});
*/

// CURL EXAMPLE:
/*
curl -X GET "http://localhost:3000/api/products?status=approved&limit=6" \
  -H "Content-Type: application/json"
*/
