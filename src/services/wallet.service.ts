import api from "@/lib/api";

/**
 * GET /api/v1/admin/wallets
 * Query params: Search, Coin, Status, PageNo, PageSize
 * Response envelope: { success, message, data: { items, stats, totalCount, pageNo, pageSize, totalPages } }
 */
export async function getWallets(
  params?: Record<string, string | number | boolean>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/wallets", { params });
  return response?.data;
}

/**
 * GET /api/v1/admin/wallets/{id}/ledger
 * Response envelope: { success, message, data: { walletDbId, walletId, coin, ledgerBalance, availableBalance, isFrozen, activitySummary, entries, totalEntries, pageNo, pageSize, totalPages } }
 */
export async function getWalletLedger(id: number): Promise<unknown> {
  const response = await api.get(`/api/v1/admin/wallets/${id}/ledger`);
  return response?.data;
}
