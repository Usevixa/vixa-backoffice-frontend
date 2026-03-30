import api from "@/lib/api";

/**
 * GET /api/v1/admin/dashboard/overview
 * Query params: period (optional — today, 24h, 7d, 30d, 90d, all)
 * Response envelope: { success, message, data: { moneyFlow, platformHealth, alerts, volumeChart, recentTransactions } }
 */
export async function getDashboardOverview(period?: string): Promise<unknown> {
  const params = period ? { period } : undefined;
  const response = await api.get("/api/v1/admin/dashboard/overview", { params });
  return response?.data;
}
