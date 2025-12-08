import { apiClient } from './api';
import type { PayoutRequest, PayoutResponse } from '@/types';

export const payoutsService = {
  async createPayout(data: PayoutRequest): Promise<PayoutResponse> {
    return apiClient.post<PayoutResponse>('/payouts', data);
  },
};
