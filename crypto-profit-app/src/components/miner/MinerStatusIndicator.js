// src/components/miner/MinerStatusIndicator.js
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Typography from '../ui/Typography';
import { Ionicons } from '@expo/vector-icons';

const MinerStatusIndicator = ({ active, progress = 0, onActivate }) => {
  const [currentProgress, setCurrentProgress] = useState(progress);
  
  // Update progress in real-time
  useEffect(() => {
    if (!active) return;
    
    // If progress is already at 100%, don't update
    if (progress >= 1) {
      setCurrentProgress(1);
      return;
    }
    
    // Initial progress from props
    setCurrentProgress(progress);
    
    // Update progress continuously
    const interval = setInterval(() => {
      setCurrentProgress(prev => {
        // Calculate new progress based on time passed (1 day = 24 hours = 86400 seconds)
        const progressPerSecond = 1 / 86400; // Full progress in 24 hours
        const newProgress = prev + progressPerSecond;
        
        // Cap at 1 (100%)
        return Math.min(newProgress, 1);
      });
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [active, progress]);
  
  // Progress is complete when reaches 100%
  const canActivate = currentProgress >= 1;
  const progressPercentage = Math.floor(currentProgress * 100);
  
  // Calculate remaining time
  const getRemainingTime = () => {
    if (canActivate) return 'Ready!';
    
    const remainingPercent = 100 - progressPercentage;
    const remainingSeconds = (remainingPercent / 100) * 86400; // 24 hours in seconds
    
    // Format remaining time
    if (remainingSeconds > 3600) {
      const hours = Math.floor(remainingSeconds / 3600);
      return `${hours}h remaining`;
    } else if (remainingSeconds > 60) {
      const minutes = Math.floor(remainingSeconds / 60);
      return `${minutes}m remaining`;
    } else {
      return `<1m remaining`;
    }
  };
  
  return (
    <View className="flex-col items-center">
      {/* Status indicator */}
      <View className={`flex-row items-center px-2 py-1 rounded-full ${active ? 'bg-green-100' : 'bg-gray-100'}`}>
        <View className={`w-2 h-2 rounded-full mr-1 ${active ? 'bg-green-500' : 'bg-gray-500'}`} />
        <Typography variant="caption" className={`${active ? 'text-green-700' : 'text-gray-700'} text-xs`}>
          {active ? 'Active' : 'Inactive'}
        </Typography>
      </View>
      
      {/* Progress bar - only show if active */}
      {active && (
        <View className="mt-2 w-full">
          {/* Progress percentage/time text */}
          <View className="flex-row justify-between mb-1">
            <Typography variant="caption" className="text-xs text-gray-600">
              {progressPercentage}%
            </Typography>
            <Typography variant="caption" className="text-xs text-gray-600">
              {getRemainingTime()}
            </Typography>
          </View>
          
          {/* Progress bar */}
          <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <View 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${Math.min(currentProgress * 100, 100)}%` }} 
            />
          </View>
          
          {/* Activation button - enabled when progress reaches 100% */}
          <TouchableOpacity 
            onPress={onActivate}
            disabled={!canActivate}
            className={`mt-2 py-2 px-4 rounded-lg self-center ${canActivate ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <View className="flex-row items-center">
              <Ionicons name="refresh" size={14} color="white" />
              <Typography variant="caption" className="text-white text-xs font-medium ml-1">
                {canActivate ? 'Activate Daily Bonus' : 'Wait for activation'}
              </Typography>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MinerStatusIndicator;