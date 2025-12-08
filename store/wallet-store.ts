import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Wallet, Transaction } from '@/types';

const WALLETS_CACHE_KEY = 'cached_wallets';
const TRANSACTIONS_CACHE_KEY = 'cached_transactions';

interface WalletState {
  cachedWallets: Wallet[];
  cachedTransactions: Transaction[];
  selectedWalletId: number | null;
  
  // Actions
  setCachedWallets: (wallets: Wallet[]) => Promise<void>;
  setCachedTransactions: (transactions: Transaction[]) => Promise<void>;
  loadCachedData: () => Promise<void>;
  setSelectedWallet: (walletId: number | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  cachedWallets: [],
  cachedTransactions: [],
  selectedWalletId: null,

  setCachedWallets: async (wallets) => {
    await AsyncStorage.setItem(WALLETS_CACHE_KEY, JSON.stringify(wallets));
    set({ cachedWallets: wallets });
  },

  setCachedTransactions: async (transactions) => {
    // Limit to 50 transactions as per requirements
    const limitedTransactions = transactions.slice(0, 50);
    await AsyncStorage.setItem(TRANSACTIONS_CACHE_KEY, JSON.stringify(limitedTransactions));
    set({ cachedTransactions: limitedTransactions });
  },

  loadCachedData: async () => {
    try {
      const [walletsJson, transactionsJson] = await Promise.all([
        AsyncStorage.getItem(WALLETS_CACHE_KEY),
        AsyncStorage.getItem(TRANSACTIONS_CACHE_KEY),
      ]);
      
      set({
        cachedWallets: walletsJson ? JSON.parse(walletsJson) : [],
        cachedTransactions: transactionsJson ? JSON.parse(transactionsJson) : [],
      });
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  },

  setSelectedWallet: (walletId) => set({ selectedWalletId: walletId }),
}));
