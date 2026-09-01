import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { Button } from '@/components/ui/Button';

export const ErrorState = ({
  message = 'Something went wrong',
  onRetry,
  icon = 'alert-circle-outline',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={64} color={Colors.error} />
      </View>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="primary"
          size="md"
        />
      )}
    </View>
  );
};

export const NetworkError = ({ onRetry }) => {
  return (
    <ErrorState
      message="No internet connection. Please check your network and try again."
      onRetry={onRetry}
      icon="wifi-outline"
    />
  );
};

export const ServerError = ({ onRetry }) => {
  return (
    <ErrorState
      message="Server is unavailable. Please try again later."
      onRetry={onRetry}
      icon="server-outline"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  iconContainer: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});

export default ErrorState;
