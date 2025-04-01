// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { WalletProvider } from '../src/context/WalletContext';
import { MinerProvider } from '../src/context/MinerContext';
import { useAuth } from '../src/hooks/useAuth'; // Import the useAuth hook
import "../global.css"; // Important: Keep this import

// Auth protection component
function AuthenticationGuard({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (initializing) return;

    // Get the first segment to determine if user is in protected route
    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      // Redirect to login if trying to access protected routes
      router.replace('/login');
    }
  }, [isAuthenticated, initializing, segments, router]);

  return <>{children}</>;
}

// Root provider component without auth check
function RootLayout() {
  return (
    <AuthProvider>
      <WalletProvider>
        <MinerProvider>
          <RootLayoutNav />
        </MinerProvider>
      </WalletProvider>
    </AuthProvider>
  );
}

// Navigation with auth check
function RootLayoutNav() {
  return (
    <AuthenticationGuard>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthenticationGuard>
  );
}

export default RootLayout;