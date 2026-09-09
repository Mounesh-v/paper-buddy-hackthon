import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, LetterSpacing } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/helpers';

interface FeesCardProps {
  data?: {
    outstanding?: number;
    totalOutstanding?: number;
    nextDueDate?: string;
    dueDate?: string;
    status?: string;
  };
  onPress?: () => void;
}

export const FeesCard: React.FC<FeesCardProps> = ({ data, onPress }) => {
  const outstanding = data?.outstanding || data?.totalOutstanding || 0;
  const dueDate = data?.nextDueDate || data?.dueDate || '';
  const status = data?.status || (outstanding > 0 ? 'PENDING' : 'PAID');

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="wallet" size={24} color={Colors.warning} />
        </View>
        <Text style={styles.title}>Fees</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: status === 'PAID' ? Colors.successLight : Colors.warningLight },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: status === 'PAID' ? Colors.success : Colors.warning },
            ]}
          >
            {status === 'PAID' ? 'Paid' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Outstanding</Text>
          <Text
            style={[
              styles.amount,
              outstanding > 0 && styles.amountPending,
            ]}
          >
            {formatCurrency(outstanding)}
          </Text>
        </View>

        {dueDate && outstanding > 0 && (
          <View style={styles.dueDateContainer}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.dueDateLabel}>Due: {formatDate(dueDate)}</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.warningLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    letterSpacing: LetterSpacing.tight,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  content: {
    gap: Spacing.sm,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  amountLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  amount: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.success,
  },
  amountPending: {
    color: Colors.warning,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dueDateLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});

export default FeesCard;
