// List item from GET /api/v1/admin/sends → data.items[]
export interface Send {
  id: number;
  sendRef: string;
  userId: string;
  userFullName: string;
  fromSubwalletId: string;
  destination: string;
  coin: string;
  amount: number;
  fee: number;
  finalAmount: number | null;
  txType: string;
  status: string;
  statusDisplay: string;
  oxsRef: string;
  txHash: string | null;
  createdAt: string;
  updatedAt: string;
}

// Detail from GET /api/v1/admin/sends/{id} → data
export interface SendDetail extends Send {
  userPhone: string;
  toSubwalletId: string;
  toAddress: string | null;
  toPhone: string | null;
  chain: string;
  networkFee: number;
  vixaFee: number;
  idempotencyKey: string;
  retryCount: number;
  timeline: SendTimelineStep[];
}

export interface SendTimelineStep {
  label: string;
  subLabel: string | null;
  timestamp: string | null;
  completed: boolean;
  failed: boolean;
  handoffLabel: string | null;
}

export interface SendStats {
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

// Query params for GET /api/v1/admin/sends
export interface SendsFilter {
  Search?: string;
  Coin?: string;
  TxType?: string;
  Status?: string;
  DateFrom?: string;
  DateTo?: string;
  PageNo?: number;
  PageSize?: number;
}

// Paginated list response shape extracted from data envelope
export interface SendListResult {
  items: Send[];
  stats: SendStats;
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
