// ==========================================
// ADMIN API ENDPOINTS FOR PRODUCTS & ADS
// ==========================================
// Add these endpoints to your Express backend

// =============================================
// PRODUCTS - GET ALL (ADMIN)
// =============================================
router.get('/products/all', async (req, res) => {
    try {
        const products = await productsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json(products);

    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

// =============================================
// PRODUCTS - UPDATE STATUS (ADMIN)
// =============================================
router.patch('/products/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            });
        }

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, approved, or rejected'
            });
        }

        const updateData = {
            status,
            updatedAt: new Date(),
        };

        if (status === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const result = await productsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: `Product ${status} successfully`,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product status',
            error: error.message
        });
    }
});

// =============================================
// ADVERTISEMENTS - GET ALL (ADMIN)
// =============================================
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

// =============================================
// ADVERTISEMENTS - UPDATE STATUS (ADMIN)
// =============================================
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
            message: `Advertisement ${status} successfully`,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Error updating advertisement status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating advertisement status',
            error: error.message
        });
    }
});

// =============================================
// TESTING CURL COMMANDS
// =============================================
/*

// GET All Products
curl http://localhost:3000/api/products/all

// UPDATE Product Status to Approved
curl -X PATCH http://localhost:3000/api/products/PRODUCT_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

// REJECT Product with reason
curl -X PATCH http://localhost:3000/api/products/PRODUCT_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected", "rejectionReason": "Product image is not clear"}'

// GET All Advertisements
curl http://localhost:3000/api/advertisements/all

// UPDATE Advertisement Status to Approved
curl -X PATCH http://localhost:3000/api/advertisements/AD_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

// REJECT Advertisement
curl -X PATCH http://localhost:3000/api/advertisements/AD_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'

*/
