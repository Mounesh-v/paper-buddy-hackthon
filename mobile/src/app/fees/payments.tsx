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
import { useChild } from '@/hooks/useChild';
import { feeService } from '@/services/api';
import { Header } from '@/components/common/Header';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing, FontSize } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/helpers';

interface Payment {
  id?: string;
  description?: string;
  feeName?: string;
  amount?: number;
  status?: string;
  date?: string;
  paymentDate?: string;
  transactionId?: string;
}

export default function PaymentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getChildId } = useChild();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const childId = getChildId();
    if (!childId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await feeService.getPayments(childId as string);
      setPayments(Array.isArray(data) ? data : data?.content || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getChildId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading payments..." />;
  }

  if (error && !payments.length) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Payment History"
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
        {payments.length === 0 ? (
          <EmptyState
            title="No payments"
            message="Payment history will appear here."
            icon="time-outline"
          />
        ) : (
          <View style={styles.list}>
            {payments.map((payment, index) => (
              <Card key={payment.id || index} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentIcon}>
                    <Ionicons
                      name={payment.status === 'SUCCESS' ? 'checkmark-circle' : 'time'}
                      size={24}
                      color={payment.status === 'SUCCESS' ? Colors.success : Colors.warning}
                    />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>
                      {payment.description || payment.feeName || 'Payment'}
                    </Text>
                    <Text style={styles.paymentDate}>
                      {formatDate(payment.date || payment.paymentDate)}
                    </Text>
                  </View>
                  <Text style={styles.paymentAmount}>
                    {formatCurrency(payment.amount)}
                  </Text>
                </View>

                {payment.transactionId && (
                  <Text style={styles.transactionId}>
                    Transaction ID: {payment.transactionId}
                  </Text>
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
    gap: Spacing.sm,
  },
  paymentCard: {
    marginBottom: Spacing.sm,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  transactionId: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
