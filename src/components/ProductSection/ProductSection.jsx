import React from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductSection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Fetch approved products (limit 6)
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['homeProducts'],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL || 'https://price-bazar-server.vercel.app'}/api/products/all?status=approved&sort=latest&order=desc`
            );
            // Limit to 6 products on frontend if needed
            return response.data.slice(0, 6);
        },
    });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

    // Check if price is recent (today or recent dates)
    const isRecentPrice = (dateString) => {
        if (!dateString) return false;
        const priceDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - priceDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7; // Within last 7 days
    };

    // Handle View Details
    const handleViewDetails = (productId) => {
        if (!user) {
            toast.error('Please login to view product details');
            navigate('/login');
            return;
        }
        navigate(`/product-details/${productId}`);
    };

    if (isLoading) {
        return (
            <div className="py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className="py-12 px-4 md:px-8 bg-gray-50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div 
                    className="mb-10 text-center"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
                    <p className="text-gray-600">Fresh products from local markets with current pricing</p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                        >
                            {/* Product Image */}
                            <div className="relative h-48 overflow-hidden bg-gray-200">
                                <img
                                    src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={product.itemName}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Approved Badge */}
                                <motion.div 
                                    className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    ✓ Approved
                                </motion.div>
                                {/* Recent Price Badge */}
                                {isRecentPrice(getLatestDate(product)) && (
                                    <motion.div 
                                        className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        📅 Recent
                                    </motion.div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4 md:p-5">
                                {/* Product Name */}
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                    {product.itemName}
                                </h3>

                                {/* Price */}
                                <div className="mb-3">
                                    <p className="text-2xl font-bold text-emerald-600">
                                        ৳{getLatestPrice(product)}
                                        <span className="text-sm text-gray-600 font-normal ml-1">/kg</span>
                                    </p>
                                </div>

                                {/* Market Name */}
                                <div className="flex items-center gap-2 text-gray-700 mb-2">
                                    <FaMapMarkerAlt className="text-red-500 shrink-0" />
                                    <p className="font-semibold text-sm truncate">
                                        {product.marketName || 'Local Market'}
                                    </p>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                                    <FaCalendarAlt className="text-blue-500 shrink-0" />
                                    <span>{formatDate(getLatestDate(product))}</span>
                                </div>

                                {/* Vendor Name */}
                                <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
                                    <FaUser className="text-purple-500 shrink-0" />
                                    <span className="truncate">{product.vendorName || 'Local Farmer'}</span>
                                </div>

                                {/* View Details Button */}
                                <button
                                    onClick={() => handleViewDetails(product._id)}
                                    className="w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                    View Details
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && !isLoading && (
                    <motion.div 
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-gray-500 text-lg">No approved products available at the moment.</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductSection;