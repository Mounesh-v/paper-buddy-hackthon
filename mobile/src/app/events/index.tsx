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
import { eventService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { formatDate, groupByDate } from '@/utils/helpers';

interface SchoolEvent {
  id?: string;
  title?: string;
  name?: string;
  date?: string;
  time?: string;
  startTime?: string;
  description?: string;
  location?: string;
  type?: string;
}

export default function EventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await eventService.getEvents();
      setEvents(Array.isArray(data) ? data : data?.content || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
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

  const getEventIcon = (type?: string): string => {
    switch (type?.toUpperCase()) {
      case 'EXAM':
        return 'school';
      case 'HOLIDAY':
        return 'sunny';
      case 'PTM':
      case 'PARENT_TEACHER_MEETING':
        return 'people';
      case 'COMPETITION':
        return 'trophy';
      default:
        return 'calendar';
    }
  };

  const getEventColor = (type?: string): string => {
    switch (type?.toUpperCase()) {
      case 'EXAM':
        return Colors.error;
      case 'HOLIDAY':
        return Colors.success;
      case 'PTM':
      case 'PARENT_TEACHER_MEETING':
        return Colors.primary;
      case 'COMPETITION':
        return Colors.warning;
      default:
        return Colors.info;
    }
  };

  const groupedEvents = groupByDate(events, 'date');

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading events..." />;
  }

  if (error && !events.length) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Events"
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
        {events.length === 0 ? (
          <EmptyState
            title="No events"
            message="School events will appear here."
            icon="calendar-outline"
          />
        ) : (
          Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{formatDate(date)}</Text>
              {dateEvents.map((event, index) => (
                <Card key={event.id || index} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <View
                      style={[
                        styles.eventIcon,
                        { backgroundColor: getEventColor(event.type) + '15' },
                      ]}
                    >
                      <Ionicons
                        name={getEventIcon(event.type) as any}
                        size={20}
                        color={getEventColor(event.type)}
                      />
                    </View>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>
                        {event.title || event.name}
                      </Text>
                      <Text style={styles.eventTime}>
                        {event.time || event.startTime || 'All day'}
                      </Text>
                    </View>
                  </View>

                  {event.description && (
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      {event.description}
                    </Text>
                  )}

                  {event.location && (
                    <View style={styles.eventLocation}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color={Colors.textMuted}
                      />
                      <Text style={styles.locationText}>{event.location}</Text>
                    </View>
                  )}
                </Card>
              ))}
            </View>
          ))
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
  dateGroup: {
    marginBottom: Spacing.lg,
  },
  dateHeader: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  eventCard: {
    marginBottom: Spacing.sm,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  eventTime: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  eventDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  locationText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
