import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminUsers,
  getAuditLogs,
  createAdmin,
  resendAdminInvite,
} from "@/services/admin-management.service";
import { AdminUser, AuditFilter, AuditLog, CreateAdminPayload } from "@/types/admin-management";

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

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"] as const,
    queryFn: getAdminUsers,
    select: (data: unknown) => (data as any)?.data as AdminUser[],
  });
}

export function useAuditLogs(filter: AuditFilter) {
  const params: Record<string, string | number> = {};
  if (filter.adminId?.trim()) params.adminId = filter.adminId.trim();
  if (filter.action?.trim()) params.action = filter.action.trim();
  if (filter.from) params.from = `${filter.from}T00:00:00.000Z`;
  if (filter.to) params.to = `${filter.to}T23:59:59.999Z`;
  params.skip = filter.skip ?? 0;
  params.take = filter.take ?? 20;

  return useQuery({
    queryKey: ["audit-logs", params] as const,
    queryFn: () => getAuditLogs(params),
    select: (data: unknown) => (data as any)?.data as AuditLog[],
  });
}

export function useCreateAdmin(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => createAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Invite sent successfully");
      onSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useResendAdminInvite() {
  return useMutation({
    mutationFn: (adminId: string) => resendAdminInvite(adminId),
    onSuccess: () => toast.success("Invite resent"),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
