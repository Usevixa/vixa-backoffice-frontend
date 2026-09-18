import api from "@/lib/api";

/**
 * GET /api/v1/admin/webhooks/logs
 * Query params: search, source, category, status, page, pageSize
 * Response envelope: { success, message, data: { stats, providers, items, totalCount, pageNo, pageSize, totalPages } }
 */
export async function getWebhookLogs(
  params?: Record<string, string | number>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/webhooks/logs", { params });
  return response?.data;
}

/**
 * GET /api/v1/admin/webhooks/logs/{id}
 */
export async function getWebhookLogById(id: number): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/webhooks/logs/${id}`);
  return response?.data;
}
