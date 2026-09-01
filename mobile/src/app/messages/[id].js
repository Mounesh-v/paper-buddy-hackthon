import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { messageService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { formatTime } from '@/utils/helpers';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const loadMessages = useCallback(async () => {
    try {
      setError(null);
      const data = await messageService.getMessages(id);
      setMessages(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      setIsSending(true);
      const sentMessage = await messageService.sendMessage(id, messageText);
      setMessages((prev) => [...prev, sentMessage]);
    } catch (err) {
      setNewMessage(messageText);
      setError(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const isOwnMessage = (message) => {
    return message.sender_id === user?.id || message.senderType === 'PARENT';
  };

  const renderMessage = ({ item }) => {
    const isOwn = isOwnMessage(item);

    return (
      <View
        style={[
          styles.messageBubble,
          isOwn ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isOwn ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {item.content || item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            isOwn ? styles.ownMessageTime : styles.otherMessageTime,
          ]}
        >
          {formatTime(item.createdAt || item.timestamp)}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingScreen message="Loading messages..." />;
  }

  if (error && !messages.length) {
    return <ErrorState message={error} onRetry={loadMessages} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Header title="Chat" onBack={() => router.back()} />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => (item.id || index).toString()}
        renderItem={renderMessage}
        contentContainerStyle={[
          styles.messageList,
          { paddingBottom: insets.bottom + 80 },
        ]}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newMessage.trim() || isSending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!newMessage.trim() || isSending}
        >
          <Ionicons
            name="send"
            size={20}
            color={newMessage.trim() ? Colors.white : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messageList: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  ownMessageText: {
    color: Colors.white,
  },
  otherMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  ownMessageTime: {
    color: Colors.white + '80',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: Colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.surfaceVariant,
  },
});
