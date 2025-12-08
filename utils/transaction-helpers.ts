import { CURRENCY_MAP, TransactionStatus, TransactionType, Transaction } from '@/types';

// Date formatting
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateWithTime = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

export const getMonthYear = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Amount formatting
export const formatAmount = (amount: number, currencyId: number, type: TransactionType) => {
  const currency = CURRENCY_MAP[currencyId];
  const prefix = type === 'top-up' ? '+' : '-';
  return `${prefix}${Math.abs(amount).toFixed(2)} ${currency?.code ?? 'EUR'}`;
};

// Status helpers
export const getStatusColor = (status: TransactionStatus) => {
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

export const getStatusText = (status: TransactionStatus) => {
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

// Navigation params builder
export const buildTransactionParams = (transaction: Transaction) => ({
  id: transaction.id?.toString() ?? '',
  wallet_id: transaction.wallet_id.toString(),
  type: transaction.type,
  status: transaction.status,
  reason: transaction.reason,
  amount: transaction.amount.toString(),
  currency_id: transaction.currency_id.toString(),
  created_at: transaction.created_at,
});
