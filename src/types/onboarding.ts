// List item from GET /api/v1/admin/onboarding/dropoffs → data.items[]
export interface OnboardingDropoff {
  progressId: number;
  userId: string | null;
  phoneNumber: string;
  fullName: string | null;
  email: string | null;
  stage: string;
  reminderCount: number;
  hasOptedOut: boolean;
  lastUpdatedAt: string;
  createdAt: string;
  hoursStuck: number;
  lastReminderSentAt: string | null;
}

// Paginated list result extracted from response envelope
export interface OnboardingDropoffListResult {
  items: OnboardingDropoff[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Funnel stats from GET /api/v1/admin/onboarding/funnel → data
export interface OnboardingFunnel {
  totalStarted: number;
  completionRatePct: number;
  activeDropOffs: number;
  optedOut: number;
}

// One step in the stage timeline from GET /api/v1/admin/onboarding/user/{phoneNumber}
export interface OnboardingStageStep {
  stage: string;
  status: "Completed" | "Failed" | "Pending";
  failureReason: string | null;
  occurredAt: string | null;
}

// User detail from GET /api/v1/admin/onboarding/user/{phoneNumber} → data
export interface OnboardingUserDetail {
  progressId: number;
  userId: string | null;
  phoneNumber: string;
  fullName: string | null;
  email: string | null;
  stage: string;
  onboardingStatus: string;
  reminderCount: number;
  hasOptedOut: boolean;
  hoursStuck: number;
  createdAt: string;
  lastUpdatedAt: string;
  lastReminderSentAt: string | null;
  stageTimeline: OnboardingStageStep[];
}

// Query params for GET /api/v1/admin/onboarding/dropoffs
export interface OnboardingDropoffsFilter {
  search?: string;
  stage?: string;
  onlyActive?: boolean;
  page?: number;
  pageSize?: number;
}
