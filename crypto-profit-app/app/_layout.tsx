import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { WalletProvider } from '../src/context/WalletContext';
import { MinerProvider } from '../src/context/MinerContext';
import "../global.css"; // Important: Keep this import

export default function RootLayout() {
  return (
    <AuthProvider>
      <WalletProvider>
        <MinerProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </MinerProvider>
      </WalletProvider>
    </AuthProvider>
  );
}
