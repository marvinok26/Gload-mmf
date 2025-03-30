// src/components/wallet/WithdrawForm.js
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import Typography from '../ui/Typography';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useWallet } from '../../hooks/useWallet';
import { useAuth } from '../../hooks/useAuth';

const WithdrawForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const { requestWithdrawal } = useWallet();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(amount) > (user?.balance || 0)) {
      newErrors.amount = 'Insufficient balance';
    }
    
    if (!address || address.trim().length < 10) {
      newErrors.address = 'Please enter a valid TRC20 address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdraw = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await requestWithdrawal(parseFloat(amount), address);
      
      if (result.success) {
        Alert.alert(
          'Withdrawal Requested',
          'Your withdrawal request has been submitted and is pending approval.'
        );
        setAmount('');
        setAddress('');
        if (onSuccess) onSuccess();
      } else {
        Alert.alert('Error', result.message || 'Failed to process withdrawal');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full">
      <Typography variant="h2" className="mb-4">Withdraw USDT</Typography>
      
      <Typography variant="body" className="mb-4">
        Available balance: <Typography className="font-bold">{user?.balance?.toFixed(2) || '0.00'} USDT</Typography>
      </Typography>
      
      <Input
        label="Amount (USDT)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter amount to withdraw"
        error={errors.amount}
      />
      
      <Input
        label="Destination Address (TRC20)"
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your TRC20 wallet address"
        error={errors.address}
      />
      
      <Button
        title="Request Withdrawal"
        onPress={handleWithdraw}
        loading={loading}
        disabled={loading || !(amount && address)}
        className="mt-2"
      />
      
      <View className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-4">
        <Typography variant="caption">
          Note: Withdrawals are processed manually within 24 hours. A minimum withdrawal amount of 10 USDT applies.
        </Typography>
      </View>
    </View>
  );
};

export default WithdrawForm;