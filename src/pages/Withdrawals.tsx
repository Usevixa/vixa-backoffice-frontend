import { useState, useEffect } from "react";
import {
  Search,
  ArrowUpRight,
  AlertTriangle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useWithdrawals, useWithdrawalStats } from "@/hooks/useWithdrawalQueries";
import { WithdrawalDetailsSheet } from "@/components/withdrawals/WithdrawalDetailsSheet";
import { Withdrawal } from "@/types/withdrawal";

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["completed", "confirmed", "complete"].includes(s)) return "success";
  if (["processing", "pending", "initiated"].includes(s)) return "warning";
  return "error";
}

export default function Withdrawals() {
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [queuePage, setQueuePage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [coin, setCoin] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, coin, status, dateFrom, dateTo]);

  const { data: stats } = useWithdrawalStats();

  const { data, isLoading, isError } = useWithdrawals({
    Search: search,
    Coin: coin,
    Status: status,
    DateFrom: dateFrom || undefined,
    DateTo: dateTo || undefined,
    PageNo: currentPage,
    PageSize: pageSize,
  });
  const withdrawals = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  const { data: queueData, isLoading: queueLoading, isError: queueError } = useWithdrawals({
    QueueOnly: true,
    PageNo: queuePage,
    PageSize: pageSize,
  });
  const queueItems = queueData?.items ?? [];
  const queueTotal = queueData?.totalCount ?? 0;
  const queueTotalPages = queueData?.totalPages ?? 1;

  const hasActiveFilters =
    !!searchInput || coin !== "all" || status !== "all" || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCoin("all");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const openDetail = (id: number) => {
    setSelectedWithdrawalId(id);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Withdrawals (Network Out)</h1>
          <p className="page-description">
            USDT withdrawals: OpenXSwitch debit → Yellow Card → destination address
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          OXS → Yellow Card → Polygon · Asset: USDT
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <p className="metric-label">Completed Today</p>
          </div>
          <p className="metric-value mt-1">{stats?.completedToday ?? "—"}</p>
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Pending / In-Flight</p>
          <p className="metric-value mt-1 text-warning">{stats?.pending ?? "—"}</p>
          {stats && stats.slaBreachCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{stats.slaBreachCount} SLA breach</p>
          )}
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed (24h)</p>
          <p className="metric-value mt-1 text-destructive">{stats?.failed24h ?? "—"}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Avg Processing Time</p>
          <p className="metric-value mt-1">
            {stats ? `${Number(stats.avgProcessingMinutes).toFixed(1)} min` : "—"}
          </p>
        </div>
      </div>

      {/* SLA Breach Alert Banner */}
      {queueTotal > 0 && (
        <div className="alert-card alert-card-error">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {queueTotal} withdrawal(s) breaching SLA (&gt;30 min)
            </p>
            <p className="text-xs text-muted-foreground">Immediate investigation required</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setActiveTab("queue")}>
            View Queue
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Withdrawals</TabsTrigger>
          <TabsTrigger value="queue" className="relative">
            Queue
            {queueTotal > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning text-xs text-warning-foreground">
                {queueTotal}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* All Withdrawals Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="space-y-3">
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
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search user, withdrawal ref, OX ref, YC ref..."
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
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <WithdrawalsTable
            items={withdrawals}
            isLoading={isLoading}
            isError={isError}
            onSelect={openDetail}
          />
          <WithdrawalsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </TabsContent>

        {/* Queue Tab */}
        <TabsContent value="queue" className="space-y-4">
          <WithdrawalsTable
            items={queueItems}
            isLoading={queueLoading}
            isError={queueError}
            onSelect={openDetail}
          />
          <WithdrawalsPagination
            currentPage={queuePage}
            totalPages={queueTotalPages}
            totalCount={queueTotal}
            pageSize={pageSize}
            onPageChange={setQueuePage}
          />
        </TabsContent>
      </Tabs>

      <WithdrawalDetailsSheet
        withdrawalId={selectedWithdrawalId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}

function WithdrawalsTable({
  items,
  isLoading,
  isError,
  onSelect,
}: {
  items: Withdrawal[];
  isLoading: boolean;
  isError: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="content-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User / Sub-wallet</th>
            <th>Amount</th>
            <th>Final Amount</th>
            <th>Bank</th>
            <th>Destination</th>
            <th>Status</th>
            <th>OX Reference</th>
            <th className="text-right">View</th>
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
                Failed to load withdrawals. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && items.length === 0 && (
            <tr>
              <td colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                No withdrawals found.
              </td>
            </tr>
          )}
          {items.map((w) => (
            <tr
              key={w.id}
              className={cn(
                "cursor-pointer",
                w.slaBreached && "bg-warning/5",
                statusVariant(w.status) === "error" && "bg-destructive/5"
              )}
              onClick={() => onSelect(w.id)}
            >
              <td className="text-muted-foreground text-sm">
                {new Date(w.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td>
                <div>
                  <p className="font-medium text-sm">{w.userFullName}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {w.subwalletId.substring(0, 10)}…
                  </p>
                </div>
              </td>
              <td>
                <p className="font-semibold text-sm">
                  {Number(w.amount).toFixed(2)} {w.coin}
                </p>
              </td>
              <td>
                {w.finalAmount != null ? (
                  <div>
                    <p className="font-semibold text-sm text-success">
                      {Number(w.finalAmount).toFixed(2)} {w.coin}
                    </p>
                    {w.fiatAmount != null && w.currency && (
                      <p className="text-xs text-muted-foreground">
                        ≈ {Number(w.fiatAmount).toLocaleString()} {w.currency}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td>
                {w.bankName ? (
                  <div>
                    <p className="text-sm">{w.bankName}</p>
                    {w.accountNumber && (
                      <p className="text-xs text-muted-foreground font-mono">
                        ••••{w.accountNumber.slice(-4)}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="font-mono text-xs text-muted-foreground max-w-[120px] truncate">
                {w.destinationAddress ?? "—"}
              </td>
              <td>
                <StatusBadge status={statusVariant(w.status)}>
                  {w.statusDisplay ?? w.status}
                </StatusBadge>
              </td>
              <td className="font-mono text-xs text-muted-foreground max-w-[140px] truncate">
                {w.oxReference ?? "—"}
              </td>
              <td className="text-right" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" variant="ghost" onClick={() => onSelect(w.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WithdrawalsPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  return (
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
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={currentPage === p ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(p)}
            className="w-8 px-0"
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
