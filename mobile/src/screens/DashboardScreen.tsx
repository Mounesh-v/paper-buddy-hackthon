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
import { useAuth } from '@/hooks/useAuth';
import { useChild } from '@/hooks/useChild';
import { parentService } from '@/services/api';
import { ChildSelector } from '@/components/dashboard/ChildSelector';
import { AttendanceCard } from '@/components/dashboard/AttendanceCard';
import { AcademicsCard } from '@/components/dashboard/AcademicsCard';
import { FeesCard } from '@/components/dashboard/FeesCard';
import { AssignmentCard } from '@/components/dashboard/AssignmentCard';
import { QuickAction } from '@/components/dashboard/QuickAction';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { getInitials, getTimeAgo, formatCurrency } from '@/utils/helpers';

interface DashboardData {
  attendance?: {
    percentage?: number;
    presentDays?: number;
    absentDays?: number;
  };
  academics?: {
    average?: number;
    overallPercentage?: number;
    topSubject?: string;
    bestSubject?: string;
    result?: string;
    status?: string;
  };
  fees?: {
    outstanding?: number;
    totalOutstanding?: number;
    nextDueDate?: string;
    dueDate?: string;
    status?: string;
  };
  assignments?: {
    pending?: number;
    submitted?: number;
    overdue?: number;
  };
  upcomingEvents?: Array<{
    id?: string;
    title?: string;
    name?: string;
    date?: string;
    startDate?: string;
  }>;
  recentAnnouncements?: Array<{
    id?: string;
    title?: string;
    publishDate?: string;
    createdAt?: string;
  }>;
  unreadNotifications?: number;
}

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { activeChild, getChildId } = useChild();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    const childId = getChildId();
    if (!childId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await parentService.getDashboard(childId as string);
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getChildId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (activeChild) {
      loadDashboard();
    }
  }, [activeChild]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDashboard();
  };

  const getChildName = () => {
    if (!activeChild) return 'Student';
    return activeChild.name || activeChild.studentName || activeChild.firstName || 'Student';
  };

  const getChildClass = () => {
    if (!activeChild) return '';
    const cls = activeChild.className || activeChild.class || activeChild.grade || '';
    const sec = activeChild.section || '';
    return sec ? `${cls} - ${sec}` : cls;
  };

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (error && !dashboardData) {
    return <ErrorState message={error} onRetry={loadDashboard} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 100 },
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
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>
              Hello, {user?.name?.split(' ')[0] || 'Parent'} 👋
            </Text>
            <Text style={styles.subtitle}>Here's your child's overview</Text>
          </View>
          <View style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.text}
            />
            {dashboardData?.unreadNotifications != null && dashboardData.unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>
                  {dashboardData.unreadNotifications > 99
                    ? '99+'
                    : dashboardData.unreadNotifications}
                </Text>
              </View>
            )}
          </View>
        </View>

        <ChildSelector style={styles.childSelector} />

        <View style={styles.childHeader}>
          <View style={styles.childAvatar}>
            <Text style={styles.childAvatarText}>
              {getInitials(getChildName())}
            </Text>
          </View>
          <View style={styles.childInfo}>
            <Text style={styles.childName}>{getChildName()}</Text>
            <Text style={styles.childClass}>{getChildClass()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <QuickAction
          icon="checkmark-circle-outline"
          label="Attendance"
          onPress={() => router.push('/attendance' as any)}
          color={Colors.success}
        />
        <QuickAction
          icon="book-outline"
          label="Academics"
          onPress={() => router.push('/academics' as any)}
          color={Colors.primary}
        />
        <QuickAction
          icon="document-text-outline"
          label="Assignments"
          onPress={() => router.push('/assignments' as any)}
          color={Colors.secondary}
        />
        <QuickAction
          icon="wallet-outline"
          label="Fees"
          onPress={() => router.push('/fees' as any)}
          color={Colors.warning}
        />
      </View>

      <View style={styles.cards}>
        <AttendanceCard
          data={dashboardData?.attendance}
          onPress={() => router.push('/attendance' as any)}
        />

        <AcademicsCard
          data={dashboardData?.academics}
          onPress={() => router.push('/academics' as any)}
        />

        <FeesCard
          data={dashboardData?.fees}
          onPress={() => router.push('/fees' as any)}
        />

        <AssignmentCard
          data={dashboardData?.assignments}
          onPress={() => router.push('/assignments' as any)}
        />

        {dashboardData?.upcomingEvents != null && dashboardData.upcomingEvents.length > 0 && (
          <Card onPress={() => router.push('/events' as any)} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={20} color={Colors.info} />
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
            </View>
            {dashboardData.upcomingEvents.slice(0, 3).map((event, index) => (
              <View key={event.id || index} style={styles.eventItem}>
                <View style={styles.eventDot} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {event.title || event.name}
                  </Text>
                  <Text style={styles.eventDate}>
                    {getTimeAgo(event.date || event.startDate)}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {dashboardData?.recentAnnouncements != null && dashboardData.recentAnnouncements.length > 0 && (
          <Card
            onPress={() => router.push('/announcements' as any)}
            style={styles.sectionCard}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="megaphone" size={20} color={Colors.secondary} />
              <Text style={styles.sectionTitle}>Announcements</Text>
            </View>
            {dashboardData.recentAnnouncements.slice(0, 2).map((item, index) => (
              <View key={item.id || index} style={styles.announcementItem}>
                <Text style={styles.announcementTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.announcementDate}>
                  {getTimeAgo(item.publishDate || item.createdAt)}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  childSelector: {
    marginBottom: Spacing.md,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childAvatarText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  childClass: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cards: {
    gap: Spacing.xs,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.info,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  eventDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  announcementItem: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  announcementTitle: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  announcementDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
