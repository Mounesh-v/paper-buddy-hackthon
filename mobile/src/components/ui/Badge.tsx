import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize } from '@/constants/colors';

interface BadgeProps {
  count?: number;
  variant?: 'error' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

interface StatusBadgeProps {
  status: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  variant = 'error',
  size = 'sm',
  style,
}) => {
  if (!count || count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View style={[styles.badge, styles[variant], size === 'sm' ? styles.size_sm : styles.size_md, style]}>
      <Text style={[styles.text, size === 'sm' ? styles.textSize_sm : styles.textSize_md]}>{displayCount}</Text>
    </View>
  );
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string }> = {
      PAID: { color: Colors.success, bg: Colors.successLight, label: 'Paid' },
      SUBMITTED: { color: Colors.success, bg: Colors.successLight, label: 'Submitted' },
      PRESENT: { color: Colors.success, bg: Colors.successLight, label: 'Present' },
      PENDING: { color: Colors.warning, bg: Colors.warningLight, label: 'Pending' },
      UPCOMING: { color: Colors.info, bg: Colors.infoLight, label: 'Upcoming' },
      OVERDUE: { color: Colors.error, bg: Colors.errorLight, label: 'Overdue' },
      ABSENT: { color: Colors.error, bg: Colors.errorLight, label: 'Absent' },
      LATE: { color: Colors.warning, bg: Colors.warningLight, label: 'Late' },
      GRADED: { color: Colors.info, bg: Colors.infoLight, label: 'Graded' },
      PARTIAL: { color: Colors.warning, bg: Colors.warningLight, label: 'Partial' },
    };
    return configs[status] || { color: Colors.textSecondary, bg: Colors.surfaceVariant, label: status };
  };

  const config = getStatusConfig(status);

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: config.bg },
        style,
      ]}
    >
      <Text style={[styles.statusText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    backgroundColor: Colors.error,
  },
  success: {
    backgroundColor: Colors.success,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  info: {
    backgroundColor: Colors.info,
  },
  size_sm: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
  },
  size_md: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 7,
  },
  text: {
    color: Colors.white,
    fontWeight: '700',
  },
  textSize_sm: {
    fontSize: 10,
  },
  textSize_md: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});

export default Badge;
