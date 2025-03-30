// src/components/ui/Button.js
import React from 'react';
import { TouchableOpacity, ActivityIndicator, Text } from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  className = '',
  textClassName = '',
  ...props 
}) => {
  const getButtonStyles = () => {
    const baseClasses = 'py-3 px-4 rounded-lg flex-row justify-center items-center';
    
    if (disabled) {
      return `${baseClasses} bg-gray-300 ${className}`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-600 ${className}`;
      case 'secondary':
        return `${baseClasses} bg-gray-200 ${className}`;
      case 'accent':
        return `${baseClasses} bg-green-600 ${className}`;
      case 'outline':
        return `${baseClasses} border border-blue-600 ${className}`;
      default:
        return `${baseClasses} bg-blue-600 ${className}`;
    }
  };
  
  const getTextStyles = () => {
    const baseClasses = 'font-medium text-center';
    
    if (disabled) {
      return `${baseClasses} text-gray-500 ${textClassName}`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} text-white ${textClassName}`;
      case 'secondary':
        return `${baseClasses} text-gray-800 ${textClassName}`;
      case 'accent':
        return `${baseClasses} text-white ${textClassName}`;
      case 'outline':
        return `${baseClasses} text-blue-600 ${textClassName}`;
      default:
        return `${baseClasses} text-white ${textClassName}`;
    }
  };
  
  return (
    <TouchableOpacity
      className={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563EB' : '#FFFFFF'} />
      ) : (
        <Text className={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;