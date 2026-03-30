import api from "@/lib/api";

/**
 * GET /api/v1/admin/swaps
 * Query params: Search, FromCoin, ToCoin, Status, DateFrom, DateTo, PageNo, PageSize
 */
export async function getSwaps(
  params?: Record<string, string | number>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/swaps", { params });
  return response?.data;
}

/**
 * GET /api/v1/admin/swaps/{id}
 */
export async function getSwapById(id: number): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/swaps/${id}`);
  return response?.data;
}

/**
 * GET /api/v1/admin/swaps/stats
 */
export async function getSwapStats(): Promise<unknown> {
  const response = await api.get("/api/v1/admin/swaps/stats");
  return response?.data;
}
