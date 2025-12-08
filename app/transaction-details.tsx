import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CURRENCY_MAP, TransactionStatus, TransactionType } from '@/types';
import { BrandColors } from '@/constants/theme';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case 'completed':
      return '#22C55E';
    case 'failed':
      return '#EF4444';
    case 'pending':
    default:
      return '#9CA3AF';
  }
};

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

const getTypeIcon = (type: TransactionType) => {
  return type === 'top-up' ? 'arrow-down-circle' : 'arrow-up-circle';
};

const getTypeColor = (type: TransactionType) => {
  return type === 'top-up' ? '#22C55E' : '#EF4444';
};

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
  }>();

  const currency = CURRENCY_MAP[Number(params.currency_id)];
  const amount = parseFloat(params.amount || '0');
  const prefix = params.type === 'top-up' ? '+' : '-';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Amount Section */}
        <View style={styles.amountSection}>
          <Ionicons 
            name={getTypeIcon(params.type)} 
            size={48} 
            color={getTypeColor(params.type)} 
          />
          <Text style={[styles.amount, { color: getTypeColor(params.type) }]}>
            {prefix}{Math.abs(amount).toFixed(2)} {currency?.code ?? 'EUR'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(params.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(params.status) }]}>
              {getStatusText(params.status)}
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <DetailRow label="Transaction ID" value={params.id || 'N/A'} />
          <DetailRow label="Type" value={params.type === 'top-up' ? 'Top Up' : 'Withdrawal'} />
          <DetailRow label="Description" value={params.reason || 'No description'} />
          <DetailRow label="Date" value={formatDate(params.created_at)} />
          <DetailRow label="Wallet ID" value={params.wallet_id} isLast />
        </View>
      </View>
    </SafeAreaView>
  );
}

const DetailRow = ({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) => (
  <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

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
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  detailLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
});
