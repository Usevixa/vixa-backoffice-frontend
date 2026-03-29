import { useQuery } from "@tanstack/react-query";
import { getWallets, getWalletLedger } from "@/services/wallet.service";
import { WalletLedger, WalletListResult, WalletsFilter } from "@/types/wallet";

export function useWallets(filters: WalletsFilter) {
  const params: Record<string, string | number | boolean> = {};
  if (filters.Search?.trim()) params.Search = filters.Search.trim();
  if (filters.Coin && filters.Coin !== "all") params.Coin = filters.Coin;
  if (filters.Status && filters.Status !== "all") params.Status = filters.Status;
  if (filters.DateFrom) params.DateFrom = filters.DateFrom;
  if (filters.DateTo) params.DateTo = filters.DateTo;
  params.PageNo = filters.PageNo ?? 1;
  params.PageSize = filters.PageSize ?? 20;

  return useQuery({
    queryKey: ["wallets", params] as const,
    queryFn: () => getWallets(params),
    select: (data: unknown): WalletListResult => ({
      items: (data as any)?.data?.items ?? [],
      stats: (data as any)?.data?.stats ?? {
        totalCustodyValueUsdt: 0,
        usdtFloat: 0,
        otherCoinsFloat: 0,
        frozenWalletsCount: 0,
      },
      totalCount: (data as any)?.data?.totalCount ?? 0,
      pageNo: (data as any)?.data?.pageNo ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 20,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useWalletLedger(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["wallet-ledger", id] as const,
    queryFn: () => getWalletLedger(id!),
    enabled: enabled && !!id,
    select: (data: unknown) => (data as any)?.data as WalletLedger,
  });
}
