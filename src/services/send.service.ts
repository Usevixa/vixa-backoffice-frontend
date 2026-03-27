import api from "@/lib/api";

/**
 * GET /api/v1/admin/sends
 * Query params: Search, Coin, TxType, Status, DateFrom, DateTo, PageNo, PageSize
 * Response envelope: { success, message, data: { items, stats, totalCount, pageNo, pageSize, totalPages } }
 */
export async function getSends(
  params?: Record<string, string | number>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/sends", { params });
  return response?.data;
}

/**
 * GET /api/v1/admin/sends/{id}
 */
export async function getSendById(id: number): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/sends/${id}`);
  return response?.data;
}
