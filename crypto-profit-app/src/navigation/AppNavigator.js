// src/navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/app.constants';

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [initializing, setInitializing] = useState(true);
  
  // Check if onboarding has been completed
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
        setOnboardingComplete(completed === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setInitializing(false);
      }
    };
    
    checkOnboarding();
  }, []);
  
  // Show loading indicator while checking auth and onboarding status
  if (loading || initializing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainNavigator />
      ) : (
        <AuthNavigator showOnboarding={!onboardingComplete} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;