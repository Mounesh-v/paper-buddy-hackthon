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
import { academicsService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';

export default function AcademicsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getChildId } = useChild();

  const [academics, setAcademics] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
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
      const [academicsData, subjectsData, examsData] = await Promise.all([
        academicsService.getAcademics(childId),
        academicsService.getSubjects(childId),
        academicsService.getExams(childId),
      ]);

      setAcademics(academicsData);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : subjectsData?.content || []);
      setExams(Array.isArray(examsData) ? examsData : examsData?.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load academics');
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
    return <LoadingScreen message="Loading academics..." />;
  }

  if (error && !academics) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Academics"
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
        {academics && (
          <Card style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Ionicons name="school" size={24} color={Colors.primary} />
              <Text style={styles.overviewTitle}>Overall Performance</Text>
            </View>

            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>
                  {academics.average || academics.overallPercentage || 0}%
                </Text>
                <Text style={styles.overviewStatLabel}>Average</Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={[styles.overviewStatValue, { color: Colors.success }]}>
                  {academics.result || academics.status || 'N/A'}
                </Text>
                <Text style={styles.overviewStatLabel}>Result</Text>
              </View>
            </View>

            {academics.remark && (
              <View style={styles.remarkContainer}>
                <Text style={styles.remarkLabel}>Teacher's Remark:</Text>
                <Text style={styles.remarkText}>{academics.remark}</Text>
              </View>
            )}
          </Card>
        )}

        {subjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            {subjects.map((subject, index) => (
              <Card key={subject.id || index} style={styles.subjectCard}>
                <View style={styles.subjectHeader}>
                  <View style={styles.subjectIcon}>
                    <Ionicons name="book" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>
                      {subject.name || subject.subjectName}
                    </Text>
                    <Text style={styles.subjectTeacher}>
                      {subject.teacher || subject.teacherName || ''}
                    </Text>
                  </View>
                  <Text style={styles.subjectMarks}>
                    {subject.marks || subject.marksObtained || '-'}/
                    {subject.totalMarks || '-'}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {exams.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exams</Text>
            {exams.map((exam, index) => (
              <Card key={exam.id || index} style={styles.examCard}>
                <View style={styles.examHeader}>
                  <Text style={styles.examName}>{exam.name || exam.examName}</Text>
                  <Text style={styles.examDate}>{exam.date || exam.examDate}</Text>
                </View>
                {exam.marks && (
                  <Text style={styles.examMarks}>
                    Marks: {exam.marks}/{exam.totalMarks}
                  </Text>
                )}
                {exam.grade && (
                  <Text style={styles.examGrade}>Grade: {exam.grade}</Text>
                )}
              </Card>
            ))}
          </View>
        )}

        {subjects.length === 0 && exams.length === 0 && (
          <EmptyState
            title="No academic data"
            message="Academic information will appear here once available."
            icon="school-outline"
          />
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
  overviewCard: {
    marginBottom: Spacing.lg,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  overviewTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.primary,
  },
  overviewStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  remarkContainer: {
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  remarkLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  remarkText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  subjectCard: {
    marginBottom: Spacing.sm,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  subjectIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  subjectTeacher: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  subjectMarks: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  examCard: {
    marginBottom: Spacing.sm,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  examDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  examMarks: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  examGrade: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
});

