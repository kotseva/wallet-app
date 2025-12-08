import { apiClient } from './api';
import type { TransactionsResponse, TransactionsParams } from '@/types';

export const transactionsService = {
  async getTransactions(params?: TransactionsParams): Promise<TransactionsResponse> {
    return apiClient.get<TransactionsResponse>('/transactions', params);
  },
};
