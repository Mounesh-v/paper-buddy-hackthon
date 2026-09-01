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

export default function ReceiptsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getChildId } = useChild();

  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    const childId = getChildId();
    if (!childId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await feeService.getReceipts(childId);
      setReceipts(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load receipts');
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

  if (isLoading && !isRefreshing) {
    return <LoadingScreen message="Loading receipts..." />;
  }

  if (error && !receipts.length) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Receipts"
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
        {receipts.length === 0 ? (
          <EmptyState
            title="No receipts"
            message="Payment receipts will appear here."
            icon="receipt-outline"
          />
        ) : (
          <View style={styles.list}>
            {receipts.map((receipt, index) => (
              <Card key={receipt.id || index} style={styles.receiptCard}>
                <View style={styles.receiptHeader}>
                  <View style={styles.receiptIcon}>
                    <Ionicons name="receipt" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.receiptInfo}>
                    <Text style={styles.receiptTitle}>
                      {receipt.description || receipt.feeName || 'Receipt'}
                    </Text>
                    <Text style={styles.receiptDate}>
                      {formatDate(receipt.date || receipt.paymentDate)}
                    </Text>
                  </View>
                  <Text style={styles.receiptAmount}>
                    {formatCurrency(receipt.amount)}
                  </Text>
                </View>

                <View style={styles.receiptMeta}>
                  {receipt.receiptNumber && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Receipt #</Text>
                      <Text style={styles.metaValue}>{receipt.receiptNumber}</Text>
                    </View>
                  )}
                  {receipt.paymentMethod && (
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Method</Text>
                      <Text style={styles.metaValue}>{receipt.paymentMethod}</Text>
                    </View>
                  )}
                </View>
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
  receiptCard: {
    marginBottom: Spacing.sm,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  receiptIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptInfo: {
    flex: 1,
  },
  receiptTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  receiptDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  receiptAmount: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  receiptMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  metaItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  metaValue: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.text,
  },
});