// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router'; // Import router from expo-router
import Typography from '../../components/ui/Typography';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { isValidEmail } from '../../utils/validation.utils';

const LoginScreen = () => { // Remove navigation prop
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email || !isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setErrors({ general: result.error || 'Login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="flex-1 justify-center px-5 py-6">
            {/* App Logo */}
            <View className="items-center mb-6">
              {/* Use a different image since .svg might not work directly */}
              <Image 
                source={require('../../../assets/images/logo.svg')} 
                resizeMode="contain"
                className="w-24 h-24"
              />
            </View>
            
            {/* Login Form */}
            <View>
              <Typography variant="h1" className="text-center text-2xl font-bold text-slate-800 mb-2">Welcome Back</Typography>
              <Typography variant="body" className="text-center text-slate-500 mb-6">
                Login to continue to your account
              </Typography>
              
              {errors.general && (
                <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Typography className="text-red-600 text-sm">{errors.general}</Typography>
                </View>
              )}
              
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                className="mb-3"
              />
              
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
                className="mb-4"
              />
              
              <Button
                title="Login"
                onPress={handleLogin}
                loading={loading}
                className="bg-blue-600 rounded-lg py-3"
              />
              
              {/* Register Link */}
              <View className="flex-row justify-center mt-6">
                <Typography variant="body" className="text-slate-500">
                  Don't have an account?
                </Typography>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Typography variant="body" className="text-blue-600 ml-1 font-medium">
                    Register
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;