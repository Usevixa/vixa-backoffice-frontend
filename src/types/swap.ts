// List item from GET /api/v1/admin/swaps → data.items[]
export interface Swap {
  id: number;
  swapRef: string;
  userId: string;
  userFullName: string;
  subwalletId: string;
  fromCoin: string;
  toCoin: string;
  amountIn: number;
  amountOut: number;
  swapPrice: string;
  quoteId: string;
  oxsRef: string;
  status: string;
  statusDisplay: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface SwapStats {
  totalCount: number;
  totalAmount: number;
  completedCount: number;
  completedAmount: number;
  pendingCount: number;
  pendingAmount: number;
  failedCount: number;
  failedAmount: number;
  completedTodayCount: number;
  failed24hCount: number;
  successRate: number;
  avgProcessingMinutes: number;
  slaBreachCount: number;
}

export interface SwapsFilter {
  Search?: string;
  FromCoin?: string;
  ToCoin?: string;
  Status?: string;
  DateFrom?: string;
  DateTo?: string;
  PageNo?: number;
  PageSize?: number;
}

// Detail from GET /api/v1/admin/swaps/{id} → data
export interface SwapDetail extends Swap {
  userPhone: string;
  swapPriceRaw: number;
  swapPriceDisplay: string;
  markupPct: number | null;
  fee: number;
  debitLedgerRef: string | null;
  creditLedgerRef: string | null;
  oxSwapId: string;
  errorMessage: string | null;
  timeline: SwapTimelineStep[];
}

export interface SwapTimelineStep {
  label: string;
  subLabel: string | null;
  timestamp: string | null;
  completed: boolean;
  failed: boolean;
  handoffLabel: string | null;
}

export interface SwapListResult {
  items: Swap[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
