import { apiClient } from './api';
import type { WalletsResponse } from '@/types';

export const walletService = {
  async getBalances(): Promise<WalletsResponse> {
    return apiClient.get<WalletsResponse>('/balances');
  },
};
