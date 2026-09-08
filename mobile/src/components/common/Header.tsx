import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: () => void;
  rightIcon?: string;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  rightIcon,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.content}>
        <View style={styles.left}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightAction && (
          <TouchableOpacity onPress={rightAction} style={styles.rightButton}>
            <Ionicons name={(rightIcon as any) || 'ellipsis-horizontal'} size={22} color={Colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rightButton: {
    padding: Spacing.xs,
  },
});

export default Header;
