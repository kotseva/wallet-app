import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { transactionsService } from '@/services/transactions';
import { useWalletStore } from '@/store/wallet-store';
import { useEffect } from 'react';
import type { TransactionsParams } from '@/types';

export function useTransactions(params?: Omit<TransactionsParams, 'page'>) {
  const { cachedTransactions, setCachedTransactions } = useWalletStore();

  const query = useInfiniteQuery({
    queryKey: ['transactions', params],
    queryFn: ({ pageParam = 1 }) => 
      transactionsService.getTransactions({ ...params, page: pageParam, per_page: 15 }),
    getNextPageParam: (lastPage) => 
      lastPage.data.has_more ? lastPage.data.current_page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 0,//1000 * 60 * 5, // 5 minutes
  });

  // Cache transactions when successfully fetched
  useEffect(() => {
    if (query.data?.pages) {
      const allTransactions = query.data.pages.flatMap(page => page.data.items);
      setCachedTransactions(allTransactions);
    }
  }, [query.data]);

  const allTransactions = query.data?.pages.flatMap(page => page.data.items) ?? cachedTransactions;

  return {
    transactions: allTransactions,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
