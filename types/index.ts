// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  access_token_expire: string;
  refresh_token: string;
  refresh_token_expire: string;
}

export interface LoginResponse {
  auth: AuthTokens;
  tfa: {
    enabled: boolean;
    type: string | null;
  };
}

// Wallet Types
export interface Wallet {
  id: number;
  user_id: string;
  currency_id: number;
  available_balance: string;
  current_balance: string;
  reserved_balance: string;
  reference_number: string;
}

export interface WalletsResponse {
  data: Wallet[];
  message: string[];
  status: number;
  type: string;
}

// Transaction Types
export type TransactionType = 'top-up' | 'withdrawal';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id?: number;
  wallet_id: number;
  type: TransactionType;
  status: TransactionStatus;
  reason: string;
  amount: number;
  currency_id: number;
  created_at: string;
}

export interface TransactionsPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more: boolean;
  items: Transaction[];
}

export interface TransactionsResponse {
  data: TransactionsPagination;
  message: string;
  status: number;
  type: string;
}

export interface TransactionsParams {
  page?: number;
  per_page?: number;
  wallet_id?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Payout Types
export type PayoutProvider = 'bank' | 'card';

export interface PayoutRequest {
  wallet_id: number;
  provider: PayoutProvider;
  amount: number;
  currency_id: number;
  bank_id?: number;
}

export interface PayoutResponseData {
  id: number;
  status: string;
  amount: number;
  provider: PayoutProvider;
  wallet_id: number;
  currency_id: number;
  created_at: string;
}

export interface PayoutResponse {
  data: PayoutResponseData;
  message: string;
  status: number;
  type: string;
}

// API Error
export interface ApiError {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
}

// Currency mapping helper
export const CURRENCY_MAP: Record<number, { code: string; symbol: string; name: string }> = {
  1: { code: 'EUR', symbol: '€', name: 'Euro' },
  2: { code: 'USD', symbol: '$', name: 'US Dollar' },
  9: { code: 'GBP', symbol: '£', name: 'British Pound' },
};
