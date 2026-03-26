import api from "@/lib/api";

/**
 * GET /api/v1/admin/transactions
 * Query params: Search, Type, TransactionType, Status, Coin, DateFrom, DateTo, PageNo, PageSize
 * Response envelope: { success, message, data: { items, totalCount, pageNo, pageSize, totalPages } }
 */
export async function getTransactions(
  params?: Record<string, string | number>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/transactions", { params });
  return response?.data;
}

/**
 * GET /api/v1/admin/transactions/{id}
 */
export async function getTransactionById(id: number): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/transactions/${id}`);
  return response?.data;
}

/**
 * GET /api/v1/admin/transactions/export
 * Response: downloadable CSV blob
 */
export async function exportTransactions(
  params?: Record<string, string | number>
): Promise<Blob> {
  const response = await api.get("/api/v1/admin/transactions/export", {
    params,
    responseType: "blob",
  });
  return response.data;
}
