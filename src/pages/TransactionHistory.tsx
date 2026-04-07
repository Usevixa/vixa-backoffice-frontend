import { useState, useEffect } from "react";
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Send,
  Inbox,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { useTransactions, useExportTransactions } from "@/hooks/useTransactionQueries";
import { TransactionDetailsSheet } from "@/components/transactions/TransactionDetailsSheet";

const typeIcons: Record<string, typeof ArrowDownLeft> = {
  Withdrawal: ArrowUpRight,
  Deposit: ArrowDownLeft,
  Swap: RefreshCw,
  Send: Send,
  Receive: Inbox,
};

const typeColors: Record<string, string> = {
  Withdrawal: "bg-primary/10 text-primary",
  Deposit: "bg-success/10 text-success",
  Swap: "bg-warning/10 text-warning",
  Send: "bg-primary/10 text-primary",
  Receive: "bg-success/10 text-success",
};

const txTypeColors: Record<string, string> = {
  "On-Chain": "bg-primary/10 text-primary",
  "On-Ramp": "bg-success/10 text-success",
  Internal: "bg-muted text-muted-foreground",
};

const PAGE_SIZE_OPTIONS = [15, 25, 50];

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["completed", "confirmed", "credited", "complete"].includes(s)) return "success";
  if (["pending", "processing", "leg1_pending", "leg2_pending"].includes(s)) return "warning";
  return "error";
}

export default function TransactionHistory() {
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Filter state
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [transactionType, setTransactionType] = useState("all");
  const [status, setStatus] = useState("all");
  const [coin, setCoin] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Debounce search — waits 400ms after the user stops typing
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, type, transactionType, status, coin, dateFrom, dateTo]);

  const { data, isLoading, isError } = useTransactions({
    Search: search,
    Type: type,
    TransactionType: transactionType,
    Status: status,
    Coin: coin,
    DateFrom: dateFrom || undefined,
    DateTo: dateTo || undefined,
    PageNo: currentPage,
    PageSize: pageSize,
  });

  const transactions = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  const exportMutation = useExportTransactions();

  const buildExportParams = (): Record<string, string | number> => {
    const params: Record<string, string | number> = {};
    if (search) params.Search = search;
    if (type !== "all") params.Type = type;
    if (transactionType !== "all") params.TransactionType = transactionType;
    if (status !== "all") params.Status = status;
    if (coin !== "all") params.Coin = coin;
    if (dateFrom) params.DateFrom = dateFrom;
    if (dateTo) params.DateTo = dateTo;
    return params;
  };

  const hasActiveFilters =
    !!searchInput || type !== "all" || transactionType !== "all" ||
    status !== "all" || coin !== "all" || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setType("all");
    setTransactionType("all");
    setStatus("all");
    setCoin("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleViewTransaction = (id: number) => {
    setSelectedTxId(id);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Transaction History</h1>
          <p className="page-description">
            Unified view of all deposits, withdrawals, sends, receives, and swaps — USDT reporting
          </p>
        </div>
        <Button
          variant="outline"
          disabled={exportMutation.isPending}
          onClick={() => exportMutation.mutate(buildExportParams())}
        >
          <Download className="mr-2 h-4 w-4" />
          {exportMutation.isPending ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Date range row */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">From</span>
          <Input
            type="date"
            className="w-40"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="text-sm text-muted-foreground">To</span>
          <Input
            type="date"
            className="w-40"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="mr-1 h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
        {/* Other filters row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search user, reference, sub-wallet..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Deposit">Deposit</SelectItem>
              <SelectItem value="Withdrawal">Withdrawal</SelectItem>
              <SelectItem value="Send">Send</SelectItem>
              <SelectItem value="Receive">Receive</SelectItem>
              <SelectItem value="Swap">Swap</SelectItem>
            </SelectContent>
          </Select>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tx Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tx Types</SelectItem>
              <SelectItem value="On-Chain">On-Chain</SelectItem>
              <SelectItem value="On-Ramp">On-Ramp</SelectItem>
              <SelectItem value="Internal">Internal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CREDITED">Credited</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="LEG1_PENDING">Leg 1 Pending</SelectItem>
              <SelectItem value="LEG2_PENDING">Leg 2 Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={coin} onValueChange={setCoin}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Coin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coins</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="SOL">SOL</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="BTC">BTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Tx Type</th>
              <th>User</th>
              <th>Coin / Pair</th>
              <th>Amount</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={9} className="py-12">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-destructive">
                  Failed to load transactions. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && transactions.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                  No transactions found.
                </td>
              </tr>
            )}
            {transactions.map((tx) => {
              const Icon = typeIcons[tx.type] ?? ArrowDownLeft;
              return (
                <tr
                  key={tx.id}
                  className="cursor-pointer"
                  onClick={() => handleViewTransaction(tx.id)}
                >
                  <td className="text-muted-foreground text-sm">
                    {new Date(tx.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full flex-shrink-0",
                          typeColors[tx.type] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium">{tx.type}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                        txTypeColors[tx.transactionType] ?? "bg-muted text-muted-foreground"
                      )}
                    >
                      {tx.transactionType}
                    </span>
                  </td>
                  <td>
                    <p className="text-sm font-medium">{tx.userFullName}</p>
                  </td>
                  <td className="font-medium text-sm">{tx.coinPair}</td>
                  <td>
                    <p className="font-semibold text-sm">{Number(tx.amount).toFixed(4)}</p>
                    <p className="text-xs text-muted-foreground">
                      {Number(tx.usdtEquivalent).toFixed(2)} USDT
                    </p>
                  </td>
                  <td className="text-muted-foreground text-sm">{Number(tx.fee).toFixed(3)}</td>
                  <td>
                    <StatusBadge status={statusVariant(tx.status)}>{tx.status}</StatusBadge>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground max-w-[160px] truncate">
                    {tx.reference}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {totalCount === 0
              ? "0"
              : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                  currentPage * pageSize,
                  totalCount
                )}`}{" "}
            of {totalCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={currentPage === p ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(p)}
              className="w-8 px-0"
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TransactionDetailsSheet
        transactionId={selectedTxId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
