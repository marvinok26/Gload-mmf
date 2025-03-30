// src/utils/crypto.utils.js
import CryptoJS from 'react-native-crypto-js';

// Encrypt data
export const encryptData = (data, secretKey) => {
  try {
    const jsonData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonData, secretKey).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Decrypt data
export const decryptData = (encryptedData, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Generate random string
export const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};