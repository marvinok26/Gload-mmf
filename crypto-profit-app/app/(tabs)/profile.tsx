// app/(tabs)/profile.tsx
import React from 'react';
import { View } from 'react-native';
import ProfileScreen from '../../src/screens/main/ProfileScreen';

export default function TabThreeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ProfileScreen />
    </View>
  );
}