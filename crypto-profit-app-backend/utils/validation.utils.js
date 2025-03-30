// utils/validation.utils.js

/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password strength
   * - At least 6 characters
   */
  const isValidPassword = (password) => {
    return password && password.length >= 6;
  };
  
  /**
   * Validate USDT TRC20 address
   * - Starts with T
   * - 34 characters long
   * - Contains only alphanumeric characters
   */
  const isValidTrc20Address = (address) => {
    const trc20Regex = /^T[a-zA-Z0-9]{33}$/;
    return trc20Regex.test(address);
  };
  
  /**
   * Validate positive numeric amount
   */
  const isValidAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
  };
  
  /**
   * Validate referral code format
   * - 8 characters
   * - Uppercase alphanumeric
   */
  const isValidReferralCode = (code) => {
    const referralRegex = /^[A-Z0-9]{8}$/;
    return referralRegex.test(code);
  };
  
  module.exports = {
    isValidEmail,
    isValidPassword,
    isValidTrc20Address,
    isValidAmount,
    isValidReferralCode
  };