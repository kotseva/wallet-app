import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrandColors } from '@/constants/theme';
import { CURRENCY_MAP, TransactionType } from '@/types';

interface TransactionItemProps {
    reason: string;
    createdAt: string;
    amount: number;
    currencyId: number;
    type: TransactionType;
    onPress?: () => void;
}

export function TransactionItem({ reason, createdAt, amount, currencyId, type, onPress }: TransactionItemProps) {
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
        {formatAmount()}
      </Text>
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: BrandColors.surface,
    borderRadius: 8,
    marginBottom: 5,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BrandColors.textSecondary,
  },
  date: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BrandColors.textPrimary,
  },
  amountPositive: {
    color: BrandColors.success,
  },
});
