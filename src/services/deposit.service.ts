import api from "@/lib/api";

/**
 * GET /api/v1/admin/deposits
 * Query params: Search, Asset, Network, Status, DateFrom, DateTo, PageNo, PageSize
 * Response envelope: { success, message, data: { items, stats, totalCount, pageNo, pageSize, totalPages } }
 */
export async function getDeposits(
  params?: Record<string, string | number>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/deposits", { params });
  return response?.data;
}

/**
 * GET /api/v1/admin/deposits/{id}
 */
export async function getDepositById(id: number): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/deposits/${id}`);
  return response?.data;
}

/**
 * GET /api/v1/admin/deposits/stats
 * Response envelope: { success, message, data: { totalCount, totalAmount, completedCount, completedAmount, pendingCount, pendingAmount, failedCount, failedAmount, completedTodayCount, failed24hCount, successRate, avgProcessingMinutes, slaBreachCount } }
 */
export async function getDepositStats(): Promise<unknown> {
  const response = await api.get("/api/v1/admin/deposits/stats");
  return response?.data;
}
