import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
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
import { StatusBadge } from '@/components/ui/Badge';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/helpers';

export default function FeesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getChildId } = useChild();

  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = ['ALL', 'PENDING', 'PAID'];

  const loadData = useCallback(async () => {
    const childId = getChildId();
    if (!childId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await feeService.getFees(childId);
      setFees(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load fees');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getChildId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const filteredFees = fees.filter((f) => {
    if (activeTab === 'ALL') return true;
    return f.status === activeTab;
  });

  const totalPending = fees
    .filter((f) => f.status === 'PENDING' || f.status === 'OVERDUE')
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  const totalPaid = fees
    .filter((f) => f.status === 'PAID')
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading fees..." />;
  }

  if (error && !fees.length) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Fees & Payments"
        onBack={() => router.back()}
        rightAction={() => router.push('/fees/receipts')}
        rightIcon="receipt-outline"
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
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Paid</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>
                {formatCurrency(totalPaid)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={[styles.summaryValue, { color: Colors.warning }]}>
                {formatCurrency(totalPending)}
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeTabText]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredFees.length === 0 ? (
          <EmptyState
            title="No fees found"
            message={`No ${activeTab.toLowerCase()} fees found.`}
            icon="wallet-outline"
          />
        ) : (
          <View style={styles.list}>
            {filteredFees.map((fee, index) => (
              <Card key={fee.id || index} style={styles.feeCard}>
                <View style={styles.feeHeader}>
                  <View style={styles.feeInfo}>
                    <Text style={styles.feeName}>{fee.name || fee.feeName || fee.category}</Text>
                    <Text style={styles.feePeriod}>
                      {fee.period || fee.dueDate || fee.due_date ? `Due: ${formatDate(fee.dueDate || fee.due_date)}` : ''}
                    </Text>
                  </View>
                  <StatusBadge status={fee.status} />
                </View>

                <View style={styles.feeAmount}>
                  <Text style={styles.amountLabel}>Amount</Text>
                  <Text style={styles.amountValue}>{formatCurrency(fee.amount)}</Text>
                </View>

                {(fee.paidDate || fee.paid_date) && (
                  <View style={styles.paidInfo}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.paidText}>Paid on {formatDate(fee.paidDate || fee.paid_date)}</Text>
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.paymentsButton}
          onPress={() => router.push('/fees/payments')}
        >
          <Ionicons name="time-outline" size={20} color={Colors.primary} />
          <Text style={styles.paymentsButtonText}>View Payment History</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
        </TouchableOpacity>
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
  summaryCard: {
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
  },
  list: {
    gap: Spacing.sm,
  },
  feeCard: {
    marginBottom: Spacing.sm,
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  feeInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  feeName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  feePeriod: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  feeAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  amountLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  amountValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  paidInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  paidText: {
    fontSize: FontSize.sm,
    color: Colors.success,
  },
  paymentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  paymentsButtonText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.primary,
  },
});
