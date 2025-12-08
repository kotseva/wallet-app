import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CURRENCY_MAP, TransactionStatus, TransactionType, Transaction } from '@/types';
import { formatDateWithTime, getStatusColor, getStatusText, buildTransactionParams } from '@/utils/transaction-helpers';

const DetailRow = ({ 
  label, 
  value, 
  valueColor,
  showCurrencyIndicator 
}: { 
  label: string; 
  value: string; 
  valueColor?: string;
  showCurrencyIndicator?: boolean;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.detailValueContainer}>
      {showCurrencyIndicator && (
        <View style={styles.currencyIndicator}>
          <Text style={styles.currencyIndicatorText}>€</Text>
        </View>
      )}
      <Text style={[styles.detailValue, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  amountCard: {
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  amountCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incomeLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22C55E',
  },
  detailsCard: {
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 16,
  },
  detailsList: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  currencyIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyIndicatorText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  detailsSection: {
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    paddingTop: 16,
    marginTop: 4,
  },
  detailsSectionTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  detailsSectionContent: {
    fontSize: 14,
    color: '#fff',
  },
});

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    wallet_id: string;
    type: TransactionType;
    status: TransactionStatus;
    reason: string;
    amount: string;
    currency_id: string;
    created_at: string;
    payer_name?: string;
    current_balance?: string;
  }>();

  const currency = CURRENCY_MAP[Number(params.currency_id)];
  const amount = parseFloat(params.amount || '0');
  const currencyCode = currency?.code ?? 'EUR';
  const isIncome = params.type === 'top-up';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.pageTitle}>Transaction details</Text>

      {/* Content */}
      <View style={styles.content}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountCardHeader}>
            <Text style={styles.incomeLabel}>{isIncome ? 'Income' : 'Expense'}</Text>
            <Ionicons name="document-text-outline" size={20} color="#6B7280" />
          </View>
          <Text style={styles.amount}>
            {isIncome ? '+' : '-'}{Math.abs(amount).toFixed(2)} {currencyCode}
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          {/* Details List */}
          <View style={styles.detailsList}>
            <DetailRow 
              label="Wallet" 
              value={currencyCode}
              showCurrencyIndicator
            />
            <DetailRow 
              label="Transaction type" 
              value={isIncome ? 'Income' : 'Expense'}
            />
            <DetailRow 
              label="Payer name" 
              value={params.payer_name || 'Admin'}
            />
            <DetailRow 
              label="Status" 
              value={getStatusText(params.status)}
              valueColor={getStatusColor(params.status)}
            />
            <DetailRow 
              label="Transaction number" 
              value={`#${params.id || '00000000'}`}
            />
            <DetailRow 
              label="Payment date" 
              value={formatDateWithTime(params.created_at)}
            />
            <DetailRow 
              label="Current balance" 
              value={`${params.current_balance || '0.00'} ${currencyCode}`}
            />
          </View>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsSectionTitle}>Details</Text>
            <Text style={styles.detailsSectionContent}>{params.reason || 'Expense request'}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
