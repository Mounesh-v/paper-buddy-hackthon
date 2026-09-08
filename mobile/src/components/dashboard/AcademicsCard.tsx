import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize } from '@/constants/colors';

interface AcademicsCardProps {
  data?: {
    average?: number;
    overallPercentage?: number;
    topSubject?: string;
    bestSubject?: string;
    result?: string;
    status?: string;
  };
  onPress?: () => void;
}

export const AcademicsCard: React.FC<AcademicsCardProps> = ({ data, onPress }) => {
  const average = data?.average || data?.overallPercentage || 0;
  const topSubject = data?.topSubject || data?.bestSubject || '';
  const result = data?.result || data?.status || 'N/A';

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="book" size={24} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Academics</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.mainStat}>
          <Text style={styles.average}>{average}%</Text>
          <Text style={styles.averageLabel}>Average</Text>
        </View>

        <View style={styles.details}>
          {topSubject ? (
            <View style={styles.detailRow}>
              <Ionicons name="star" size={16} color={Colors.warning} />
              <Text style={styles.detailLabel}>Top Subject:</Text>
              <Text style={styles.detailValue}>{topSubject}</Text>
            </View>
          ) : null}
          <View style={styles.detailRow}>
            <Ionicons name="ribbon" size={16} color={Colors.secondary} />
            <Text style={styles.detailLabel}>Result:</Text>
            <Text style={styles.detailValue}>{result}</Text>
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
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainStat: {
    alignItems: 'center',
  },
  average: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.primary,
  },
  averageLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  details: {
    flex: 1,
    marginLeft: Spacing.lg,
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default AcademicsCard;
