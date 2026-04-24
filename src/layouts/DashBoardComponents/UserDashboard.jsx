import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const UserDashboard = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch user order stats
    const { data: orderStats = {}, isPending: statsLoading, error } = useQuery({
        queryKey: ['userOrderStats', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            try {
                const response = await axiosSecure.get(`/orders-stats/${user.email}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching order stats:', error);
                toast.error('Failed to load order statistics');
                return {};
            }
        },
    });

    // Fetch user orders
    const { data: orders = [], isPending: ordersLoading } = useQuery({
        queryKey: ['userOrders', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            try {
                const response = await axiosSecure.get(`/orders/${user.email}`);
                return response.data || [];
            } catch (error) {
                console.error('Error fetching orders:', error);
                return [];
            }
        },
    });

    // Fetch watchlist count
    const { data: watchlistCount = 0 } = useQuery({
        queryKey: ['watchlistCount', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            try {
                const response = await axiosSecure.get(`/watchlist/${user.email}`);
                return Array.isArray(response.data) ? response.data.length : 0;
            } catch (error) {
                return 0;
            }
        },
    });

    if (statsLoading || ordersLoading) {
        return (
            <div className="p-4 md:p-8">
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            </div>
        );
    }

    const recentOrders = orders.slice(0, 5);
    const completedOrders = orders.filter(o => o.paymentStatus === 'completed').length;
    const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;

    const statCards = [
        {
            label: 'Total Orders',
            value: orderStats.totalOrders || 0,
            icon: '🛒',
            bgGradient: 'from-blue-500 to-blue-600'
        },
        {
            label: 'Total Spent',
            value: `৳${(orderStats.totalSpent || 0).toFixed(2)}`,
            icon: '💰',
            bgGradient: 'from-green-500 to-green-600'
        },
        {
            label: 'Average Order',
            value: `৳${(orderStats.avgOrderValue || 0).toFixed(2)}`,
            icon: '📊',
            bgGradient: 'from-purple-500 to-purple-600'
        },
        {
            label: 'Completed Orders',
            value: completedOrders,
            icon: '✅',
            bgGradient: 'from-emerald-500 to-emerald-600'
        },
        {
            label: 'Pending Orders',
            value: pendingOrders,
            icon: '⏳',
            bgGradient: 'from-yellow-500 to-yellow-600'
        },
        {
            label: 'Watchlist Items',
            value: watchlistCount,
            icon: '❤️',
            bgGradient: 'from-pink-500 to-pink-600'
        }
    ];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    🎯 Your Dashboard
                </h1>
                <p className="text-gray-600">
                    Welcome back, {user?.displayName || 'User'}! Here's your shopping overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                        <div className={`bg-gradient-to-r ${card.bgGradient} p-6 text-white`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-medium opacity-90">{card.label}</p>
                                    <p className="text-3xl md:text-4xl font-bold mt-2">{card.value}</p>
                                </div>
                                <div className="text-4xl">{card.icon}</div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Your activity</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📦 Recent Orders</h2>
                {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">#</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Product</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Market</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentOrders.map((order, idx) => {
                                    const orderDate = new Date(order.orderDate);
                                    const formattedDate = orderDate.toLocaleDateString('en-BD', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    });

                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-600">{idx + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {order.productImage && (
                                                        <img src={order.productImage} alt={order.productName} className="w-8 h-8 rounded object-cover" />
                                                    )}
                                                    <span className="font-medium text-gray-900">{order.productName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{order.marketName || 'N/A'}</td>
                                            <td className="px-4 py-3 font-semibold text-emerald-600">
                                                ৳{order.amount?.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{formattedDate}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    order.paymentStatus === 'completed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {order.paymentStatus || 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">No orders yet. Start shopping now!</p>
                )}
                {orders.length > 5 && (
                    <div className="mt-4 text-center">
                        <a href="/dashboard/my-orders" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                            View All Orders →
                        </a>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">
                        Failed to load statistics: {error.message}
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
