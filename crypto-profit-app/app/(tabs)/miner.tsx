// app/(tabs)/miner.tsx
import React from 'react';
import { View } from 'react-native';
import MinerScreen from '../../src/screens/main/MinerScreen';

export default function TabTwoScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MinerScreen />
    </View>
  );
}