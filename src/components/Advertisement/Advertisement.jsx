import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Advertisement = () => {
    const axiosSecure = useAxiosSecure();

    // ✅ Fetch approved advertisements
    const { data: advertisements = [], isLoading } = useQuery({
        queryKey: ['advertisements'],
        queryFn: async () => {
            const res = await axiosSecure.get('api/advertisements');
            return res.data.data || [];
        },
    });

    // ✅ Loading Skeleton
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-8 space-y-3">
                    <div className="h-10 bg-gray-200 rounded-lg max-w-xs mx-auto animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg max-w-md mx-auto animate-pulse"></div>
                </div>
                <div className="h-96 bg-gray-300 rounded-xl animate-pulse"></div>
            </div>
        );
    }

    // ✅ No advertisements
    if (advertisements.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12 text-center">
                <p className="text-gray-500 text-lg">No advertisements available at the moment.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Advertisement Section */}
            <motion.div 
                className="w-full bg-linear-to-b from-gray-50 to-white py-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-6xl mx-auto px-4">
                    {/* Section Header */}
                    <motion.div 
                        className="text-center mb-10"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            📢 Advertisement Highlights
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base">
                            Explore all current promotions and vendor ads through this interactive carousel
                        </p>
                    </motion.div>

                    {/* Advertisement Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {advertisements.map((ad, index) => (
                        <motion.div
                            key={ad._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                        >
                            {/* Card Image */}
                            <div className="relative h-48 overflow-hidden bg-gray-200">
                                <img
                                    src={ad.image || 'https://via.placeholder.com/400x300?text=Advertisement'}
                                    alt={ad.adTitle}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Status Badge */}
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                                    viewport={{ once: true }}
                                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                        ad.status === 'approved' 
                                            ? 'bg-emerald-500' 
                                            : ad.status === 'rejected' 
                                            ? 'bg-red-500' 
                                        : 'bg-yellow-500'
                                }`}>
                                    {ad.status === 'approved' && '✓ Approved'}
                                    {ad.status === 'rejected' && '✗ Rejected'}
                                    {ad.status === 'pending' && '⏳ Pending'}
                                </motion.div>
                            </div>

                            {/* Card Content */}
                            <motion.div 
                                className="p-4 md:p-5"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
                                viewport={{ once: true }}
                            >
                                {/* Ad Title */}
                                <div className="flex items-start gap-2 mb-2">
                                    <FaQuoteLeft className="text-emerald-500 shrink-0 mt-1 text-sm" />
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {ad.adTitle}
                                    </h3>
                                </div>

                                {/* Ad Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {ad.shortDescription}
                                </p>

                                {/* Vendor Info */}
                                <div className="border-t border-gray-200 pt-3">
                                    <p className="text-gray-900 font-semibold text-sm">
                                        {ad.vendorName || 'Vendor'}
                                    </p>
                                    <p className="text-gray-600 text-xs">
                                        {ad.vendorEmail}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Advertisement;
