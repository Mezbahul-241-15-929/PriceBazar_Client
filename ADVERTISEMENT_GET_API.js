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
