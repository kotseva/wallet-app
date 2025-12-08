import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BrandColors } from '@/constants/theme';

interface CardPromoBannerProps {
  onOrderCard?: () => void;
}

export function CardPromoBanner({ onOrderCard }: CardPromoBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Get your card and{'\n'}use it anywhere</Text>
        <TouchableOpacity style={styles.button} onPress={onOrderCard}>
          <Text style={styles.buttonText}>Order card</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.graphic}>
        <View style={styles.card}>
          <Text style={styles.diamond}>♦</Text>
          <Text style={styles.heart}>♥</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BrandColors.cardPromo,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  graphic: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 64,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    transform: [{ rotate: '-15deg' }],
    justifyContent: 'space-between',
  },
  diamond: {
    fontSize: 24,
    color: BrandColors.primary,
  },
  heart: {
    fontSize: 24,
    color: BrandColors.primary,
    alignSelf: 'flex-end',
  },
});
