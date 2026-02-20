import { useState } from "react";
import { Search, Filter, ArrowUpRight, AlertTriangle, RefreshCw, Flag, CheckCircle, Clock } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const withdrawals = [
  {
    id: "WDR-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    amountUsdt: "250.00 USDT",
    destination: "Access Bank ***4521",
    provider: "OpenXSwitch",
    status: "completed",
    ageMinutes: null,
    retryCount: 0,
    providerRef: "OXS-WDR-7841234",
    ledgerRef: "WAL-001",
    webhookRef: "WH-001",
    lastProviderResponse: "SUCCESS - bank credited",
    createdAt: "Dec 31, 2024 14:32",
    timeline: [
      { step: "INITIATED", done: true, time: "14:32:00" },
      { step: "PROCESSING", done: true, time: "14:32:15" },
      { step: "SETTLED", done: true, time: "14:34:12" },
      { step: "COMPLETED", done: true, time: "14:34:30" },
    ],
  },
  {
    id: "WDR-002",
    user: "Amara Eze",
    userId: "USR-002",
    amountUsdt: "175.00 USDT",
    destination: "GTBank ***7891",
    provider: "OpenXSwitch",
    status: "pending",
    ageMinutes: 8,
    retryCount: 0,
    providerRef: "OXS-WDR-7841235",
    ledgerRef: "WAL-003",
    webhookRef: null,
    lastProviderResponse: "PENDING - awaiting bank confirmation",
    createdAt: "Dec 31, 2024 15:10",
    timeline: [
      { step: "INITIATED", done: true, time: "15:10:00" },
      { step: "PROCESSING", done: true, time: "15:10:22" },
      { step: "SETTLED", done: false, time: null },
      { step: "COMPLETED", done: false, time: null },
    ],
  },
  {
    id: "WDR-003",
    user: "Ibrahim Musa",
    userId: "USR-003",
    amountUsdt: "490.00 USDT",
    destination: "First Bank ***2345",
    provider: "OpenXSwitch",
    status: "pending",
    ageMinutes: 35,
    retryCount: 1,
    providerRef: "OXS-WDR-7841220",
    ledgerRef: "WAL-005",
    webhookRef: null,
    lastProviderResponse: "TIMEOUT - bank did not respond within 30s",
    createdAt: "Dec 31, 2024 14:43",
    timeline: [
      { step: "INITIATED", done: true, time: "14:43:00" },
      { step: "PROCESSING", done: true, time: "14:43:18" },
      { step: "SETTLED", done: false, time: null },
      { step: "COMPLETED", done: false, time: null },
    ],
  },
  {
    id: "WDR-004",
    user: "Emeka Nwosu",
    userId: "USR-005",
    amountUsdt: "1,180.00 USDT",
    destination: "Zenith Bank ***6789",
    provider: "OpenXSwitch",
    status: "failed",
    ageMinutes: null,
    retryCount: 3,
    providerRef: "OXS-WDR-7841199",
    ledgerRef: "WAL-009",
    webhookRef: "WH-003",
    lastProviderResponse: "FAILED - bank account invalid",
    createdAt: "Dec 31, 2024 10:22",
    timeline: [
      { step: "INITIATED", done: true, time: "10:22:00" },
      { step: "PROCESSING", done: true, time: "10:22:30" },
      { step: "SETTLED", done: false, time: null },
      { step: "COMPLETED", done: false, time: null },
    ],
  },
  {
    id: "WDR-005",
    user: "Ngozi Obi",
    userId: "USR-006",
    amountUsdt: "310.00 USDT",
    destination: "MTN MoMo ***0801",
    provider: "OpenXSwitch",
    status: "completed",
    ageMinutes: null,
    retryCount: 0,
    providerRef: "OXS-WDR-7841100",
    ledgerRef: "WAL-003",
    webhookRef: "WH-001",
    lastProviderResponse: "SUCCESS - mobile money credited",
    createdAt: "Dec 30, 2024 16:45",
    timeline: [
      { step: "INITIATED", done: true, time: "16:45:00" },
      { step: "PROCESSING", done: true, time: "16:45:20" },
      { step: "SETTLED", done: true, time: "16:46:45" },
      { step: "COMPLETED", done: true, time: "16:47:00" },
    ],
  },
];

const statusConfig = {
  pending: "warning",
  processing: "info",
  completed: "success",
  failed: "error",
  settled: "success",
} as const;

function getSlaColor(minutes: number | null) {
  if (minutes === null) return "";
  if (minutes < 10) return "text-success bg-success/10";
  if (minutes < 30) return "text-warning bg-warning/10";
  return "text-destructive bg-destructive/10";
}

