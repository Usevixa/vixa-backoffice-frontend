import { useState } from "react";
import { Search, Filter, ArrowDownLeft, Eye, Shield } from "lucide-react";
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

const receiveEvents = [
  {
    id: "RCV-001",
    toWallet: "SUB-00142",
    toUser: "Chinedu Okonkwo",
    source: "YC-DEP-001 (Yellow Card)",
    asset: "USDT",
    amountUsdt: "240.50 USDT",
    txType: "On-Ramp",
    status: "credited",
    providerRef: "OXS-RCV-8847291",
    ledgerCredit: "LDG-CREDIT-001",
    complianceFlags: [],
    createdAt: "Dec 31, 2024 14:32",
    timeline: [
      { step: "DETECTED", done: true, time: "14:31:50" },
      { step: "CONFIRMED", done: true, time: "14:32:10" },
      { step: "CREDITED", done: true, time: "14:32:20" },
    ],
  },
  {
    id: "RCV-002",
    toWallet: "SUB-00089",
    toUser: "Amara Eze",
    source: "YC-DEP-002 (Yellow Card)",
    asset: "USDT",
    amountUsdt: "175.00 USDT",
    txType: "On-Ramp",
    status: "credited",
    providerRef: "OXS-RCV-5523891",
    ledgerCredit: "LDG-CREDIT-002",
    complianceFlags: [],
    createdAt: "Dec 31, 2024 13:45",
    timeline: [
      { step: "DETECTED", done: true, time: "13:44:48" },
      { step: "CONFIRMED", done: true, time: "13:44:58" },
      { step: "CREDITED", done: true, time: "13:45:08" },
    ],
  },
  {
    id: "RCV-003",
    toWallet: "SUB-00213",
    toUser: "Ibrahim Musa",
    source: "External wallet 0x7a3...e91f",
    asset: "USDC",
    amountUsdt: "490.00 USDT",
    txType: "On-Chain",
    status: "confirmed",
    providerRef: "OXS-RCV-9912345",
    ledgerCredit: null,
    complianceFlags: ["large_amount"],
    createdAt: "Dec 31, 2024 15:10",
    timeline: [
      { step: "DETECTED", done: true, time: "15:09:55" },
      { step: "CONFIRMED", done: true, time: "15:10:05" },
      { step: "CREDITED", done: false, time: null },
    ],
  },
  {
    id: "RCV-004",
    toWallet: "SUB-00301",
    toUser: "Emeka Nwosu",
    source: "SUB-00078 (Internal)",
    asset: "USDT",
    amountUsdt: "118.00 USDT",
    txType: "Internal",
    status: "failed",
    providerRef: "OXS-RCV-5231987",
    ledgerCredit: null,
    complianceFlags: [],
    failureReason: "Sub-wallet frozen — credit rejected",
    createdAt: "Dec 31, 2024 10:22",
    timeline: [
      { step: "DETECTED", done: true, time: "10:22:00" },
      { step: "CONFIRMED", done: false, time: null },
      { step: "CREDITED", done: false, time: null },
    ],
  },
  {
    id: "RCV-005",
    toWallet: "SUB-00078",
    toUser: "Ngozi Obi",
    source: "YC-DEP-004 (Yellow Card)",
    asset: "USDC",
    amountUsdt: "305.00 USDT",
    txType: "On-Ramp",
    status: "credited",
    providerRef: "OXS-RCV-5523880",
    ledgerCredit: "LDG-CREDIT-005",
    complianceFlags: [],
    createdAt: "Dec 30, 2024 16:45",
    timeline: [
      { step: "DETECTED", done: true, time: "16:44:55" },
      { step: "CONFIRMED", done: true, time: "16:45:05" },
      { step: "CREDITED", done: true, time: "16:45:15" },
    ],
  },
];

