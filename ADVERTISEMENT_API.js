/**
 * ============================================================================
 * ADVERTISEMENT API - EXPRESS.JS BACKEND IMPLEMENTATION
 * ============================================================================
 * 
 * This file contains all Advertisement-related API endpoints for PriceBazar
 * Backend. Copy these routes into your Express.js server file.
 * 
 * Database Collection: advertisementsCollection
 * ============================================================================
 */

/**
 * ============================================================================
 * 1. DATABASE SCHEMA (MongoDB)
 * ============================================================================
 * 
 * Collection Name: advertisementsCollection
 * 
 * Document Structure:
 * {
 *   _id: ObjectId,
 *   adTitle: String (required),
 *   shortDescription: String (required),
 *   image: String (URL to advertisement image),
 *   vendorEmail: String (vendor's email),
 *   vendorName: String (vendor's display name),
 *   status: String (enum: "pending", "approved", "rejected"),
 *   createdAt: Date (timestamp),
 *   updatedAt: Date (timestamp)
 * }
 * 
 * Example Document:
 * {
 *   "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
 *   "adTitle": "Summer Vegetable Sale",
 *   "shortDescription": "Get fresh vegetables at 30% off this summer!",
 *   "image": "https://example.com/images/summer-sale.jpg",
 *   "vendorEmail": "vendor@example.com",
 *   "vendorName": "Fresh Farms",
 *   "status": "approved",
 *   "createdAt": ISODate("2024-01-15T10:30:00Z"),
 *   "updatedAt": ISODate("2024-01-15T10:30:00Z")
 * }
 * 
 * ============================================================================
 */

/**
 * ============================================================================
 * 2. REQUIRED MIDDLEWARE & UTILITIES
 * ============================================================================
 * 
 * Make sure you have these imports in your server file:
 * 
 * const express = require('express');
 * const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 * const cors = require('cors');
 * const dotenv = require('dotenv');
 * 
 * const router = express.Router();
 * const app = express();
 * 
 * // Middleware
 * app.use(cors());
 * app.use(express.json());
 * dotenv.config();
 * 
 * // MongoDB Connection
 * const uri = process.env.MONGODB_URI;
 * const client = new MongoClient(uri, {
 *   serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
 * });
 * 
 * const advertisementsCollection = client.db('pricebazar').collection('advertisements');
 * 
 * ============================================================================
 */

/**
 * ============================================================================
 * 3. API ENDPOINTS
 * ============================================================================
 */

// ✅ ENDPOINT 1: GET ALL ADVERTISEMENTS (with filtering)
// ============================================================================
// Route: GET /api/advertisements
// Query Parameters:
//   - status (optional): "approved", "pending", "rejected", "all"
//   - email (optional): Filter by vendor email
//   - limit (optional): Number of results to return (default: 100)
//   - skip (optional): Number of results to skip for pagination (default: 0)
// 
// Response:
//   - Status: 200 (Success)
//   - Body: Array of advertisement objects
// 
// Example Usage:
//   GET /api/advertisements                          (all advertisements)
//   GET /api/advertisements?status=approved          (only approved ads)
//   GET /api/advertisements?status=approved&limit=5  (first 5 approved ads)
//   GET /api/advertisements?email=vendor@example.com (vendor's advertisements)
//
// Implementation:
/*
router.get('/api/advertisements', async (req, res) => {
  try {
    const { status = 'approved', email, limit = 100, skip = 0 } = req.query;

    // Build filter object
    const filter = {};
    
    // Filter by status
    if (status !== 'all') {
      filter.status = status;
    }
    
    // Filter by vendor email
    if (email) {
      filter.vendorEmail = email;
    }

    // Fetch advertisements with filters
    const advertisements = await advertisementsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();

    // Get total count for pagination
    const total = await advertisementsCollection.countDocuments(filter);

    res.json({
      success: true,
      data: advertisements,
      total: total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advertisements',
      error: error.message
    });
  }
});
*/

// ✅ ENDPOINT 2: GET SINGLE ADVERTISEMENT BY ID
// ============================================================================
// Route: GET /api/advertisements/:id
// URL Parameters:
//   - id: Advertisement ID (MongoDB ObjectId)
// 
// Response:
//   - Status: 200 (Success) or 404 (Not Found)
//   - Body: Single advertisement object
// 
// Example Usage:
//   GET /api/advertisements/65a1b2c3d4e5f6g7h8i9j0k1
//
// Implementation:
/*
router.get('/api/advertisements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid advertisement ID format'
      });
    }

    const advertisement = await advertisementsCollection.findOne({
      _id: new ObjectId(id)
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      data: advertisement
    });
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advertisement',
      error: error.message
    });
  }
});
*/

