import { apiClient } from './api';
import type { LoginRequest, LoginResponse } from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    // Store tokens
    await apiClient.setToken(response.auth.access_token);
    await apiClient.setRefreshToken(response.auth.refresh_token);
    
    return response;
  },

  async logout(): Promise<void> {
    await apiClient.clearTokens();
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await apiClient.getToken();
    return !!token;
  },
};
