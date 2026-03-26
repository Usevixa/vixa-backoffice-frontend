import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTransactions,
  getTransactionById,
  exportTransactions,
} from "@/services/transaction.service";
import {
  Transaction,
  TransactionDetail,
  TransactionListResult,
  TransactionsFilter,
} from "@/types/transaction";

function getErrorMessage(err: unknown): string {
  const backendMessage = (err as any)?.response?.data?.message;
  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useTransactions(filters: TransactionsFilter) {
  const params: Record<string, string | number> = {};
  if (filters.Search?.trim()) params.Search = filters.Search.trim();
  if (filters.Type && filters.Type !== "all") params.Type = filters.Type;
  if (filters.TransactionType && filters.TransactionType !== "all")
    params.TransactionType = filters.TransactionType;
  if (filters.Status && filters.Status !== "all") params.Status = filters.Status;
  if (filters.Coin && filters.Coin !== "all") params.Coin = filters.Coin;
  if (filters.DateFrom) params.DateFrom = filters.DateFrom;
  if (filters.DateTo) params.DateTo = filters.DateTo;
  params.PageNo = filters.PageNo ?? 1;
  params.PageSize = filters.PageSize ?? 25;

  return useQuery({
    queryKey: ["transactions", params] as const,
    queryFn: () => getTransactions(params),
    select: (data: unknown): TransactionListResult => ({
      items: ((data as any)?.data?.items ?? []) as Transaction[],
      totalCount: (data as any)?.data?.totalCount ?? 0,
      pageNo: (data as any)?.data?.pageNo ?? 1,
      pageSize: (data as any)?.data?.pageSize ?? 25,
      totalPages: Math.max(1, (data as any)?.data?.totalPages ?? 1),
    }),
  });
}

export function useTransactionDetail(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["transaction", id] as const,
    queryFn: () => getTransactionById(id!),
    enabled: enabled && !!id,
    select: (data: unknown) => (data as any)?.data as TransactionDetail,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useExportTransactions() {
  return useMutation({
    mutationFn: (params: Record<string, string | number>) => exportTransactions(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
