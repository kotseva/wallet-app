import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWallets } from '@/hooks/use-wallets';
import { useTransactions } from '@/hooks/use-transactions';
import { BrandColors } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { ActionButton } from '@/components/action-button';
import { BalanceDisplay } from '@/components/balance-display';
import { TransactionItem } from '@/components/transaction-item';
import { CardPromoBanner } from '@/components/card-promo-banner';
import { LoadingScreen } from '@/components/loading-screen';
import { showErrorAlert } from '@/services/api';
import { formatDate, formatAmount, getMonthYear, getStatusColor, getStatusText, buildTransactionParams } from '@/utils/transaction-helpers';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, tokens } = useAuthStore();
  const { wallets, isLoading: walletsLoading, error: walletsError, refetch: refetchWallets } = useWallets();
  const { transactions, isLoading: transactionsLoading, error: transactionsError, refetch: refetchTransactions } = useTransactions();
  const [refreshing, setRefreshing] = React.useState(false);

  // Show alert when wallet error occurs
  useEffect(() => {
    if (walletsError) {
      showErrorAlert(walletsError, {
        title: 'Failed to load wallets',
        onRetry: () => refetchWallets(),
      });
    }
  }, [walletsError]);

  // Show alert when transactions error occurs
  useEffect(() => {
    if (transactionsError) {
      showErrorAlert(transactionsError, {
        title: 'Failed to load transactions',
        onRetry: () => refetchTransactions(),
      });
    }
  }, [transactionsError]);

  const eurWallet = wallets?.find((w) => w.currency_id === 1);
  const balance = eurWallet?.available_balance ?? '0.00';
  const displayedTransactions = transactions?.slice(0, 3) ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchWallets(), refetchTransactions()]);
    setRefreshing(false);
  };

  const handleTransactionPress = (transaction: typeof displayedTransactions[0]) => {
    router.push({
      pathname: '/transaction-details',
      params: buildTransactionParams(transaction),
    });
  };

  if (walletsLoading && !wallets?.length) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BrandColors.primary} />
        }
      >
        {/* Logo */}
        <View style={styles.header}>
          <View style={styles.logo} />
        </View>

        {/* Balance */}
        <BalanceDisplay currency="EUR" amount={balance} />

        {/* Actions */}
        <View style={styles.actionButtons}>
          <ActionButton icon="add" label="Add" iconSize={28} />
          <ActionButton icon="send" label="Send" />
          <ActionButton icon="document-text" label="Details" />
        </View>

        {/* Card Promo */}
        <CardPromoBanner onOrderCard={() => console.log('Order card')} />

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          {transactionsLoading && !displayedTransactions.length ? (
            <ActivityIndicator size="small" color={BrandColors.primary} />
          ) : (
            <View style={styles.transactionsCard}>
              {displayedTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id ?? index}
                  reason={transaction.reason}
                  createdAt={transaction.created_at}
                  amount={transaction.amount}
                  currencyId={transaction.currency_id}
                  type={transaction.type}
                  onPress={() => handleTransactionPress(transaction)}
                  isLast={false}
                />
              ))}

              {/* See All Button */}
              <TouchableOpacity
                style={styles.seeAllButton}
                onPress={() => router.push('/transactions')}
              >
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  header: { paddingVertical: 16 },
  logo: { width: 24, height: 24, backgroundColor: BrandColors.primary, borderRadius: 4 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  transactionsSection: { gap: 0 },
  transactionsCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    overflow: 'hidden',
  },
  // Add these styles back:
  seeAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
  },
  seeAllText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
