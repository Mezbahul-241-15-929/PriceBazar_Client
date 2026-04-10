const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'pricebazar';
let db;

const connectDB = async () => {
    try {
        const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
        await client.connect();
        db = client.db(DB_NAME);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

connectDB();

// GET all reviews for a product
app.get('/api/reviews/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await db.collection('reviews')
            .find({ productId })
            .sort({ timestamp: -1 })
            .toArray();
        
        res.json(reviews || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new review
app.post('/api/reviews', async (req, res) => {
    try {
        const { productId, userId, author, email, text, rating } = req.body;

        if (!productId || !userId || !author || !email || !text || !rating) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const existingReview = await db.collection('reviews')
            .findOne({ productId, userId });

        if (existingReview) {
            return res.status(409).json({ error: 'You have already reviewed this product' });
        }

        const review = {
            productId,
            userId,
            author,
            email,
            text,
            rating,
            timestamp: new Date(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        const result = await db.collection('reviews').insertOne(review);
        
        res.status(201).json({
            _id: result.insertedId,
            ...review
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update review
app.put('/api/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, text, rating } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid review ID' });
        }

        const review = await db.collection('reviews')
            .findOne({ _id: new ObjectId(id) });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.email !== email) {
            return res.status(403).json({ error: 'Not authorized to update this review' });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const updatedReview = {
            text: text || review.text,
            rating: rating || review.rating,
            updatedAt: new Date()
        };

        await db.collection('reviews')
            .updateOne({ _id: new ObjectId(id) }, { $set: updatedReview });

        const updated = await db.collection('reviews')
            .findOne({ _id: new ObjectId(id) });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE review
app.delete('/api/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid review ID' });
        }

        const review = await db.collection('reviews')
            .findOne({ _id: new ObjectId(id) });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.email !== email) {
            return res.status(403).json({ error: 'Not authorized to delete this review' });
        }

        await db.collection('reviews')
            .deleteOne({ _id: new ObjectId(id) });

        res.json({ message: 'Review deleted successfully', _id: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
