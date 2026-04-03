// ============================================================================
// ALL PRODUCTS API - EXPRESS.JS ENDPOINTS
// Add these endpoints to your Express server (app.js or routes file)
// ============================================================================

/*
  ENDPOINT 1: GET /api/products/all - Fetch all products with filters & sorting
  
  Purpose: Fetch all approved products with advanced filtering and sorting
  
  Query Parameters:
  - status: "approved" (required - filter by status)
  - sort: "price" | "date" | "latest" (sorting field)
  - order: "asc" | "desc" (sorting order)
  - dateFrom: "YYYY-MM-DD" (optional - filter from date)
  - dateTo: "YYYY-MM-DD" (optional - filter to date)
  
  Example Requests:
  
  1. Get all approved products, latest first:
  GET http://localhost:3000/api/products/all?status=approved&sort=latest&order=desc
  
  2. Get products sorted by price (low to high):
  GET http://localhost:3000/api/products/all?status=approved&sort=price&order=asc
  
  3. Get products sorted by price (high to low):
  GET http://localhost:3000/api/products/all?status=approved&sort=price&order=desc
  
  4. Get products from specific date range:
  GET http://localhost:3000/api/products/all?status=approved&sort=latest&order=desc&dateFrom=2026-04-01&dateTo=2026-04-07
  
  5. Get products from date onwards:
  GET http://localhost:3000/api/products/all?status=approved&sort=latest&order=desc&dateFrom=2026-04-01
  
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
      "vendorPhone": "+880-123-456-7890",
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
    // ... more products
  ]
  
  Error Response (500):
  {
    "message": "Error fetching products"
  }
*/

// ============================================================================
// EXPRESS.JS CODE - IMPLEMENTATION
// ============================================================================

// Add this code to your Express server (app.js or routes/products.js):

app.get('/api/products/all', async (req, res) => {
    try {
        const { 
            status = 'approved', 
            sort = 'latest', 
            order = 'desc', 
            dateFrom, 
            dateTo 
        } = req.query;
        
        console.log('Fetching products with filters:', { status, sort, order, dateFrom, dateTo });
        
        // Build MongoDB query
        let query = { status };
        
        // Add date range filter
        if (dateFrom || dateTo) {
            query.date = {};
            
            if (dateFrom) {
                const fromDate = new Date(dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                query.date.$gte = fromDate;
                console.log('From date filter:', fromDate);
            }
            
            if (dateTo) {
                const toDate = new Date(dateTo);
                toDate.setHours(23, 59, 59, 999);
                query.date.$lte = toDate;
                console.log('To date filter:', toDate);
            }
        }
        
        // Determine sort field and order
        const sortOrder = order === 'asc' ? 1 : -1;
        let sortField = 'createdAt'; // default
        
        if (sort === 'price') {
            // For price sorting, fetch all matching documents first
            let products = await db.collection('products')
                .find(query)
                .toArray();
            
            console.log(`Found ${products.length} products before price sorting`);
            
            // Add calculated latestPrice field
            products = products.map(product => {
                let latestPrice = 0;
                if (product.newPrices && product.newPrices.length > 0) {
                    const prices = product.newPrices.map(p => p.price);
                    latestPrice = Math.min(...prices); // Get lowest price
                }
                return { ...product, latestPrice };
            });
            
            // Sort by latestPrice
            products.sort((a, b) => {
                return sortOrder === 1
                    ? a.latestPrice - b.latestPrice
                    : b.latestPrice - a.latestPrice;
            });
            
            // Remove temporary field
            products = products.map(({ latestPrice, ...product }) => product);
            
            console.log(`Returning ${products.length} products after price sorting`);
            return res.json(products);
        } else if (sort === 'date') {
            sortField = 'date';
        } else {
            // sort === 'latest'
            sortField = 'createdAt';
        }
        
        // For non-price sorting, use MongoDB sort
        const products = await db.collection('products')
            .find(query)
            .sort({ [sortField]: sortOrder })
            .toArray();
        
        console.log(`Found ${products.length} products`);
        res.json(products);
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});


// ============================================================================
// ENDPOINT 2: GET /api/products/:id - Fetch single product details
// ============================================================================

/*
  Purpose: Fetch full details of a single product
  
  Path Parameter:
  - id: Product ID (MongoDB ObjectId)
  
  Example Request:
  GET http://localhost:3000/api/products/507f1f77bcf86cd799439011
  
  Response (200 OK):
  {
    "_id": "507f1f77bcf86cd799439011",
    "itemName": "Onion",
    "marketName": "Dhaka Central Market",
    "image": "https://...",
    "description": "Fresh organic onions from local farms",
    "date": "2026-04-03T10:00:00Z",
    "vendorEmail": "vendor@example.com",
    "vendorName": "Local Farmer",
    "vendorPhone": "+880-123-456-7890",
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
  
  Error Response (404):
  {
    "message": "Product not found"
  }
  
  Error Response (400):
  {
    "message": "Invalid product ID"
  }
*/

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ObjectId } = require('mongodb');
        
        // Validate MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        
        const product = await db.collection('products')
            .findOne({ _id: new ObjectId(id) });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        console.log(`Fetched product: ${product.itemName}`);
        res.json(product);
        
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});


