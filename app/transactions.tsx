import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '@/hooks/use-transactions';
import { BrandColors } from '@/constants/theme';
import { CURRENCY_MAP, Transaction, TransactionStatus } from '@/types';

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Helper to format amount
const formatAmount = (amount: number, currencyId: number, type: string) => {
  const currency = CURRENCY_MAP[currencyId];
  const prefix = type === 'top-up' ? '+' : '-';
  return `${prefix}${Math.abs(amount).toFixed(2)} ${currency?.code ?? 'EUR'}`;
};

// Helper to get month-year string
const getMonthYear = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Status color helper
const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case 'completed':
      return '#22C55E'; // green
    case 'failed':
      return '#EF4444'; // red
    case 'pending':
    default:
      return '#9CA3AF'; // gray
  }
};

// Status display text
const getStatusText = (status: TransactionStatus) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Declined';
    case 'pending':
    default:
      return 'Pending';
  }
};

interface TransactionSection {
  title: string;
  data: Transaction[];
}

export default function TransactionsScreen() {
  const router = useRouter();
  const {
    transactions,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactions();

  // Group transactions by month
  const sections: TransactionSection[] = useMemo(() => {
    if (!transactions?.length) return [];

    const grouped = transactions.reduce((acc, transaction) => {
      const monthYear = getMonthYear(transaction.created_at);
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.entries(grouped).map(([title, data]) => ({
      title,
      data,
    }));
  }, [transactions]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderTransaction = ({ item, index, section }: { item: Transaction; index: number; section: TransactionSection }) => {
    const isFirst = index === 0;
    const isLast = index === section.data.length - 1;
    
    return (
      <View style={[
        styles.transactionItem,
        isFirst && styles.transactionItemFirst,
        isLast && styles.transactionItemLast,
      ]}>
        <View style={styles.transactionLeft}>
          <View>
            <Text style={styles.transactionName} numberOfLines={1}>
              {item.reason || 'Transaction na...'}
            </Text>
            <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionAmount}>
            {formatAmount(item.amount, item.currency_id, item.type)}
          </Text>
          <Text style={[styles.transactionStatus, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
        {!isLast && <View style={styles.divider} />}
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: TransactionSection }) => (
    <Text style={styles.monthHeader}>{section.title}</Text>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={BrandColors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Transactions</Text>

      {/* Transactions List */}
      {isLoading && !transactions?.length ? (
        <ActivityIndicator size="large" color={BrandColors.primary} style={styles.loader} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
          renderItem={renderTransaction}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions yet</Text>
          }
          stickySectionHeadersEnabled={false}
          renderSectionFooter={() => <View style={styles.sectionFooter} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionFooter: {
    height: 24,
  },
  transactionCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    overflow: 'hidden',
  },
  transactionItem: {
    backgroundColor: '#18181B',
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'relative',
  },

  transactionItemFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  transactionItemLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
    maxWidth: 180,
  },
  transactionDate: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  transactionRight: {
    position: 'absolute',
    right: 16,
    top: 16,
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 14,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: '#27272A',
  },
  loader: {
    marginTop: 40,
  },
  footerLoader: {
    paddingVertical: 20,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
