import { useQuery } from "@tanstack/react-query";
import { getReceives, getReceiveById, getReceiveStats } from "@/services/receive.service";
import { ReceiveDetail, ReceiveListResult, ReceiveStats, ReceivesFilter } from "@/types/receive";

export function useReceives(filters: ReceivesFilter) {
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
    queryKey: ["receives", params] as const,
    queryFn: () => getReceives(params),
    select: (data: unknown): ReceiveListResult => ({
      items: (data as any)?.data?.items ?? [],
      totalCount: (data as any)?.data?.totalCount ?? 0,
      pageNo: (data as any)?.data?.pageNo ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 15,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useReceiveStats() {
  return useQuery({
    queryKey: ["receive-stats"] as const,
    queryFn: getReceiveStats,
    select: (data: unknown) => (data as any)?.data as ReceiveStats,
  });
}

export function useReceiveDetail(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["receive", id] as const,
    queryFn: () => getReceiveById(id!),
    enabled: enabled && !!id,
    select: (data: unknown) => (data as any)?.data as ReceiveDetail,
  });
}
