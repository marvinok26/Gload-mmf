// app/login.js
import React from 'react';
import LoginScreen from '../src/screens/auth/LoginScreen';
import { Stack } from 'expo-router';

export default function Login() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginScreen />
    </>
  );
}