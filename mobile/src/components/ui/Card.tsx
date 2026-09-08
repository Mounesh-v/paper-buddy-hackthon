import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing } from '@/constants/colors';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'outlined';
}

export const Card: React.FC<CardProps> = ({ children, onPress, style, variant = 'default' }) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.card, variant === 'outlined' && styles.outlined, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default Card;
