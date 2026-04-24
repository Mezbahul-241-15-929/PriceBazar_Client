import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AllOrders = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('date');
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');

    // Fetch all orders
    const { data: orders = [], isPending, error, refetch } = useQuery({
        queryKey: ['allOrders'],
        queryFn: async () => {
            try {
                const response = await axiosSecure.get(`/all-orders`);
                return response.data || [];
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to load orders');
                return [];
            }
        },
    });

    // Filter orders
    const filteredOrders = React.useMemo(() => {
        let filtered = [...orders];
        
        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(order => order.paymentStatus === filterStatus);
        }
        
        // Search filter
        if (search) {
            filtered = filtered.filter(order =>
                order.productName?.toLowerCase().includes(search.toLowerCase()) ||
                order.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
                order.marketName?.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        return filtered;
    }, [orders, filterStatus, search]);

    // Sort orders
    const sortedOrders = React.useMemo(() => {
        const sorted = [...filteredOrders];
        if (sortBy === 'date') {
            sorted.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        } else if (sortBy === 'price') {
            sorted.sort((a, b) => b.amount - a.amount);
        } else if (sortBy === 'price-asc') {
            sorted.sort((a, b) => a.amount - b.amount);
        } else if (sortBy === 'user') {
            sorted.sort((a, b) => (a.userEmail || '').localeCompare(b.userEmail || ''));
        }
        return sorted;
    }, [filteredOrders, sortBy]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-BD', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'Invalid date';
        }
    };

    const handleViewDetails = (productId) => {
        navigate(`/product-details/${productId}`);
    };

    if (isPending) {
        return (
            <div className="p-4 md:p-6">
                <p className="text-center py-10 text-gray-500">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 w-full">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        📋 All Orders
                    </h1>
                    <p className="text-gray-500 text-sm">
                        View and manage all customer orders
                    </p>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by product, email, or market..."
                    className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Filters */}
            {orders.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3 flex-wrap items-center">
                    <label className="text-gray-600 font-medium">Filter:</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="all">All Orders</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    <label className="text-gray-600 font-medium ml-auto">Sort:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="date">Latest First</option>
                        <option value="price">Price (High to Low)</option>
                        <option value="price-asc">Price (Low to High)</option>
                        <option value="user">Customer Email</option>
                    </select>
                </div>
            )}

            {/* Table */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto w-full">

                    <table className="w-full min-w-full text-sm">

                        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">#</th>
                                <th className="py-3 px-4 text-left">Product</th>
                                <th className="py-3 px-4 text-left">Customer Email</th>
                                <th className="py-3 px-4 text-left">Market</th>
                                <th className="py-3 px-4 text-left">Price</th>
                                <th className="py-3 px-4 text-left">Order Date</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                sortedOrders.map((order, index) => (
                                    <tr
                                        key={order._id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 px-4 text-gray-600">
                                            {index + 1}
                                        </td>

                                        {/* Product */}
                                        <td className="py-3 px-4 flex items-center gap-3">
                                            {order.productImage && (
                                                <img
                                                    src={order.productImage}
                                                    alt={order.productName}
                                                    className="w-10 h-10 rounded object-cover border border-gray-200"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/40?text=Product';
                                                    }}
                                                />
                                            )}
                                            <span className="font-semibold text-gray-800">
                                                {order.productName}
                                            </span>
                                        </td>

                                        {/* Customer Email */}
                                        <td className="py-3 px-4 text-gray-600 text-xs">
                                            {order.userEmail || 'N/A'}
                                        </td>

                                        {/* Market */}
                                        <td className="py-3 px-4 text-gray-600">
                                            {order.marketName || 'N/A'}
                                        </td>

                                        {/* Price */}
                                        <td className="py-3 px-4 font-semibold text-emerald-600">
                                            ৳{order.amount?.toFixed(2) || '0.00'}
                                        </td>

                                        {/* Date */}
                                        <td className="py-3 px-4 text-gray-500 text-xs">
                                            {formatDate(order.orderDate)}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                                order.paymentStatus === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : order.paymentStatus === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {order.paymentStatus || 'Pending'}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleViewDetails(order.productId)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>

                </div>
            </div>

            {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">
                        Failed to load orders: {error.message}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AllOrders;
