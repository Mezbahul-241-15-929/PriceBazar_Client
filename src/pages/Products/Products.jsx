import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaArrowRight, FaLock, FaFilter, FaSort } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Products = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // State for filters and sorting
    const [sortBy, setSortBy] = useState('latest'); // latest, priceLow, priceHigh
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Build query string
    const buildQueryString = () => {
        const params = new URLSearchParams();
        params.append('status', 'approved');
        
        if (sortBy === 'priceLow') {
            params.append('sort', 'price');
            params.append('order', 'asc');
        } else if (sortBy === 'priceHigh') {
            params.append('sort', 'price');
            params.append('order', 'desc');
        } else {
            params.append('sort', 'latest');
            params.append('order', 'desc');
        }

        if (dateFrom) {
            params.append('dateFrom', dateFrom);
        }
        if (dateTo) {
            params.append('dateTo', dateTo);
        }

        return params.toString();
    };

    // Fetch all products with filters
    const { data: products = [], isLoading, error, refetch } = useQuery({
        queryKey: ['allProducts', sortBy, dateFrom, dateTo, searchTerm],
        queryFn: async () => {
            const queryString = buildQueryString();
            const response = await axios.get(`http://localhost:3000/api/products/all?${queryString}`);
            let filteredProducts = response.data;
            
            // Apply search filter on frontend
            if (searchTerm.trim()) {
                filteredProducts = filteredProducts.filter(product =>
                    product.itemName.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            return filteredProducts;
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

    // Handle filter apply
    const handleApplyFilters = () => {
        refetch();
        setShowFilters(false);
        toast.success('Filters applied successfully!');
    };

    // Handle filter reset
    const handleResetFilters = () => {
        setDateFrom('');
        setDateTo('');
        setSortBy('latest');
        setSearchTerm('');
        refetch();
        toast.success('Filters reset!');
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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Products</h1>
                    <p className="text-gray-600 mb-6">Failed to load products. Please try again later.</p>
                    <button
                        onClick={() => refetch()}
                        className="bg-linear-to-r from-emerald-500 to-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}

                {/* Filters and Sorting Section */}
                <div className="mb-8 bg-white rounded-lg shadow-md p-4">
                    {/* Top Row - Search and Sort */}
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
                        {/* Search Bar */}
                        <div className="w-full md:flex-1">
                            <input
                                type="text"
                                placeholder="🔍 Search products by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="w-full md:w-48">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            >
                                <option value="latest">🔼 Latest First</option>
                                <option value="priceLow">💵 Price: Low to High</option>
                                <option value="priceHigh">💵 Price: High to Low</option>
                            </select>
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm whitespace-nowrap"
                        >
                            <FaFilter className="text-sm" />
                            {showFilters ? 'Hide' : 'Date'}
                        </button>
                    </div>

                    {/* Filter Panel - Date Range */}
                    {showFilters && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                {/* From Date */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                    />
                                </div>

                                {/* To Date */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Filter Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleApplyFilters}
                                    className="flex-1 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={handleResetFilters}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products List */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 overflow-hidden bg-gray-200">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        alt={product.itemName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        ✓ Approved
                                    </div>
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
                                        {user ? (
                                            <>
                                                View Details
                                                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                                            </>
                                        ) : (
                                            <>
                                                <FaLock className="text-sm" />
                                                Login to View
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-600 text-lg">No products found matching your filters.</p>
                        <button
                            onClick={handleResetFilters}
                            className="mt-4 bg-linear-to-r from-emerald-500 to-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Results Count */}
                {products.length > 0 && !isLoading && (
                    <div className="text-center mt-8 text-gray-600">
                        <p className="text-sm">Showing <span className="font-bold">{products.length}</span> product{products.length !== 1 ? 's' : ''}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;