import api from "@/lib/api";
import { UpdateSupportedCurrencyPayload } from "@/types/supported-currency";

/**
 * GET /api/v1/admin/supported-currencies
 * Query params: coin, chain, transactionType, isEnabled
 * Response envelope: { success, message, data: { currencies, totalCoins, totalChains } }
 */
export async function getSupportedCurrencies(
  params?: Record<string, string | boolean>
): Promise<unknown> {
  const response = await api.get("/api/v1/admin/supported-currencies", { params });
  return response?.data;
}

/**
 * PATCH /api/v1/admin/supported-currencies/{id}
 * Toggles the enabled flags for a single supported-currency record.
 */
export async function updateSupportedCurrency(
  id: number,
  payload: UpdateSupportedCurrencyPayload
): Promise<unknown> {
  const response = await api.patch(`/api/v1/admin/supported-currencies/${id}`, payload);
  return response?.data;
}