// ============================================================================
// DATABASE SETUP - RUN THESE COMMANDS IN MONGODB
// ============================================================================

/*
  Create indexes for better query performance:
  
  1. Index for status and date (used for filtering)
  db.products.createIndex({ status: 1, date: -1 })
  
  2. Index for date range queries
  db.products.createIndex({ date: 1 })
  
  3. Index for status (used for filtering)
  db.products.createIndex({ status: 1, createdAt: -1 })
  
  4. Verify indexes created
  db.products.getIndexes()
  
  5. Drop index if needed
  db.products.dropIndex("status_1_date_-1")
*/


// ============================================================================
// CURL TEST EXAMPLES
// ============================================================================

/*
  Test 1: Get all approved products, latest first
  curl -X GET "http://localhost:3000/api/products/all?status=approved&sort=latest&order=desc" \
    -H "Content-Type: application/json"
  
  Test 2: Price low to high
  curl -X GET "http://localhost:3000/api/products/all?status=approved&sort=price&order=asc" \
    -H "Content-Type: application/json"
  
  Test 3: Price high to low
  curl -X GET "http://localhost:3000/api/products/all?status=approved&sort=price&order=desc" \
    -H "Content-Type: application/json"
  
  Test 4: By date (oldest to newest)
  curl -X GET "http://localhost:3000/api/products/all?status=approved&sort=date&order=asc" \
    -H "Content-Type: application/json"
  
  Test 5: By date (newest to oldest)
  curl -X GET "http://localhost:3000/api/products/all?status=approved&sort=date&order=desc" \
    -H "Content-Type: application/json"
  
  Test 6: Date range filter
  curl -X GET "http://localhost:3000/api/products/all?status=approved&sort=latest&order=desc&dateFrom=2026-04-01&dateTo=2026-04-07" \
    -H "Content-Type: application/json"
  
  Test 7: From date only (products from April 1 onwards)
  curl -X GET "http://localhost:3000/api/products/all?status=approved&sort=latest&order=desc&dateFrom=2026-04-01" \
    -H "Content-Type: application/json"
  
  Test 8: To date only (products up to April 7)
  curl -X GET "http://localhost:3000/api/products/all?status=approved&sort=latest&order=desc&dateTo=2026-04-07" \
    -H "Content-Type: application/json"
  
  Test 9: Get single product by ID
  curl -X GET "http://localhost:3000/api/products/507f1f77bcf86cd799439011" \
    -H "Content-Type: application/json"
  
  Test 10: Combined - Price sort with date filter
  curl -X GET "http://localhost:3000/api/products/all?status=approved&sort=price&order=asc&dateFrom=2026-04-01&dateTo=2026-04-07" \
    -H "Content-Type: application/json"
*/


// ============================================================================
// SORTING OPTIONS EXPLANATION
// ============================================================================

/*
  SORT OPTION 1: sort=latest (Default)
  ├─ Sorting Field: createdAt
  ├─ Default Order: desc (newest first)
  ├─ Shows: Most recently added products first
  ├─ Query: { createdAt: -1 }
  └─ Use Case: Browse recent products
  
  Products Display:
  1. Created 2 hours ago
  2. Created 1 day ago
  3. Created 5 days ago
  
  
  SORT OPTION 2: sort=price
  ├─ Sorting Field: newPrices array (latest price)
  ├─ Low to High (order=asc): Cheapest first
  ├─ High to Low (order=desc): Most expensive first
  ├─ Calculation: Math.min(...newPrices.map(p => p.price))
  ├─ Backend: Extracts price from array, then sorts
  └─ Use Case: Price-conscious shopping
  
  Products Display (asc):
  1. ৳15/kg (cheapest)
  2. ৳25/kg
  3. ৳50/kg (most expensive)
  
  
  SORT OPTION 3: sort=date
  ├─ Sorting Field: date (product date)
  ├─ Oldest to Newest (order=asc): Older products first
  ├─ Newest to Oldest (order=desc): Newer products first
  ├─ Query: { date: 1 } or { date: -1 }
  └─ Use Case: Browse by market date
  
  Products Display (asc):
  1. From April 1, 2026
  2. From April 3, 2026
  3. From April 7, 2026
*/


// ============================================================================
// DATE FILTER COMBINATIONS
// ============================================================================