export default function Withdrawals() {
  const [selectedWdr, setSelectedWdr] = useState<typeof withdrawals[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const pending = withdrawals.filter(w => w.status === "pending");
  const failed = withdrawals.filter(w => w.status === "failed");
  const completed = withdrawals.filter(w => w.status === "completed");
  const redSla = pending.filter(w => (w.ageMinutes ?? 0) > 30);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Withdrawals</h1>
        <p className="page-description">
          Ops-critical view of all value leaving VIXA wallets via bank, mobile money, and stablecoin rails
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <p className="metric-label">Completed Today</p>
          </div>
          <p className="metric-value mt-1">{completed.length}</p>
        </div>
        <div className="metric-card border-warning/30">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            <p className="metric-label">Pending</p>
          </div>
          <p className="metric-value mt-1 text-warning">{pending.length}</p>
        </div>
        <div className="metric-card border-destructive/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="metric-label">Failed (24h)</p>
          </div>
          <p className="metric-value mt-1 text-destructive">{failed.length}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Avg Processing Time</p>
          <p className="metric-value mt-1">2.1 min</p>
        </div>
      </div>

      {/* SLA Breach Alert */}
      {redSla.length > 0 && (
        <div className="alert-card alert-card-error">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {redSla.length} withdrawal(s) breaching SLA (&gt;30 min)
            </p>
            <p className="text-xs text-muted-foreground">Immediate investigation required</p>
          </div>
          <Button size="sm" variant="outline">View Queue</Button>
        </div>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Withdrawals</TabsTrigger>
          <TabsTrigger value="queue" className="relative">
            Queue
            {pending.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning text-xs text-warning-foreground">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search withdrawal ID, user, provider ref..." className="pl-9" />
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
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>

          <WithdrawalsTable withdrawals={withdrawals} onSelect={(w) => { setSelectedWdr(w); setSheetOpen(true); }} showSla={false} />
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          {/* Quick filter buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline">&gt;30 min</Button>
            <Button size="sm" variant="outline">Failed last 2h</Button>
            <Button size="sm" variant="outline">OpenXSwitch</Button>
            <Button size="sm" variant="outline">Yellow Card</Button>
          </div>

          <WithdrawalsTable
            withdrawals={pending}
            onSelect={(w) => { setSelectedWdr(w); setSheetOpen(true); }}
            showSla
          />
        </TabsContent>
      </Tabs>

      {/* Withdrawal Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[540px] overflow-y-auto">
          {selectedWdr && (
            <>
              <SheetHeader>
                <SheetTitle>Withdrawal — {selectedWdr.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Amount + Status */}
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-3xl font-bold">{selectedWdr.amountUsdt}</p>
                  <p className="text-sm text-muted-foreground mt-1">→ {selectedWdr.destination}</p>
                  <div className="mt-2">
                    <StatusBadge status={statusConfig[selectedWdr.status as keyof typeof statusConfig]}>
                      {selectedWdr.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Status Timeline</h4>
                  {selectedWdr.timeline.map((t, i) => (
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

                {/* Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs text-muted-foreground">User</p><p className="font-medium">{selectedWdr.user}</p></div>
                    <div><p className="text-xs text-muted-foreground">User ID</p><p className="font-mono text-sm font-medium">{selectedWdr.userId}</p></div>
                    <div><p className="text-xs text-muted-foreground">Provider</p><p className="font-medium">{selectedWdr.provider}</p></div>
                    <div><p className="text-xs text-muted-foreground">Retry Count</p><p className="font-medium">{selectedWdr.retryCount}</p></div>
                    <div><p className="text-xs text-muted-foreground">Provider Ref</p><p className="font-mono text-sm">{selectedWdr.providerRef}</p></div>
                    <div><p className="text-xs text-muted-foreground">Ledger Debit</p><p className="font-mono text-sm">{selectedWdr.ledgerRef}</p></div>
                    {selectedWdr.webhookRef && (
                      <div><p className="text-xs text-muted-foreground">Webhook Log</p><p className="font-mono text-sm text-primary">{selectedWdr.webhookRef}</p></div>
                    )}
                    <div><p className="text-xs text-muted-foreground">Created At</p><p className="font-medium">{selectedWdr.createdAt}</p></div>
                  </div>
                </div>

                {/* Provider Response */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Last Provider Response</p>
                  <p className="text-sm font-medium">{selectedWdr.lastProviderResponse}</p>
                </div>

                {/* Admin Note */}
                <div className="space-y-2">
                  <Label>Admin Note</Label>
                  <Textarea
                    placeholder="Add resolution note..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  {selectedWdr.status === "failed" && (
                    <Button variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                  )}
                  <Button variant="outline">
                    <Flag className="mr-2 h-4 w-4" />
                    Escalate
                  </Button>
                  <Button variant="outline" disabled={!adminNote}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Resolved
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">All actions are logged to the Audit Trail</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function WithdrawalsTable({
  withdrawals,
  onSelect,
  showSla,
}: {
  withdrawals: {
    id: string; user: string; userId: string; amountUsdt: string;
    destination: string; provider: string; status: string;
    ageMinutes: number | null; createdAt: string;
  }[];
  onSelect: (w: any) => void;
  showSla: boolean;
}) {
  return (
    <div className="content-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Withdrawal ID</th>
            <th>User</th>
            <th>Amount (USDT)</th>
            <th>Destination</th>
            <th>Provider</th>
            <th>Status</th>
            {showSla && <th>Age</th>}
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr
              key={w.id}
              className={cn(
                "cursor-pointer",
                w.status === "failed" && "bg-destructive/5",
                w.ageMinutes !== null && w.ageMinutes > 30 && "bg-warning/5"
              )}
              onClick={() => onSelect(w)}
            >
              <td className="font-mono text-sm font-medium">{w.id}</td>
              <td>
                <div>
                  <p className="font-medium">{w.user}</p>
                  <p className="text-xs text-muted-foreground">{w.userId}</p>
                </div>
              </td>
              <td className="font-semibold">{w.amountUsdt}</td>
              <td className="text-muted-foreground text-sm">{w.destination}</td>
              <td>
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                  w.provider === "OpenXSwitch" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                )}>
                  {w.provider}
                </span>
              </td>
              <td>
                <StatusBadge status={statusConfig[w.status as keyof typeof statusConfig]}>
                  {w.status}
                </StatusBadge>
              </td>
              {showSla && (
                <td>
                  {w.ageMinutes !== null ? (
                    <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", getSlaColor(w.ageMinutes))}>
                      {w.ageMinutes} min
                    </span>
                  ) : <span className="text-muted-foreground">—</span>}
                </td>
              )}
              <td className="text-muted-foreground">{w.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
