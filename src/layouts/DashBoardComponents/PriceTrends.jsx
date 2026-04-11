import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FaChartLine, FaArrowUp, FaArrowDown, FaBox } from 'react-icons/fa';
import { MdTrendingUp } from 'react-icons/md';
import toast from 'react-hot-toast';

const PriceTrends = () => {
    const [trackedItems, setTrackedItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trend, setTrend] = useState(null);

    useEffect(() => {
        fetchTrackedItems();
    }, []);

    const fetchTrackedItems = async () => {
        try {
            setLoading(true);
            // Fetch products from API
            const response = await axios.get('http://localhost:3000/products');
            const products = response.data;
            
            // Filter products with price history
            const itemsWithPrices = products.filter(p => p.prices && p.prices.length > 0);
            
            setTrackedItems(itemsWithPrices);
            
            if (itemsWithPrices.length > 0) {
                setSelectedItem(itemsWithPrices[0]);
                generateChartData(itemsWithPrices[0]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load tracked items');
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = (product) => {
        if (!product.prices || product.prices.length === 0) return;

        const sortedPrices = [...product.prices].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const data = sortedPrices.map(price => {
            const dateObj = new Date(price.date);
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            const seconds = String(dateObj.getSeconds()).padStart(2, '0');
            
            return {
                date: `${month}/${day} ${hours}:${minutes}:${seconds}`,
                price: parseInt(price.price),
                fullDate: price.date
            };
        });

        setChartData(data);
        calculateTrend(data);
    };

    const calculateTrend = (data) => {
        if (data.length < 2) {
            setTrend({ percentage: 0, direction: 'stable' });
            return;
        }

        const firstPrice = data[0].price;
        const lastPrice = data[data.length - 1].price;
        const percentageChange = ((lastPrice - firstPrice) / firstPrice) * 100;
        const direction = percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable';

        setTrend({ 
            percentage: Math.abs(percentageChange).toFixed(1), 
            direction,
            days: data.length
        });
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        generateChartData(item);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="inline-block animate-spin">
                        <FaChartLine className="text-4xl text-emerald-500" />
                    </div>
                    <p className="mt-4 text-gray-600 font-semibold">Loading price trends...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 p-6"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <p className="text-gray-600 text-base mb-2">View price trends:</p>
                    <p className="text-gray-600 text-base mb-4">Show graphs 📊 of price changes over days/weeks for tracked items.</p>
                    <h1 className="text-4xl font-bold text-gray-900">View Price Trends</h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Tracked Items Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-lg shadow-lg p-6 lg:col-span-1"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tracked Items</h2>
                        
                        <div className="space-y-3 max-h-screen overflow-y-auto">
                            {trackedItems.length > 0 ? (
                                trackedItems.map((item) => (
                                    <motion.button
                                        key={item._id}
                                        onClick={() => handleItemClick(item)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                                            selectedItem?._id === item._id
                                                ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        <img
                                            src={item.image || 'https://via.placeholder.com/40'}
                                            alt={item.itemName}
                                            className="w-8 h-8 rounded object-cover shrink-0"
                                        />
                                        <span className="font-semibold text-sm">{item.itemName}</span>
                                    </motion.button>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No tracked items</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Chart Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="lg:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden p-8"
                    >
                        {selectedItem ? (
                            <>
                                {/* Product Header */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-6 pb-6 border-b-2 border-gray-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                                                <span className="text-2xl">🥕</span>
                                                {selectedItem.itemName}
                                            </h2>
                                            <p className="text-gray-600 text-lg">{selectedItem.marketName}</p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Vendor: {selectedItem.vendorName}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Price History Chart */}
                                {chartData && chartData.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="mb-6"
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <MdTrendingUp className="text-blue-600 text-3xl" />
                                            📈 Price History Chart
                                        </h3>
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <ResponsiveContainer width="100%" height={400}>
                                                <LineChart data={chartData}>
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
                                                        name={`${selectedItem.itemName} Price`}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Trend Info */}
                                {trend && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                    >
                                        <p className="text-gray-700 text-lg font-bold">
                                            Trend: {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                                            {trend.percentage}% last {trend.days} days
                                        </p>
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-xl text-gray-500">Select an item to view price trends</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default PriceTrends;
