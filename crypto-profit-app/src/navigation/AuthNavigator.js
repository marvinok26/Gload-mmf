// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OnboardingScreen from '../screens/common/OnboardingScreen';

const Stack = createStackNavigator();

const AuthNavigator = ({ showOnboarding = false }) => {
  return (
    <Stack.Navigator
      initialRouteName={showOnboarding ? 'Onboarding' : 'Login'}
      screenOptions={{
        headerShown: false,
      }}
    >
      {showOnboarding && (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;