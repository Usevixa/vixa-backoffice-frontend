import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUsers,
  getUserProfile,
  getUserKyc,
  getUserWallet,
  getUserActivity,
  getUserNotes,
  updateUserNotes,
  freezeUserWallets,
  unfreezeUserWallet,
  toggleUserWithdrawal,
  flagUser,
} from "@/services/user.service";
import {
  User,
  UserNote,
  UsersFilter,
  UpdateNotesPayload,
  ToggleWithdrawalPayload,
  FlagUserPayload,
} from "@/types/user";

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

export function useUsers(filters?: UsersFilter) {
  // Build clean params — omit undefined values and the "all" sentinel
  const params: Record<string, string> = {};
  if (filters?.Search?.trim()) params.Search = filters.Search.trim();
  if (filters?.KycStatus && filters.KycStatus !== "all") params.KycStatus = filters.KycStatus;
  if (filters?.RiskLevel && filters.RiskLevel !== "all") params.RiskLevel = filters.RiskLevel;
  if (filters?.WalletStatus && filters.WalletStatus !== "all") params.WalletStatus = filters.WalletStatus;
  // Only include dates when both are provided — prevents partial date requests
  if (filters?.DateFrom && filters?.DateTo) {
    params.DateFrom = filters.DateFrom;
    params.DateTo = filters.DateTo;
  }

  return useQuery({
    queryKey: ["users", params] as const,
    queryFn: () => getUsers(params),
    select: (data: unknown) => ((data as any)?.data?.users ?? []) as User[],
  });
}

export function useUserProfile(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["user", userId, "profile"] as const,
    queryFn: () => getUserProfile(userId!),
    enabled: enabled && !!userId,
    select: (data: unknown) => (data as any)?.data ?? data,
  });
}

export function useUserKyc(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["user", userId, "kyc"] as const,
    queryFn: () => getUserKyc(userId!),
    enabled: enabled && !!userId,
    select: (data: unknown) => (data as any)?.data ?? data,
  });
}

export function useUserWallet(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["user", userId, "wallet"] as const,
    queryFn: () => getUserWallet(userId!),
    enabled: enabled && !!userId,
    select: (data: unknown) => (data as any)?.data ?? data,
  });
}

export function useUserActivity(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["user", userId, "activity"] as const,
    queryFn: () => getUserActivity(userId!),
    enabled: enabled && !!userId,
    // Response: { success, message, data: { items: [...] } }
    select: (data: unknown) => ((data as any)?.data?.items ?? []) as any[],
  });
}

export function useUserNotes(userId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["user", userId, "notes"] as const,
    queryFn: () => getUserNotes(userId!),
    enabled: enabled && !!userId,
    // Response: { success, message, data: { notes: [...] } }
    select: (data: unknown) => ((data as any)?.data?.notes ?? []) as UserNote[],
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useUpdateUserNotes(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateNotesPayload }) =>
      updateUserNotes(userId, payload),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId, "notes"] });
      toast.success("Note saved successfully");
      onSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useFreezeWallets(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => freezeUserWallets(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Wallets frozen successfully");
      onSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUnfreezeWallet(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unfreezeUserWallet(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Wallet unfrozen successfully");
      onSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useToggleWithdrawal(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: ToggleWithdrawalPayload }) =>
      toggleUserWithdrawal(userId, payload),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId, "profile"] });
      toast.success((data as any)?.message ?? "Withdrawal setting updated");
      onSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useFlagUser(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: FlagUserPayload }) =>
      flagUser(userId, payload),
    onSuccess: (_data, { payload }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(payload.isFlagged ? "User flagged successfully" : "Flag removed successfully");
      onSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
