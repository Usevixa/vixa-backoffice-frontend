export interface KycRecord {
  id: number;
  userId: string;
  userFullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  status: string;
  statusDisplay: string;
  submittedAt: string | null;
  updatedAt: string | null;
  reviewerName: string | null;
}

export interface KycReviewEntry {
  id: number;
  action: string;
  actionDisplay: string;
  comment: string;
  reviewerName: string;
  timestamp: string;
}

export interface KycDetail extends KycRecord {
  documentType: string | null;
  documentNumber: string | null;
  issuingCountry: string | null;
  nationality: string | null;
  address: string | null;
  reviewedAt: string | null;
  reviewComment: string | null;
  reviewHistory: KycReviewEntry[];
}

export interface KycStats {
  totalCount: number;
  verifiedCount: number;
  pendingCount: number;
  pendingApprovalCount: number;
  failedCount: number;
  rejectedCount: number;
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
  pageNo: number;
  pageSize: number;
  totalPages: number;
}

export interface KycDecisionPayload {
  comment: string;
}
