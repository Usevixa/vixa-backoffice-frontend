import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getKycRecords,
  getKycDetail,
  getKycStats,
  reviewKyc,
} from "@/services/kyc.service";
import {
  KycDetail,
  KycListResult,
  KycStats,
  KycFilter,
  KycReviewPayload,
} from "@/types/kyc";

function getErrorMessage(err: unknown): string {
  const backendMessage = (err as any)?.response?.data?.message;
  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}

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
      page: (data as any)?.data?.page ?? 1,
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

export function useKycDetail(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["kyc", userId] as const,
    queryFn: () => getKycDetail(userId!),
    enabled: enabled && !!userId,
    select: (data: unknown) => (data as any)?.data as KycDetail,
  });
}

export function useReviewKyc(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: KycReviewPayload }) =>
      reviewKyc(userId, payload),
    onSuccess: (data, { userId, payload }) => {
      queryClient.invalidateQueries({ queryKey: ["kyc-records"] });
      queryClient.invalidateQueries({ queryKey: ["kyc-stats"] });
      queryClient.invalidateQueries({ queryKey: ["kyc", userId] });
      toast.success(
        (data as any)?.message ??
          (payload.action === "Approve" ? "KYC approved successfully" : "KYC rejected successfully")
      );
      onSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
