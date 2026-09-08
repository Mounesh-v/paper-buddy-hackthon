import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChild } from '@/hooks/useChild';
import { assignmentService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { formatDate, getTimeAgo } from '@/utils/helpers';

interface Assignment {
  id?: string;
  title?: string;
  name?: string;
  subject?: string;
  subjectName?: string;
  teacher?: string;
  teacherName?: string;
  status?: string;
  dueDate?: string;
  due_date?: string;
  marks?: number;
  totalMarks?: number;
  total_marks?: number;
}

export default function AssignmentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getChildId } = useChild();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = ['ALL', 'PENDING', 'SUBMITTED', 'OVERDUE'];

  const loadData = useCallback(async () => {
    const childId = getChildId();
    if (!childId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await assignmentService.getAssignments(childId as string);
      setAssignments(Array.isArray(data) ? data : data?.content || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getChildId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === 'ALL') return true;
    return a.status === activeTab;
  });

  const getStatusIcon = (status?: string): string => {
    switch (status) {
      case 'SUBMITTED':
        return 'checkmark-circle';
      case 'PENDING':
        return 'time';
      case 'OVERDUE':
        return 'alert-circle';
      default:
        return 'document-text';
    }
  };

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'SUBMITTED':
        return Colors.success;
      case 'PENDING':
        return Colors.warning;
      case 'OVERDUE':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading assignments..." />;
  }

  if (error && !assignments.length) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Assignments"
        onBack={() => router.back()}
      />

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
        {filteredAssignments.length === 0 ? (
          <EmptyState
            title="No assignments"
            message={`No ${activeTab.toLowerCase()} assignments found.`}
            icon="document-text-outline"
          />
        ) : (
          <View style={styles.list}>
            {filteredAssignments.map((assignment, index) => (
              <Card
                key={assignment.id || index}
                onPress={() => router.push(`/assignments/${assignment.id}` as any)}
                style={styles.assignmentCard}
              >
                <View style={styles.assignmentHeader}>
                  <View style={styles.assignmentIcon}>
                    <Ionicons
                      name={getStatusIcon(assignment.status) as any}
                      size={24}
                      color={getStatusColor(assignment.status)}
                    />
                  </View>
                  <View style={styles.assignmentInfo}>
                    <Text style={styles.assignmentTitle} numberOfLines={1}>
                      {assignment.title || assignment.name}
                    </Text>
                    <Text style={styles.assignmentSubject}>
                      {assignment.subject || assignment.subjectName}
                    </Text>
                  </View>
                  <StatusBadge status={assignment.status || ''} />
                </View>

                <View style={styles.assignmentMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="person-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>
                      {assignment.teacher || assignment.teacherName || 'Teacher'}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>
                      Due: {formatDate(assignment.dueDate || assignment.due_date)}
                    </Text>
                  </View>
                </View>

                {assignment.marks !== undefined && assignment.marks !== null && (
                  <View style={styles.marksContainer}>
                    <Text style={styles.marksLabel}>Marks:</Text>
                    <Text style={styles.marksValue}>
                      {assignment.marks}/{assignment.totalMarks || assignment.total_marks || '-'}
                    </Text>
                  </View>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
  },
  content: {
    padding: Spacing.md,
  },
  list: {
    gap: Spacing.sm,
  },
  assignmentCard: {
    marginBottom: Spacing.sm,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  assignmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  assignmentSubject: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  assignmentMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  marksLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  marksValue: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
});
