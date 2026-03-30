import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/services/dashboard.service";
import { DashboardOverview } from "@/types/dashboard";

export function useDashboardOverview(period: string) {
  return useQuery({
    queryKey: ["dashboard-overview", period] as const,
    queryFn: () => getDashboardOverview(period),
    select: (data: unknown) => (data as any)?.data as DashboardOverview,
  });
}