// ✅ ENDPOINT 3: CREATE NEW ADVERTISEMENT
// ============================================================================
// Route: POST /api/advertisements
// Method: POST
// Auth Required: Yes (Vendor/Admin only)
// 
// Request Body:
// {
//   "adTitle": "Summer Sale",
//   "shortDescription": "Get 30% discount on all vegetables",
//   "image": "https://example.com/image.jpg",
//   "vendorEmail": "vendor@example.com",
//   "vendorName": "Fresh Farms"
// }
// 
// Response:
//   - Status: 201 (Created)
//   - Body: { success: true, data: { insertedId, ...advertisement } }
// 
// Example Usage:
//   POST /api/advertisements
//
// Implementation:
/*
router.post('/api/advertisements', async (req, res) => {
  try {
    const { adTitle, shortDescription, image, vendorEmail, vendorName } = req.body;

    // Validation
    if (!adTitle || !shortDescription || !vendorEmail || !vendorName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: adTitle, shortDescription, vendorEmail, vendorName'
      });
    }

    const newAdvertisement = {
      adTitle,
      shortDescription,
      image: image || '',
      vendorEmail,
      vendorName,
      status: 'pending', // New ads start as pending
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await advertisementsCollection.insertOne(newAdvertisement);

    res.status(201).json({
      success: true,
      message: 'Advertisement created successfully',
      data: {
        insertedId: result.insertedId,
        ...newAdvertisement
      }
    });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create advertisement',
      error: error.message
    });
  }
});
*/

// ✅ ENDPOINT 4: UPDATE ADVERTISEMENT
// ============================================================================
// Route: PUT /api/advertisements/:id
// Method: PUT
// Auth Required: Yes (Owner or Admin only)
// URL Parameters:
//   - id: Advertisement ID
// 
// Request Body:
// {
//   "adTitle": "Updated Title",
//   "shortDescription": "Updated Description",
//   "image": "https://example.com/new-image.jpg"
// }
// 
// Response:
//   - Status: 200 (Success) or 404 (Not Found)
//   - Body: { success: true, message: "Advertisement updated successfully" }
// 
// Example Usage:
//   PUT /api/advertisements/65a1b2c3d4e5f6g7h8i9j0k1
//
// Implementation:
/*
router.put('/api/advertisements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid advertisement ID format'
      });
    }

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const result = await advertisementsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      message: 'Advertisement updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update advertisement',
      error: error.message
    });
  }
});
*/

// ✅ ENDPOINT 5: UPDATE ADVERTISEMENT STATUS (Admin only)
// ============================================================================
// Route: PATCH /api/advertisements/:id/status
// Method: PATCH
// Auth Required: Yes (Admin only)
// URL Parameters:
//   - id: Advertisement ID
// 
// Request Body:
// {
//   "status": "approved"  // or "rejected"
// }
// 
// Response:
//   - Status: 200 (Success) or 404 (Not Found)
//   - Body: { success: true, message: "Advertisement status updated" }
// 
// Example Usage:
//   PATCH /api/advertisements/65a1b2c3d4e5f6g7h8i9j0k1/status
//
// Implementation:
/*
router.patch('/api/advertisements/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status value
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid advertisement ID format'
      });
    }

    const result = await advertisementsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      message: `Advertisement status updated to ${status}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating advertisement status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update advertisement status',
      error: error.message
    });
  }
});
*/

// ✅ ENDPOINT 6: DELETE ADVERTISEMENT
// ============================================================================
// Route: DELETE /api/advertisements/:id
// Method: DELETE
// Auth Required: Yes (Owner or Admin only)
// URL Parameters:
//   - id: Advertisement ID
// 
// Response:
//   - Status: 200 (Success) or 404 (Not Found)
//   - Body: { success: true, message: "Advertisement deleted successfully" }
// 
// Example Usage:
//   DELETE /api/advertisements/65a1b2c3d4e5f6g7h8i9j0k1
//
// Implementation:
/*
router.delete('/api/advertisements/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid advertisement ID format'
      });
    }

    const result = await advertisementsCollection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      message: 'Advertisement deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete advertisement',
      error: error.message
    });
  }
});
*/

/**
 * ============================================================================
 * 4. QUICK COPY-PASTE COMPLETE CODE
 * ============================================================================
 * Copy all the code below into your Express.js server file (e.g., server.js)
 * After your MongoDB connection setup and before app.listen()
 * ============================================================================
 */

