import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize } from '@/constants/colors';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export const LoadingOverlay: React.FC = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: '60%' }]} />
      <View style={[styles.skeletonLine, { width: '40%' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  skeletonCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
    width: '80%',
  },
});

export default LoadingScreen;
