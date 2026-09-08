import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChild } from '@/hooks/useChild';
import { assignmentService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { formatDate } from '@/utils/helpers';

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
  submittedDate?: string;
  marks?: number;
  totalMarks?: number;
  grade?: string;
  description?: string;
  feedback?: string;
  attachments?: Array<{ name?: string; fileName?: string }>;
}

export default function AssignmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getChildId } = useChild();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssignment = async () => {
      const childId = getChildId();
      if (!childId || !id) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await assignmentService.getAssignment(childId as string, id as string);
        setAssignment(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load assignment');
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignment();
  }, [getChildId, id]);

  if (isLoading) {
    return <LoadingScreen message="Loading assignment..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => router.back()} />;
  }

  if (!assignment) {
    return <ErrorState message="Assignment not found" onRetry={() => router.back()} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Assignment Details"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.mainCard}>
          <View style={styles.header}>
            <Text style={styles.title}>{assignment.title || assignment.name}</Text>
            <StatusBadge status={assignment.status || ''} />
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Ionicons name="book-outline" size={18} color={Colors.primary} />
              <View>
                <Text style={styles.metaLabel}>Subject</Text>
                <Text style={styles.metaValue}>
                  {assignment.subject || assignment.subjectName}
                </Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={18} color={Colors.secondary} />
              <View>
                <Text style={styles.metaLabel}>Teacher</Text>
                <Text style={styles.metaValue}>
                  {assignment.teacher || assignment.teacherName || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={18} color={Colors.warning} />
              <View>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>
                  {formatDate(assignment.dueDate)}
                </Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={18} color={Colors.info} />
              <View>
                <Text style={styles.metaLabel}>Submitted</Text>
                <Text style={styles.metaValue}>
                  {assignment.submittedDate
                    ? formatDate(assignment.submittedDate)
                    : 'Not submitted'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {assignment.description && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{assignment.description}</Text>
          </Card>
        )}

        {assignment.marks !== undefined && assignment.marks !== null && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Marks</Text>
            <View style={styles.marksContainer}>
              <Text style={styles.marksValue}>
                {assignment.marks}/{assignment.totalMarks || '-'}
              </Text>
              {assignment.grade && (
                <Text style={styles.grade}>Grade: {assignment.grade}</Text>
              )}
            </View>
          </Card>
        )}

        {assignment.feedback && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Feedback</Text>
            <Text style={styles.feedback}>{assignment.feedback}</Text>
          </Card>
        )}

        {assignment.attachments != null && assignment.attachments.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            {assignment.attachments.map((attachment, index) => (
              <View key={index} style={styles.attachmentItem}>
                <Ionicons name="document-attach" size={18} color={Colors.primary} />
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {attachment.name || attachment.fileName}
                </Text>
              </View>
            ))}
          </Card>
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
    gap: Spacing.md,
  },
  mainCard: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  metaGrid: {
    gap: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  metaValue: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.text,
  },
  sectionCard: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  marksValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.primary,
  },
  grade: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  feedback: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  attachmentName: {
    fontSize: FontSize.sm,
    color: Colors.text,
    flex: 1,
  },
});