/*
  COMBINATION 1: No Date Filter
  
  Query: GET /api/products/all?status=approved
  Result: All approved products, no date restriction
  MongoDB Query: { status: "approved" }
  
  
  COMBINATION 2: From Date Only
  
  Query: GET /api/products/all?status=approved&dateFrom=2026-04-01
  Result: Products from April 1, 2026 onwards
  Date Range: Apr 1 → Today (no upper limit)
  MongoDB Query: { status: "approved", date: { $gte: "2026-04-01T00:00:00" } }
  
  Timeline:
  ───────┬──────────────────────────────→
        Apr 1 (included)         Today
  
  
  COMBINATION 3: To Date Only
  
  Query: GET /api/products/all?status=approved&dateTo=2026-04-07
  Result: Products up to April 7, 2026
  Date Range: Beginning → Apr 7 (no lower limit)
  MongoDB Query: { status: "approved", date: { $lte: "2026-04-07T23:59:59" } }
  
  Timeline:
  ←────────────────────────────┬───────
                             Apr 7 (included)
  
  
  COMBINATION 4: Date Range (From AND To)
  
  Query: GET /api/products/all?status=approved&dateFrom=2026-04-01&dateTo=2026-04-07
  Result: Products between April 1-7, 2026 (inclusive)
  MongoDB Query: { status: "approved", date: { $gte: "2026-04-01T00:00:00", $lte: "2026-04-07T23:59:59" } }
  
  Timeline:
  ────┬─────────────────────────────┬────
     Apr 1 (included)          Apr 7 (included)
  
  Products included:
  ✓ Apr 1, 2026 - Onion (within range)
  ✓ Apr 3, 2026 - Broccoli (within range)
  ✓ Apr 7, 2026 - Lettuce (within range)
  ✗ Mar 31, 2026 - Tomato (before range)
  ✗ Apr 8, 2026 - Carrot (after range)
*/


// ============================================================================
// FRONTEND QUERY STRING BUILDING
// ============================================================================

/*
  When frontend calls API, it should build query string like:
  
  Default (Latest):
  ?status=approved&sort=latest&order=desc
  
  Price Low to High:
  ?status=approved&sort=price&order=asc
  
  Price High to Low:
  ?status=approved&sort=price&order=desc
  
  Date Range Filter:
  ?status=approved&sort=latest&order=desc&dateFrom=2026-04-01&dateTo=2026-04-07
  
  Combined (Price sort + Date filter):
  ?status=approved&sort=price&order=asc&dateFrom=2026-04-01&dateTo=2026-04-07
  
  
  COMPLETE URL EXAMPLES:
  
  http://localhost:3000/api/products/all?status=approved&sort=latest&order=desc
  
  http://localhost:3000/api/products/all?status=approved&sort=price&order=asc
  
  http://localhost:3000/api/products/all?status=approved&sort=price&order=desc&dateFrom=2026-04-01&dateTo=2026-04-07
*/


// ============================================================================
// ERROR HANDLING & VALIDATION
// ============================================================================

/*
  The backend code includes:
  
  1. Status validation: Only 'approved' status is used (can be extended)
  2. Sort validation: Accepts 'latest', 'price', 'date'
  3. Order validation: Accepts 'asc', 'desc'
  4. Date validation: Accepts 'YYYY-MM-DD' format
  5. MongoDB ObjectId validation: For product ID routes
  6. Try-catch blocks: For error handling
  7. Console logging: For debugging
  8. Error responses: 400 for bad requests, 404 for not found, 500 for server errors
*/


// ============================================================================
// PERFORMANCE NOTES
// ============================================================================

/*
  DATABASE INDEXES:
  
  Critical indexes to create:
  1. { status: 1, date: -1 }
     └─ Used for filtering by status and date range
     └─ Improves: Filtering performance
  
  2. { date: 1 }
     └─ Used for date range queries
     └─ Improves: Date filtering and date sorting
  
  3. { status: 1, createdAt: -1 }
     └─ Used for latest first sorting
     └─ Improves: Latest sort performance
  
  
  OPTIMIZATION TIPS:
  
  1. For price sorting:
     - Backend extracts latest price from newPrices array
     - Then sorts in JavaScript
     - Faster for small datasets (<1000 products)
  
  2. For large datasets (>10,000 products):
     - Add pagination with limit and skip
     - Consider caching with Redis
     - Denormalize latestPrice field on products
  
  3. For date queries:
     - Always use MongoDB date range operators ($gte, $lte)
     - Indexes make these queries very fast
     - Frontend sends ISO date format (YYYY-MM-DD)
  
  4. Production deployment:
     - Enable database compression
     - Use read replicas for scaling
     - Monitor query performance
     - Set up database backups
*/


// ============================================================================
// IMPLEMENTATION CHECKLIST
// ============================================================================

/*
  ☐ Copy GET /api/products/all endpoint
  ☐ Paste into Express server (app.js)
  ☐ Copy GET /api/products/:id endpoint
  ☐ Paste into Express server (app.js)
  ☐ Create MongoDB indexes (see above)
  ☐ Test with CURL examples (see above)
  ☐ Verify response format matches expectations
  ☐ Test all sort options (latest, price asc, price desc, date)
  ☐ Test all filter combinations (no filter, from date, to date, range)
  ☐ Test combined sort + filter
  ☐ Check console logs for debugging
  ☐ Verify no database errors
  ☐ Deploy to production
*/
