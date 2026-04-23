/**
 * Card Validation Utility
 * Validates Stripe card information
 */

export const validateCardNumber = (cardNumber) => {
    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    
    // Check if it's a valid number and length
    if (!/^\d{13,19}$/.test(cleanNumber)) {
        return { valid: false, error: 'Card number must be 13-19 digits' };
    }
    
    // Luhn algorithm validation
    if (!luhnCheck(cleanNumber)) {
        return { valid: false, error: 'Invalid card number' };
    }
    
    return { valid: true };
};

export const validateExpiryDate = (expiryDate) => {
    // Format: MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        return { valid: false, error: 'Expiry date must be MM/YY format' };
    }
    
    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    if (monthNum < 1 || monthNum > 12) {
        return { valid: false, error: 'Invalid month' };
    }
    
    // Check if card is expired
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        return { valid: false, error: 'Card has expired' };
    }
    
    return { valid: true };
};

export const validateCVC = (cvc) => {
    if (!/^\d{3,4}$/.test(cvc)) {
        return { valid: false, error: 'CVC must be 3-4 digits' };
    }
    return { valid: true };
};

export const validateCardholderName = (name) => {
    if (!name || name.trim().length < 3) {
        return { valid: false, error: 'Cardholder name must be at least 3 characters' };
    }
    return { valid: true };
};

/**
 * Luhn Algorithm for card number validation
 */
const luhnCheck = (cardNumber) => {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
};

export const getCardType = (cardNumber) => {
    const patterns = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    };
    
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    
    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cleanNumber)) {
            return type;
        }
    }
    
    return 'unknown';
};
