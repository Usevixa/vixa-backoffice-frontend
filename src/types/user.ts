// User shape from GET /api/v1/admin/users
export interface User {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  kycStatus: string;
  riskLevel: string;
  walletStatus: string;
  ngnBalance: number;
  usdtBalance: number;
  joinedAt: string;
  isFlagged: boolean;
  canWithdraw: boolean;
}

// Note shape from GET /api/v1/admin/users/{userId}/notes → data.notes[]
export interface UserNote {
  id: number;
  noteText: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

// Query params for GET /api/v1/admin/users
export interface UsersFilter {
  Search?: string;
  KycStatus?: string;
  RiskLevel?: string;
  WalletStatus?: string;
}

// Payload for PUT /api/v1/admin/users/{userId}/notes
export interface UpdateNotesPayload {
  notes: string;
}

// Payload for POST /api/v1/admin/users/{userId}/withderawal
export interface ToggleWithdrawalPayload {
  enabled: boolean;
  reason: string;
}

// Payload for POST /api/v1/admin/users/{userId}/flag
export interface FlagUserPayload {
  isFlagged: boolean;
  reason: string;
}
