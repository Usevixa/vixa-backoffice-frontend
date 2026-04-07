// List item from GET /api/v1/admin/receives → data.items[]
export interface Receive {
  id: number;
  receiveRef: string;
  userId: string;
  userFullName: string;
  toSubwalletId: string | null;
  source: string;
  coin: string;
  amount: number;
  txType: string;
  status: string;
  statusDisplay: string;
  providerRef: string;
  ledgerCreditRef: string | null;
  createdAt: string;
  updatedAt: string | null;
}

// Detail from GET /api/v1/admin/receives/{id} → data
export interface ReceiveDetail extends Receive {
  chain: string;
  userPhone: string;
  correlationId: string | null;
  externalRef: string | null;
  timeline: ReceiveTimelineStep[];
}

export interface ReceiveTimelineStep {
  label: string;
  subLabel: string | null;
  timestamp: string | null;
  completed: boolean;
  failed: boolean;
  handoffLabel: string | null;
}

export interface ReceiveStats {
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

// Query params for GET /api/v1/admin/receives
export interface ReceivesFilter {
  Search?: string;
  Coin?: string;
  TxType?: string;
  Status?: string;
  DateFrom?: string;
  DateTo?: string;
  PageNo?: number;
  PageSize?: number;
}

// Paginated list response extracted from data envelope
export interface ReceiveListResult {
  items: Receive[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
