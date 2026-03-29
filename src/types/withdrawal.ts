// List item from GET /api/v1/admin/withdrawals → data.items[]
export interface Withdrawal {
  id: number;
  withdrawalRef: string;
  userId: string;
  userFullName: string;
  subwalletId: string;
  amount: number;
  coin: string;
  finalAmount: number | null;
  fiatAmount: number | null;
  currency: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  destinationAddress: string | null;
  status: string;
  statusDisplay: string;
  oxReference: string | null;
  ycReference: string | null;
  createdAt: string;
  updatedAt: string | null;
  slaBreached: boolean;
}

// Detail from GET /api/v1/admin/withdrawals/{id} → data
export interface WithdrawalDetail extends Withdrawal {
  usdtAmount: number;
  networkFee: number;
  vixaFee: number;
  fiatRate: number | null;
  chain: string | null;
  userPhone: string;
  oxTxHash: string | null;
  ycDepositId: string | null;
  idempotencyKey: string | null;
  retryCount: number;
  transactionId: number | null;
  ledgerDebitRef: string | null;
  lastProviderResponse: string | null;
  timeline: WithdrawalTimelineStep[];
}

export interface WithdrawalTimelineStep {
  label: string;
  subLabel: string | null;
  timestamp: string | null;
  completed: boolean;
  failed: boolean;
  handoffLabel: string | null;
}

// Stats from GET /api/v1/admin/withdrawals/stats → data
export interface WithdrawalStats {
  completedToday: number;
  pending: number;
  failed24h: number;
  avgProcessingMinutes: number;
  slaBreachCount: number;
}

// Query params for GET /api/v1/admin/withdrawals
export interface WithdrawalsFilter {
  Search?: string;
  Coin?: string;
  Status?: string;
  DateFrom?: string;
  DateTo?: string;
  PageNo?: number;
  PageSize?: number;
  QueueOnly?: boolean;
}

// Paginated list response shape extracted from data envelope
export interface WithdrawalListResult {
  items: Withdrawal[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
