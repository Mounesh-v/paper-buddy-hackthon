import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../Theme/colors";
import { spacing } from "../Theme/spacing";
import { typography } from "../Theme/typography";

const HomeScreen = () => {
  const quickActions = [
    {
      id: 1,
      icon: "📝",
      title: "Assignments",
      subtitle: "3 pending",
      color: "#EEF2FF",
      iconColor: colors.primary,
    },
    {
      id: 2,
      icon: "✓",
      title: "Attendance",
      subtitle: "94% present",
      color: "#ECFDF5",
      iconColor: colors.success,
    },
    {
      id: 3,
      icon: "📊",
      title: "Progress",
      subtitle: "View report",
      color: "#F5F3FF",
      iconColor: colors.secondary,
    },
    {
      id: 4,
      icon: "📚",
      title: "Exams",
      subtitle: "2 upcoming",
      color: "#FFF7ED",
      iconColor: colors.warning,
    },
  ];

  const recentUpdates = [
    {
      id: 1,
      icon: "📝",
      title: "New Assignment",
      description: "Mathematics assignment has been posted.",
      time: "10 min ago",
      background: "#EEF2FF",
    },
    {
      id: 2,
      icon: "📢",
      title: "School Announcement",
      description: "Annual Sports Day registration is open.",
      time: "2 hrs ago",
      background: "#FFF7ED",
    },
    {
      id: 3,
      icon: "💬",
      title: "Message from Teacher",
      description: "Mrs. Sharma sent you a new message.",
      time: "Yesterday",
      background: "#F5F3FF",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =========================================
            HEADER
        ========================================= */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>P</Text>
            </View>

            <View>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.parentName}>Priya 👋</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>

            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* =========================================
            CHILD PROFILE CARD
        ========================================= */}
        <View style={styles.studentCard}>
          <View style={styles.studentTop}>
            <View style={styles.studentAvatar}>
              <Text style={styles.studentAvatarText}>A</Text>
            </View>

            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>Arjun Sharma</Text>

              <Text style={styles.studentClass}>
                Class 6 - A
              </Text>

              <Text style={styles.schoolName}>
                Green Valley Public School
              </Text>
            </View>
          </View>

          <View style={styles.studentDivider} />

          <View style={styles.studentStats}>
            <View style={styles.studentStat}>
              <Text style={styles.statValue}>94%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.studentStat}>
              <Text style={styles.statValue}>A</Text>
              <Text style={styles.statLabel}>Performance</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.studentStat}>
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Class Rank</Text>
            </View>
          </View>
        </View>

        {/* =========================================
            QUICK ACCESS
        ========================================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={styles.quickCard}
            >
              <View
                style={[
                  styles.quickIconContainer,
                  { backgroundColor: item.color },
                ]}
              >
                <Text
                  style={[
                    styles.quickIcon,
                    { color: item.iconColor },
                  ]}
                >
                  {item.icon}
                </Text>
              </View>

              <Text style={styles.quickTitle}>
                {item.title}
              </Text>

              <Text style={styles.quickSubtitle}>
                {item.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* =========================================
            UPCOMING EVENT
        ========================================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Upcoming
          </Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.eventCard}
        >
          <View style={styles.eventDate}>
            <Text style={styles.eventMonth}>MAY</Text>
            <Text style={styles.eventDay}>24</Text>
          </View>

          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>
              Parent-Teacher Meeting
            </Text>

            <Text style={styles.eventDescription}>
              Meet with your child's class teacher
            </Text>

            <View style={styles.eventMeta}>
              <Text style={styles.eventMetaText}>
                🕙 10:00 AM
              </Text>

              <Text style={styles.eventMetaText}>
                📍 School Campus
              </Text>
            </View>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* =========================================
            TODAY'S OVERVIEW
        ========================================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Today's Overview
          </Text>
        </View>

        <View style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <View
              style={[
                styles.overviewIcon,
                { backgroundColor: "#ECFDF5" },
              ]}
            >
              <Text>✓</Text>
            </View>

            <Text style={styles.overviewLabel}>
              Attendance
            </Text>

            <Text
              style={[
                styles.overviewValue,
                { color: colors.success },
              ]}
            >
              Present
            </Text>
          </View>

          <View style={styles.overviewDivider} />

          <View style={styles.overviewItem}>
            <View
              style={[
                styles.overviewIcon,
                { backgroundColor: "#EEF2FF" },
              ]}
            >
              <Text>📚</Text>
            </View>

            <Text style={styles.overviewLabel}>
              Classes
            </Text>

            <Text style={styles.overviewValue}>
              6
            </Text>
          </View>

          <View style={styles.overviewDivider} />

          <View style={styles.overviewItem}>
            <View
              style={[
                styles.overviewIcon,
                { backgroundColor: "#F5F3FF" },
              ]}
            >
              <Text>📝</Text>
            </View>

            <Text style={styles.overviewLabel}>
              Assignments
            </Text>

            <Text style={styles.overviewValue}>
              2
            </Text>
          </View>
        </View>

        {/* =========================================
            RECENT UPDATES
        ========================================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Updates
          </Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.updatesCard}>
          {recentUpdates.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              style={[
                styles.updateItem,
                index !== recentUpdates.length - 1 &&
                  styles.updateBorder,
              ]}
            >
              <View
                style={[
                  styles.updateIcon,
                  { backgroundColor: item.background },
                ]}
              >
                <Text>{item.icon}</Text>
              </View>

              <View style={styles.updateContent}>
                <View style={styles.updateTitleRow}>
                  <Text style={styles.updateTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.updateTime}>
                    {item.time}
                  </Text>
                </View>

                <Text
                  style={styles.updateDescription}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </View>

              <View style={styles.unreadDot} />
            </TouchableOpacity>
          ))}
        </View>

        {/* =========================================
            AI ASSISTANT
        ========================================= */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.aiCard}
        >
          <View style={styles.aiIconContainer}>
            <Text style={styles.aiIcon}>✦</Text>
          </View>

          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>
              Ask School AI
            </Text>

            <Text style={styles.aiDescription}>
              Get quick answers about assignments,
              attendance, exams and school activities.
            </Text>
          </View>

          <Text style={styles.aiArrow}>›</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },

  /* =========================================
     HEADER
  ========================================= */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  avatarText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "700",
  },

  greeting: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  parentName: {
    ...typography.title,
    color: colors.text,
    marginTop: 2,
  },

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  notificationIcon: {
    fontSize: 19,
  },

  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationBadgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: "700",
  },

  /* =========================================
     STUDENT CARD
  ========================================= */

  studentCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  studentTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  studentAvatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  studentAvatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.background,
  },

  studentInfo: {
    flex: 1,
  },

  studentName: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.background,
  },

  studentClass: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginTop: 3,
  },

  schoolName: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },

  studentDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: spacing.md,
  },

  studentStats: {
    flexDirection: "row",
    alignItems: "center",
  },

  studentStat: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.background,
  },

  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginTop: 3,
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  /* =========================================
     SECTION
  ========================================= */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },

  sectionTitle: {
    ...typography.title,
    color: colors.text,
  },

  seeAll: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },

  /* =========================================
     QUICK ACCESS
  ========================================= */

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  quickCard: {
    width: "48.2%",
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.sm,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  quickIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },

  quickIcon: {
    fontSize: 20,
  },

  quickTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  quickSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },

  /* =========================================
     EVENT
  ========================================= */

  eventCard: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  eventDate: {
    width: 52,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  eventMonth: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.primary,
  },

  eventDay: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 1,
  },

  eventContent: {
    flex: 1,
  },

  eventTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  eventDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  eventMeta: {
    flexDirection: "row",
    marginTop: 7,
    gap: 10,
  },

  eventMetaText: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  arrow: {
    fontSize: 28,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },

  /* =========================================
     TODAY OVERVIEW
  ========================================= */

  overviewCard: {
    backgroundColor: colors.background,
    borderRadius: 18,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  overviewItem: {
    flex: 1,
    alignItems: "center",
  },

  overviewIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  overviewLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  overviewValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginTop: 3,
  },

  overviewDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
  },

  /* =========================================
     RECENT UPDATES
  ========================================= */

  updatesCard: {
    backgroundColor: colors.background,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  updateItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },

  updateBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  updateIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  updateContent: {
    flex: 1,
  },

  updateTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  updateTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },

  updateTime: {
    fontSize: 9,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },

  updateDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },

  /* =========================================
     AI ASSISTANT
  ========================================= */

  aiCard: {
    backgroundColor: "#F5F3FF",
    borderRadius: 20,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },

  aiIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  aiIcon: {
    color: colors.background,
    fontSize: 22,
    fontWeight: "700",
  },

  aiContent: {
    flex: 1,
  },

  aiTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  aiDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 3,
  },

  aiArrow: {
    fontSize: 28,
    color: colors.secondary,
    marginLeft: spacing.sm,
  },

  bottomSpace: {
    height: spacing.xxl,
  },
});