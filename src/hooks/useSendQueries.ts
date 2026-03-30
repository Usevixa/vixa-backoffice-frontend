import { useQuery } from "@tanstack/react-query";
import { getSends, getSendById, getSendStats } from "@/services/send.service";
import { SendDetail, SendListResult, SendStats, SendsFilter } from "@/types/send";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useSends(filters: SendsFilter) {
  const params: Record<string, string | number> = {};
  if (filters.Search?.trim()) params.Search = filters.Search.trim();
  if (filters.Coin && filters.Coin !== "all") params.Coin = filters.Coin;
  if (filters.TxType && filters.TxType !== "all") params.TxType = filters.TxType;
  if (filters.Status && filters.Status !== "all") params.Status = filters.Status;
  if (filters.DateFrom) params.DateFrom = filters.DateFrom;
  if (filters.DateTo) params.DateTo = filters.DateTo;
  params.PageNo = filters.PageNo ?? 1;
  params.PageSize = filters.PageSize ?? 15;

  return useQuery({
    queryKey: ["sends", params] as const,
    queryFn: () => getSends(params),
    select: (data: unknown): SendListResult => ({
      items: ((data as any)?.data?.items ?? []),
      totalCount: (data as any)?.data?.totalCount ?? 0,
      pageNo: (data as any)?.data?.pageNo ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 15,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useSendStats() {
  return useQuery({
    queryKey: ["send-stats"] as const,
    queryFn: getSendStats,
    select: (data: unknown) => (data as any)?.data as SendStats,
  });
}

export function useSendDetail(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["send", id] as const,
    queryFn: () => getSendById(id!),
    enabled: enabled && !!id,
    select: (data: unknown) => (data as any)?.data as SendDetail,
  });
}
