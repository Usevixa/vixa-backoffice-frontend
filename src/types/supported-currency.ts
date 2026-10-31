// Operation entry from GET /api/v1/admin/supported-currencies → chains[].operations[key]
// `id` is the supported-currency record the PATCH endpoint expects, when the API sends it per operation.
export interface SupportedCurrencyOperation {
  id?: number;
  enabled: boolean;
}

// Chain entry → data.currencies[].chains[]
export interface SupportedCurrencyChain {
  id?: number;
  chain: string;
  oxsNetworkSlug: string;
  needTag: boolean;
  minDepositAmount: number;
  minWithdrawAmount: number;
  decimals: number;
  operations: Record<string, SupportedCurrencyOperation>;
}

// Currency entry → data.currencies[]
export interface SupportedCurrency {
  coin: string;
  chains: SupportedCurrencyChain[];
}

// Extracted shape from response envelope
export interface SupportedCurrencyListResult {
  currencies: SupportedCurrency[];
  totalCoins: number;
  totalChains: number;
}

// Query params
export interface SupportedCurrenciesFilter {
  coin?: string;
  chain?: string;
  transactionType?: string;
  isEnabled?: string; // "all" | "true" | "false"
}

// PATCH /api/v1/admin/supported-currencies/{id} body — every field optional
export interface UpdateSupportedCurrencyPayload {
  isEnabledReceive?: boolean;
  isEnabledSend?: boolean;
  sendEnabled?: boolean;
  isEnabledSwap?: boolean;
  isEnabledBalance?: boolean;
  isEnabledDeposit?: boolean;
  isEnabledWithdrawal?: boolean;
}
