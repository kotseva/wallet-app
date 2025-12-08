import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services/wallet';
import { useWalletStore } from '@/store/wallet-store';
import { useEffect } from 'react';

export function useWallets() {
  const { cachedWallets, setCachedWallets } = useWalletStore();

  const query = useQuery({
    queryKey: ['wallets'],
    queryFn: () => walletService.getBalances(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Cache wallets when successfully fetched
  useEffect(() => {
    if (query.data?.data) {
      setCachedWallets(query.data.data);
    }
  }, [query.data]);

  return {
    wallets: query.data?.data ?? cachedWallets,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
