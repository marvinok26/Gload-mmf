// App.js
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { WalletProvider } from './src/context/WalletContext';
import { MinerProvider } from './src/context/MinerContext';
import AppNavigator from './src/navigation/AppNavigator';
import "./global.css"

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WalletProvider>
          <MinerProvider>
            <AppNavigator />
          </MinerProvider>
        </WalletProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}