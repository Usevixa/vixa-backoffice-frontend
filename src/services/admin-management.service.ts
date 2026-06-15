import api from "@/lib/api";
import { CreateAdminPayload } from "@/types/admin-management";

export async function getAdminUsers(): Promise<unknown> {
  const response = await api.get("/api/v1/admin-management/users");
  return response?.data;
}

export async function getAuditLogs(
  params?: Record<string, string | number>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin-management/audit", { params });
  return response?.data;
}

export async function createAdmin(payload: CreateAdminPayload): Promise<unknown> {
  const response = await api.post("/api/v1/admin-management/users", payload);
  return response?.data;
}

export async function resendAdminInvite(adminId: string): Promise<unknown> {
  const response = await api.post(`/api/v1/admin-management/users/${adminId}/resend-invite`);
  return response?.data;
}
