import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChild } from '@/hooks/useChild';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { getInitials } from '@/utils/helpers';

export default function ChildrenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { children: childrenList, activeChild, setActiveChild } = useChild();

  const handleSelectChild = (child) => {
    setActiveChild(child);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Children"
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
        {childrenList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No children linked</Text>
            <Text style={styles.emptyMessage}>
              Contact your school to link your children to your account.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {childrenList.map((child, index) => {
              const isActive =
                (child.id || child.studentId) ===
                (activeChild?.id || activeChild?.studentId);

              return (
                <TouchableOpacity
                  key={child.id || child.studentId || index}
                  onPress={() => handleSelectChild(child)}
                  activeOpacity={0.7}
                >
                  <Card
                    style={[
                      styles.childCard,
                      isActive && styles.activeChildCard,
                    ]}
                  >
                    <View style={styles.childContent}>
                      <View
                        style={[
                          styles.childAvatar,
                          isActive && styles.activeChildAvatar,
                        ]}
                      >
                        <Text
                          style={[
                            styles.childAvatarText,
                            isActive && styles.activeChildAvatarText,
                          ]}
                        >
                          {getInitials(
                            child.name || child.studentName || child.firstName
                          )}
                        </Text>
                      </View>

                      <View style={styles.childInfo}>
                        <Text
                          style={[
                            styles.childName,
                            isActive && styles.activeChildName,
                          ]}
                        >
                          {child.name || child.studentName || child.firstName}
                        </Text>
                        <Text style={styles.childClass}>
                          {child.className || child.class || child.grade}
                          {child.section ? ` - ${child.section}` : ''}
                        </Text>
                        {child.roll_number || child.rollNumber && (
                          <Text style={styles.rollNumber}>
                            Roll #{child.roll_number || child.rollNumber}
                          </Text>
                        )}
                      </View>

                      {isActive && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={Colors.primary}
                        />
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
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
  childCard: {
    marginBottom: Spacing.sm,
  },
  activeChildCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  childContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  childAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeChildAvatar: {
    backgroundColor: Colors.primary,
  },
  childAvatarText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  activeChildAvatarText: {
    color: Colors.white,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  activeChildName: {
    color: Colors.primary,
  },
  childClass: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  rollNumber: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyMessage: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
