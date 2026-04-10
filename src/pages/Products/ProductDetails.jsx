import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaStar, FaBookmark, FaShoppingCart, FaCarrot, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading/Loading';
import useAuth from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MdTrendingUp } from 'react-icons/md';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [editingRating, setEditingRating] = useState(5);
    const [userRating, setUserRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedCompareDate, setSelectedCompareDate] = useState('');

    // Fetch product details
    const { data: product = {}, isLoading, error } = useQuery({
        queryKey: ['productDetails', id],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/products/${id}`);
            return response.data;
        },
    });

    // Fetch reviews
    const { data: reviewsData = [] } = useQuery({
        queryKey: ['reviews', id],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/reviews/${id}`);
            return response.data;
        },
    });

    useEffect(() => {
        if (reviewsData && reviewsData.length > 0) {
            setComments(reviewsData);
        }
    }, [reviewsData]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Check if price is recent
    const isRecentPrice = (priceDate) => {
        if (!priceDate) return false;
        const priceDateObj = new Date(priceDate);
        const today = new Date();
        const diffTime = Math.abs(today - priceDateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    // Get latest price from product
    const getLatestPrice = (product) => {
        if (!product.prices || product.prices.length === 0) {
            return 'N/A';
        }
        const sorted = [...product.prices].sort((a, b) => new Date(b.date) - new Date(a.date));
        return sorted[0].price;
    };

    // Get latest date from product
    const getLatestDate = (product) => {
        if (!product.prices || product.prices.length === 0) {
            return 'N/A';
        }
        const sorted = [...product.prices].sort((a, b) => new Date(b.date) - new Date(a.date));
        return sorted[0].date;
    };

    // Handle contact vendor
    const handleContactVendor = () => {
        toast.success(`Contact ${product.vendorName} for more information!`);
        // You can add WhatsApp, email, or phone integration here
    };

    // Handle watchlist toggle
    const handleWatchlist = () => {
        if (!user) {
            toast.error('Please login to add to watchlist');
            navigate('/login');
            return;
        }
        setIsWatchlisted(!isWatchlisted);
        toast.success(isWatchlisted ? 'Removed from watchlist' : 'Added to watchlist');
    };

    // Handle buy product
    const handleBuyProduct = () => {
        if (!user) {
            toast.error('Please login to buy products');
            navigate('/login');
            return;
        }
        toast.success('Product added to cart!');
    };

    // Handle add comment
    const handleAddComment = async () => {
        if (!user) {
            toast.error('Please login to add comments');
            navigate('/login');
            return;
        }
        if (!newComment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        const existingReview = comments.find(c => c.email === user.email);
        if (existingReview) {
            toast.error('You have already reviewed this product. Edit or delete your existing review.');
            return;
        }

        try {
            const reviewData = {
                productId: id,
                userId: user.uid,
                author: user.displayName || 'Anonymous',
                email: user.email,
                text: newComment,
                rating: userRating
            };

            const response = await axios.post('http://localhost:3000/api/reviews', reviewData);
            
            if (response.data) {
                setComments([response.data, ...comments]);
                setNewComment('');
                setUserRating(5);
                toast.success('Review posted successfully!');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            toast.error('Failed to post review: ' + errorMsg);
        }
    };

    const handleEditReview = (reviewId) => {
        const review = comments.find(c => c._id === reviewId);
        if (review) {
            setEditingReviewId(reviewId);
            setEditingText(review.text);
            setEditingRating(review.rating);
        }
    };

    const handleUpdateReview = async () => {
        if (!editingText.trim()) {
            toast.error('Please write a comment');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/reviews/${editingReviewId}`, {
                email: user.email,
                text: editingText,
                rating: editingRating
            });

            setComments(comments.map(c => c._id === editingReviewId ? response.data : c));
            setEditingReviewId(null);
            setEditingText('');
            setEditingRating(5);
            toast.success('Review updated successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            toast.error('Failed to update review: ' + errorMsg);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
                data: { email: user.email }
            });
            setComments(comments.filter(c => c._id !== reviewId));
            toast.success('Review deleted successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            toast.error('Failed to delete review: ' + errorMsg);
        }
    };

    // Get the latest price (most recent by date)
    const getLatestPriceFromHistory = () => {
        if (!product.prices || product.prices.length === 0) {
            return product?.price || 0;
        }
        // Find the price with the latest date
        const latest = product.prices.reduce((prev, current) => {
            return new Date(current.date) > new Date(prev.date) ? current : prev;
        });
        return parseInt(latest.price);
    };
    const getPriceHistoryData = () => {
        if (!product) return [];
        
        // If product has prices array, use it
        if (product.prices && product.prices.length > 0) {
            const data = product.prices
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((priceObj, index) => {
                    const dateObj = new Date(priceObj.date);
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const hours = String(dateObj.getHours()).padStart(2, '0');
                    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
                    const priceValue = typeof priceObj.price === 'string' ? parseInt(priceObj.price) : priceObj.price;
                    return {
                        date: `${month}/${day} ${hours}:${minutes}:${seconds}`,
                        price: priceValue,
                        fullDate: priceObj.date
                    };
                });
            console.log('Price History Data:', data);
            return data;
        }
        
        // Otherwise generate sample data from current price
        if (product.price) {
            const today = new Date();
            const sampleData = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const variance = (Math.random() - 0.5) * (product.price * 0.15);
                sampleData.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    price: Math.round(product.price + variance),
                    fullDate: date.toISOString()
                });
            }
            return sampleData;
        }
        
        return [];
    };

    // Get comparison data
    const getComparisonData = () => {
        const data = getPriceHistoryData();
        if (!data || data.length < 2) return data;
        if (!selectedCompareDate) return data;
        
        const selectedIndex = data.findIndex(d => d.fullDate === selectedCompareDate);
        if (selectedIndex === -1) return data;
        
        return data.slice(selectedIndex).reverse();
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Product</h1>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or is no longer available.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-linear-to-r from-emerald-500 to-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className="min-h-screen bg-gray-50 py-8 px-4 md:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <motion.button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-6 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaArrowLeft />
                    Go Back
                </motion.button>

                <motion.div 
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
                        {/* Product Image */}
                        <motion.div 
                            className="flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                                <img
                                    src={product.image || 'https://via.placeholder.com/500x500?text=No+Image'}
                                    alt={product.itemName}
                                    className="w-full h-full object-cover"
                                />
                                {product.status === 'approved' && (
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                                        ✓ Approved
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Product Info */}
                        <motion.div 
                            className="flex flex-col justify-between"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {/* Header */}
                            <div>
                                <motion.h1 
                                    className="text-4xl font-bold text-gray-900 mb-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    {product.itemName}
                                </motion.h1>
                                
                                {/* Current Price */}
                                <motion.div 
                                    className="mb-6 p-3 bg-linear-to-r from-emerald-100 to-teal-100 rounded-lg border-2 border-emerald-500"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                >
                                    <p className="text-xs text-gray-600 font-semibold mb-1">Current Price</p>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        ৳{getLatestPrice(product)}
                                        <span className="text-sm text-gray-600 ml-2">/kg</span>
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {getLatestDate(product) !== 'N/A' ? new Date(getLatestDate(product)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </motion.div>
                                
                                {/* Market Info */}
                                <motion.div 
                                    className="flex items-center gap-2 text-gray-700 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.6 }}
                                >
                                    <FaMapMarkerAlt className="text-red-500" />
                                    <span className="text-lg font-semibold">{product.marketName}</span>
                                </motion.div>

                                {/* Description */}
                                {product.description && (
                                    <motion.div 
                                        className="mb-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.7 }}
                                    >
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
                                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Vendor Info */}
                            <motion.div 
                                className="bg-linear-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-200 mt-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.8 }}
                            >
                                <h3 className="text-sm font-bold text-gray-800 mb-2">Vendor Information</h3>
                                <div className="flex flex-col gap-1">
                                    <motion.div 
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.85 }}
                                    >
                                        <FaUser className="text-emerald-600 shrink-0" />
                                        <span className="text-gray-700">{product.vendorName || 'Local Farmer'}</span>
                                    </motion.div>
                                    <motion.div 
                                        className="flex items-center gap-2"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.9 }}
                                    >
                                        <FaEnvelope className="text-emerald-600 shrink-0" />
                                        <span className="text-gray-700">{product.vendorEmail || 'vendor@example.com'}</span>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Action Buttons - Right Side */}
                            <motion.div 
                                className="flex flex-row gap-2 mt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.95 }}
                            >
                                {/* Buy Button */}
                                <motion.button
                                    onClick={handleBuyProduct}
                                    className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaShoppingCart />
                                    Buy Product
                                </motion.button>

                                {/* Watchlist Button - Disabled for admin/vendor */}
                                <motion.button
                                    onClick={handleWatchlist}
                                    disabled={user && (user.role === 'admin' || user.role === 'vendor')}
                                    className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md text-sm ${
                                        isWatchlisted
                                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                            : user && (user.role === 'admin' || user.role === 'vendor')
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                    }`}
                                    whileHover={!user || (user.role !== 'admin' && user.role !== 'vendor') ? { scale: 1.02 } : {}}
                                    whileTap={!user || (user.role !== 'admin' && user.role !== 'vendor') ? { scale: 0.98 } : {}}
                                >
                                    <FaBookmark />
                                    {isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Reviews & Comments Section */}
                <motion.div 
                    className="bg-white rounded-lg shadow-lg overflow-hidden mt-8 p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        🗣️ Reviews & Community Feedback
                    </h2>

                    {/* Add Review Form */}
                    {user && (
                        <motion.div 
                            className="bg-linear-to-r from-emerald-50 to-teal-50 p-6 rounded-lg mb-8 border border-emerald-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Share Your Market Experience</h3>
                            
                            {/* Star Rating */}
                            <motion.div 
                                className="mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 1.15 }}
                            >
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Rate the current price:</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            onClick={() => setUserRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="text-2xl transition-all"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaStar 
                                                className={
                                                    star <= (hoveredRating || userRating) 
                                                        ? 'text-yellow-500' 
                                                        : 'text-gray-300'
                                                }
                                            />
                                        </motion.button>
                                    ))}
                                    <span className="ml-2 text-gray-600 font-semibold">
                                        {hoveredRating || userRating}/5 - {
                                            (hoveredRating || userRating) === 5 ? 'Fair Price' :
                                            (hoveredRating || userRating) === 4 ? 'Slightly High' :
                                            (hoveredRating || userRating) === 3 ? 'Moderate' :
                                            (hoveredRating || userRating) === 2 ? 'High' : 'Very High'
                                        }
                                    </span>
                                </div>
                            </motion.div>

                            {/* Comment Input */}
                            <motion.div 
                                className="mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 1.2 }}
                            >
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Feedback:</label>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your thoughts about current prices... (e.g., 'Price rose by ৳10 since yesterday', 'Fair market rate', etc.)"
                                    className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                    rows="4"
                                    disabled={comments.some(c => c.email === user?.email)}
                                />
                                {comments.some(c => c.email === user?.email) && (
                                    <p className="text-yellow-600 text-sm mt-2 font-semibold">You have already reviewed this product</p>
                                )}
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                onClick={handleAddComment}
                                disabled={comments.some(c => c.email === user?.email)}
                                className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Post Review
                            </motion.button>
                        </motion.div>
                    )}

                    {!user && (
                        <motion.div 
                            className="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-lg mb-8 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 1.1 }}
                        >
                            <p className="text-gray-700 font-semibold mb-3">Please login to share your market feedback</p>
                            <motion.button
                                onClick={() => navigate('/login')}
                                className="bg-linear-to-r from-emerald-500 to-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-700"
                                whileHover={{ scale: 1.05 }}
                            >
                                Login to Review
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Reviews List */}
                    <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.25 }}
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Community Reviews ({comments.length})</h3>
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <motion.div 
                                    key={comment.id}
                                    className="bg-white p-4 rounded-lg border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 1.3 + index * 0.05 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                            {comment.author.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{comment.author}</h4>
                                                    <p className="text-xs text-gray-500">{comment.email}</p>
                                                </div>
                                                <span className="text-xs text-gray-500 font-semibold">{comment.date}</span>
                                            </div>

                                            {editingReviewId === comment._id ? (
                                                <motion.div 
                                                    className="mt-3 p-3 bg-gray-50 rounded-lg border border-emerald-200"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <div className="mb-3">
                                                        <label className="block text-xs font-semibold text-gray-700 mb-2">Update Rating:</label>
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <motion.button
                                                                    key={star}
                                                                    onClick={() => setEditingRating(star)}
                                                                    whileHover={{ scale: 1.1 }}
                                                                >
                                                                    <FaStar 
                                                                        className={star <= editingRating ? 'text-yellow-500' : 'text-gray-300'}
                                                                        size={16}
                                                                    />
                                                                </motion.button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        value={editingText}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        className="w-full px-3 py-2 border border-emerald-300 rounded text-sm mb-3"
                                                        rows="3"
                                                    />
                                                    <div className="flex gap-2">
                                                        <motion.button
                                                            onClick={handleUpdateReview}
                                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-2 rounded"
                                                            whileHover={{ scale: 1.02 }}
                                                        >
                                                            Save
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => setEditingReviewId(null)}
                                                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white text-sm font-bold py-2 rounded"
                                                            whileHover={{ scale: 1.02 }}
                                                        >
                                                            Cancel
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-1 mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar 
                                                                key={i}
                                                                className={i < comment.rating ? 'text-yellow-500' : 'text-gray-300'}
                                                                size={14}
                                                            />
                                                        ))}
                                                        <span className="text-xs text-gray-600 ml-2 font-semibold">
                                                            {comment.rating === 5 ? 'Fair Price' :
                                                             comment.rating === 4 ? 'Slightly High' :
                                                             comment.rating === 3 ? 'Moderate' :
                                                             comment.rating === 2 ? 'High' : 'Very High'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed mb-3">{comment.text}</p>
                                                    
                                                    {user && comment.email === user.email && (
                                                        <div className="flex gap-2">
                                                            <motion.button
                                                                onClick={() => handleEditReview(comment._id)}
                                                                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-semibold"
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                Edit
                                                            </motion.button>
                                                            <motion.button
                                                                onClick={() => handleDeleteReview(comment._id)}
                                                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold"
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                Delete
                                                            </motion.button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.p 
                                className="text-center text-gray-500 py-8 italic"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 1.3 }}
                            >
                                No reviews yet. Be the first to share your market experience!
                            </motion.p>
                        )}
                    </motion.div>
                </motion.div>

                {/* Price History Chart */}
                {getPriceHistoryData() && getPriceHistoryData().length > 0 && (
                    <motion.div 
                        className="bg-white rounded-lg shadow-lg overflow-hidden mt-8 p-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MdTrendingUp className="text-blue-600 text-3xl" />
                            📈 Price History Chart
                        </h2>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={getPriceHistoryData()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#6b7280"
                                        style={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <YAxis 
                                        stroke="#6b7280"
                                        style={{ fontSize: '12px', fontWeight: 'bold' }}
                                        label={{ value: 'Price (৳)', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip 
                                        formatter={(value) => `৳${value}`}
                                        labelFormatter={(label) => `Date: ${label}`}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '2px solid #3b82f6',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            color: '#1f2937'
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{
                                            paddingTop: '20px',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="price" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', r: 5 }}
                                        activeDot={{ r: 8 }}
                                        name={`${product.name || 'Product'} Price`}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Price Stats */}
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 1.7 }}
                        >
                            <div className="bg-linear-to-r from-blue-400 to-blue-600 p-4 rounded-lg text-white shadow-lg">
                                <p className="text-sm font-semibold opacity-90">💵 Latest Price</p>
                                <p className="text-2xl font-bold">৳{getLatestPriceFromHistory()}</p>
                            </div>

                            <div className="bg-linear-to-r from-green-400 to-green-600 p-4 rounded-lg text-white shadow-lg">
                                <p className="text-sm font-semibold opacity-90">⬇️ Lowest</p>
                                <p className="text-2xl font-bold">৳{getPriceHistoryData().length > 0 ? Math.min(...getPriceHistoryData().map(d => d.price)) : 0}</p>
                            </div>

                            <div className="bg-linear-to-r from-orange-400 to-orange-600 p-4 rounded-lg text-white shadow-lg">
                                <p className="text-sm font-semibold opacity-90">⬆️ Highest</p>
                                <p className="text-2xl font-bold">৳{getPriceHistoryData().length > 0 ? Math.max(...getPriceHistoryData().map(d => d.price)) : 0}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductDetails;
