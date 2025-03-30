// src/components/wallet/BalanceDisplay.js
import React from 'react';
import { View } from 'react-native';
import Typography from '../ui/Typography';

const BalanceDisplay = ({ balance, todayProfit = 0 }) => {
  return (
    <View>
      <Typography variant="label" className="text-gray-500">
        Total Balance
      </Typography>
      <Typography className="text-3xl font-bold text-gray-800">
        {balance.toFixed(2)} USDT
      </Typography>
      {todayProfit > 0 && (
        <Typography className="text-green-600">
          +{todayProfit.toFixed(2)} USDT today
        </Typography>
      )}
    </View>
  );
};

export default BalanceDisplay;