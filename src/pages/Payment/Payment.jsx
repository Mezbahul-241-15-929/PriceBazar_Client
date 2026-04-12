import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const CheckoutForm = ({ product }) => {
    const { product_id } = useParams();
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState('');

    // Get the latest price from the prices array
    const getLatestPrice = () => {
        if (product && product.prices && product.prices.length > 0) {
            const latestPrice = product.prices[product.prices.length - 1];
            return parseFloat(latestPrice.price || 0);
        }
        return parseFloat(product?.price || 0);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setErrorMessage(error.message);
            console.log('[error]', error);
            toast.error('Payment failed: ' + error.message);
        } else {
            setErrorMessage('');
            console.log('[PaymentMethod]', paymentMethod);
            toast.success('Payment successful!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h2>
                
                {product && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <p className="text-gray-600 mb-2"><strong>Product:</strong> {product.name || product.itemName}</p>
                                <p className="text-gray-600 mb-2"><strong>Price:</strong> ৳{getLatestPrice().toFixed(2)}</p>
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
                    <div className="border border-gray-300 rounded-lg p-4">
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

                    <button
                        type="submit"
                        disabled={!stripe}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Pay ৳{getLatestPrice().toFixed(2)}
                    </button>
                    {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
                </form>
            </div>
        </div>
    );
};

const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

const Payment = () => {
    const { product_id } = useParams();

    // Fetch product data using TanStack Query
    const { data: product = null, isPending, error } = useQuery({
        queryKey: ['product', product_id],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/api/products/${product_id}`);
            return response.data;
        },
        enabled: !!product_id,
    });

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
