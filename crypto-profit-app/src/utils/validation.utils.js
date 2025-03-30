// src/utils/validation.utils.js

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate password - at least 6 characters
  export const isValidPassword = (password) => {
    return password && password.length >= 6;
  };
  
  // Validate TRC20 address
  export const isValidTrc20Address = (address) => {
    // TRC20 addresses start with 'T' and are 34 characters long
    return address && /^T[a-zA-Z0-9]{33}$/.test(address);
  };
  
  // Validate amount - positive number, max 2 decimal places
  export const isValidAmount = (amount) => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return false;
    }
    
    // Check decimal places
    const decimalStr = amount.toString().split('.')[1];
    if (decimalStr && decimalStr.length > 2) {
      return false;
    }
    
    return true;
  };
  
  // Validate referral code - 8 character alphanumeric
  export const isValidReferralCode = (code) => {
    return code && /^[A-Z0-9]{8}$/.test(code);
  };