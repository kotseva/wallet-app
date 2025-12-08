import {
  formatDate,
  formatDateWithTime,
  getMonthYear,
  formatAmount,
  getStatusColor,
  getStatusText,
  buildTransactionParams,
} from '@/utils/transaction-helpers';
import type { Transaction } from '@/types';

describe('transaction-helpers', () => {
  describe('formatDate', () => {
    it('should format date string to DD/MM/YYYY format', () => {
      const result = formatDate('2024-03-15T10:30:00Z');
      expect(result).toMatch(/15\/03\/2024/);
    });

    it('should handle different date inputs', () => {
      const result = formatDate('2023-12-01T00:00:00Z');
      expect(result).toMatch(/01\/12\/2023/);
    });
  });

  describe('formatDateWithTime', () => {
    it('should format date with time and AM/PM indicator', () => {
      const result = formatDateWithTime('2024-03-15T10:30:00');
      expect(result).toContain('/');
      expect(result).toMatch(/(AM|PM)/);
    });

    it('should show PM for afternoon times', () => {
      const result = formatDateWithTime('2024-03-15T14:30:00');
      expect(result).toContain('PM');
    });

    it('should show AM for morning times', () => {
      const result = formatDateWithTime('2024-03-15T08:30:00');
      expect(result).toContain('AM');
    });
  });

  describe('getMonthYear', () => {
    it('should return month and year in short format', () => {
      const result = getMonthYear('2024-03-15T10:30:00Z');
      expect(result).toBe('Mar 2024');
    });

    it('should handle December correctly', () => {
      const result = getMonthYear('2023-12-25T10:30:00Z');
      expect(result).toBe('Dec 2023');
    });
  });

  describe('formatAmount', () => {
    it('should format top-up with positive prefix and EUR', () => {
      const result = formatAmount(100.5, 1, 'top-up');
      expect(result).toBe('+100.50 EUR');
    });

    it('should format withdrawal with negative prefix', () => {
      const result = formatAmount(50.75, 1, 'withdrawal');
      expect(result).toBe('-50.75 EUR');
    });

    it('should handle USD currency', () => {
      const result = formatAmount(200, 2, 'top-up');
      expect(result).toBe('+200.00 USD');
    });

    it('should handle GBP currency', () => {
      const result = formatAmount(150, 9, 'withdrawal');
      expect(result).toBe('-150.00 GBP');
    });

    it('should default to EUR for unknown currency', () => {
      const result = formatAmount(100, 999, 'top-up');
      expect(result).toBe('+100.00 EUR');
    });

    it('should handle negative amounts correctly', () => {
      const result = formatAmount(-100, 1, 'withdrawal');
      expect(result).toBe('-100.00 EUR');
    });
  });

  describe('getStatusColor', () => {
    it('should return green for completed status', () => {
      expect(getStatusColor('completed')).toBe('#22C55E');
    });

    it('should return red for failed status', () => {
      expect(getStatusColor('failed')).toBe('#EF4444');
    });

    it('should return gray for pending status', () => {
      expect(getStatusColor('pending')).toBe('#9CA3AF');
    });
  });

  describe('getStatusText', () => {
    it('should return "Completed" for completed status', () => {
      expect(getStatusText('completed')).toBe('Completed');
    });

    it('should return "Declined" for failed status', () => {
      expect(getStatusText('failed')).toBe('Declined');
    });

    it('should return "Pending" for pending status', () => {
      expect(getStatusText('pending')).toBe('Pending');
    });
  });

  describe('buildTransactionParams', () => {
    it('should convert transaction to navigation params', () => {
      const transaction: Transaction = {
        id: 123,
        wallet_id: 456,
        type: 'top-up',
        status: 'completed',
        reason: 'Bank transfer',
        amount: 100.5,
        currency_id: 1,
        created_at: '2024-03-15T10:30:00Z',
      };

      const result = buildTransactionParams(transaction);

      expect(result).toEqual({
        id: '123',
        wallet_id: '456',
        type: 'top-up',
        status: 'completed',
        reason: 'Bank transfer',
        amount: '100.5',
        currency_id: '1',
        created_at: '2024-03-15T10:30:00Z',
      });
    });

    it('should handle undefined id', () => {
      const transaction: Transaction = {
        wallet_id: 456,
        type: 'withdrawal',
        status: 'pending',
        reason: 'ATM',
        amount: 50,
        currency_id: 2,
        created_at: '2024-03-15T10:30:00Z',
      };

      const result = buildTransactionParams(transaction);

      expect(result.id).toBe('');
    });
  });
});
