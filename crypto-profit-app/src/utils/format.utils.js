// src/utils/format.utils.js

// Format currency
export const formatCurrency = (value, currency = 'USDT', decimals = 2) => {
    if (value === undefined || value === null) return `0 ${currency}`;
    
    const formattedValue = parseFloat(value).toFixed(decimals);
    return `${formattedValue} ${currency}`;
  };
  
  // Format percentage
  export const formatPercentage = (value, decimals = 2) => {
    if (value === undefined || value === null) return '0%';
    
    const formattedValue = parseFloat(value).toFixed(decimals);
    return `${formattedValue}%`;
  };
  
  // Format date
  export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString();
  };
  
  // Format time
  export const formatTime = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format datetime
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    return `${formatDate(date)} ${formatTime(date)}`;
  };
  
  // Truncate text
  export const truncateText = (text, maxLength = 20) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength)}...`;
  };
  
  // Format address for display (show first 6 and last 4 characters)
  export const formatAddress = (address) => {
    if (!address) return '';
    
    if (address.length <= 10) return address;
    
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };