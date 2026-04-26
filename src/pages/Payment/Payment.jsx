import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import { 
    createPaymentIntent, 
    confirmPayment, 
    handleStripeError 
} from './StripeUtils';

const CheckoutForm = ({ product }) => {
    const { product_id } = useParams();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    // Get the latest price from the prices array
    const getLatestPrice = () => {
        if (product && product.prices && product.prices.length > 0) {
            const latestPrice = product.prices[product.prices.length - 1];
            return parseFloat(latestPrice.price || 0);
        }
        return parseFloat(product?.price || 0);
    };

    const price = getLatestPrice();
    const amountInCents = Math.round(price * 100); // Convert to cents for Stripe

    // Create payment intent when component mounts
    React.useEffect(() => {
        const createIntent = async () => {
            try {
                const response = await createPaymentIntent(
                    stripe,
                    axiosSecure,
                    amountInCents,
                    product_id,
                    user?.email
                );
                setClientSecret(response.clientSecret);
            } catch (error) {
                const errorMsg = handleStripeError(error);
                setErrorMessage(errorMsg);
                toast.error(errorMsg);
            }
        };

        if (user?.email && amountInCents > 0) {
            createIntent();
        }
    }, [user?.email, amountInCents, product_id, stripe, axiosSecure]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            toast.error('Payment system is not ready. Please try again.');
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        try {
            const card = elements.getElement(CardElement);

            if (!card) {
                throw new Error('Card element not found');
            }

            // Create payment method
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            });

            if (error) {
                const errorMsg = handleStripeError(error);
                setErrorMessage(errorMsg);
                toast.error(errorMsg);
                setIsProcessing(false);
                return;
            }

            // Confirm payment
            const result = await confirmPayment(
                stripe,
                paymentMethod.id,
                clientSecret,
                product_id,
                user?.email,
                product,
                axiosSecure
            );

            if (result.success) {
                toast.success('Payment successful! Redirecting to your orders...');
                // Redirect to My Orders page after 2 seconds
                setTimeout(() => {
                    navigate('/dashboard/my-orders');
                }, 2000);
            }
        } catch (error) {
            const errorMsg = handleStripeError(error);
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
            console.error('Payment error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
                <p className="text-gray-500 text-sm mb-6">Secure payment powered by Stripe</p>
                
                {product && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-2">
                                    <strong>Product:</strong> {product.name || product.itemName}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <strong>Price:</strong> ৳{getLatestPrice().toFixed(2)}
                                </p>
                                {product.marketName && (
                                    <p className="text-gray-600 mb-2">
                                        <strong>Market:</strong> {product.marketName}
                                    </p>
                                )}
                            </div>
                            {product.image && (
                                <div className="flex-shrink-0">
                                    <img 
                                        src={product.image} 
                                        alt={product.name || product.itemName}
                                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/80?text=Product';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Details
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4 bg-white">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">{errorMessage}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!stripe || isProcessing}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin">
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                </div>
                                Processing...
                            </>
                        ) : (
                            <>Pay ৳{getLatestPrice().toFixed(2)}</>
                        )}
                    </button>

                    <p className="text-gray-500 text-xs text-center">
                        🔒 Your payment information is secure and encrypted
                    </p>
                </form>
            </div>
        </div>
    );
};

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);

const Payment = () => {
    const { product_id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { role, roleLoading } = useUserRole();

    // Fetch product data using TanStack Query
    const { data: product = null, isPending, error } = useQuery({
        queryKey: ['product', product_id],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL || 'https://price-bazar-server.vercel.app'}/api/products/${product_id}`);
                return response.data;
            } catch (err) {
                toast.error('Failed to load product');
                return null;
            }
        },
        enabled: !!product_id,
    });

    // Check if user is allowed to make payment (only regular users can buy)
    if (roleLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin">
                        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                    </div>
                    <p className="mt-4 text-gray-600 text-lg">Verifying user access...</p>
                </div>
            </div>
        );
    }

    // Only users can make purchases, not vendors or admins
    if (role && role !== 'user') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-5xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">
                        Only regular users can purchase products. {role === 'vendor' ? 'Vendors' : 'Admins'} cannot make purchases.
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin">
                        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                    </div>
                    <p className="mt-4 text-gray-600 text-lg">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg">Error loading product: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm product={product} />
        </Elements>
    );
};

export default Payment;
