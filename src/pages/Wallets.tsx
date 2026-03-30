import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Lock, History, Edit, AlertTriangle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useWallets, useWalletLedger } from "@/hooks/useWalletQueries";
import { Wallet } from "@/types/wallet";

const coinColors: Record<string, string> = {
  USDT: "bg-primary/10 text-primary",
  USDC: "bg-warning/10 text-warning",
  SOL: "bg-success/10 text-success",
  ETH: "bg-primary/10 text-primary",
  ADA: "bg-warning/10 text-warning",
  BTC: "bg-warning/10 text-warning",
};

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "-";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function walletDisplayId(wallet: Wallet): string {
  return wallet.walletId ?? `WAL-${wallet.id}`;
}

export default function Wallets() {
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adjustReason, setAdjustReason] = useState("");

  const [search, setSearch] = useState("");
  const [coin, setCoin] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pageNo, setPageNo] = useState(1);

  const { data, isLoading } = useWallets({ Search: search, Coin: coin, Status: status, DateFrom: dateFrom || undefined, DateTo: dateTo || undefined, PageNo: pageNo, PageSize: 20 });
  const { data: ledger, isLoading: ledgerLoading } = useWalletLedger(selectedWalletId, sheetOpen);

  const items = data?.items ?? [];
  const stats = data?.stats;
  const totalPages = data?.totalPages ?? 1;

  const selectedWallet = items.find((w) => w.id === selectedWalletId) ?? null;

  function openLedger(wallet: Wallet) {
    setSelectedWalletId(wallet.id);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Wallets & Ledger</h1>
        <p className="page-description">
          Monitor and manage all user wallets — multi-coin. All totals shown in USDT equivalent.
        </p>
      </div>

      {/* Stats — USDT equiv as primary */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card border-primary/30">
          <p className="metric-label">Total Custody Value</p>
          <p className="metric-value mt-1 text-primary">
            {stats ? `${Number(stats.totalCustodyValueUsdt).toFixed(2)} USDT` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">USDT equivalent (all wallets)</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">USDT Float</p>
          <p className="metric-value mt-1">
            {stats ? `${Number(stats.usdtFloat).toFixed(2)} USDT` : "—"}
          </p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Other Coins Float</p>
          <p className="metric-value mt-1">
            {stats ? `${Number(stats.otherCoinsFloat).toFixed(2)} USDT` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">SOL, ETH, ADA, USDC equiv</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Frozen Wallets</p>
          <p className="metric-value mt-1 text-destructive">
            {stats ? String(stats.frozenWalletsCount) : "—"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by wallet ID or user..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPageNo(1); }}
          />
        </div>
        <Select value={coin} onValueChange={(v) => { setCoin(v); setPageNo(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Coin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Coins</SelectItem>
            <SelectItem value="USDT">USDT</SelectItem>
            <SelectItem value="USDC">USDC</SelectItem>
            <SelectItem value="SOL">SOL</SelectItem>
            <SelectItem value="ETH">ETH</SelectItem>
            <SelectItem value="ADA">ADA</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPageNo(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="frozen">Frozen</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          className="w-40"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPageNo(1); }}
        />
        <span className="text-sm text-muted-foreground">to</span>
        <Input
          type="date"
          className="w-40"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPageNo(1); }}
        />
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Wallets Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Wallet ID</th>
              <th>User</th>
              <th>Coin</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Last Activity</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  No wallets found.
                </td>
              </tr>
            ) : (
              items.map((wallet) => (
                <tr key={wallet.id}>
                  <td className="font-medium font-mono text-sm">{walletDisplayId(wallet)}</td>
                  <td>
                    <div>
                      <p className="font-medium">{wallet.userFullName}</p>
                      <p className="text-xs text-muted-foreground">{wallet.userId.slice(0, 8)}…</p>
                    </div>
                  </td>
                  <td>
                    <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", coinColors[wallet.coin] || "bg-muted text-muted-foreground")}>
                      {wallet.coin}
                    </span>
                  </td>
                  <td className="font-semibold text-success">
                    {Number(wallet.ledgerBalance).toFixed(4)} {wallet.coin}
                  </td>
                  <td>
                    <StatusBadge status={wallet.isFrozen || wallet.status === "frozen" ? "error" : "success"}>
                      {wallet.isFrozen ? "frozen" : wallet.status}
                    </StatusBadge>
                  </td>
                  <td className="text-muted-foreground">{relativeTime(wallet.lastActivity)}</td>
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openLedger(wallet)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Ledger
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="mr-2 h-4 w-4" />
                          Transaction History
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Adjust Balance
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Lock className="mr-2 h-4 w-4" />
                          {wallet.isFrozen || wallet.status === "frozen" ? "Unfreeze" : "Freeze"} Wallet
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!isLoading && data && data.totalCount > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {data.totalCount} wallet{data.totalCount !== 1 ? "s" : ""} total
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNo((p) => Math.max(1, p - 1))}
                disabled={pageNo <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pageNo} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageNo((p) => Math.min(totalPages, p + 1))}
                disabled={pageNo >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Wallet Ledger Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Wallet Ledger — {ledger?.walletId ?? (selectedWallet ? walletDisplayId(selectedWallet) : "…")}
            </SheetTitle>
          </SheetHeader>

          {ledgerLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : ledger ? (
            <div className="mt-6 space-y-6">
              {/* Balances */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                <p className="text-xs text-muted-foreground">Ledger Balance</p>
                <p className="text-3xl font-bold text-success">
                  {Number(ledger.ledgerBalance).toFixed(4)} {ledger.coin}
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", ledger.isFrozen ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success")}>
                    {ledger.isFrozen ? "Frozen" : "Active"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">Available Balance</p>
                  <p className="text-xl font-semibold">
                    {Number(ledger.availableBalance).toFixed(4)} {ledger.coin}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">Ledger Balance</p>
                  <p className="text-xl font-semibold">
                    {Number(ledger.ledgerBalance).toFixed(4)} {ledger.coin}
                  </p>
                </div>
              </div>

              {/* Coin Breakdown — inside drawer only */}
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Coin Detail</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{ledger.coin}</span>
                  <span className="text-sm font-semibold">
                    {Number(ledger.availableBalance).toFixed(4)} {ledger.coin}
                  </span>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Activity Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                    <p className="text-xs text-muted-foreground">Total Deposited</p>
                    <p className="text-lg font-semibold text-primary">
                      {Number(ledger.activitySummary.totalDeposited).toFixed(4)} {ledger.coin}
                    </p>
                  </div>
                  <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
                    <p className="text-xs text-muted-foreground">Total Withdrawn</p>
                    <p className="text-lg font-semibold text-destructive">
                      {Number(ledger.activitySummary.totalWithdrawn).toFixed(4)} {ledger.coin}
                    </p>
                  </div>
                  <div className="rounded-lg bg-success/5 border border-success/20 p-3">
                    <p className="text-xs text-muted-foreground">Total Swapped In</p>
                    <p className="text-lg font-semibold text-success">
                      {Number(ledger.activitySummary.totalSwappedIn).toFixed(4)} {ledger.coin}
                    </p>
                  </div>
                  <div className="rounded-lg bg-warning/5 border border-warning/20 p-3">
                    <p className="text-xs text-muted-foreground">Total Swapped Out</p>
                    <p className="text-lg font-semibold text-warning">
                      {Number(ledger.activitySummary.totalSwappedOut).toFixed(4)} {ledger.coin}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ledger Entries */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recent Ledger Entries</h4>
                <div className="content-card overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Entity Type</th>
                        <th>Entity ID</th>
                        <th>Amount</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.entries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                            No ledger entries.
                          </td>
                        </tr>
                      ) : (
                        ledger.entries.map((entry, i) => {
                          const type = String((entry as any).type ?? "");
                          const isCredit = type === "credit";
                          return (
                            <tr key={i}>
                              <td>
                                <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", isCredit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                                  {type}
                                </span>
                              </td>
                              <td className="text-muted-foreground">{String((entry as any).entityType ?? "—")}</td>
                              <td className="font-mono text-sm text-primary">{String((entry as any).entityId ?? "—")}</td>
                              <td className={cn("font-semibold", isCredit ? "text-success" : "text-destructive")}>
                                {String((entry as any).amount ?? "—")}
                              </td>
                              <td className="text-muted-foreground">{String((entry as any).timestamp ?? "—")}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Manual Adjustment */}
              <div className="space-y-4 border-t border-border pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Manual Balance Adjustment
                  </h4>
                </div>
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                  <p className="text-xs text-warning font-medium">⚠ This action will be logged to the Audit Trail and is irreversible without a counter-adjustment.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Adjustment Type</Label>
                    <Select defaultValue="credit">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit (+)</SelectItem>
                        <SelectItem value="debit">Debit (-)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason (Required)</Label>
                  <Textarea
                    placeholder="Provide a reason for this adjustment..."
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">This will be permanently logged to the Audit Trail</p>
                </div>
                <Button disabled={!adjustReason}>Apply Adjustment</Button>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
