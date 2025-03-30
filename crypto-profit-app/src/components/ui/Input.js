// src/components/ui/Input.js
import React from 'react';
import { View, TextInput, Text } from 'react-native';

const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  className = '',
  labelClassName = '',
  inputClassName = '',
  ...props 
}) => {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className={`text-gray-700 mb-1 ${labelClassName}`}>
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 ${inputClassName}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;