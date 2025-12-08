import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrandColors } from '@/constants/theme';
import { CURRENCY_MAP, TransactionType } from '@/types';
import { formatDate, formatAmount } from '@/utils/transaction-helpers';

interface TransactionItemProps {
    reason: string;
    createdAt: string;
    amount: number;
    currencyId: number;
    type: TransactionType;
    onPress?: () => void;
    isLast?: boolean;
}

export function TransactionItem({ reason, createdAt, amount, currencyId, type, onPress, isLast = false }: TransactionItemProps) {
  const content = (
    <View style={styles.container}>
      <View style={styles.left}>
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {reason || 'Transaction'}
          </Text>
          <Text style={styles.date}>{formatDate(createdAt)}</Text>
        </View>
      </View>
      <Text style={[styles.amount, type === 'top-up' && styles.amountPositive]}>
        {formatAmount(amount, currencyId, type)}
      </Text>
      {!isLast && <View style={styles.divider} />}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    maxWidth: 180,
  },
  date: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  amountPositive: {
    color: BrandColors.success,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: '#27272A',
  },
});
