import api from "@/lib/api";

/**
 * GET /api/v1/admin/receives
 * Query params: Search, Coin, TxType, Status, DateFrom, DateTo, PageNo, PageSize
 * Response envelope: { success, message, data: { items, stats, totalCount, pageNo, pageSize, totalPages } }
 * Note: data.stats is ignored — use the dedicated stats endpoint instead.
 */
export async function getReceives(
  params?: Record<string, string | number>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/receives", { params });
  return response?.data;
}

/**
 * GET /api/v1/admin/receives/{id}
 */
export async function getReceiveById(id: number): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/receives/${id}`);
  return response?.data;
}

/**
 * GET /api/v1/admin/receives/stats
 */
export async function getReceiveStats(): Promise<unknown> {
  const response = await api.get("/api/v1/admin/receives/stats");
  return response?.data;
}
