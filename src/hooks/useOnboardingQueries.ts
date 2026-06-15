import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getOnboardingDropoffs,
  getOnboardingUserDetail,
  getOnboardingFunnel,
  triggerOnboardingScan,
} from "@/services/onboarding.service";
import {
  OnboardingDropoff,
  OnboardingDropoffListResult,
  OnboardingDropoffsFilter,
  OnboardingFunnel,
  OnboardingUserDetail,
} from "@/types/onboarding";

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

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useOnboardingDropoffs(filters: OnboardingDropoffsFilter) {
  const params: Record<string, string | number | boolean> = {};
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.stage && filters.stage !== "all") params.stage = filters.stage;
  if (filters.onlyActive) params.onlyActive = true;
  params.page = filters.page ?? 1;
  params.pageSize = filters.pageSize ?? 20;

  return useQuery({
    queryKey: ["onboarding-dropoffs", params] as const,
    queryFn: () => getOnboardingDropoffs(params),
    select: (data: unknown): OnboardingDropoffListResult => ({
      items: ((data as any)?.data?.items ?? []) as OnboardingDropoff[],
      total: (data as any)?.data?.total ?? 0,
      page: (data as any)?.data?.page ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 20,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useOnboardingUserDetail(phoneNumber: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["onboarding-user", phoneNumber] as const,
    queryFn: () => getOnboardingUserDetail(phoneNumber!),
    enabled: enabled && !!phoneNumber,
    select: (data: unknown) => (data as any)?.data as OnboardingUserDetail,
  });
}

export function useOnboardingFunnel() {
  return useQuery({
    queryKey: ["onboarding-funnel"] as const,
    queryFn: getOnboardingFunnel,
    select: (data: unknown) => (data as any)?.data as OnboardingFunnel,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useTriggerOnboardingScan(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => triggerOnboardingScan(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-funnel"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-dropoffs"] });
      toast.success("Onboarding scan triggered successfully");
      onSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
