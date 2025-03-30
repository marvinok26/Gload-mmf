// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import Typography from '../../components/ui/Typography';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { isValidEmail, isValidReferralCode } from '../../utils/validation.utils';

const RegisterScreen = ({ navigation, route }) => {
  const { register } = useAuth();
  const initialReferralCode = route.params?.referralCode || '';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState(initialReferralCode);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email || !isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (referralCode && !isValidReferralCode(referralCode)) {
      newErrors.referralCode = 'Invalid referral code format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await register(name, email, password, referralCode || null);
      
      if (!result.success) {
        setErrors({ general: result.error || 'Registration failed. Please try again.' });
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
          <View className="flex-1 px-5 py-6">
            {/* App Logo */}
            <View className="items-center mb-4">
              <Image 
                source={require('../../assets/images/logo.png')} 
                resizeMode="contain"
                className="w-20 h-20"
              />
            </View>
            
            {/* Register Form */}
            <View>
              <Typography variant="h1" className="text-center text-2xl font-bold text-slate-800 mb-2">Create Account</Typography>
              <Typography variant="body" className="text-center text-slate-500 mb-5">
                Sign up to start earning crypto profits
              </Typography>
              
              {errors.general && (
                <View className="mb-3 p-2 bg-red-50 rounded-lg border border-red-200">
                  <Typography className="text-red-600 text-sm">{errors.general}</Typography>
                </View>
              )}
              
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoCapitalize="words"
                error={errors.name}
                className="mb-3"
              />
              
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
                placeholder="Create a password"
                secureTextEntry
                error={errors.password}
                className="mb-3"
              />
              
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword}
                className="mb-3"
              />
              
              <Input
                label="Referral Code (Optional)"
                value={referralCode}
                onChangeText={setReferralCode}
                placeholder="Enter referral code if you have one"
                autoCapitalize="characters"
                error={errors.referralCode}
                className="mb-4"
              />
              
              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                className="bg-blue-600 rounded-lg py-3"
              />
              
              {/* Login Link */}
              <View className="flex-row justify-center mt-5">
                <Typography variant="body" className="text-slate-500">
                  Already have an account?
                </Typography>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Typography variant="body" className="text-blue-600 ml-1 font-medium">
                    Login
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

export default RegisterScreen;