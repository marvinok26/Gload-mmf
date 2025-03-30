// app/(tabs)/index.tsx
import React from 'react';
import { View } from 'react-native';
import HomeScreen from '../../src/screens/main/HomeScreen';

export default function TabOneScreen() {
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
    </View>
  );
}