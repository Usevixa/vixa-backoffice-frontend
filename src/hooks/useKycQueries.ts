import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getKycRecords,
  getKycById,
  getKycStats,
  approveKyc,
  declineKyc,
} from "@/services/kyc.service";
import {
  KycDecisionPayload,
  KycDetail,
  KycListResult,
  KycStats,
  KycFilter,
} from "@/types/kyc";

export function useKycRecords(filters: KycFilter) {
  const params: Record<string, string | number> = {};
  if (filters.Search?.trim()) params.Search = filters.Search.trim();
  if (filters.Status && filters.Status !== "all") params.Status = filters.Status;
  if (filters.DateFrom) params.DateFrom = filters.DateFrom;
  if (filters.DateTo) params.DateTo = filters.DateTo;
  params.PageNo = filters.PageNo ?? 1;
  params.PageSize = filters.PageSize ?? 15;

  return useQuery({
    queryKey: ["kyc-records", params] as const,
    queryFn: () => getKycRecords(params),
    select: (data: unknown): KycListResult => ({
      items: (data as any)?.data?.items ?? [],
      totalCount: (data as any)?.data?.totalCount ?? 0,
      pageNo: (data as any)?.data?.pageNo ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 15,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useKycStats() {
  return useQuery({
    queryKey: ["kyc-stats"] as const,
    queryFn: getKycStats,
    select: (data: unknown) => (data as any)?.data as KycStats,
  });
}

export function useKycDetail(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["kyc", id] as const,
    queryFn: () => getKycById(id!),
    enabled: enabled && !!id,
    select: (data: unknown) => (data as any)?.data as KycDetail,
  });
}

export function useApproveKyc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: KycDecisionPayload }) =>
      approveKyc(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc-records"] });
      queryClient.invalidateQueries({ queryKey: ["kyc-stats"] });
    },
  });
}

export function useDeclineKyc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: KycDecisionPayload }) =>
      declineKyc(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc-records"] });
      queryClient.invalidateQueries({ queryKey: ["kyc-stats"] });
    },
  });
}
