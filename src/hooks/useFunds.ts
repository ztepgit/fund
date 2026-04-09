import { useQuery } from '@tanstack/react-query';
import { fetchAllFunds, fetchFundDetail, searchFunds } from '@/src/api/funds';

export const fundKeys = {
  all: ['funds'] as const,
  lists: () => [...fundKeys.all, 'list'] as const,
  list: (filters: string) => [...fundKeys.lists(), { filters }] as const,
  details: () => [...fundKeys.all, 'detail'] as const,
  detail: (id: number) => [...fundKeys.details(), id] as const,
  search: (query: string) => [...fundKeys.all, 'search', query] as const,
};

export function useAllFunds() {
  return useQuery({
    queryKey: fundKeys.lists(),
    queryFn: fetchAllFunds,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFundDetail(schemeCode: number) {
  return useQuery({
    queryKey: fundKeys.detail(schemeCode),
    queryFn: () => fetchFundDetail(schemeCode),
    enabled: !!schemeCode,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchFunds(query: string) {
  return useQuery({
    queryKey: fundKeys.search(query),
    queryFn: () => searchFunds(query),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}
