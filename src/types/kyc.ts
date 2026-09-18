// Shape of items from GET /api/v1/admin/kyc → data.items[]
export interface KycRecord {
  userId: string;
  internalId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  kycStatus: string;
  submittedAt: string | null;
  lastUpdated: string | null;
}

// Shape from GET /api/v1/admin/kyc/{userId} → data
export interface KycDetail extends KycRecord {
  nationality: string | null;
  documentType: string | null;
  documentNumber: string | null;
  issuingCountry: string | null;
  address: string | null;
  provider: string | null;
  providerRef: string | null;
  reviewedBy: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  reviewComment: string | null;
  reviewHistory: KycReviewEntry[];
}

export interface KycReviewEntry {
  id?: number;
  action: string;
  actionDisplay?: string;
  comment: string;
  reviewerName: string;
  timestamp: string;
}

// Shape from GET /api/v1/admin/kyc/stats → data
export interface KycStats {
  total: number;
  verified: number;
  pending: number;
  pendingApproval: number;
  failedOrRejected: number;
}

export interface KycFilter {
  Search?: string;
  Status?: string;
  DateFrom?: string;
  DateTo?: string;
  PageNo?: number;
  PageSize?: number;
}

export interface KycListResult {
  items: KycRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Payload for POST /api/v1/admin/kyc/{userId}/review
export interface KycReviewPayload {
  action: "Approve" | "Reject";
  comment: string;
}
