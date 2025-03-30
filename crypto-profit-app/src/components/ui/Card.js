// src/components/ui/Card.js
import React from 'react';
import { View } from 'react-native';

const Card = ({ children, className = '', ...props }) => {
  return (
    <View 
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;