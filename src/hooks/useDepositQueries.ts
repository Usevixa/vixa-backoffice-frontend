import { useQuery } from "@tanstack/react-query";
import { getDeposits, getDepositById, getDepositStats } from "@/services/deposit.service";
import { DepositDetail, DepositListResult, DepositStats, DepositsFilter } from "@/types/deposit";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useDeposits(filters: DepositsFilter) {
  const params: Record<string, string | number> = {};
  if (filters.Search?.trim()) params.Search = filters.Search.trim();
  if (filters.Asset && filters.Asset !== "all") params.Asset = filters.Asset;
  if (filters.Network && filters.Network !== "all") params.Network = filters.Network;
  if (filters.Status && filters.Status !== "all") params.Status = filters.Status;
  if (filters.DateFrom) params.DateFrom = filters.DateFrom;
  if (filters.DateTo) params.DateTo = filters.DateTo;
  params.PageNo = filters.PageNo ?? 1;
  params.PageSize = filters.PageSize ?? 15;

  return useQuery({
    queryKey: ["deposits", params] as const,
    queryFn: () => getDeposits(params),
    select: (data: unknown): DepositListResult => ({
      items: ((data as any)?.data?.items ?? []),
      totalCount: (data as any)?.data?.totalCount ?? 0,
      pageNo: (data as any)?.data?.pageNo ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 15,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useDepositStats() {
  return useQuery({
    queryKey: ["deposit-stats"] as const,
    queryFn: getDepositStats,
    select: (data: unknown) => (data as any)?.data as DepositStats,
  });
}

export function useDepositDetail(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["deposit", id] as const,
    queryFn: () => getDepositById(id!),
    enabled: enabled && !!id,
    select: (data: unknown) => (data as any)?.data as DepositDetail,
  });
}
