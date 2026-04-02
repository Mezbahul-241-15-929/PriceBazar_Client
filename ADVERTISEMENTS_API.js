// ==========================================
// ADVERTISEMENTS API ROUTES FOR EXPRESS.JS
// ==========================================
// Add this to your Express backend (e.g., routes/advertisements.js)

const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// NOTE: Replace 'advertisementsCollection' with your MongoDB collection
// Example: const { advertisementsCollection } = require('../db');

// ==========================================
// POST - CREATE ADVERTISEMENT
// ==========================================
router.post('/advertisements', async (req, res) => {
    try {
        const { adTitle, shortDescription, image, vendorEmail, vendorName, status } = req.body;

        // Validate required fields
        if (!adTitle || !shortDescription || !vendorEmail) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: adTitle, shortDescription, vendorEmail'
            });
        }

        const newAdvertisement = {
            adTitle: adTitle.trim(),
            shortDescription: shortDescription.trim(),
            image: image || '',
            vendorEmail,
            vendorName,
            status: status || 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await advertisementsCollection.insertOne(newAdvertisement);

        res.json({
            success: true,
            message: 'Advertisement created successfully',
            data: { _id: result.insertedId, ...newAdvertisement }
        });

    } catch (error) {
        console.error('Error creating advertisement:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating advertisement',
            error: error.message
        });
    }
});

// ==========================================
// GET - FETCH ADS BY VENDOR EMAIL
// ==========================================
router.get('/advertisements', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email query parameter is required'
            });
        }

        const advertisements = await advertisementsCollection
            .find({ vendorEmail: email })
            .sort({ createdAt: -1 })
            .toArray();

        res.json(advertisements);

    } catch (error) {
        console.error('Error fetching advertisements:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching advertisements',
            error: error.message
        });
    }
});

// ==========================================
// GET - FETCH ALL ADS (ADMIN)
// ==========================================
router.get('/advertisements/all', async (req, res) => {
    try {
        const advertisements = await advertisementsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json(advertisements);

    } catch (error) {
        console.error('Error fetching all advertisements:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching advertisements',
            error: error.message
        });
    }
});

// ==========================================
// GET - FETCH SINGLE AD BY ID
// ==========================================
router.get('/advertisements/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid advertisement ID'
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

        res.json(advertisement);

    } catch (error) {
        console.error('Error fetching advertisement:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching advertisement',
            error: error.message
        });
    }
});

// ==========================================
// PUT - UPDATE ADVERTISEMENT
// ==========================================
router.put('/advertisements/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { adTitle, shortDescription, image, status } = req.body;

        // Validate MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
            console.error("Invalid advertisement ID:", id);
            return res.status(400).json({
                success: false,
                message: 'Invalid advertisement ID'
            });
        }

        // Validate required fields
        if (!adTitle || !shortDescription) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: adTitle, shortDescription'
            });
        }

        // Build update object
        const updateData = {
            adTitle: adTitle.trim(),
            shortDescription: shortDescription.trim(),
            image: image || '',
            status: status || 'pending',
            updatedAt: new Date(),
        };

        console.log("Updating advertisement with ID:", id);
        console.log("Update data:", updateData);

        // Update in MongoDB
        const result = await advertisementsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        console.log("Update result:", result);

        // Check if advertisement was found
        if (result.matchedCount === 0) {
            console.error("Advertisement not found with ID:", id);
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        // Success response
        res.json({
            success: true,
            message: 'Advertisement updated successfully',
            modifiedCount: result.modifiedCount,
            acknowledged: result.acknowledged
        });

    } catch (error) {
        console.error('Error updating advertisement:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating advertisement',
            error: error.message
        });
    }
});

// ==========================================
// DELETE - DELETE ADVERTISEMENT
// ==========================================
router.delete('/advertisements/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
            console.error("Invalid advertisement ID:", id);
            return res.status(400).json({
                success: false,
                message: 'Invalid advertisement ID'
            });
        }

        console.log("Deleting advertisement with ID:", id);

        // Delete from MongoDB
        const result = await advertisementsCollection.deleteOne({
            _id: new ObjectId(id)
        });

        console.log("Delete result:", result);

        // Check if advertisement was found
        if (result.deletedCount === 0) {
            console.error("Advertisement not found with ID:", id);
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        // Success response
        res.json({
            success: true,
            message: 'Advertisement deleted successfully',
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Error deleting advertisement:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting advertisement',
            error: error.message
        });
    }
});

// ==========================================
// PATCH - UPDATE AD STATUS (ADMIN)
// ==========================================
router.patch('/advertisements/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid advertisement ID'
            });
        }

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, approved, or rejected'
            });
        }

        const result = await advertisementsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        res.json({
            success: true,
            message: 'Advertisement status updated successfully'
        });

    } catch (error) {
        console.error('Error updating advertisement status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating status',
            error: error.message
        });
    }
});

module.exports = router;

// ==========================================
// HOW TO USE IN YOUR MAIN SERVER FILE
// ==========================================
/*

// In your main server.js or app.js:

const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());

// ===== MONGODB CONNECTION =====
const uri = "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let advertisementsCollection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db('YOUR_DATABASE_NAME');
        advertisementsCollection = db.collection('advertisements');
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
}

connectDB();

// ===== IMPORT ADVERTISEMENTS ROUTES =====
const advertisementsRoute = require('./routes/advertisements');
app.use('/api', advertisementsRoute);

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

*/

// ==========================================
// TESTING THE API WITH CURL
// ==========================================
/*

// POST - Create Advertisement
curl -X POST http://localhost:3000/api/advertisements \
  -H "Content-Type: application/json" \
  -d '{
    "adTitle": "Special Summer Sale",
    "shortDescription": "Get 50% off on all products",
    "image": "https://example.com/banner.jpg",
    "vendorEmail": "vendor@example.com",
    "vendorName": "John Doe",
    "status": "pending"
  }'

// GET - Fetch vendor advertisements
curl http://localhost:3000/api/advertisements?email=vendor@example.com

// GET - Fetch single advertisement
curl http://localhost:3000/api/advertisements/ADVERTISEMENT_ID

// PUT - Update advertisement
curl -X PUT http://localhost:3000/api/advertisements/ADVERTISEMENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "adTitle": "Updated Sale",
    "shortDescription": "Get 60% off on all products",
    "image": "https://example.com/new-banner.jpg",
    "status": "pending"
  }'

// DELETE - Delete advertisement
curl -X DELETE http://localhost:3000/api/advertisements/ADVERTISEMENT_ID

// PATCH - Update status (Admin only)
curl -X PATCH http://localhost:3000/api/advertisements/ADVERTISEMENT_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

*/
