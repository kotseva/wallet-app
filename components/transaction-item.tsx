import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrandColors } from '@/constants/theme';
import { CURRENCY_MAP, TransactionType } from '@/types';

interface TransactionItemProps {
    reason: string;
    createdAt: string;
    amount: number;
    currencyId: number;
    type: TransactionType;
}

export function TransactionItem({ reason, createdAt, amount, currencyId, type }: TransactionItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatAmount = () => {
    const currency = CURRENCY_MAP[currencyId];
    const prefix = type === 'top-up' ? '+' : '-';
    return `${prefix}${Math.abs(amount).toFixed(2)} ${currency?.code ?? 'EUR'}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.dot} />
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {reason || 'Transaction'}
          </Text>
          <Text style={styles.date}>{formatDate(createdAt)}</Text>
        </View>
      </View>
      <Text style={[styles.amount, type === 'top-up' && styles.amountPositive]}>
        {formatAmount()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.primary,
  },
  name: {
    fontSize: 16,
    color: '#FFFFFF',
    maxWidth: 160,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  amountPositive: {
    color: '#22C55E',
  },
});
