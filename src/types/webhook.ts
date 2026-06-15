// List item from GET /api/v1/admin/webhooks/logs → data.items[]
export interface WebhookLog {
  id: number;
  source: string;
  eventCategory: string;
  event: string;
  status: string;
  retries: number;
  linkedTransfer: string | null;
  responseTimeMs: number;
  timestamp: string;
}

// Detail from GET /api/v1/admin/webhooks/logs/{id} → data
export interface WebhookLogDetail extends WebhookLog {
  endpoint: string;
  signatureValid: boolean;
  rawPayload: string;
  error: string | null;
  correlationId: string | null;
}

// Stats block from list response → data.stats
export interface WebhookStats {
  totalWebhooks24h: number;
  successRate: number;
  failed24h: number;
  avgResponseTimeMs: number;
}

// Provider entry from list response → data.providers[]
export interface WebhookProvider {
  name: string;
  status: string;
  avgLatencyMs?: number;
}

// Query params — API uses lowercase names (unlike other endpoints)
export interface WebhookLogsFilter {
  search?: string;
  source?: string;
  category?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

// Extracted shape from response envelope
export interface WebhookLogListResult {
  stats: WebhookStats;
  providers: WebhookProvider[];
  items: WebhookLog[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}
