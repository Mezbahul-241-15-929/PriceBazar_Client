import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const VendorDashboard = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch vendor stats
    const { data: stats = {}, isPending, error } = useQuery({
        queryKey: ['vendorStats', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            try {
                const response = await axiosSecure.get(`/vendor-stats/${user.email}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching vendor stats:', error);
                toast.error('Failed to load vendor statistics');
                return {};
            }
        },
    });

    // Fetch vendor products
    const { data: products = [], isPending: productsLoading } = useQuery({
        queryKey: ['vendorProducts', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            try {
                const response = await axiosSecure.get(`/products?email=${user.email}`);
                return response.data || [];
            } catch (error) {
                console.error('Error fetching products:', error);
                return [];
            }
        },
    });

    if (isPending || productsLoading) {
        return (
            <div className="p-4 md:p-8">
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            </div>
        );
    }

    // Calculate pending products
    const pendingProducts = products.filter(p => p.status === 'pending').length;
    const approvedProducts = products.filter(p => p.status === 'approved').length;

    const statCards = [
        {
            label: 'Total Products',
            value: stats.totalProducts || 0,
            icon: '📦',
            bgGradient: 'from-blue-500 to-blue-600'
        },
        {
            label: 'Total Advertisements',
            value: stats.totalAdvertisements || 0,
            icon: '📢',
            bgGradient: 'from-purple-500 to-purple-600'
        },
        {
            label: 'Total Sales',
            value: `৳${(stats.totalSales || 0).toFixed(2)}`,
            icon: '💰',
            bgGradient: 'from-green-500 to-green-600'
        },
        {
            label: 'Orders Received',
            value: stats.totalOrdersReceived || 0,
            icon: '🛒',
            bgGradient: 'from-orange-500 to-orange-600'
        },
        {
            label: 'Approved Products',
            value: approvedProducts,
            icon: '✅',
            bgGradient: 'from-emerald-500 to-emerald-600'
        },
        {
            label: 'Pending Products',
            value: pendingProducts,
            icon: '⏳',
            bgGradient: 'from-yellow-500 to-yellow-600'
        }
    ];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    🏪 Vendor Dashboard
                </h1>
                <p className="text-gray-600">
                    Welcome, {user?.displayName || 'Vendor'}! Here's your business overview.
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
                            <p className="text-xs text-gray-500">Your current metrics</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📦 Your Recent Products</h2>
                {products.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">#</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Product</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Market</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Price</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {products.slice(0, 5).map((product, idx) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-600">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {product.image && (
                                                    <img src={product.image} alt={product.itemName} className="w-8 h-8 rounded object-cover" />
                                                )}
                                                <span className="font-medium text-gray-900">{product.itemName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{product.marketName}</td>
                                        <td className="px-4 py-3 font-semibold text-emerald-600">
                                            ৳{product.prices?.[product.prices.length - 1]?.price || '0'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                product.status === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">No products yet. Start by adding your first product!</p>
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

export default VendorDashboard;
