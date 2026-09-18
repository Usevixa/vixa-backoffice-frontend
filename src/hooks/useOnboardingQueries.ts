import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getOnboardingDropoffs,
  getOnboardingUserDetail,
  getOnboardingFunnel,
  triggerOnboardingScan,
  exportOnboardingDropoffs,
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

// With responseType "blob", error bodies also come back as Blob,
// so we need to read them before extracting the backend message.
async function getBlobErrorMessage(err: unknown): Promise<string> {
  const data = (err as any)?.response?.data;
  if (data instanceof Blob) {
    try {
      const json = JSON.parse(await data.text());
      if (typeof json?.message === "string" && json.message.trim()) {
        return json.message;
      }
    } catch {
      // not JSON — fall through
    }
  }
  return getErrorMessage(err);
}

function getFilenameFromDisposition(disposition?: string): string {
  const fallback = `onboarding-dropoffs-${new Date().toISOString().slice(0, 10)}.csv`;
  if (!disposition) return fallback;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1].replace(/"/g, ""));

  const plainMatch = disposition.match(/filename="?([^";]+)"?/i);
  return plainMatch?.[1] ?? fallback;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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

export function useExportOnboardingDropoffs() {
  return useMutation({
    mutationFn: (filters: Omit<OnboardingDropoffsFilter, "page" | "pageSize">) => {
      const params: Record<string, string | boolean> = {};
      if (filters.search?.trim()) params.search = filters.search.trim();
      if (filters.stage && filters.stage !== "all") params.stage = filters.stage;
      if (filters.onlyActive) params.onlyActive = true;
      return exportOnboardingDropoffs(params);
    },
    onSuccess: (res: any) => {
      const blob =
        res?.data instanceof Blob
          ? res.data
          : new Blob([res?.data ?? ""], { type: "text/csv;charset=utf-8" });
      const filename = getFilenameFromDisposition(res?.headers?.["content-disposition"]);
      downloadBlob(blob, filename);
      toast.success("Export downloaded");
    },
    onError: async (err) => toast.error(await getBlobErrorMessage(err)),
  });
}