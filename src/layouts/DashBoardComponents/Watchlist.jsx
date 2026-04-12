import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { FaBookmark, FaPlus, FaTrash, FaExclamationTriangle, FaShoppingBag } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const WatchlistPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [watchlistItems, setWatchlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [removing, setRemoving] = useState(false);

    console.log(user.uid)

    useEffect(() => {
        if (user && user.uid) {
            fetchWatchlist();
        } else {
            setLoading(false);
            toast.error('Please login to view watchlist');
        }
    }, [user?.uid]);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            console.log('📍 Fetching watchlist for user:', user.uid);

            // Step 1: Get watchlist with product IDs
            const watchlistResponse = await axios.get(
                `http://localhost:3000/api/watchlist/${user.uid}`
            );

            console.log('📦 Watchlist API Response:', watchlistResponse.data);

            const watchlist = watchlistResponse.data;

            // Check if watchlist exists and has products
            if (!watchlist || !watchlist.products || watchlist.products.length === 0) {
                console.log('ℹ️ Watchlist is empty');
                setWatchlistItems([]);
                setLoading(false);
                return;
            }

            console.log(`📦 Found ${watchlist.products.length} product IDs in watchlist`);

            // Step 2: Fetch full product details for each product ID
            const productsPromises = watchlist.products.map(productId => 
                axios.get(`http://localhost:3000/api/products/${productId}`)
                    .catch(err => {
                        console.error(`❌ Failed to fetch product ${productId}:`, err.message);
                        return null;
                    })
            );

            const productsResponses = await Promise.all(productsPromises);
            
            // Step 3: Extract product data and filter out failed requests
            const enrichedProducts = productsResponses
                .filter(response => response !== null)
                .map(response => ({
                    ...response.data,
                    addedDate: new Date(watchlist.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                }));

            console.log('✅ Loaded items:', enrichedProducts.length);
            console.log('📦 Enriched products:', enrichedProducts);

            if (enrichedProducts.length > 0) {
                setWatchlistItems(enrichedProducts);
                toast.success(`✅ Loaded ${enrichedProducts.length} item(s)`);
            } else {
                setWatchlistItems([]);
                toast.error('❌ Failed to load product details');
            }

        } catch (error) {
            console.error('❌ Error fetching watchlist:', error);
            toast.error('Failed to load watchlist');
            setWatchlistItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMore = () => {
        navigate('/products');
        toast.success('Navigate to All Products');
    };

    const handleRemoveClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleConfirmRemove = async () => {
        try {
            if (!user || !user.uid) {
                toast.error('User not authenticated');
                return;
            }

            setRemoving(true);
            console.log('🗑️ Removing product:', selectedItem._id);

            await axios.delete(
                `http://localhost:3000/api/watchlist/${user.uid}/${selectedItem._id}`
            );

            setWatchlistItems(
                watchlistItems.filter(item => item._id !== selectedItem._id)
            );

            setShowModal(false);
            setSelectedItem(null);
            toast.success('✅ Item removed from watchlist');
            console.log('✅ Item removed successfully');
        } catch (error) {
            console.error('❌ Error removing from watchlist:', error);
            toast.error('Failed to remove from watchlist');
        } finally {
            setRemoving(false);
        }
    };

    const handleCancelRemove = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    // Helper function to get the latest price with date and time
    const getLatestPriceInfo = (item) => {
        if (item.prices && item.prices.length > 0) {
            // Get the last price entry
            const latestPrice = item.prices[item.prices.length - 1];
            const price = parseFloat(latestPrice.price || 0);
            const date = new Date(latestPrice.date);
            const timeString = date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            return { price, timeString };
        }
        // Fallback to item.price if prices array not available
        return {
            price: parseFloat(item.price || 0),
            timeString: 'N/A'
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="inline-block animate-spin">
                        <FaBookmark className="text-4xl text-emerald-500" />
                    </div>
                    <p className="mt-4 text-gray-600 text-lg">Loading watchlist...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4"
        >
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <FaBookmark className="text-emerald-600 text-3xl" />
                        <h1 className="text-4xl font-bold text-gray-900">Manage Watchlist</h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Track and manage your favorite products
                    </p>
                </motion.div>

                {watchlistItems && watchlistItems.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">Product Name</th>
                                        <th className="px-6 py-4 text-left font-semibold">Market</th>
                                        <th className="px-6 py-4 text-left font-semibold">Price</th>
                                        <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {watchlistItems.map((item, index) => (
                                        <motion.tr
                                            key={item._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="border-b border-gray-200 hover:bg-emerald-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.image || 'https://via.placeholder.com/50'}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/50';
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">
                                                            {item.name || item.itemName || 'Unknown Product'}
                                                        </p>
                                                        {item.description && (
                                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    {item.marketName || 'N/A'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="font-bold text-lg text-emerald-600">
                                                    ৳{getLatestPriceInfo(item).price.toFixed(2)}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center">
                                                    <motion.button
                                                        onClick={() => handleRemoveClick(item)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                                                    >
                                                        <FaTrash size={14} />
                                                        Remove
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <motion.div
                            className="bg-emerald-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <p className="text-gray-700 font-semibold">
                                📦 Total Items: <span className="text-emerald-600">{watchlistItems.length}</span>
                            </p>
                            <motion.button
                                onClick={handleAddMore}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                <FaPlus size={16} />
                                Add More Products
                            </motion.button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-lg shadow-lg p-12 text-center"
                    >
                        <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Your Watchlist is Empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            You haven't added any items to your watchlist yet. Start exploring products now!
                        </p>
                        <motion.button
                            onClick={handleAddMore}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                        >
                            <FaShoppingBag />
                            Browse Products
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {showModal && selectedItem && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                            <FaExclamationTriangle className="text-red-600 text-xl" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Remove from Watchlist?
                        </h3>

                        <p className="text-gray-600 text-center mb-4">
                            Are you sure you want to remove{' '}
                            <span className="font-semibold">{selectedItem.name || selectedItem.itemName}</span> from
                            your watchlist?
                        </p>

                        <div className="flex gap-3">
                            <motion.button
                                onClick={handleCancelRemove}
                                disabled={removing}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                onClick={handleConfirmRemove}
                                disabled={removing}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {removing ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash />
                                        Remove
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default WatchlistPage;