const statusConfig = {
  detected: "neutral",
  confirmed: "info",
  credited: "success",
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

export default function OxsReceive() {
  const [selectedReceive, setSelectedReceive] = useState<typeof receiveEvents[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const credited = receiveEvents.filter(r => r.status === "credited").length;
  const pending = receiveEvents.filter(r => r.status === "detected" || r.status === "confirmed").length;
  const failed = receiveEvents.filter(r => r.status === "failed").length;
  const totalVolume = "1,328.50 USDT";

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Receive (OpenXSwitch)</h1>
          <p className="page-description">
            Wallet credit events — value entering customer sub-wallets via OpenXSwitch custody
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          OpenXSwitch · RECEIVE primitive
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card border-success/30">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="h-4 w-4 text-success" />
            <p className="metric-label">Total Received</p>
          </div>
          <p className="metric-value mt-1 text-success">{totalVolume}</p>
          <p className="text-xs text-muted-foreground mt-1">USDT equivalent today</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Credited</p>
          <p className="metric-value mt-1 text-success">{credited}</p>
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Pending Credit</p>
          <p className="metric-value mt-1 text-warning">{pending}</p>
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
          <Input type="search" placeholder="Search receive ID, sub-wallet, provider ref..." className="pl-9" />
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
            <SelectItem value="detected">Detected</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="credited">Credited</SelectItem>
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
              <th>Receive Event ID</th>
              <th>To Sub-wallet</th>
              <th>Source</th>
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
            {receiveEvents.map((rcv) => (
              <tr
                key={rcv.id}
                className={cn("cursor-pointer", rcv.status === "failed" && "bg-destructive/5")}
                onClick={() => { setSelectedReceive(rcv); setSheetOpen(true); }}
              >
                <td className="font-mono text-sm font-medium text-success">{rcv.id}</td>
                <td>
                  <div>
                    <p className="font-mono text-sm font-medium">{rcv.toWallet}</p>
                    <p className="text-xs text-muted-foreground">{rcv.toUser}</p>
                  </div>
                </td>
                <td className="text-muted-foreground text-sm">{rcv.source}</td>
                <td>
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", assetColors[rcv.asset] ?? "bg-muted text-muted-foreground")}>
                    {rcv.asset}
                  </span>
                </td>
                <td>
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", txTypeColors[rcv.txType] ?? "bg-muted text-muted-foreground")}>
                    {rcv.txType}
                  </span>
                </td>
                <td className="font-semibold text-success">{rcv.amountUsdt}</td>
                <td>
                  <StatusBadge status={statusConfig[rcv.status as keyof typeof statusConfig]}>
                    {rcv.status}
                  </StatusBadge>
                </td>
                <td className="font-mono text-xs text-muted-foreground">{rcv.providerRef}</td>
                <td className="text-muted-foreground text-sm">{rcv.createdAt}</td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedReceive(rcv); setSheetOpen(true); }}>
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
          {selectedReceive && (
            <>
              <SheetHeader>
                <SheetTitle>Receive Event — {selectedReceive.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Summary */}
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-3xl font-bold text-success">{selectedReceive.amountUsdt}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReceive.asset} → {selectedReceive.toWallet}</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <StatusBadge status={statusConfig[selectedReceive.status as keyof typeof statusConfig]}>
                      {selectedReceive.status.toUpperCase()}
                    </StatusBadge>
                    <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", txTypeColors[selectedReceive.txType])}>
                      {selectedReceive.txType}
                    </span>
                  </div>
                </div>

                {/* Compliance flags */}
                {selectedReceive.complianceFlags.length > 0 && (
                  <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-warning" />
                      <p className="text-sm font-medium text-warning">Compliance Flags</p>
                    </div>
                    <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
                      {selectedReceive.complianceFlags.map((f) => <li key={f}>{f.replace("_", " ")}</li>)}
                    </ul>
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Status Timeline</h4>
                  {selectedReceive.timeline.map((t, i) => (
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
                    <div><p className="text-xs text-muted-foreground">To Sub-wallet</p><p className="font-mono text-sm font-medium">{selectedReceive.toWallet}</p></div>
                    <div><p className="text-xs text-muted-foreground">User</p><p className="font-medium">{selectedReceive.toUser}</p></div>
                    <div className="col-span-2"><p className="text-xs text-muted-foreground">Source</p><p className="font-medium text-sm">{selectedReceive.source}</p></div>
                    <div><p className="text-xs text-muted-foreground">Coin</p><p className="font-medium">{selectedReceive.asset}</p></div>
                    <div><p className="text-xs text-muted-foreground">Transaction Type</p><p className="font-medium">{selectedReceive.txType}</p></div>
                    <div><p className="text-xs text-muted-foreground">Provider Ref</p><p className="font-mono text-sm">{selectedReceive.providerRef}</p></div>
                    {selectedReceive.ledgerCredit && (
                      <div><p className="text-xs text-muted-foreground">Ledger Credit</p><p className="font-mono text-sm text-success">{selectedReceive.ledgerCredit}</p></div>
                    )}
                    <div><p className="text-xs text-muted-foreground">Created At</p><p className="font-medium">{selectedReceive.createdAt}</p></div>
                  </div>
                </div>

                {selectedReceive.failureReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Failure Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedReceive.failureReason}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center">Logged to Audit Trail</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
