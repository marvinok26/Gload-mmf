// src/components/miner/MinerStatusIndicator.js
import React from 'react';
import { View } from 'react-native';
import Typography from '../ui/Typography';

const MinerStatusIndicator = ({ active }) => {
  return (
    <View className={`flex-row items-center px-2 py-1 rounded-full ${active ? 'bg-green-100' : 'bg-gray-100'}`}>
      <View className={`w-2 h-2 rounded-full mr-1 ${active ? 'bg-green-500' : 'bg-gray-500'}`} />
      <Typography variant="caption" className={active ? 'text-green-700' : 'text-gray-700'}>
        {active ? 'Active' : 'Inactive'}
      </Typography>
    </View>
  );
};

export default MinerStatusIndicator;