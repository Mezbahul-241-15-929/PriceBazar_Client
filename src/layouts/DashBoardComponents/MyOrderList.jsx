import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const MyOrderList = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('date');

    // Fetch user orders
    const { data: orders = [], isPending, error, refetch } = useQuery({
        queryKey: ['myOrders', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            try {
                const response = await axiosSecure.get(`/orders/${user.email}`);
                return response.data || [];
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to load orders');
                return [];
            }
        },
        enabled: !!user?.email,
    });

    // Sort orders
    const sortedOrders = React.useMemo(() => {
        const sorted = [...orders];
        if (sortBy === 'date') {
            sorted.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        } else if (sortBy === 'price') {
            sorted.sort((a, b) => b.amount - a.amount);
        } else if (sortBy === 'price-asc') {
            sorted.sort((a, b) => a.amount - b.amount);
        }
        return sorted;
    }, [orders, sortBy]);

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
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="inline-block animate-spin">
                            <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                        </div>
                        <p className="mt-4 text-gray-600">Loading your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">
                        View and manage all your purchased products
                    </p>
                </div>

                {/* Filters and Info */}
                {orders.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">
                                Total Orders: <strong>{orders.length}</strong>
                            </span>
                            <span className="text-gray-600">
                                Total Spent: <strong>৳{orders.reduce((sum, order) => sum + (order.amount || 0), 0).toFixed(2)}</strong>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-gray-600 font-medium">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                            >
                                <option value="date">Latest First</option>
                                <option value="price">Price (High to Low)</option>
                                <option value="price-asc">Price (Low to High)</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Orders Table */}
                {sortedOrders.length > 0 ? (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Market Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortedOrders.map((order, index) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                {order.productImage && (
                                                    <img
                                                        src={order.productImage}
                                                        alt={order.productName}
                                                        className="h-10 w-10 object-cover rounded"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/40?text=Product';
                                                        }}
                                                    />
                                                )}
                                                <span className="text-gray-900 font-medium">
                                                    {order.productName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.marketName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                                            ৳{order.amount?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(order.orderDate)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                order.paymentStatus === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.paymentStatus === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {order.paymentStatus || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleViewDetails(order.productId)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                                            >
                                                <span>🔍</span>
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="mb-4 text-5xl">📦</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">
                            You haven't purchased any products yet. Start shopping now!
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                        >
                            Browse Products
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">
                            Failed to load orders: {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrderList;
