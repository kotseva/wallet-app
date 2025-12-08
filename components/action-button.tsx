import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  iconSize?: number;
}

export function ActionButton({ icon, label, onPress, iconSize = 24 }: ActionButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={iconSize} color="#FFFFFF" />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BrandColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
