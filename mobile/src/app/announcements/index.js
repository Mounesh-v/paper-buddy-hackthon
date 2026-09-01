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
import { announcementService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { formatDate, getTimeAgo } from '@/utils/helpers';

export default function AnnouncementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await announcementService.getAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
      case 'URGENT':
        return Colors.error;
      case 'MEDIUM':
        return Colors.warning;
      default:
        return Colors.info;
    }
  };

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading announcements..." />;
  }

  if (error && !announcements.length) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Announcements"
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
        {announcements.length === 0 ? (
          <EmptyState
            title="No announcements"
            message="School announcements will appear here."
            icon="megaphone-outline"
          />
        ) : (
          <View style={styles.list}>
            {announcements.map((announcement, index) => (
              <Card key={announcement.id || index} style={styles.announcementCard}>
                {announcement.priority && announcement.priority !== 'LOW' && (
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(announcement.priority) },
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {announcement.priority}
                    </Text>
                  </View>
                )}

                <Text style={styles.title}>{announcement.title}</Text>

                <Text style={styles.description} numberOfLines={3}>
                  {announcement.description || announcement.content}
                </Text>

                <View style={styles.footer}>
                  <View style={styles.authorInfo}>
                    <Ionicons name="person-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.author}>
                      {announcement.author || announcement.school || 'School Admin'}
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {getTimeAgo(announcement.publishDate || announcement.createdAt)}
                  </Text>
                </View>

                {announcement.attachments?.length > 0 && (
                  <View style={styles.attachments}>
                    <Ionicons name="attach" size={14} color={Colors.primary} />
                    <Text style={styles.attachmentCount}>
                      {announcement.attachments.length} attachment(s)
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
  content: {
    padding: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
  announcementCard: {
    marginBottom: Spacing.sm,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  priorityText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.white,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  author: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  attachments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  attachmentCount: {
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
});
