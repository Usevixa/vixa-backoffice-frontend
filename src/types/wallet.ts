// List item from GET /api/v1/admin/wallets → data.items[]
export interface Wallet {
  id: number;
  walletId: string | null;
  userId: string;
  userDisplayId: string | null;
  userFullName: string;
  coin: string;
  ledgerBalance: number;
  availableBalance: number;
  status: string;
  isFrozen: boolean;
  lastActivity: string | null;
  subWalletId: string;
}

// Stats from GET /api/v1/admin/wallets → data.stats
export interface WalletStats {
  totalCustodyValueUsdt: number;
  usdtFloat: number;
  otherCoinsFloat: number;
  frozenWalletsCount: number;
}

// Ledger activity summary from GET /api/v1/admin/wallets/{id}/ledger → data.activitySummary
export interface WalletActivitySummary {
  totalDeposited: number;
  totalWithdrawn: number;
  totalSwappedIn: number;
  totalSwappedOut: number;
}

// Ledger entry — shape currently unknown from API; typed loosely until populated
export interface WalletLedgerEntry {
  [key: string]: unknown;
}

// Detail from GET /api/v1/admin/wallets/{id}/ledger → data
export interface WalletLedger {
  walletDbId: number;
  walletId: string;
  coin: string;
  ledgerBalance: number;
  availableBalance: number;
  isFrozen: boolean;
  activitySummary: WalletActivitySummary;
  entries: WalletLedgerEntry[];
  totalEntries: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}

// Query params for GET /api/v1/admin/wallets
export interface WalletsFilter {
  Search?: string;
  Coin?: string;
  Status?: string;
  DateFrom?: string;
  DateTo?: string;
  PageNo?: number;
  PageSize?: number;
}

// Paginated list response shape extracted from data envelope
export interface WalletListResult {
  items: Wallet[];
  stats: WalletStats;
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
