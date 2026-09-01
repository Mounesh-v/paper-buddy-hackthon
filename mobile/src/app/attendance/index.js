import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChild } from '@/hooks/useChild';
import { attendanceService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { formatDate } from '@/utils/helpers';

export default function AttendanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getChildId } = useChild();

  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    const childId = getChildId();
    if (!childId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const [attendanceData, summaryData] = await Promise.all([
        attendanceService.getAttendance(childId),
        attendanceService.getAttendanceSummary(childId),
      ]);

      setAttendance(Array.isArray(attendanceData) ? attendanceData : attendanceData?.content || []);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message || 'Failed to load attendance');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getChildId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading attendance..." />;
  }

  if (error && !attendance.length) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Attendance"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {summary && (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="pie-chart" size={24} color={Colors.primary} />
              <Text style={styles.summaryTitle}>Attendance Summary</Text>
            </View>

            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>
                  {summary.percentage || 0}%
                </Text>
                <Text style={styles.summaryStatLabel}>Overall</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatValue, { color: Colors.success }]}>
                  {summary.presentDays || 0}
                </Text>
                <Text style={styles.summaryStatLabel}>Present</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatValue, { color: Colors.error }]}>
                  {summary.absentDays || 0}
                </Text>
                <Text style={styles.summaryStatLabel}>Absent</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatValue, { color: Colors.warning }]}>
                  {summary.lateDays || 0}
                </Text>
                <Text style={styles.summaryStatLabel}>Late</Text>
              </View>
            </View>
          </Card>
        )}

        {attendance.length === 0 ? (
          <EmptyState
            title="No attendance data"
            message="Attendance records will appear here once available."
            icon="calendar-outline"
          />
        ) : (
          <View style={styles.list}>
            <Text style={styles.listTitle}>Recent Attendance</Text>
            {attendance.map((record, index) => (
              <Card key={record.id || index} style={styles.attendanceItem}>
                <View style={styles.attendanceHeader}>
                  <View style={styles.attendanceDate}>
                    <Ionicons name="calendar" size={16} color={Colors.textSecondary} />
                    <Text style={styles.dateText}>{formatDate(record.date)}</Text>
                  </View>
                  <StatusBadge status={record.status} />
                </View>
                {record.remark && (
                  <Text style={styles.remark}>{record.remark}</Text>
                )}
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.primary,
  },
  summaryStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  list: {
    gap: Spacing.sm,
  },
  listTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  attendanceItem: {
    marginBottom: Spacing.sm,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: '500',
  },
  remark: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
});