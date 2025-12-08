import { create } from 'zustand';
import { authService } from '@/services/auth';
import type { LoginRequest, AuthTokens } from '@/types';
import { apiClient } from '@/services/api';

const MOCK_TOKENS: AuthTokens = {
  access_token: 'mock_access_token_12345',
  access_token_expire: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  refresh_token: 'mock-refresh-token-67890',
  refresh_token_expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
};

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  tokens: AuthTokens | null;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  isLoading: false,
  tokens: MOCK_TOKENS,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({ 
        isAuthenticated: true, 
        tokens: response.auth,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ 
      isAuthenticated: false, 
      tokens: null 
    });
  },

  checkAuth: async () => {
    await apiClient.setToken(MOCK_TOKENS.access_token);
    set({ 
      isAuthenticated: true, 
      isLoading: false,
      tokens: MOCK_TOKENS,
    });
  },

  clearError: () => set({ error: null }),
}));
