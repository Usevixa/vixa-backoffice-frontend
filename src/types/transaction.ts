// List item from GET /api/v1/admin/transactions → data.items[]
export interface Transaction {
  id: number;
  timestamp: string;
  type: string;
  transactionType: string;
  userId: string;
  userFullName: string;
  subwalletId: string;
  coinPair: string;
  amount: number;
  usdtEquivalent: number;
  status: string;
  reference: string;
  externalRef: string;
  oxsRef: string;
  ycRef: string;
  narration: string;
  channel: string;
  fee: number;
  updatedAt: string;
}

// Detail from GET /api/v1/admin/transactions/{id} → data
export interface TransactionDetail {
  id: number;
  timestamp: string;
  type: string;
  transactionType: string;
  status: string;
  userId: string;
  userFullName: string;
  userPhone: string;
  userEmail: string;
  walletId: number;
  subwalletId: string;
  coinPair: string;
  amount: number;
  fee: number;
  networkFee: number;
  partnerFee: number;
  totalAmount: number;
  usdtEquivalent: number;
  coin: string;
  chain: string;
  currency: string;
  isCrypto: boolean;
  reference: string;
  externalRef: string;
  oxsRef: string;
  ycRef: string;
  correlationId: string;
  idempotencyKey: string;
  narration: string;
  remarks: string;
  channel: string;
  responseCode: string;
  updatedAt: string;
  ledgerEntries: any[];
}

// Query params for GET /api/v1/admin/transactions
export interface TransactionsFilter {
  Search?: string;
  Type?: string;
  TransactionType?: string;
  Status?: string;
  Coin?: string;
  DateFrom?: string;
  DateTo?: string;
  PageNo?: number;
  PageSize?: number;
}

// Paginated list response shape extracted from data envelope
export interface TransactionListResult {
  items: Transaction[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
