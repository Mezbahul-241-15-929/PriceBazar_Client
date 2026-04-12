import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useParams } from 'react-router';
import toast from 'react-hot-toast';

const CheckoutForm = () => {
    const { id } = useParams();
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState('');

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
                <p className="text-gray-600 mb-4">Product ID: {id}</p>

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
                        Pay Now
                    </button>
                    {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
                </form>
            </div>
        </div>
    );
};

const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default Payment;
