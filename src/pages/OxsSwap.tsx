import { useState } from "react";
import { Search, Filter, RefreshCw, ArrowRight, Flag, Eye } from "lucide-react";
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
    id: "OXS-SWP-001",
    subWallet: "SUB-00142",
    user: "Chinedu Okonkwo",
    fromAsset: "NGN",
    toAsset: "USDT",
    amountIn: "₦1,018,500",
    amountOut: "1,000 USDT",
    usdtEquiv: "1,000.00 USDT",
    rateSnapshot: "₦1,018.50/USDT",
    markup: "0.5%",
    status: "completed",
    providerRef: "OXS-SWP-8847291",
    ycRateRef: "YC-RATE-8847291",
    debitLedger: "LDG-DEBIT-001",
    creditLedger: "LDG-CREDIT-001",
    timestamp: "Dec 31, 2024 14:32",
    timeline: [
      { step: "INITIATED", done: true, time: "14:32:00" },
      { step: "RATE_LOCKED", done: true, time: "14:32:05" },
      { step: "COMPLETED", done: true, time: "14:32:18" },
    ],
  },
  {
    id: "OXS-SWP-002",
    subWallet: "SUB-00089",
    user: "Amara Eze",
    fromAsset: "USDT",
    toAsset: "NGN",
    amountIn: "500 USDT",
    amountOut: "₦509,250",
    usdtEquiv: "500.00 USDT",
    rateSnapshot: "₦1,018.50/USDT",
    markup: "0.5%",
    status: "completed",
    providerRef: "OXS-SWP-5523891",
    ycRateRef: "YC-RATE-5523891",
    debitLedger: "LDG-DEBIT-002",
    creditLedger: "LDG-CREDIT-002",
    timestamp: "Dec 31, 2024 13:15",
    timeline: [
      { step: "INITIATED", done: true, time: "13:15:00" },
      { step: "RATE_LOCKED", done: true, time: "13:15:03" },
      { step: "COMPLETED", done: true, time: "13:15:21" },
    ],
  },
  {
    id: "OXS-SWP-003",
    subWallet: "SUB-00213",
    user: "Ibrahim Musa",
    fromAsset: "NGN",
    toAsset: "USDC",
    amountIn: "₦2,037,000",
    amountOut: "2,000 USDC",
    usdtEquiv: "1,999.00 USDT",
    rateSnapshot: "₦1,018.50/USDC",
    markup: "0.5%",
    status: "rate_locked",
    providerRef: "OXS-SWP-9912345",
    ycRateRef: "YC-RATE-9912345",
    debitLedger: "LDG-DEBIT-003",
    creditLedger: null,
    timestamp: "Dec 31, 2024 15:45",
    timeline: [
      { step: "INITIATED", done: true, time: "15:45:00" },
      { step: "RATE_LOCKED", done: true, time: "15:45:04" },
      { step: "COMPLETED", done: false, time: null },
    ],
  },
  {
    id: "OXS-SWP-004",
    subWallet: "SUB-00301",
    user: "Emeka Nwosu",
    fromAsset: "USDC",
    toAsset: "USDT",
    amountIn: "1,000 USDC",
    amountOut: "999.50 USDT",
    usdtEquiv: "999.50 USDT",
    rateSnapshot: "0.9995 USDT/USDC",
    markup: "0.05%",
    status: "failed",
    providerRef: "OXS-SWP-3312234",
    ycRateRef: "YC-RATE-3312234",
    debitLedger: null,
    creditLedger: null,
    failureReason: "Insufficient USDT liquidity at OpenXSwitch custody level",
    timestamp: "Dec 31, 2024 11:20",
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

export default function OxsSwap() {
  const [selectedSwap, setSelectedSwap] = useState<typeof swaps[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const completed = swaps.filter(s => s.status === "completed").length;
  const active = swaps.filter(s => s.status === "rate_locked" || s.status === "initiated").length;
  const failed = swaps.filter(s => s.status === "failed").length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Swap (OpenXSwitch)</h1>
          <p className="page-description">
            Internal custody conversion — NGN ↔ USDT/USDC within OpenXSwitch sub-wallets
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
          OpenXSwitch · SWAP primitive · Rate sourced from Yellow Card
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card border-warning/30">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-warning" />
            <p className="metric-label">Total Swap Volume</p>
          </div>
          <p className="metric-value mt-1 text-warning">3,498.50 USDT</p>
          <p className="text-xs text-muted-foreground mt-1">USDT equivalent today</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Completed</p>
          <p className="metric-value mt-1 text-success">{completed}</p>
        </div>
        <div className="metric-card border-primary/30">
          <p className="metric-label">Active / Rate Locked</p>
          <p className="metric-value mt-1 text-primary">{active}</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed (24h)</p>
          <p className="metric-value mt-1 text-destructive">{failed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search swap ID, sub-wallet, provider ref..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="From Asset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assets</SelectItem>
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
              <th>Sub-wallet</th>
              <th>Conversion</th>
              <th>Amount In</th>
              <th>Amount Out</th>
              <th>USDT Equiv</th>
              <th>Rate Snapshot</th>
              <th>Markup</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th className="text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {swaps.map((swap) => (
              <tr
                key={swap.id}
                className={cn("cursor-pointer", swap.status === "failed" && "bg-destructive/5")}
                onClick={() => { setSelectedSwap(swap); setSheetOpen(true); }}
              >
                <td className="font-mono text-sm font-medium text-warning">{swap.id}</td>
                <td>
                  <div>
                    <p className="font-mono text-sm">{swap.subWallet}</p>
                    <p className="text-xs text-muted-foreground">{swap.user}</p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">{swap.fromAsset}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">{swap.toAsset}</span>
                  </div>
                </td>
                <td className="font-medium">{swap.amountIn}</td>
                <td className="font-medium">{swap.amountOut}</td>
                <td className="font-semibold text-success">{swap.usdtEquiv}</td>
                <td className="text-muted-foreground text-sm">{swap.rateSnapshot}</td>
                <td className="text-success font-medium">{swap.markup}</td>
                <td>
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", statusColors[swap.status as keyof typeof statusColors])}>
                    {swap.status.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="text-muted-foreground text-sm">{swap.timestamp}</td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedSwap(swap); setSheetOpen(true); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
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
                <SheetTitle>Swap — {selectedSwap.id}</SheetTitle>
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
                    <div><p className="text-xs text-muted-foreground">Rate Used</p><p className="font-semibold">{selectedSwap.rateSnapshot}</p></div>
                    <div><p className="text-xs text-muted-foreground">Markup Applied</p><p className="font-semibold text-success">{selectedSwap.markup}</p></div>
                    <div><p className="text-xs text-muted-foreground">OXS Provider Ref</p><p className="font-mono text-sm">{selectedSwap.providerRef}</p></div>
                    <div><p className="text-xs text-muted-foreground">YC Rate Ref</p><p className="font-mono text-sm">{selectedSwap.ycRateRef}</p></div>
                  </div>
                </div>

                {/* Ledger Links */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Debit Ledger Entry</p>
                    <p className="font-mono font-medium text-sm">{selectedSwap.debitLedger ?? "—"}</p>
                    <p className="text-xs text-destructive mt-1">— {selectedSwap.amountIn}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Credit Ledger Entry</p>
                    <p className="font-mono font-medium text-sm">{selectedSwap.creditLedger ?? "—"}</p>
                    <p className="text-xs text-success mt-1">+ {selectedSwap.amountOut}</p>
                  </div>
                </div>

                {/* Sub-wallet */}
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">Sub-wallet</p><p className="font-mono text-sm">{selectedSwap.subWallet}</p></div>
                  <div><p className="text-xs text-muted-foreground">User</p><p className="font-medium">{selectedSwap.user}</p></div>
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
                      <span className={cn("text-sm font-medium flex-1", t.done ? "text-foreground" : "text-muted-foreground")}>{t.step}</span>
                      {t.time && <span className="text-xs text-muted-foreground font-mono">{t.time}</span>}
                    </div>
                  ))}
                </div>

                {selectedSwap.failureReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Failure Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedSwap.failureReason}</p>
                  </div>
                )}

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
