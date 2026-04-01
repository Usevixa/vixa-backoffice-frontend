import api from "@/lib/api";
import { KycDecisionPayload } from "@/types/kyc";

/**
 * GET /api/v1/admin/kyc
 * Query params: Search, Status, DateFrom, DateTo, PageNo, PageSize
 */
export async function getKycRecords(
  params?: Record<string, string | number>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/kyc", { params });
  return response?.data;
}

/**
 * GET /api/v1/admin/kyc/{id}
 */
export async function getKycById(id: number): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/kyc/${id}`);
  return response?.data;
}

/**
 * GET /api/v1/admin/kyc/stats
 */
export async function getKycStats(): Promise<unknown> {
  const response = await api.get("/api/v1/admin/kyc/stats");
  return response?.data;
}

/**
 * PATCH /api/v1/admin/kyc/{id}/approve
 */
export async function approveKyc(
  id: number,
  payload: KycDecisionPayload
): Promise<unknown> {
  const response = await api.patch(`/api/v1/admin/kyc/${id}/approve`, payload);
  return response?.data;
}

/**
 * PATCH /api/v1/admin/kyc/{id}/decline
 */
export async function declineKyc(
  id: number,
  payload: KycDecisionPayload
): Promise<unknown> {
  const response = await api.patch(`/api/v1/admin/kyc/${id}/decline`, payload);
  return response?.data;
}
