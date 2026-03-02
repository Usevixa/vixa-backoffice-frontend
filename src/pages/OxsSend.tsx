import { useState } from "react";
import { Search, Filter, ArrowUpRight, Eye, RefreshCw, Flag } from "lucide-react";
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

const sends = [
  {
    id: "SND-001",
    fromWallet: "SUB-00142",
    fromUser: "Chinedu Okonkwo",
    toDestination: "0x3f4...a912",
    asset: "USDT",
    amountUsdt: "250.00 USDT",
    txType: "On-Chain",
    status: "confirmed",
    providerRef: "OXS-SND-7841234",
    txHash: "0xabc123...def456",
    retryCount: 0,
    createdAt: "Dec 31, 2024 14:32",
    timeline: [
      { step: "INITIATED", done: true, time: "14:32:00" },
      { step: "PROCESSING", done: true, time: "14:32:08" },
      { step: "CONFIRMED", done: true, time: "14:32:45" },
    ],
  },
  {
    id: "SND-002",
    fromWallet: "SUB-00089",
    fromUser: "Amara Eze",
    toDestination: "GTBank ***7891",
    asset: "USDT",
    amountUsdt: "175.00 USDT",
    txType: "On-Ramp",
    status: "processing",
    providerRef: "OXS-SND-7841235",
    txHash: null,
    retryCount: 0,
    createdAt: "Dec 31, 2024 15:10",
    timeline: [
      { step: "INITIATED", done: true, time: "15:10:00" },
      { step: "PROCESSING", done: true, time: "15:10:15" },
      { step: "CONFIRMED", done: false, time: null },
    ],
  },
  {
    id: "SND-003",
    fromWallet: "SUB-00213",
    fromUser: "Ibrahim Musa",
    toDestination: "0x7c1...f329",
    asset: "USDC",
    amountUsdt: "490.00 USDT",
    txType: "On-Chain",
    status: "failed",
    providerRef: "OXS-SND-7841220",
    txHash: null,
    retryCount: 2,
    failureReason: "Destination wallet address rejected by network",
    createdAt: "Dec 31, 2024 14:43",
    timeline: [
      { step: "INITIATED", done: true, time: "14:43:00" },
      { step: "PROCESSING", done: true, time: "14:43:12" },
      { step: "CONFIRMED", done: false, time: null },
    ],
  },
  {
    id: "SND-004",
    fromWallet: "SUB-00301",
    fromUser: "Emeka Nwosu",
    toDestination: "SUB-00142",
    asset: "USDT",
    amountUsdt: "1,180.00 USDT",
    txType: "Internal",
    status: "confirmed",
    providerRef: "OXS-SND-7841199",
    txHash: "0xfed987...cba654",
    retryCount: 0,
    createdAt: "Dec 31, 2024 10:22",
    timeline: [
      { step: "INITIATED", done: true, time: "10:22:00" },
      { step: "PROCESSING", done: true, time: "10:22:09" },
      { step: "CONFIRMED", done: true, time: "10:23:01" },
    ],
  },
  {
    id: "SND-005",
    fromWallet: "SUB-00078",
    fromUser: "Ngozi Obi",
    toDestination: "0x5e9...c123",
    asset: "USDT",
    amountUsdt: "310.00 USDT",
    txType: "On-Chain",
    status: "confirmed",
    providerRef: "OXS-SND-7841100",
    txHash: "0x123abc...456def",
    retryCount: 0,
    createdAt: "Dec 30, 2024 16:45",
    timeline: [
      { step: "INITIATED", done: true, time: "16:45:00" },
      { step: "PROCESSING", done: true, time: "16:45:07" },
      { step: "CONFIRMED", done: true, time: "16:45:52" },
    ],
  },
];

const statusConfig = {
  initiated: "neutral",
  processing: "warning",
  confirmed: "success",
  failed: "error",
} as const;

const assetColors: Record<string, string> = {
  USDT: "bg-primary/10 text-primary",
  USDC: "bg-warning/10 text-warning",
};

const txTypeColors: Record<string, string> = {
  "On-Chain": "bg-primary/10 text-primary",
  "On-Ramp": "bg-success/10 text-success",
  "Internal": "bg-muted text-muted-foreground",
};

