import api from "@/lib/api";
import { KycReviewPayload } from "@/types/kyc";

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
 * GET /api/v1/admin/kyc/{userId}
 */
export async function getKycDetail(userId: string): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/kyc/${userId}`);
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
 * POST /api/v1/admin/kyc/{userId}/review
 */
export async function reviewKyc(
  userId: string,
  payload: KycReviewPayload
): Promise<unknown> {
  const response = await api.post(`/api/v1/admin/kyc/${userId}/review`, payload);
  return response?.data;
}
