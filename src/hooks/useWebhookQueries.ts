import { useQuery } from "@tanstack/react-query";
import { getWebhookLogs, getWebhookLogById } from "@/services/webhook.service";
import {
  WebhookLogDetail,
  WebhookLogListResult,
  WebhookLogsFilter,
} from "@/types/webhook";

export function useWebhookLogs(filters: WebhookLogsFilter) {
  const params: Record<string, string | number> = {};
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.source && filters.source !== "all") params.source = filters.source;
  if (filters.category && filters.category !== "all") params.category = filters.category;
  if (filters.status && filters.status !== "all") params.status = filters.status;
  params.page = filters.page ?? 1;
  params.pageSize = filters.pageSize ?? 15;

  return useQuery({
    queryKey: ["webhook-logs", params] as const,
    queryFn: () => getWebhookLogs(params),
    select: (data: unknown): WebhookLogListResult => ({
      stats: (data as any)?.data?.stats ?? {
        totalWebhooks24h: 0,
        successRate: 0,
        failed24h: 0,
        avgResponseTimeMs: 0,
      },
      providers: (data as any)?.data?.providers ?? [],
      items: (data as any)?.data?.items ?? [],
      totalCount: (data as any)?.data?.totalCount ?? 0,
      pageNo: (data as any)?.data?.pageNo ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 15,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useWebhookLogDetail(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["webhook-log", id] as const,
    queryFn: () => getWebhookLogById(id!),
    enabled: enabled && !!id,
    select: (data: unknown) => (data as any)?.data as WebhookLogDetail,
  });
}