export default function OxsSend() {
  const [selectedSend, setSelectedSend] = useState<typeof sends[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const confirmed = sends.filter(s => s.status === "confirmed").length;
  const processing = sends.filter(s => s.status === "processing").length;
  const failed = sends.filter(s => s.status === "failed").length;
  const totalVolume = "2,405.00 USDT";

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Send (OpenXSwitch)</h1>
          <p className="page-description">
            Customer-initiated value transfers from sub-wallets — executed via OpenXSwitch custody
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
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
          <p className="metric-value mt-1 text-primary">{totalVolume}</p>
          <p className="text-xs text-muted-foreground mt-1">USDT equivalent today</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Confirmed</p>
          <p className="metric-value mt-1 text-success">{confirmed}</p>
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Processing</p>
          <p className="metric-value mt-1 text-warning">{processing}</p>
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
          <Input type="search" placeholder="Search send ID, sub-wallet, tx hash..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Coin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Coins</SelectItem>
            <SelectItem value="usdt">USDT</SelectItem>
            <SelectItem value="usdc">USDC</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tx Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tx Types</SelectItem>
            <SelectItem value="on-chain">On-Chain</SelectItem>
            <SelectItem value="on-ramp">On-Ramp</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="initiated">Initiated</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
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
              <th>Send Tx ID</th>
              <th>From Sub-wallet</th>
              <th>To (Destination)</th>
              <th>Coin</th>
              <th>Transaction Type</th>
              <th>Amount (USDT)</th>
              <th>Status</th>
              <th>Provider Ref</th>
              <th>Timestamp</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sends.map((snd) => (
              <tr
                key={snd.id}
                className={cn("cursor-pointer", snd.status === "failed" && "bg-destructive/5")}
                onClick={() => { setSelectedSend(snd); setSheetOpen(true); }}
              >
                <td className="font-mono text-sm font-medium text-primary">{snd.id}</td>
                <td>
                  <div>
                    <p className="font-mono text-sm font-medium">{snd.fromWallet}</p>
                    <p className="text-xs text-muted-foreground">{snd.fromUser}</p>
                  </div>
                </td>
                <td className="font-mono text-sm text-muted-foreground">{snd.toDestination}</td>
                <td>
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", assetColors[snd.asset] ?? "bg-muted text-muted-foreground")}>
                    {snd.asset}
                  </span>
                </td>
                <td>
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", txTypeColors[snd.txType] ?? "bg-muted text-muted-foreground")}>
                    {snd.txType}
                  </span>
                </td>
                <td className="font-semibold">{snd.amountUsdt}</td>
                <td>
                  <StatusBadge status={statusConfig[snd.status as keyof typeof statusConfig]}>
                    {snd.status}
                  </StatusBadge>
                </td>
                <td className="font-mono text-xs text-muted-foreground">{snd.providerRef}</td>
                <td className="text-muted-foreground text-sm">{snd.createdAt}</td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedSend(snd); setSheetOpen(true); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[520px] overflow-y-auto">
          {selectedSend && (
            <>
              <SheetHeader>
                <SheetTitle>Send Details — {selectedSend.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Summary */}
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{selectedSend.amountUsdt}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedSend.asset} · {selectedSend.fromWallet} → {selectedSend.toDestination}</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <StatusBadge status={statusConfig[selectedSend.status as keyof typeof statusConfig]}>
                      {selectedSend.status.toUpperCase()}
                    </StatusBadge>
                    <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", txTypeColors[selectedSend.txType])}>
                      {selectedSend.txType}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Status Timeline</h4>
                  {selectedSend.timeline.map((t, i) => (
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

                {/* Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs text-muted-foreground">From Sub-wallet</p><p className="font-mono text-sm font-medium">{selectedSend.fromWallet}</p></div>
                    <div><p className="text-xs text-muted-foreground">User</p><p className="font-medium">{selectedSend.fromUser}</p></div>
                    <div><p className="text-xs text-muted-foreground">To Destination</p><p className="font-mono text-sm">{selectedSend.toDestination}</p></div>
                    <div><p className="text-xs text-muted-foreground">Coin</p><p className="font-medium">{selectedSend.asset}</p></div>
                    <div><p className="text-xs text-muted-foreground">Transaction Type</p><p className="font-medium">{selectedSend.txType}</p></div>
                    <div><p className="text-xs text-muted-foreground">Provider Ref</p><p className="font-mono text-sm">{selectedSend.providerRef}</p></div>
                    <div><p className="text-xs text-muted-foreground">Retry Count</p><p className="font-medium">{selectedSend.retryCount}</p></div>
                    {selectedSend.txHash && (
                      <div className="col-span-2"><p className="text-xs text-muted-foreground">Tx Hash</p><p className="font-mono text-sm text-primary">{selectedSend.txHash}</p></div>
                    )}
                    <div><p className="text-xs text-muted-foreground">Created At</p><p className="font-medium">{selectedSend.createdAt}</p></div>
                  </div>
                </div>

                {selectedSend.failureReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Failure Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedSend.failureReason}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  {selectedSend.status === "failed" && (
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="mr-2 h-4 w-4" /> Retry
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
