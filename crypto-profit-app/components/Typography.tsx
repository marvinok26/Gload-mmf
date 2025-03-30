// Create this file at components/Typography.tsx
import React from 'react';
import { Text, TextProps } from 'react-native';
import {ThemedText} from './ThemedText';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  className?: string;
}

export default function Typography({ 
  children, 
  variant = 'body', 
  className = '',
  style,
  ...props 
}: TypographyProps) {
  // Use the existing ThemedText component but adapt it to match our API
  return (
    <ThemedText
      style={[getVariantStyee(variant), style]}
      {...props}
    >
      {children}
    </ThemedText>
  );
}

function getVariantStyle(variant: string) {
  switch (variant) {
    case 'h1':
      return { fontSize: 24, fontWeight: 'bold' };
    case 'h2':
      return { fontSize: 20, fontWeight: '600' };
    case 'h3':
      return { fontSize: 18, fontWeight: '500' };
    case 'body':
      return { fontSize: 16 };
    case 'caption':
      return { fontSize: 14, color: '#666' };
    case 'label':
      return { fontSize: 14, fontWeight: '500' };
    default:
      return { fontSize: 16 };
  }
}