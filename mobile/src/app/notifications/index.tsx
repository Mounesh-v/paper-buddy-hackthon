import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { notificationService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { getTimeAgo } from '@/utils/helpers';

interface Notification {
  id?: string;
  title?: string;
  message?: string;
  description?: string;
  type?: string;
  referenceId?: string;
  reference_id?: string;
  is_read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  created_at?: string;
  timestamp?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const result = await notificationService.getNotifications();
      const data = result?.data ?? result;
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // Silently fail
    }
  };

  const handleMarkAsRead = useCallback(async (notification: Notification) => {
    if (notification.is_read) return;

    try {
      await notificationService.markAsRead(notification.id!);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    } catch {
      // Silently fail
    }
  }, []);

  const getNotificationIcon = (type?: string): string => {
    switch (type) {
      case 'ATTENDANCE':
        return 'checkmark-circle';
      case 'FEE':
        return 'wallet';
      case 'ACADEMIC':
        return 'school';
      case 'ASSIGNMENT':
        return 'document-text';
      case 'EVENT':
        return 'calendar';
      case 'ANNOUNCEMENT':
        return 'megaphone';
      case 'MESSAGE':
        return 'chatbubble';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type?: string): string => {
    switch (type) {
      case 'ATTENDANCE':
        return Colors.success;
      case 'FEE':
        return Colors.warning;
      case 'ACADEMIC':
        return Colors.primary;
      case 'ASSIGNMENT':
        return Colors.secondary;
      case 'EVENT':
        return Colors.info;
      case 'ANNOUNCEMENT':
        return Colors.info;
      case 'MESSAGE':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
  };

  const handlePress = useCallback((notification: Notification) => {
    handleMarkAsRead(notification);

    if (notification.type && (notification.reference_id || notification.referenceId)) {
      switch (notification.type) {
        case 'ATTENDANCE':
          router.push('/attendance' as any);
          break;
        case 'FEE':
          router.push('/fees' as any);
          break;
        case 'ACADEMIC':
          router.push('/academics' as any);
          break;
        case 'ASSIGNMENT':
          router.push('/assignments' as any);
          break;
        case 'EVENT':
          router.push('/events' as any);
          break;
        case 'ANNOUNCEMENT':
          router.push('/announcements' as any);
          break;
        case 'MESSAGE':
          router.push('/messages' as any);
          break;
      }
    }
  }, [handleMarkAsRead, router]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const renderNotification = useCallback(({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.is_read && styles.unreadItem,
      ]}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getNotificationColor(item.type) + '15' },
        ]}
      >
        <Ionicons
          name={getNotificationIcon(item.type) as any}
          size={24}
          color={getNotificationColor(item.type)}
        />
      </View>

      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle} numberOfLines={1}>
          {item.title || item.message}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message || item.description}
        </Text>
        <Text style={styles.notificationTime}>
          {getTimeAgo(item.createdAt || item.created_at || item.timestamp)}
        </Text>
      </View>

      {!item.is_read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  ), [handlePress]);

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading notifications..." />;
  }

  if (error && !notifications.length) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        onBack={() => router.back()}
        rightAction={unreadCount > 0 ? handleMarkAllAsRead : undefined}
        rightIcon="checkmark-done-outline"
      />

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          message="You're all caught up!"
          icon="notifications-outline"
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderNotification}
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  unreadItem: {
    backgroundColor: Colors.primary + '05',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  notificationMessage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
});
