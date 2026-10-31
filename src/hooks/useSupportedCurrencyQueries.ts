import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSupportedCurrencies,
  updateSupportedCurrency,
} from "@/services/supported-currency.service";
import {
  SupportedCurrenciesFilter,
  SupportedCurrencyListResult,
  UpdateSupportedCurrencyPayload,
} from "@/types/supported-currency";

function getErrorMessage(err: unknown): string {
  const backendMessage = (err as any)?.response?.data?.message;
  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}

/**
 * Maps an operation key from the GET response (e.g. "send", "withdraw")
 * to the PATCH body field(s) that control it.
 */
export function operationPayload(
  operation: string,
  enabled: boolean
): UpdateSupportedCurrencyPayload {
  const key = operation.toLowerCase().replace(/[^a-z]/g, "");
  if (key.startsWith("send")) return { isEnabledSend: enabled, sendEnabled: enabled };
  if (key.startsWith("receive")) return { isEnabledReceive: enabled };
  if (key.startsWith("swap")) return { isEnabledSwap: enabled };
  if (key.startsWith("balance")) return { isEnabledBalance: enabled };
  if (key.startsWith("deposit")) return { isEnabledDeposit: enabled };
  if (key.startsWith("withdraw")) return { isEnabledWithdrawal: enabled };
  return {};
}

export function useSupportedCurrencies(filters: SupportedCurrenciesFilter) {
  const params: Record<string, string | boolean> = {};
  if (filters.coin?.trim()) params.coin = filters.coin.trim();
  if (filters.chain?.trim()) params.chain = filters.chain.trim();
  if (filters.transactionType && filters.transactionType !== "all")
    params.transactionType = filters.transactionType;
  if (filters.isEnabled && filters.isEnabled !== "all")
    params.isEnabled = filters.isEnabled === "true";

  return useQuery({
    queryKey: ["supported-currencies", params] as const,
    queryFn: () => getSupportedCurrencies(params),
    select: (data: unknown): SupportedCurrencyListResult => ({
      currencies: (data as any)?.data?.currencies ?? [],
      totalCoins: (data as any)?.data?.totalCoins ?? 0,
      totalChains: (data as any)?.data?.totalChains ?? 0,
    }),
  });
}

export interface SupportedCurrencyUpdate {
  id: number;
  payload: UpdateSupportedCurrencyPayload;
}

/**
 * Accepts one or more { id, payload } updates so a single row can be
 * bulk-toggled even when the API keys each operation by its own id.
 */
export function useUpdateSupportedCurrency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: SupportedCurrencyUpdate[]) =>
      Promise.all(updates.map((u) => updateSupportedCurrency(u.id, u.payload))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supported-currencies"] });
      toast.success("Currency updated");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
