import { useQuery } from "@tanstack/react-query";
import { getSwaps, getSwapById, getSwapStats } from "@/services/swap.service";
import { SwapDetail, SwapListResult, SwapStats, SwapsFilter } from "@/types/swap";

export function useSwaps(filters: SwapsFilter) {
  const params: Record<string, string | number> = {};
  if (filters.Search?.trim()) params.Search = filters.Search.trim();
  if (filters.FromCoin && filters.FromCoin !== "all") params.FromCoin = filters.FromCoin;
  if (filters.ToCoin && filters.ToCoin !== "all") params.ToCoin = filters.ToCoin;
  if (filters.Status && filters.Status !== "all") params.Status = filters.Status;
  if (filters.DateFrom) params.DateFrom = filters.DateFrom;
  if (filters.DateTo) params.DateTo = filters.DateTo;
  params.PageNo = filters.PageNo ?? 1;
  params.PageSize = filters.PageSize ?? 15;

  return useQuery({
    queryKey: ["swaps", params] as const,
    queryFn: () => getSwaps(params),
    select: (data: unknown): SwapListResult => ({
      items: (data as any)?.data?.items ?? [],
      totalCount: (data as any)?.data?.totalCount ?? 0,
      pageNo: (data as any)?.data?.pageNo ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 15,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useSwapStats() {
  return useQuery({
    queryKey: ["swap-stats"] as const,
    queryFn: getSwapStats,
    select: (data: unknown) => (data as any)?.data as SwapStats,
  });
}

export function useSwapDetail(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["swap", id] as const,
    queryFn: () => getSwapById(id!),
    enabled: enabled && !!id,
    select: (data: unknown) => (data as any)?.data as SwapDetail,
  });
}
