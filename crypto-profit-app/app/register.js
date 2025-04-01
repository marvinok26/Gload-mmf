// app/register.js
import React from 'react';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import { Stack } from 'expo-router';

export default function Register() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RegisterScreen />
    </>
  );
}