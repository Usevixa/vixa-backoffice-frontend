import { useState, useEffect } from "react";
import {
  Search,
  ArrowUpRight,
  Eye,
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
import { useSends, useSendStats } from "@/hooks/useSendQueries";
import { SendDetailsSheet } from "@/components/sends/SendDetailsSheet";

const assetColors: Record<string, string> = {
  USDT: "bg-primary/10 text-primary",
  USDC: "bg-warning/10 text-warning",
};

const txTypeColors: Record<string, string> = {
  "On-Chain": "bg-primary/10 text-primary",
  "On-Ramp": "bg-success/10 text-success",
  Internal: "bg-muted text-muted-foreground",
};

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["completed", "confirmed", "credited", "complete"].includes(s)) return "success";
  if (["pending", "processing", "initiated"].includes(s)) return "warning";
  return "error";
}

export default function OxsSend() {
  const [selectedSendId, setSelectedSendId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filter state
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [coin, setCoin] = useState("all");
  const [txType, setTxType] = useState("all");
  const [status, setStatus] = useState("all");
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
  }, [search, coin, txType, status, dateFrom, dateTo]);

  const { data, isLoading, isError } = useSends({
    Search: search,
    Coin: coin,
    TxType: txType,
    Status: status,
    DateFrom: dateFrom || undefined,
    DateTo: dateTo || undefined,
    PageNo: currentPage,
    PageSize: pageSize,
  });

  const { data: stats } = useSendStats();

  const sends = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  const hasActiveFilters =
    !!searchInput || coin !== "all" || txType !== "all" ||
    status !== "all" || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCoin("all");
    setTxType("all");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Send (OpenXSwitch)</h1>
          <p className="page-description">
            Customer-initiated value transfers from sub-wallets — executed via OpenXSwitch custody
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          OpenXSwitch · SEND primitive
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card border-primary/30">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <p className="metric-label">Total Send Volume</p>
          </div>
          <p className="metric-value mt-1 text-primary">
            {stats ? `${Number(stats.totalAmount).toFixed(2)} USDT` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats ? `${stats.totalCount} transactions` : ""}
          </p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Confirmed</p>
          <p className="metric-value mt-1 text-success">{stats?.completedCount ?? "—"}</p>
          {stats && stats.completedTodayCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{stats.completedTodayCount} today</p>
          )}
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Processing</p>
          <p className="metric-value mt-1 text-warning">{stats?.pendingCount ?? "—"}</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed (24h)</p>
          <p className="metric-value mt-1 text-destructive">{stats?.failed24hCount ?? "—"}</p>
          {stats && stats.successRate > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{stats.successRate}% success rate</p>
          )}
        </div>
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
              placeholder="Search send ref, sub-wallet, tx hash..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select value={coin} onValueChange={setCoin}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Coin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coins</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="BTC">BTC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
            </SelectContent>
          </Select>
          <Select value={txType} onValueChange={setTxType}>
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
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
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
              <th>From Sub-wallet</th>
              <th>To Destination</th>
              <th>Coin</th>
              <th>Tx Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>OXS Ref</th>
              <th className="text-right">Actions</th>
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
                  Failed to load sends. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && sends.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                  No sends found.
                </td>
              </tr>
            )}
            {sends.map((snd) => (
              <tr
                key={snd.id}
                className={cn(
                  "cursor-pointer",
                  statusVariant(snd.status) === "error" && "bg-destructive/5"
                )}
                onClick={() => { setSelectedSendId(snd.id); setSheetOpen(true); }}
              >
                <td className="text-muted-foreground text-sm">
                  {new Date(snd.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <div>
                    <p className="font-mono text-sm font-medium">
                      {snd.fromSubwalletId.substring(0, 10)}…
                    </p>
                    <p className="text-xs text-muted-foreground">{snd.userFullName}</p>
                  </div>
                </td>
                <td className="font-mono text-sm text-muted-foreground max-w-[120px] truncate">
                  {snd.destination}
                </td>
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      assetColors[snd.coin] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {snd.coin}
                  </span>
                </td>
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      txTypeColors[snd.txType] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {snd.txType}
                  </span>
                </td>
                <td>
                  <p className="font-semibold text-sm">{Number(snd.amount).toFixed(4)}</p>
                  {snd.fee > 0 && (
                    <p className="text-xs text-muted-foreground">Fee: {Number(snd.fee).toFixed(4)}</p>
                  )}
                </td>
                <td>
                  <StatusBadge status={statusVariant(snd.status)}>
                    {snd.statusDisplay ?? snd.status}
                  </StatusBadge>
                </td>
                <td className="font-mono text-xs text-muted-foreground max-w-[160px] truncate">
                  {snd.oxsRef}
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setSelectedSendId(snd.id); setSheetOpen(true); }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {totalCount === 0
            ? "0"
            : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                currentPage * pageSize,
                totalCount
              )}`}{" "}
          of {totalCount}
        </span>
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

      <SendDetailsSheet
        sendId={selectedSendId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
