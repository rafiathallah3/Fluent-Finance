import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface CustomTextProps extends TextProps {
  weight?: 'regular' | 'bold' | 'medium' | 'semiBold';
}

export function CustomText({ style, weight = 'regular', ...props }: CustomTextProps) {
  let fontFamily = 'Poppins-Regular';
  
  if (weight === 'bold') {
    fontFamily = 'Poppins-Bold';
  } else if (weight === 'medium') {
    fontFamily = 'Poppins-Medium';
  } else if (weight === 'semiBold') {
    fontFamily = 'Poppins-SemiBold';
  }

  return <Text style={[{ fontFamily }, style]} {...props} />;
}
