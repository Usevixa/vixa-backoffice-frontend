import { useState } from "react";
import { Search, Filter, RefreshCw, ArrowRight, Flag } from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const swaps = [
  {
    id: "SWP-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    fromCurrency: "NGN",
    toCurrency: "USDT",
    amountIn: "₦1,018,500",
    amountOut: "1,000 USDT",
    usdtEquiv: "1,000.00 USDT",
    rateUsed: "₦1,018.50",
    spread: "₦3,500",
    status: "completed",
    debitWallet: "WAL-001",
    creditWallet: "WAL-002",
    providerRef: "YC-RATE-8847291",
    timestamp: "Dec 31, 2024 14:32",
    timeline: [
      { step: "INITIATED", done: true, time: "14:32:00" },
      { step: "RATE_LOCKED", done: true, time: "14:32:05" },
      { step: "COMPLETED", done: true, time: "14:32:18" },
    ],
  },
  {
    id: "SWP-002",
    user: "Amara Eze",
    userId: "USR-002",
    fromCurrency: "USDT",
    toCurrency: "NGN",
    amountIn: "500 USDT",
    amountOut: "₦509,250",
    usdtEquiv: "500.00 USDT",
    rateUsed: "₦1,018.50",
    spread: "₦1,750",
    status: "completed",
    debitWallet: "WAL-004",
    creditWallet: "WAL-003",
    providerRef: "YC-RATE-5523891",
    timestamp: "Dec 31, 2024 13:15",
    timeline: [
      { step: "INITIATED", done: true, time: "13:15:00" },
      { step: "RATE_LOCKED", done: true, time: "13:15:03" },
      { step: "COMPLETED", done: true, time: "13:15:21" },
    ],
  },
  {
    id: "SWP-003",
    user: "Ibrahim Musa",
    userId: "USR-003",
    fromCurrency: "NGN",
    toCurrency: "USDC",
    amountIn: "₦2,037,000",
    amountOut: "2,000 USDC",
    usdtEquiv: "1,999.00 USDT",
    rateUsed: "₦1,018.50",
    spread: "₦7,000",
    status: "rate_locked",
    debitWallet: "WAL-005",
    creditWallet: "WAL-006",
    providerRef: "YC-RATE-9912345",
    timestamp: "Dec 31, 2024 15:45",
    timeline: [
      { step: "INITIATED", done: true, time: "15:45:00" },
      { step: "RATE_LOCKED", done: true, time: "15:45:04" },
      { step: "COMPLETED", done: false, time: null },
    ],
  },
  {
    id: "SWP-004",
    user: "Emeka Nwosu",
    userId: "USR-005",
    fromCurrency: "USDC",
    toCurrency: "USDT",
    amountIn: "1,000 USDC",
    amountOut: "999.50 USDT",
    usdtEquiv: "999.50 USDT",
    rateUsed: "0.9995",
    spread: "0.50 USDT",
    status: "failed",
    debitWallet: "WAL-009",
    creditWallet: "WAL-009",
    providerRef: "YC-RATE-3312234",
    timestamp: "Dec 31, 2024 11:20",
    failureReason: "Insufficient USDT liquidity on Yellow Card rail",
    timeline: [
      { step: "INITIATED", done: true, time: "11:20:00" },
      { step: "RATE_LOCKED", done: true, time: "11:20:04" },
      { step: "COMPLETED", done: false, time: null },
    ],
  },
];

const statusColors = {
  initiated: "bg-muted text-muted-foreground",
  rate_locked: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
};

const statusBadgeMap = {
  initiated: "neutral",
  rate_locked: "info",
  completed: "success",
  failed: "error",
} as const;

