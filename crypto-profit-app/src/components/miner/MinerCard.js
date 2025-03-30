// src/components/miner/MinerCard.js
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';

const MinerCard = ({ miner, selected, onSelect }) => {
  return (
    <TouchableOpacity onPress={onSelect}>
      <Card 
        className={`mb-3 border-2 ${selected ? 'border-blue-500' : 'border-transparent'}`}
      >
        <View className="p-4">
          <View className="flex-row justify-between items-center">
            <Typography variant="h3">{miner.name}</Typography>
            <View className={`px-2 py-1 rounded-full ${selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Typography 
                variant="caption" 
                className={selected ? 'text-blue-700' : 'text-gray-700'}
              >
                {miner.price} USDT
              </Typography>
            </View>
          </View>
          
          <Typography variant="body" className="my-2">{miner.description}</Typography>
          
          <View className="flex-row items-center mt-1">
            <Ionicons name="trending-up" size={16} color="#10B981" />
            <Typography variant="caption" className="text-green-600 ml-1">
              {(miner.profitRate * 100).toFixed(2)}% daily profit
            </Typography>
          </View>
          
          <View className="mt-3 flex-row items-center">
            {selected ? (
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
                <Typography className="text-blue-600 ml-1">Selected</Typography>
              </View>
            ) : (
              <Typography className="text-gray-500">Tap to select</Typography>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MinerCard;