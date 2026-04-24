import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch admin stats
    const { data: stats = {}, isPending, error } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            try {
                const response = await axiosSecure.get('/admin-stats');
                return response.data;
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                toast.error('Failed to load admin statistics');
                return {};
            }
        },
    });

    if (isPending) {
        return (
            <div className="p-4 md:p-8">
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Users',
            value: stats.totalUsers || 0,
            icon: '👥',
            color: 'blue',
            bgGradient: 'from-blue-500 to-blue-600'
        },
        {
            label: 'Total Products',
            value: stats.totalProducts || 0,
            icon: '📦',
            color: 'green',
            bgGradient: 'from-green-500 to-green-600'
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders || 0,
            icon: '🛒',
            color: 'orange',
            bgGradient: 'from-orange-500 to-orange-600'
        },
        {
            label: 'Total Revenue',
            value: `৳${(stats.totalRevenue || 0).toFixed(2)}`,
            icon: '💰',
            color: 'purple',
            bgGradient: 'from-purple-500 to-purple-600'
        },
        {
            label: 'Completed Orders',
            value: stats.completedOrders || 0,
            icon: '✅',
            color: 'emerald',
            bgGradient: 'from-emerald-500 to-emerald-600'
        },
        {
            label: 'Pending Orders',
            value: stats.pendingOrders || 0,
            icon: '⏳',
            color: 'yellow',
            bgGradient: 'from-yellow-500 to-yellow-600'
        }
    ];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    📊 Admin Dashboard
                </h1>
                <p className="text-gray-600">
                    Welcome back! Here's a summary of your platform statistics.
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
                            <p className="text-xs text-gray-500">Real-time data</p>
                        </div>
                    </div>
                ))}
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

export default AdminDashboard;
