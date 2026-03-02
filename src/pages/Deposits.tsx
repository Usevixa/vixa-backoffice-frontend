import { useState } from "react";
import { Search, Filter, ArrowDownLeft, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Yellow Card channel names per YC documentation
const YC_CHANNELS = [
  "Flutterwave",
  "MTN Mobile Money",
  "Airtel Money",
  "Orange Money",
  "MPESA",
  "Remitly",
  "Chipper Cash",
  "Bank Transfer (YC)",
];

const deposits = [
  {
    id: "DEP-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    country: "NG",
    subWallet: "SUB-00142",
    amountUsdt: "240.50 USDT",
    fiatEquiv: "(~ ₦244,830)",
    ycChannel: "MTN Mobile Money",
    status: "credited",
    ycRef: "YC-DEP-5523891",
    oxsCreditRef: "OXS-RCV-8847291",
    createdAt: "Dec 31, 2024 14:32",
    timeline: [
      { step: "YC DETECTED", done: true, time: "14:32:00" },
      { step: "YC CONFIRMED", done: true, time: "14:32:45" },
      { step: "CREDITED TO OXS SUB-WALLET", done: true, time: "14:33:10" },
    ],
  },
  {
    id: "DEP-002",
    user: "Amara Eze",
    userId: "USR-002",
    country: "KE",
    subWallet: "SUB-00089",
    amountUsdt: "175.00 USDT",
    fiatEquiv: "(~ KES 24,150)",
    ycChannel: "MPESA",
    status: "credited",
    ycRef: "YC-DEP-5523890",
    oxsCreditRef: "OXS-RCV-5523891",
    createdAt: "Dec 31, 2024 13:45",
    timeline: [
      { step: "YC DETECTED", done: true, time: "13:45:00" },
      { step: "YC CONFIRMED", done: true, time: "13:45:38" },
      { step: "CREDITED TO OXS SUB-WALLET", done: true, time: "13:45:55" },
    ],
  },
  {
    id: "DEP-003",
    user: "Emeka Nwosu",
    userId: "USR-005",
    country: "GH",
    subWallet: "SUB-00213",
    amountUsdt: "490.00 USDT",
    fiatEquiv: "(~ GHS 7,742)",
    ycChannel: "Bank Transfer (YC)",
    status: "confirmed",
    ycRef: "YC-DEP-9912345",
    oxsCreditRef: null,
    createdAt: "Dec 31, 2024 15:10",
    timeline: [
      { step: "YC DETECTED", done: true, time: "15:10:00" },
      { step: "YC CONFIRMED", done: true, time: "15:10:52" },
      { step: "CREDITED TO OXS SUB-WALLET", done: false, time: null },
    ],
  },
  {
    id: "DEP-004",
    user: "Folake Adeyemi",
    userId: "USR-004",
    country: "ZA",
    subWallet: null,
    amountUsdt: "118.00 USDT",
    fiatEquiv: "(~ ZAR 2,242)",
    ycChannel: "Bank Transfer (YC)",
    status: "failed",
    ycRef: "YC-DEP-5231987",
    oxsCreditRef: null,
    createdAt: "Dec 31, 2024 10:22",
    failureReason: "Yellow Card: Transaction rejected — account flagged by operator",
    timeline: [
      { step: "YC DETECTED", done: true, time: "10:22:00" },
      { step: "YC CONFIRMED", done: false, time: null },
      { step: "CREDITED TO OXS SUB-WALLET", done: false, time: null },
    ],
  },
  {
    id: "DEP-005",
    user: "Ngozi Obi",
    userId: "USR-006",
    country: "KE",
    subWallet: "SUB-00078",
    amountUsdt: "305.00 USDT",
    fiatEquiv: "(~ KES 42,090)",
    ycChannel: "Chipper Cash",
    status: "credited",
    ycRef: "YC-DEP-5523880",
    oxsCreditRef: "OXS-RCV-5523880",
    createdAt: "Dec 30, 2024 16:45",
    timeline: [
      { step: "YC DETECTED", done: true, time: "16:45:00" },
      { step: "YC CONFIRMED", done: true, time: "16:45:40" },
      { step: "CREDITED TO OXS SUB-WALLET", done: true, time: "16:46:02" },
    ],
  },
];

const statusConfig = {
  detected: "warning",
  confirmed: "info",
  credited: "success",
  failed: "error",
} as const;

export default function Deposits() {
  const [selectedDeposit, setSelectedDeposit] = useState<typeof deposits[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const credited = deposits.filter(d => d.status === "credited").length;
  const pending = deposits.filter(d => d.status === "detected" || d.status === "confirmed").length;
  const failed = deposits.filter(d => d.status === "failed").length;
  const successRate = (((deposits.length - failed) / deposits.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Deposits (Network In)</h1>
          <p className="page-description">
            USDT (Solana) deposits via Yellow Card → credited into OpenXSwitch sub-wallets
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Fixed route: Yellow Card → OpenXSwitch sub-wallet · Asset: USDT
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card border-success/30">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="h-4 w-4 text-success" />
            <p className="metric-label">Credited Today</p>
          </div>
          <p className="metric-value mt-1 text-success">{credited}</p>
          <p className="text-xs text-muted-foreground mt-1">deposits successful</p>
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Pending Credit</p>
          <p className="metric-value mt-1 text-warning">{pending}</p>
          <p className="text-xs text-muted-foreground mt-1">awaiting OXS credit</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed (24h)</p>
          <p className="metric-value mt-1 text-destructive">{failed}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Success Rate</p>
          <p className="metric-value mt-1 text-success">{successRate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search deposit ID, user, YC ref, OXS ref..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-52">
            <SelectValue placeholder="YC Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {YC_CHANNELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
              <th>Deposit ID</th>
              <th>User / Sub-wallet</th>
              <th>Country</th>
              <th>YC Channel</th>
              <th>Amount (USDT)</th>
              <th>Status</th>
              <th>Yellow Card Ref</th>
              <th>OXS Credit Ref</th>
              <th>Timestamp</th>
              <th className="text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((dep) => (
              <tr
                key={dep.id}
                className={cn("cursor-pointer", dep.status === "failed" && "bg-destructive/5")}
                onClick={() => { setSelectedDeposit(dep); setSheetOpen(true); }}
              >
                <td className="font-mono text-sm font-medium text-success">{dep.id}</td>
                <td>
                  <div>
                    <p className="font-medium">{dep.user}</p>
                    <p className="text-xs text-muted-foreground font-mono">{dep.subWallet ?? dep.userId}</p>
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
                  <p className="font-semibold text-success">{dep.amountUsdt}</p>
                  {dep.fiatEquiv && <p className="text-xs text-muted-foreground">{dep.fiatEquiv}</p>}
                </td>
                <td>
                  <StatusBadge status={statusConfig[dep.status as keyof typeof statusConfig]}>
                    {dep.status}
                  </StatusBadge>
                </td>
                <td className="font-mono text-xs text-muted-foreground">{dep.ycRef}</td>
                <td className="font-mono text-xs text-muted-foreground">{dep.oxsCreditRef ?? "—"}</td>
                <td className="text-muted-foreground text-sm">{dep.createdAt}</td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedDeposit(dep); setSheetOpen(true); }}>
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
          {selectedDeposit && (
            <>
              <SheetHeader>
                <SheetTitle>Deposit — {selectedDeposit.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Amount */}
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-xs text-muted-foreground">Amount Deposited</p>
                  <p className="text-3xl font-bold text-success mt-1">{selectedDeposit.amountUsdt}</p>
                  <p className="text-xs text-muted-foreground mt-1">USDT via {selectedDeposit.ycChannel}</p>
                  <div className="mt-2">
                    <StatusBadge status={statusConfig[selectedDeposit.status as keyof typeof statusConfig]}>
                      {selectedDeposit.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>

                {/* End-to-end Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">End-to-End Timeline</h4>
                  <div className="text-xs text-muted-foreground mb-2">Yellow Card → OpenXSwitch sub-wallet credit chain</div>
                  {selectedDeposit.timeline.map((t, i) => (
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

                {/* Provider References */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Provider References</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Yellow Card Ref</span>
                      <span className="font-mono text-sm font-medium text-warning">{selectedDeposit.ycRef}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">OXS Credit Ref</span>
                      <span className="font-mono text-sm font-medium text-primary">{selectedDeposit.oxsCreditRef ?? "Pending"}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">User</p><p className="font-medium">{selectedDeposit.user}</p></div>
                  <div><p className="text-xs text-muted-foreground">User ID</p><p className="font-mono text-sm">{selectedDeposit.userId}</p></div>
                  <div><p className="text-xs text-muted-foreground">Sub-wallet</p><p className="font-mono text-sm">{selectedDeposit.subWallet ?? "—"}</p></div>
                  <div><p className="text-xs text-muted-foreground">YC Channel</p><p className="font-medium">{selectedDeposit.ycChannel}</p></div>
                  <div><p className="text-xs text-muted-foreground">Created At</p><p className="font-medium">{selectedDeposit.createdAt}</p></div>
                </div>

                {selectedDeposit.failureReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Failure Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedDeposit.failureReason}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
