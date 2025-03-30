// src/components/ui/Typography.js
import React from 'react';
import { Text } from 'react-native';

const Typography = ({ 
  children, 
  variant = 'body', 
  className = '',
  ...props 
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'h1':
        return `text-2xl font-bold text-gray-900 ${className}`;
      case 'h2':
        return `text-xl font-semibold text-gray-800 ${className}`;
      case 'h3':
        return `text-lg font-medium text-gray-800 ${className}`;
      case 'body':
        return `text-base text-gray-700 ${className}`;
      case 'caption':
        return `text-sm text-gray-500 ${className}`;
      case 'label':
        return `text-sm font-medium text-gray-600 ${className}`;
      default:
        return `text-base text-gray-700 ${className}`;
    }
  };
  
  return (
    <Text className={getStyles()} {...props}>
      {children}
    </Text>
  );
};

export default Typography;