import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, LetterSpacing } from '@/constants/colors';

interface AttendanceCardProps {
  data?: {
    percentage?: number;
    presentDays?: number;
    absentDays?: number;
  };
  onPress?: () => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ data, onPress }) => {
  const percentage = data?.percentage || 0;
  const presentDays = data?.presentDays || 0;
  const absentDays = data?.absentDays || 0;
  const totalDays = presentDays + absentDays;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
        </View>
        <Text style={styles.title}>Attendance</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>
          <Text style={styles.percentageLabel}>Overall</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <View style={[styles.statDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.statLabel}>Present</Text>
            <Text style={styles.statValue}>{presentDays}</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.statDot, { backgroundColor: Colors.error }]} />
            <Text style={styles.statLabel}>Absent</Text>
            <Text style={styles.statValue}>{absentDays}</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.statDot, { backgroundColor: Colors.textMuted }]} />
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{totalDays}</Text>
          </View>
        </View>
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
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: LetterSpacing.tight,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageContainer: {
    alignItems: 'center',
  },
  percentage: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.primary,
  },
  percentageLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  stats: {
    flex: 1,
    marginLeft: Spacing.lg,
    gap: Spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default AttendanceCard;
