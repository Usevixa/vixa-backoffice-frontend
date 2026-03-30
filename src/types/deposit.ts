// List item from GET /api/v1/admin/deposits → data.items[]
export interface Deposit {
  id: number;
  depositRef: string;
  userId: string;
  userFullName: string;
  subwalletId: string;
  country: string;
  ycChannel: string;
  ycChannelId: string;
  amountUsdt: number;
  amountNgn: number;
  asset: string;
  network: string;
  status: string;
  statusDisplay: string;
  ycDepositId: string;
  ycReference: string;
  oxsReference: string | null;
  createdAt: string;
  updatedAt: string | null;
  expiresAtUtc: string | null;
}

// Detail from GET /api/v1/admin/deposits/{id} → data
export interface DepositDetail extends Deposit {
  unitPrice: number;
  feePercent: number;
  ycNetworkId: string | null;
  ycBankName: string | null;
  ycAccountNumber: string | null;
  ycAccountName: string | null;
  walletAddress: string;
  userPhone: string;
  errorMessage: string | null;
  correlationId: string | null;
  idempotencyKey: string | null;
  timeline: DepositTimelineStep[];
}

export interface DepositTimelineStep {
  label: string;
  subLabel: string | null;
  timestamp: string | null;
  completed: boolean;
  failed: boolean;
  handoffLabel: string | null;
}

export interface DepositStats {
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

// Query params for GET /api/v1/admin/deposits
export interface DepositsFilter {
  Search?: string;
  Asset?: string;
  Network?: string;
  Status?: string;
  DateFrom?: string;
  DateTo?: string;
  PageNo?: number;
  PageSize?: number;
}

// Paginated list response shape extracted from data envelope
export interface DepositListResult {
  items: Deposit[];
  stats: DepositStats;
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
