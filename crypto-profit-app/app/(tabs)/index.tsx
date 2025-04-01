// app/(tabs)/index.tsx
import React from 'react';
import HomeScreen from '../../src/screens/main/HomeScreen';
import { useAuth } from '../../src/hooks/useAuth';
import { View, Text } from 'react-native';

export default function HomeTab() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return <HomeScreen />; 
}