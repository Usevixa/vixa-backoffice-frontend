import { useQuery } from "@tanstack/react-query";
import { getWithdrawals, getWithdrawalById, getWithdrawalStats } from "@/services/withdrawal.service";
import { WithdrawalDetail, WithdrawalListResult, WithdrawalStats, WithdrawalsFilter } from "@/types/withdrawal";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useWithdrawals(filters: WithdrawalsFilter) {
  const params: Record<string, string | number | boolean> = {};
  if (filters.Search?.trim()) params.Search = filters.Search.trim();
  if (filters.Coin && filters.Coin !== "all") params.Coin = filters.Coin;
  if (filters.Status && filters.Status !== "all") params.Status = filters.Status;
  if (filters.DateFrom) params.DateFrom = filters.DateFrom;
  if (filters.DateTo) params.DateTo = filters.DateTo;
  if (filters.QueueOnly) params.QueueOnly = true;
  params.PageNo = filters.PageNo ?? 1;
  params.PageSize = filters.PageSize ?? 15;

  return useQuery({
    queryKey: ["withdrawals", params] as const,
    queryFn: () => getWithdrawals(params),
    select: (data: unknown): WithdrawalListResult => ({
      items: ((data as any)?.data?.items ?? []),
      totalCount: (data as any)?.data?.totalCount ?? 0,
      pageNo: (data as any)?.data?.pageNo ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 15,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useWithdrawalDetail(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["withdrawal", id] as const,
    queryFn: () => getWithdrawalById(id!),
    enabled: enabled && !!id,
    select: (data: unknown) => (data as any)?.data as WithdrawalDetail,
  });
}

export function useWithdrawalStats() {
  return useQuery({
    queryKey: ["withdrawal-stats"] as const,
    queryFn: getWithdrawalStats,
    select: (data: unknown) => (data as any)?.data as WithdrawalStats,
  });
}
