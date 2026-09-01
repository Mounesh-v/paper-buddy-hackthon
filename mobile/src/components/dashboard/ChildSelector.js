import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChild } from '@/hooks/useChild';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { getInitials } from '@/utils/helpers';

export const ChildSelector = ({ style }) => {
  const { children: childrenList, activeChild, setActiveChild } = useChild();
  const [visible, setVisible] = useState(false);

  if (!childrenList || childrenList.length <= 1) return null;

  const getChildName = (child) => {
    return child.name || child.studentName || child.firstName || 'Student';
  };

  const getChildClass = (child) => {
    return child.className || child.class || child.grade || '';
  };

  const getChildSection = (child) => {
    return child.section || '';
  };

  const handleSelect = (child) => {
    setActiveChild(child);
    setVisible(false);
  };

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(getChildName(activeChild))}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {getChildName(activeChild)}
          </Text>
          <Text style={styles.classInfo} numberOfLines={1}>
            {getChildClass(activeChild)}
            {getChildSection(activeChild)
              ? ` - ${getChildSection(activeChild)}`
              : ''}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Child</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={childrenList}
              keyExtractor={(item, index) =>
                (item.id || item.studentId || index).toString()
              }
              renderItem={({ item }) => {
                const isActive =
                  (item.id || item.studentId) ===
                  (activeChild?.id || activeChild?.studentId);
                return (
                  <TouchableOpacity
                    style={[
                      styles.childItem,
                      isActive && styles.childItemActive,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <View
                      style={[
                        styles.childAvatar,
                        isActive && styles.childAvatarActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.childAvatarText,
                          isActive && styles.childAvatarTextActive,
                        ]}
                      >
                        {getInitials(getChildName(item))}
                      </Text>
                    </View>
                    <View style={styles.childInfo}>
                      <Text
                        style={[
                          styles.childName,
                          isActive && styles.childNameActive,
                        ]}
                      >
                        {getChildName(item)}
                      </Text>
                      <Text style={styles.childClass}>
                        {getChildClass(item)}
                        {getChildSection(item)
                          ? ` - ${getChildSection(item)}`
                          : ''}
                      </Text>
                    </View>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  classInfo: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
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
    maxHeight: '60%',
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
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  childItemActive: {
    backgroundColor: Colors.primary + '10',
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childAvatarActive: {
    backgroundColor: Colors.primary,
  },
  childAvatarText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  childAvatarTextActive: {
    color: Colors.white,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  childNameActive: {
    color: Colors.primary,
  },
  childClass: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default ChildSelector;
