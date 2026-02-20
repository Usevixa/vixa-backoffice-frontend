import { useState } from "react";
import { Search, Filter, ArrowDownLeft, Eye } from "lucide-react";
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

const deposits = [
  {
    id: "DEP-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    amountUsdt: "240.50 USDT",
    nativeAmount: "₦245,000",
    channel: "Bank Transfer",
    provider: "OpenXSwitch",
    status: "credited",
    providerRef: "OXS-DEP-8847291",
    walletRef: "WAL-001",
    webhookRef: "WH-004",
    createdAt: "Dec 31, 2024 14:32",
    timeline: ["initiated", "confirmed", "credited", "settled"],
    currentStep: 3,
  },
  {
    id: "DEP-002",
    user: "Amara Eze",
    userId: "USR-002",
    amountUsdt: "175.00 USDT",
    nativeAmount: "175.00 USDT",
    channel: "Stablecoin Rail",
    provider: "Yellow Card",
    status: "credited",
    providerRef: "YC-5523891",
    walletRef: "WAL-004",
    webhookRef: "WH-002",
    createdAt: "Dec 31, 2024 13:45",
    timeline: ["initiated", "confirmed", "credited", "settled"],
    currentStep: 3,
  },
  {
    id: "DEP-003",
    user: "Emeka Nwosu",
    userId: "USR-005",
    amountUsdt: "490.00 USDT",
    nativeAmount: "₦499,000",
    channel: "Mobile Money",
    provider: "OpenXSwitch",
    status: "confirmed",
    providerRef: "OXS-DEP-9912345",
    walletRef: "WAL-009",
    webhookRef: null,
    createdAt: "Dec 31, 2024 15:10",
    timeline: ["initiated", "confirmed", "credited", "settled"],
    currentStep: 1,
  },
  {
    id: "DEP-004",
    user: "Folake Adeyemi",
    userId: "USR-004",
    amountUsdt: "118.00 USDT",
    nativeAmount: "₦120,000",
    channel: "Bank Transfer",
    provider: "OpenXSwitch",
    status: "failed",
    providerRef: "OXS-DEP-5231987",
    walletRef: null,
    webhookRef: null,
    createdAt: "Dec 31, 2024 10:22",
    timeline: ["initiated", "confirmed", "credited", "settled"],
    currentStep: 0,
    failureReason: "Bank account validation failed",
  },
  {
    id: "DEP-005",
    user: "Ngozi Obi",
    userId: "USR-006",
    amountUsdt: "305.00 USDT",
    nativeAmount: "310.00 USDC",
    channel: "Stablecoin Rail",
    provider: "Yellow Card",
    status: "settled",
    providerRef: "YC-5523880",
    walletRef: "WAL-006",
    webhookRef: "WH-005",
    createdAt: "Dec 30, 2024 16:45",
    timeline: ["initiated", "confirmed", "credited", "settled"],
    currentStep: 4,
  },
];

const timelineSteps = ["INITIATED", "CONFIRMED", "CREDITED", "SETTLED"];

const statusConfig = {
  initiated: "warning",
  confirmed: "info",
  credited: "success",
  settled: "success",
  failed: "error",
} as const;

const channelColors: Record<string, string> = {
  "Bank Transfer": "bg-primary/10 text-primary",
  "Mobile Money": "bg-success/10 text-success",
  "Stablecoin Rail": "bg-warning/10 text-warning",
};

export default function Deposits() {
  const [selectedDeposit, setSelectedDeposit] = useState<typeof deposits[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const totalToday = deposits.filter(d => d.status === "credited" || d.status === "settled").length;
  const pending = deposits.filter(d => d.status === "initiated" || d.status === "confirmed").length;
  const failed = deposits.filter(d => d.status === "failed").length;
  const successRate = (((deposits.length - failed) / deposits.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Deposits</h1>
        <p className="page-description">
          Monitor all value entering VIXA wallets via bank, mobile money, and stablecoin rails
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="h-4 w-4 text-success" />
            <p className="metric-label">Credited Today</p>
          </div>
          <p className="metric-value mt-1">{totalToday}</p>
          <p className="text-xs text-muted-foreground mt-1">deposits successful</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Pending</p>
          <p className="metric-value mt-1 text-warning">{pending}</p>
          <p className="text-xs text-muted-foreground mt-1">awaiting confirmation</p>
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
          <Input type="search" placeholder="Search deposit ID, user, provider ref..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="openxswitch">OpenXSwitch</SelectItem>
            <SelectItem value="yellowcard">Yellow Card</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
            <SelectItem value="momo">Mobile Money</SelectItem>
            <SelectItem value="stablecoin">Stablecoin Rail</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="initiated">Initiated</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="credited">Credited</SelectItem>
            <SelectItem value="settled">Settled</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Deposit ID</th>
              <th>User</th>
              <th>Amount (USDT)</th>
              <th>Native Amount</th>
              <th>Channel</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Created At</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((dep) => (
              <tr
                key={dep.id}
                className={cn("cursor-pointer", dep.status === "failed" && "bg-destructive/5")}
                onClick={() => { setSelectedDeposit(dep); setSheetOpen(true); }}
              >
                <td className="font-mono text-sm font-medium">{dep.id}</td>
                <td>
                  <div>
                    <p className="font-medium">{dep.user}</p>
                    <p className="text-xs text-muted-foreground">{dep.userId}</p>
                  </div>
                </td>
                <td className="font-semibold text-success">{dep.amountUsdt}</td>
                <td className="text-muted-foreground">{dep.nativeAmount}</td>
                <td>
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", channelColors[dep.channel])}>
                    {dep.channel}
                  </span>
                </td>
                <td>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                    dep.provider === "OpenXSwitch" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                  )}>
                    {dep.provider}
                  </span>
                </td>
                <td>
                  <StatusBadge status={statusConfig[dep.status as keyof typeof statusConfig]}>
                    {dep.status}
                  </StatusBadge>
                </td>
                <td className="text-muted-foreground">{dep.createdAt}</td>
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
                <SheetTitle>Deposit Details — {selectedDeposit.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Amount */}
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-3xl font-bold text-success">{selectedDeposit.amountUsdt}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedDeposit.nativeAmount} native</p>
                  <div className="mt-2">
                    <StatusBadge status={statusConfig[selectedDeposit.status as keyof typeof statusConfig]}>
                      {selectedDeposit.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Status Timeline</h4>
                  <div className="relative">
                    {timelineSteps.map((step, i) => {
                      const done = i <= selectedDeposit.currentStep;
                      return (
                        <div key={step} className="flex items-center gap-3 mb-3">
                          <div className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                            done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {done ? "✓" : i + 1}
                          </div>
                          <span className={cn("text-sm font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">User</p>
                      <p className="font-medium">{selectedDeposit.user}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="font-medium font-mono text-sm">{selectedDeposit.userId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Channel</p>
                      <p className="font-medium">{selectedDeposit.channel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Provider</p>
                      <p className="font-medium">{selectedDeposit.provider}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Provider Ref</p>
                      <p className="font-medium font-mono text-sm">{selectedDeposit.providerRef}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Linked Wallet</p>
                      <p className="font-medium font-mono text-sm">{selectedDeposit.walletRef ?? "—"}</p>
                    </div>
                    {selectedDeposit.webhookRef && (
                      <div>
                        <p className="text-xs text-muted-foreground">Webhook Log</p>
                        <p className="font-medium font-mono text-sm text-primary">{selectedDeposit.webhookRef}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Created At</p>
                      <p className="font-medium">{selectedDeposit.createdAt}</p>
                    </div>
                  </div>
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
