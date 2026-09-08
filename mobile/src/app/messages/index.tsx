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
import { messageService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { getTimeAgo, getInitials, truncate } from '@/utils/helpers';

interface Conversation {
  id?: string;
  name?: string;
  teacherName?: string;
  participantName?: string;
  updatedAt?: string;
  unreadCount?: number;
  lastMessage?: {
    content?: string;
    text?: string;
    createdAt?: string;
  };
}

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await messageService.getConversations();
      setConversations(Array.isArray(data) ? data : data?.content || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations');
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

  const renderConversation = useCallback(({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/messages/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {getInitials(item.name || item.teacherName || item.participantName)}
        </Text>
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {item.name || item.teacherName || item.participantName}
          </Text>
          <Text style={styles.conversationTime}>
            {getTimeAgo(item.lastMessage?.createdAt || item.updatedAt)}
          </Text>
        </View>

        <Text style={styles.conversationMessage} numberOfLines={1}>
          {item.lastMessage?.content || item.lastMessage?.text || 'No messages yet'}
        </Text>
      </View>

      {item.unreadCount != null && item.unreadCount > 0 && <Badge count={item.unreadCount} />}
    </TouchableOpacity>
  ), [router]);

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading messages..." />;
  }

  if (error && !conversations.length) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Messages"
        onBack={() => router.back()}
        rightAction={() => {}}
        rightIcon="create-outline"
      />

      {conversations.length === 0 ? (
        <EmptyState
          title="No conversations"
          message="Start a conversation with your child's teachers."
          icon="chatbubbles-outline"
        />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderConversation}
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  conversationContent: {
    flex: 1,
    gap: 4,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  conversationTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  conversationMessage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  separator: {
    height: Spacing.sm,
  },
});
