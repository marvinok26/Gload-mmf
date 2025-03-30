// src/components/miner/ProfitCounter.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Typography from '../ui/Typography';

const ProfitCounter = ({ profit = 0, miningPower = 0 }) => {
  const [displayedProfit, setDisplayedProfit] = useState(profit);
  const [tickerActive, setTickerActive] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Initialize ticker
  useEffect(() => {
    if (miningPower > 0) {
      setTickerActive(true);
      startTicker();
    } else {
      setTickerActive(false);
      setDisplayedProfit(profit);
    }
    
    return () => setTickerActive(false);
  }, [profit, miningPower]);
  
  // Profit ticker simulation
  const startTicker = () => {
    if (!tickerActive) return;
    
    // Calculate tiny increment per second
    const dailyProfit = profit;
    const incrementPerSecond = dailyProfit / (24 * 60 * 60);
    
    // Update every 5 seconds
    const interval = setInterval(() => {
      if (!tickerActive) {
        clearInterval(interval);
        return;
      }
      
      setDisplayedProfit(prev => {
        const newValue = prev + (incrementPerSecond * 5);
        return parseFloat(newValue.toFixed(6));
      });
      
      // Flash animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ]).start();
      
    }, 5000);
    
    return () => clearInterval(interval);
  };

  return (
    <View className="mt-2">
      <Typography variant="label" className="mb-1">Today's Earnings</Typography>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Typography className="text-2xl font-bold text-green-600">
          {displayedProfit.toFixed(6)} USDT
        </Typography>
      </Animated.View>
      
      <View className="mt-2 flex-row items-center justify-between">
        <Typography variant="caption" className="text-gray-500">
          Mining Power: {miningPower.toFixed(2)}
        </Typography>
        <Typography variant="caption" className="text-gray-500">
          Estimated daily: {profit.toFixed(2)} USDT
        </Typography>
      </View>
      
      {miningPower === 0 && (
        <Typography variant="caption" className="text-yellow-600 mt-2">
          You don't have any active miners. Purchase a miner to start earning!
        </Typography>
      )}
    </View>
  );
};

export default ProfitCounter;