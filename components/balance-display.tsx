import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BalanceDisplayProps {
  currency: string;
  amount: string;
  showInfo?: boolean;
}

export function BalanceDisplay({ currency, amount, showInfo = true }: BalanceDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{currency} balance</Text>
        {showInfo && (
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
          </View>
        )}
      </View>
      <Text style={styles.amount}>
        {parseFloat(amount).toFixed(2)} {currency}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoIcon: {
    width: 16,
    height: 16,
  },
  amount: {
    fontSize: 42,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