/*
// ============================================================================
// ADVERTISEMENT ROUTES - Copy this entire block into your Express server
// ============================================================================

// GET all advertisements with filtering
router.get('/api/advertisements', async (req, res) => {
  try {
    const { status = 'approved', email, limit = 100, skip = 0 } = req.query;
    const filter = {};
    
    if (status !== 'all') {
      filter.status = status;
    }
    
    if (email) {
      filter.vendorEmail = email;
    }

    const advertisements = await advertisementsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();

    const total = await advertisementsCollection.countDocuments(filter);

    res.json({
      success: true,
      data: advertisements,
      total: total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advertisements',
      error: error.message
    });
  }
});

// GET single advertisement
router.get('/api/advertisements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid advertisement ID format'
      });
    }

    const advertisement = await advertisementsCollection.findOne({
      _id: new ObjectId(id)
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      data: advertisement
    });
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advertisement',
      error: error.message
    });
  }
});

// POST create new advertisement
router.post('/api/advertisements', async (req, res) => {
  try {
    const { adTitle, shortDescription, image, vendorEmail, vendorName } = req.body;

    if (!adTitle || !shortDescription || !vendorEmail || !vendorName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: adTitle, shortDescription, vendorEmail, vendorName'
      });
    }

    const newAdvertisement = {
      adTitle,
      shortDescription,
      image: image || '',
      vendorEmail,
      vendorName,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await advertisementsCollection.insertOne(newAdvertisement);

    res.status(201).json({
      success: true,
      message: 'Advertisement created successfully',
      data: {
        insertedId: result.insertedId,
        ...newAdvertisement
      }
    });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create advertisement',
      error: error.message
    });
  }
});

// PUT update advertisement
router.put('/api/advertisements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid advertisement ID format'
      });
    }

    updateData.updatedAt = new Date();

    const result = await advertisementsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      message: 'Advertisement updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update advertisement',
      error: error.message
    });
  }
});

// PATCH update advertisement status (Admin only)
router.patch('/api/advertisements/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid advertisement ID format'
      });
    }

    const result = await advertisementsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      message: `Advertisement status updated to ${status}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating advertisement status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update advertisement status',
      error: error.message
    });
  }
});

// DELETE advertisement
router.delete('/api/advertisements/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid advertisement ID format'
      });
    }

    const result = await advertisementsCollection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      message: 'Advertisement deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete advertisement',
      error: error.message
    });
  }
});

// Use the router
app.use(router);

// ============================================================================
// END OF ADVERTISEMENT ROUTES
// ============================================================================
*/

/**
 * ============================================================================
 * 5. TESTING ENDPOINTS
 * ============================================================================
 * 
 * You can test these endpoints using Postman or curl:
 * 
 * GET ALL APPROVED ADVERTISEMENTS:
 * curl -X GET "http://localhost:5000/api/advertisements?status=approved"
 * 
 * GET ALL ADVERTISEMENTS (without filter):
 * curl -X GET "http://localhost:5000/api/advertisements?status=all"
 * 
 * GET SINGLE ADVERTISEMENT:
 * curl -X GET "http://localhost:5000/api/advertisements/65a1b2c3d4e5f6g7h8i9j0k1"
 * 
 * CREATE NEW ADVERTISEMENT:
 * curl -X POST "http://localhost:5000/api/advertisements" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "adTitle": "Summer Sale",
 *     "shortDescription": "30% off on all vegetables",
 *     "image": "https://example.com/image.jpg",
 *     "vendorEmail": "vendor@example.com",
 *     "vendorName": "Fresh Farms"
 *   }'
 * 
 * UPDATE ADVERTISEMENT:
 * curl -X PUT "http://localhost:5000/api/advertisements/65a1b2c3d4e5f6g7h8i9j0k1" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "adTitle": "Updated Title"
 *   }'
 * 
 * UPDATE STATUS (Approve):
 * curl -X PATCH "http://localhost:5000/api/advertisements/65a1b2c3d4e5f6g7h8i9j0k1/status" \
 *   -H "Content-Type: application/json" \
 *   -d '{"status": "approved"}'
 * 
 * DELETE ADVERTISEMENT:
 * curl -X DELETE "http://localhost:5000/api/advertisements/65a1b2c3d4e5f6g7h8i9j0k1"
 * 
 * ============================================================================
 */

module.exports = { /* Export router if needed */ };
