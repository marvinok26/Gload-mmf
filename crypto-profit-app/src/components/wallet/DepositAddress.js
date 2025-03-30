// src/components/wallet/DepositAddress.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';

const DepositAddress = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShare = async () => {
    if (address) {
      try {
        await Share.share({
          message: `My USDT deposit address: ${address}`,
        });
      } catch (error) {
        console.error('Error sharing address:', error);
      }
    }
  };

  return (
    <View className="w-full">
      <Typography variant="label" className="mb-2">Your Deposit Address (USDT - TRC20)</Typography>
      
      <View className="items-center mb-4">
        {address ? (
          <View className="bg-white p-4 rounded-lg border border-gray-200">
            <QRCode
              value={address}
              size={200}
              backgroundColor="white"
              color="black"
            />
          </View>
        ) : (
          <View className="w-200 h-200 bg-gray-100 rounded-lg items-center justify-center">
            <Typography>Generating address...</Typography>
          </View>
        )}
      </View>
      
      <View className="bg-gray-50 rounded-lg p-2 mb-4 border border-gray-200">
        <View className="flex-row items-center justify-between">
          <Typography className="flex-1 text-xs" numberOfLines={1} ellipsizeMode="middle">
            {address || 'Loading...'}
          </Typography>
          <TouchableOpacity onPress={handleCopy} className="ml-2 p-2">
            <Ionicons 
              name={copied ? "checkmark" : "copy-outline"} 
              size={20} 
              color={copied ? "#10B981" : "#4B5563"}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <Button 
        title="Share Address" 
        variant="outline"
        onPress={handleShare}
        disabled={!address}
        className="mb-2"
      />
      
      <View className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-2">
        <Typography variant="caption" className="text-yellow-800">
          Important: Only send USDT on TRC20 network. Sending other currencies or using
          other networks may result in permanent loss of funds.
        </Typography>
      </View>
    </View>
  );
};

export default DepositAddress;