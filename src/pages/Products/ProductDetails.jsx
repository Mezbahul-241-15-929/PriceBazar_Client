import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaStar, FaBookmark, FaShoppingCart, FaCarrot, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading/Loading';
import useAuth from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isWatchlisted, setIsWatchlisted] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);

    // Fetch product details
    const { data: product = {}, isLoading, error } = useQuery({
        queryKey: ['productDetails', id],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/products/${id}`);
            return response.data;
        },
    });

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
    const handleAddComment = () => {
        if (!user) {
            toast.error('Please login to add comments');
            navigate('/login');
            return;
        }
        if (!newComment.trim()) {
            toast.error('Please write a comment');
            return;
        }
        const comment = {
            id: Date.now(),
            author: user.displayName || 'Anonymous',
            text: newComment,
            rating: 5,
            date: new Date().toLocaleDateString()
        };
        setComments([comment, ...comments]);
        setNewComment('');
        toast.success('Comment added!');
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
            </div>
        </motion.div>
    );
};

export default ProductDetails;