export default function Swaps() {
  const [selectedSwap, setSelectedSwap] = useState<typeof swaps[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const completed = swaps.filter(s => s.status === "completed").length;
  const active = swaps.filter(s => s.status === "rate_locked" || s.status === "initiated").length;
  const failed = swaps.filter(s => s.status === "failed").length;
  const totalSpread = "₦12,250";

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Swaps</h1>
        <p className="page-description">
          Internal value conversion (NGN ↔ USDT/USDC) — not market trading
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-warning" />
            <p className="metric-label">Completed Today</p>
          </div>
          <p className="metric-value mt-1">{completed}</p>
        </div>
        <div className="metric-card border-primary/30">
          <p className="metric-label">Active / Rate Locked</p>
          <p className="metric-value mt-1 text-primary">{active}</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed (24h)</p>
          <p className="metric-value mt-1 text-destructive">{failed}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total Spread Earned</p>
          <p className="metric-value mt-1 text-success">{totalSpread}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search swap ID or user..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="From Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ngn">NGN</SelectItem>
            <SelectItem value="usdt">USDT</SelectItem>
            <SelectItem value="usdc">USDC</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="To Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ngn">NGN</SelectItem>
            <SelectItem value="usdt">USDT</SelectItem>
            <SelectItem value="usdc">USDC</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="initiated">Initiated</SelectItem>
            <SelectItem value="rate_locked">Rate Locked</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
      </div>

      {/* Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Swap ID</th>
              <th>User</th>
              <th>Conversion</th>
              <th>Amount In</th>
              <th>Amount Out</th>
              <th>USDT Equiv</th>
              <th>Rate Used</th>
              <th>Spread</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {swaps.map((swap) => (
              <tr
                key={swap.id}
                className={cn("cursor-pointer", swap.status === "failed" && "bg-destructive/5")}
                onClick={() => { setSelectedSwap(swap); setSheetOpen(true); }}
              >
                <td className="font-mono text-sm font-medium">{swap.id}</td>
                <td>
                  <div>
                    <p className="font-medium">{swap.user}</p>
                    <p className="text-xs text-muted-foreground">{swap.userId}</p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">
                      {swap.fromCurrency}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">
                      {swap.toCurrency}
                    </span>
                  </div>
                </td>
                <td className="font-medium">{swap.amountIn}</td>
                <td className="font-medium">{swap.amountOut}</td>
                <td className="font-semibold text-success">{swap.usdtEquiv}</td>
                <td className="text-muted-foreground text-sm">{swap.rateUsed}</td>
                <td className="text-success font-medium">{swap.spread}</td>
                <td>
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", statusColors[swap.status as keyof typeof statusColors])}>
                    {swap.status.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="text-muted-foreground">{swap.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Swap Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[520px] overflow-y-auto">
          {selectedSwap && (
            <>
              <SheetHeader>
                <SheetTitle>Swap Details — {selectedSwap.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Conversion Summary */}
                <div className="rounded-lg border border-border p-4 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">FROM</p>
                      <p className="text-xl font-bold">{selectedSwap.amountIn}</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">TO</p>
                      <p className="text-xl font-bold text-success">{selectedSwap.amountOut}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">≈ {selectedSwap.usdtEquiv} USDT equivalent</p>
                  <div className="mt-2">
                    <StatusBadge status={statusBadgeMap[selectedSwap.status as keyof typeof statusBadgeMap]}>
                      {selectedSwap.status.replace("_", " ").toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>

                {/* Rate Snapshot */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rate Snapshot</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs text-muted-foreground">Rate Used</p><p className="font-semibold">{selectedSwap.rateUsed}</p></div>
                    <div><p className="text-xs text-muted-foreground">Spread Earned</p><p className="font-semibold text-success">{selectedSwap.spread}</p></div>
                    <div><p className="text-xs text-muted-foreground">Provider Ref</p><p className="font-mono text-sm">{selectedSwap.providerRef}</p></div>
                    <div><p className="text-xs text-muted-foreground">Rate Source</p><p className="font-medium">Yellow Card</p></div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Timeline</h4>
                  {selectedSwap.timeline.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                        t.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {t.done ? "✓" : i + 1}
                      </div>
                      <span className={cn("text-sm font-medium flex-1", t.done ? "text-foreground" : "text-muted-foreground")}>
                        {t.step}
                      </span>
                      {t.time && <span className="text-xs text-muted-foreground font-mono">{t.time}</span>}
                    </div>
                  ))}
                </div>

                {/* Linked Wallets */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Debit Wallet</p>
                    <p className="font-mono font-medium">{selectedSwap.debitWallet}</p>
                    <p className="text-xs text-destructive mt-1">— {selectedSwap.amountIn}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Credit Wallet</p>
                    <p className="font-mono font-medium">{selectedSwap.creditWallet}</p>
                    <p className="text-xs text-success mt-1">+ {selectedSwap.amountOut}</p>
                  </div>
                </div>

                {selectedSwap.failureReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Failure Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedSwap.failureReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedSwap.status === "failed" && (
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="mr-2 h-4 w-4" /> Retry Swap
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    <Flag className="mr-2 h-4 w-4" /> Flag Anomaly
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">Actions logged to Audit Trail</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
