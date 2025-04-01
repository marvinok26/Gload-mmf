// src/components/miner/MinerSection.js
import React from 'react';
import { View } from 'react-native';
import Typography from '../ui/Typography';
import MinerCard from './MinerCard';
import Card from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';

const MinerSection = ({ title, description, miners, selectedMiner, onSelectMiner }) => {
  // Get section color based on title
  const getSectionColor = () => {
    if (title.toLowerCase().includes('basic')) {
      return 'border-blue-200 bg-blue-50';
    } else if (title.toLowerCase().includes('advanced')) {
      return 'border-purple-200 bg-purple-50';
    } else if (title.toLowerCase().includes('premium')) {
      return 'border-amber-200 bg-amber-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  // Get section icon based on title
  const getSectionIcon = () => {
    if (title.toLowerCase().includes('basic')) {
      return 'flash-outline';
    } else if (title.toLowerCase().includes('advanced')) {
      return 'trending-up-outline';
    } else if (title.toLowerCase().includes('premium')) {
      return 'diamond-outline';
    }
    return 'cube-outline';
  };

  // Get icon color based on title
  const getIconColor = () => {
    if (title.toLowerCase().includes('basic')) {
      return '#3B82F6'; // blue-500
    } else if (title.toLowerCase().includes('advanced')) {
      return '#8B5CF6'; // purple-500
    } else if (title.toLowerCase().includes('premium')) {
      return '#F59E0B'; // amber-500
    }
    return '#6B7280'; // gray-500
  };

  return (
    <View className="mb-6">
      <Card className={`rounded-xl overflow-hidden border ${getSectionColor()} mb-2`}>
        <View className="p-3">
          <View className="flex-row items-center mb-1">
            <Ionicons name={getSectionIcon()} size={20} color={getIconColor()} />
            <Typography variant="h2" className="text-lg font-semibold ml-2">{title}</Typography>
          </View>
          <Typography variant="caption" className="text-slate-600">{description}</Typography>
        </View>
      </Card>
      
      {miners.length > 0 ? (
        miners.map((miner) => (
          <MinerCard
            key={miner.minerId}
            miner={miner}
            selected={selectedMiner?.minerId === miner.minerId}
            onSelect={() => onSelectMiner(miner)}
          />
        ))
      ) : (
        <Typography variant="caption" className="text-center text-slate-500 mt-2">
          No miners available in this category
        </Typography>
      )}
    </View>
  );
};

export default MinerSection;