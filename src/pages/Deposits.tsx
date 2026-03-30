import { useState, useEffect } from "react";
import {
  Search,
  ArrowDownLeft,
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
import { useDeposits, useDepositStats } from "@/hooks/useDepositQueries";
import { DepositDetailsSheet } from "@/components/deposits/DepositDetailsSheet";

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["credited", "completed", "confirmed", "complete"].includes(s)) return "success";
  if (["processing", "pending", "detected"].includes(s)) return "warning";
  return "error";
}

export default function Deposits() {
  const [selectedDepositId, setSelectedDepositId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filter state
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [asset, setAsset] = useState("all");
  const [network, setNetwork] = useState("all");
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
  }, [search, asset, network, status, dateFrom, dateTo]);

  const { data, isLoading, isError } = useDeposits({
    Search: search,
    Asset: asset,
    Network: network,
    Status: status,
    DateFrom: dateFrom || undefined,
    DateTo: dateTo || undefined,
    PageNo: currentPage,
    PageSize: pageSize,
  });

  const { data: stats } = useDepositStats();

  const deposits = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  const hasActiveFilters =
    !!searchInput || asset !== "all" || network !== "all" ||
    status !== "all" || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setAsset("all");
    setNetwork("all");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Deposits (Network In)</h1>
          <p className="page-description">
            USDT deposits via Yellow Card → credited into OpenXSwitch sub-wallets
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Yellow Card → OpenXSwitch sub-wallet · Asset: USDT
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card border-success/30">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="h-4 w-4 text-success" />
            <p className="metric-label">Total Deposits</p>
          </div>
          <p className="metric-value mt-1 text-success">
            {stats ? `${Number(stats.totalAmount).toFixed(2)} USDT` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats ? `${stats.totalCount} deposits` : ""}
          </p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Confirmed / Credited</p>
          <p className="metric-value mt-1 text-success">{stats?.completedCount ?? "—"}</p>
          {stats && stats.completedTodayCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{stats.completedTodayCount} today</p>
          )}
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Processing</p>
          <p className="metric-value mt-1 text-warning">{stats?.pendingCount ?? "—"}</p>
          {stats && stats.slaBreachCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{stats.slaBreachCount} SLA breach</p>
          )}
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
              placeholder="Search user, deposit ref, YC ref, OXS ref..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select value={asset} onValueChange={setAsset}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
            </SelectContent>
          </Select>
          <Select value={network} onValueChange={setNetwork}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Networks</SelectItem>
              <SelectItem value="SOL">SOL</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="TRX">TRX</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="credited">Credited</SelectItem>
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
              <th>User / Sub-wallet</th>
              <th>Country</th>
              <th>YC Channel</th>
              <th>Asset / Network</th>
              <th>Amount (USDT)</th>
              <th>Status</th>
              <th>YC Reference</th>
              <th>OXS Reference</th>
              <th className="text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={10} className="py-12">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-sm text-destructive">
                  Failed to load deposits. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && deposits.length === 0 && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                  No deposits found.
                </td>
              </tr>
            )}
            {deposits.map((dep) => (
              <tr
                key={dep.id}
                className={cn(
                  "cursor-pointer",
                  statusVariant(dep.status) === "error" && "bg-destructive/5"
                )}
                onClick={() => { setSelectedDepositId(dep.id); setSheetOpen(true); }}
              >
                <td className="text-muted-foreground text-sm">
                  {new Date(dep.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <div>
                    <p className="font-medium text-sm">{dep.userFullName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {dep.subwalletId.substring(0, 10)}…
                    </p>
                  </div>
                </td>
                <td>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">
                    {dep.country}
                  </span>
                </td>
                <td>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-warning/10 text-warning">
                    {dep.ycChannel}
                  </span>
                </td>
                <td>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                    {dep.asset}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">{dep.network}</span>
                </td>
                <td>
                  <p className="font-semibold text-sm text-success">
                    {Number(dep.amountUsdt).toFixed(2)}
                  </p>
                  {dep.amountNgn > 0 && (
                    <p className="text-xs text-muted-foreground">
                      ≈ ₦{Number(dep.amountNgn).toLocaleString()}
                    </p>
                  )}
                </td>
                <td>
                  <StatusBadge status={statusVariant(dep.status)}>
                    {dep.statusDisplay ?? dep.status}
                  </StatusBadge>
                </td>
                <td className="font-mono text-xs text-muted-foreground max-w-[160px] truncate">
                  {dep.ycReference}
                </td>
                <td className="font-mono text-xs text-muted-foreground max-w-[160px] truncate">
                  {dep.oxsReference ?? "—"}
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setSelectedDepositId(dep.id); setSheetOpen(true); }}
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

      <DepositDetailsSheet
        depositId={selectedDepositId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
