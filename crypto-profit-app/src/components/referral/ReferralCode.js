// src/components/referral/ReferralCode.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';

const ReferralCode = ({ code, totalReferrals = 0, totalEarnings = 0 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (code) {
      await Clipboard.setStringAsync(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShare = async () => {
    if (code) {
      try {
        await Share.share({
          message: `Join Crypto Profit App and start earning! Use my referral code: ${code}`
        });
      } catch (error) {
        console.error('Error sharing code:', error);
      }
    }
  };

  return (
    <View className="w-full">
      <Typography variant="h2" className="mb-2">Referral Program</Typography>
      
      <View className="flex-row mb-4">
        <View className="flex-1 mr-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <Typography variant="label">Total Referrals</Typography>
          <Typography variant="h3">{totalReferrals}</Typography>
        </View>
        <View className="flex-1 ml-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <Typography variant="label">Total Earnings</Typography>
          <Typography variant="h3">{totalEarnings.toFixed(2)} USDT</Typography>
        </View>
      </View>
      
      <Typography variant="label" className="mb-2">Your Referral Code</Typography>
      
      <View className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
        <View className="flex-row items-center justify-between">
          <Typography className="text-xl font-bold text-blue-700">
            {code || 'Loading...'}
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
        title="Share Referral Code" 
        onPress={handleShare}
        disabled={!code}
        className="mb-2"
      />
      
      <View className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
        <Typography variant="body" className="text-blue-800 mb-1">
          How it works:
        </Typography>
        <Typography variant="caption" className="text-blue-800">
          Share your referral code and earn 10% commission on your referrals' first miner purchase!
        </Typography>
      </View>
    </View>
  );
};

export default ReferralCode;