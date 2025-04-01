// src/components/miner/MinerCard.js
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';

const MinerCard = ({ miner, selected, onSelect }) => {
  // Determine miner tier based on price
  let tier = 'basic';
  if (miner.price >= 110) {
    tier = 'premium';
  } else if (miner.price >= 60) {
    tier = 'advanced';
  }

  // Get duration based on tier
  const getDuration = () => {
    if (tier === 'basic') return '1 month';
    if (tier === 'advanced') return '2 months';
    if (tier === 'premium') return '3 months';
    return '1 month';
  };

  // Get color scheme based on tier
  const getColors = () => {
    if (tier === 'basic') {
      return {
        bg: 'bg-blue-50',
        accent: 'bg-blue-500',
        text: 'text-blue-700'
      };
    } else if (tier === 'advanced') {
      return {
        bg: 'bg-purple-50',
        accent: 'bg-purple-500',
        text: 'text-purple-700'
      };
    } else {
      return {
        bg: 'bg-amber-50',
        accent: 'bg-amber-500',
        text: 'text-amber-700'
      };
    }
  };

  const colors = getColors();
  const profitPercentage = (miner.profitRate * 100).toFixed();
  const dailyProfit = (miner.price * miner.profitRate).toFixed(2);

  // Get miner image based on tier
  const getMinerImage = () => {
    if (tier === 'basic') {
      return require('../../assets/images/basic-miner.svg');
    } else if (tier === 'advanced') {
      return require('../../assets/images/advanced-miner.svg');
    } else {
      return require('../../assets/images/premium-miner.svg');
    }
  };

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <Card 
        className={`mb-3 border ${selected ? 'border-blue-500 border-2' : 'border-slate-200'} rounded-xl shadow-sm overflow-hidden`}
      >
        <View className="flex-row">
          {/* Left side - Miner Image */}
          <View className={`w-28 items-center justify-center p-3 ${colors.bg}`}>
            <Image 
              source={getMinerImage()}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
            <View className={`absolute top-2 left-2 px-2 py-1 rounded-full ${colors.accent}`}>
              <Typography variant="caption" className="text-white text-xs font-bold">
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Typography>
            </View>
          </View>
          
          {/* Right side - Details */}
          <View className="flex-1 p-3">
            <View className="flex-row justify-between items-center">
              <Typography variant="h3" className="font-semibold">{miner.name}</Typography>
              <Typography variant="caption" className={`font-bold ${colors.text}`}>
                ${miner.price} USDT
              </Typography>
            </View>
            
            <View className="mt-1">
              <Typography variant="caption" className="text-slate-600 text-xs">
                Duration: {getDuration()}
              </Typography>
            </View>
            
            <View className="flex-row items-center mt-1">
              <Ionicons name="trending-up" size={16} color="#10B981" />
              <Typography variant="caption" className="text-green-600 ml-1 font-medium">
                {profitPercentage}% daily profit
              </Typography>
            </View>
            
            <Typography variant="caption" className="text-green-700 text-xs mt-1">
              Est. ${dailyProfit}/day
            </Typography>
            
            {selected && (
              <View className="flex-row items-center mt-2">
                <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />
                <Typography className="text-blue-600 ml-1 text-xs font-medium">Selected</Typography>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MinerCard;