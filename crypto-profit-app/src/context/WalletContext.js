// src/context/WalletContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from './AuthContext';
import * as walletService from '../services/wallet.service';

// Create the context
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { user, token, refreshUserData } = useContext(AuthContext);
  const [depositAddress, setDepositAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load deposit address when user is authenticated
  useEffect(() => {
    if (user && token) {
      loadDepositAddress();
    }
  }, [user, token]);
  
  // Get deposit address
  const loadDepositAddress = async () => {
    if (!user || !token) return;
    
    setLoading(true);
    try {
      const response = await walletService.getDepositAddress();
      
      if (response.success) {
        setDepositAddress(response.depositAddress);
      } else {
        setError(response.message || 'Failed to load deposit address');
      }
    } catch (error) {
      console.error('Error loading deposit address:', error);
      setError('Failed to load deposit address');
    } finally {
      setLoading(false);
    }
  };
  
  // Get transaction history
  const getTransactionHistory = async (type, page = 1, limit = 10) => {
    if (!user || !token) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    try {
      const response = await walletService.getTransactionHistory(type, page, limit);
      
      if (response.success) {
        setTransactions(response.transactions);
        return { success: true, transactions: response.transactions, pagination: response.pagination };
      } else {
        setError(response.message || 'Failed to load transaction history');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error loading transaction history:', error);
      setError('Failed to load transaction history');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Request withdrawal
  const requestWithdrawal = async (amount, address) => {
    if (!user || !token) return { success: false, error: 'Not authenticated' };
    
    if (!amount || amount <= 0) {
      return { success: false, error: 'Invalid withdrawal amount' };
    }
    
    if (!address) {
      return { success: false, error: 'Withdrawal address is required' };
    }
    
    setLoading(true);
    try {
      const response = await walletService.requestWithdrawal(amount, address);
      
      if (response.success) {
        // Refresh user data to update balance
        await refreshUserData();
        return { success: true, transaction: response.transaction };
      } else {
        setError(response.message || 'Withdrawal request failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      setError('Withdrawal request failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <WalletContext.Provider
      value={{
        depositAddress,
        transactions,
        loading,
        error,
        getTransactionHistory,
        requestWithdrawal,
        refreshDepositAddress: loadDepositAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};