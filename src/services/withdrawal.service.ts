import api from "@/lib/api";

/**
 * GET /api/v1/admin/withdrawals
 * Query params: Search, Coin, Status, DateFrom, DateTo, PageNo, PageSize, QueueOnly
 * Response envelope: { success, message, data: { items, totalCount, pageNo, pageSize, totalPages } }
 */
export async function getWithdrawals(
  params?: Record<string, string | number | boolean>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/withdrawals", { params });
  return response?.data;
}

/**
 * GET /api/v1/admin/withdrawals/{id}
 */
export async function getWithdrawalById(id: number): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/withdrawals/${id}`);
  return response?.data;
}

/**
 * GET /api/v1/admin/withdrawals/stats
 * Response envelope: { success, message, data: { completedToday, pending, failed24h, avgProcessingMinutes, slaBreachCount } }
 */
export async function getWithdrawalStats(): Promise<unknown> {
  const response = await api.get("/api/v1/admin/withdrawals/stats");
  return response?.data;
}
