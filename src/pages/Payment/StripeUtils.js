/**
 * Stripe Utility Functions
 * Handles Stripe payment operations
 */

/**
 * Create Payment Intent
 * @param {Object} stripeInstance - Stripe instance
 * @param {Object} axiosInstance - Axios instance for API calls
 * @param {number} amountInCents - Amount in cents
 * @param {string} productId - Product ID
 * @param {string} userEmail - User email
 * @returns {Promise<Object>} Payment intent response
 */
export const createPaymentIntent = async (
  stripeInstance,
  axiosInstance,
  amountInCents,
  productId,
  userEmail
) => {
  try {
    if (!amountInCents || amountInCents <= 0) {
      throw new Error('Invalid amount');
    }

    const response = await axiosInstance.post('/create-payment-intent', {
      amountInCents,
      product_id: productId,
      userEmail,
    });

    if (!response.data.clientSecret) {
      throw new Error('Failed to create payment intent');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Confirm Payment
 * @param {Object} stripeInstance - Stripe instance
 * @param {Object} paymentMethodDetails - Payment method details
 * @param {string} clientSecret - Client secret from payment intent
 * @param {string} productId - Product ID
 * @param {string} userEmail - User email
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Confirmation response
 */
export const confirmPayment = async (
  stripeInstance,
  paymentMethodDetails,
  clientSecret,
  productId,
  userEmail,
  productData,
  axiosInstance
) => {
  try {
    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripeInstance.confirmCardPayment(
      clientSecret,
      {
        payment_method: paymentMethodDetails,
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent.status === 'succeeded') {
      // Save order to database
      const orderResponse = await axiosInstance.post('/confirm-payment', {
        productId,
        userEmail,
        transactionId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        productData,
        paymentStatus: 'completed',
      });

      return {
        success: true,
        orderId: orderResponse.data.orderId,
        paymentIntent,
      };
    } else {
      throw new Error('Payment failed');
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

/**
 * Fetch Payment Methods
 * @param {Object} stripeInstance - Stripe instance
 * @param {string} customerEmail - Customer email
 * @returns {Promise<Array>} List of payment methods
 */
export const fetchPaymentMethods = async (stripeInstance, customerEmail) => {
  try {
    // This would require Stripe customer setup on the backend
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

/**
 * Format Amount for Display
 * @param {number} amountInCents - Amount in cents
 * @returns {string} Formatted amount
 */
export const formatAmount = (amountInCents) => {
  return (amountInCents / 100).toFixed(2);
};

/**
 * Validate Payment Details
 * @param {Object} cardElement - Card element from Stripe
 * @returns {Object} Validation result
 */
export const validatePaymentDetails = async (cardElement) => {
  try {
    if (!cardElement) {
      return { valid: false, error: 'Card element not found' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Handle Stripe Error
 * @param {Object} error - Stripe error object
 * @returns {string} User-friendly error message
 */
export const handleStripeError = (error) => {
  if (!error) return 'An unknown error occurred';

  const errorMessages = {
    card_error: 'Your card was declined.',
    rate_limit_error: 'Too many requests. Please try again later.',
    authentication_error: 'Authentication failed. Please check your credentials.',
    invalid_request_error: 'Invalid request. Please check your information.',
    api_error: 'API error occurred. Please try again later.',
    api_connection_error: 'Network error. Please check your connection.',
    cancelled_error: 'Request was cancelled.',
  };

  const message = errorMessages[error.type] || error.message;
  return message;
};
