import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Alert,
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
import { getTimeAgo, getInitials } from '@/utils/helpers';

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [conversations, setConversations] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [composeVisible, setComposeVisible] = useState(false);
  const [composeLoading, setComposeLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await messageService.getConversations();
      setConversations(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCompose = async () => {
    setComposeVisible(true);
    try {
      const data = await messageService.getTeachers();
      setTeachers(Array.isArray(data) ? data : []);
    } catch {
      setTeachers([]);
    }
  };

  const handleStartConversation = async (teacher) => {
    try {
      setComposeLoading(true);
      const conversation = await messageService.createConversation({
        participantIds: [teacher.id],
      });
      setComposeVisible(false);
      router.push(`/messages/${conversation.id}`);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to start conversation.');
    } finally {
      setComposeLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/messages/${item.id}`)}
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
            {getTimeAgo(item.lastMessage?.createdAt || item.lastMessage?.created_at || item.updatedAt)}
          </Text>
        </View>

        <Text style={styles.conversationMessage} numberOfLines={1}>
          {item.lastMessage?.content || item.lastMessage?.text || 'No messages yet'}
        </Text>
      </View>

      {item.unreadCount > 0 && <Badge count={item.unreadCount} />}
    </TouchableOpacity>
  );

  const renderTeacher = ({ item }) => (
    <TouchableOpacity
      style={styles.teacherItem}
      onPress={() => handleStartConversation(item)}
      activeOpacity={0.7}
      disabled={composeLoading}
    >
      <View style={styles.teacherAvatar}>
        <Text style={styles.teacherAvatarText}>{getInitials(item.name)}</Text>
      </View>
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{item.name}</Text>
        <Text style={styles.teacherEmail} numberOfLines={1}>
          {item.email}
        </Text>
      </View>
      <Ionicons name="chatbubble-outline" size={22} color={Colors.primary} />
    </TouchableOpacity>
  );

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
        rightAction={openCompose}
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

      <Modal
        visible={composeVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setComposeVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setComposeVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <TouchableOpacity onPress={() => setComposeVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Select a teacher to start a conversation
            </Text>

            {teachers.length === 0 ? (
              <EmptyState
                title="No teachers available"
                message="Teachers for your children will appear here."
                icon="people-outline"
              />
            ) : (
              <FlatList
                data={teachers}
                keyExtractor={(item, index) => (item.id || index).toString()}
                renderItem={renderTeacher}
                contentContainerStyle={styles.teacherList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  modalSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  teacherList: {
    padding: Spacing.md,
  },
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  teacherAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teacherAvatarText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  teacherEmail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
