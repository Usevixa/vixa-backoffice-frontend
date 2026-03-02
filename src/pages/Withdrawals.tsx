import { useState } from "react";
import {
  Search, Filter, ArrowUpRight, AlertTriangle, RefreshCw, Flag, CheckCircle, Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
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
    subWallet: "SUB-00142",
    amountUsdt: "250.00 USDT",
    netDelivered: "248.50 USDT",
    beneficiaryBank: "GTBank ••••1234",
    fiatEquiv: "(≈ ₦361,325)",
    destination: "0xA4f2...3ac9 (Polygon)",
    status: "completed",
    ageMinutes: null,
    retryCount: 0,
    oxsRef: "OXS-SND-7841234",
    ycRef: "YC-WD-8847291",
    ledgerRef: "LDG-DEBIT-001",
    webhookRef: "WH-001",
    lastProviderResponse: "YC: CONFIRMED — on-chain tx sent on Polygon",
    createdAt: "Dec 31, 2024 14:32",
    timeline: [
      { step: "INITIATED", done: true, time: "14:32:00" },
      { step: "OXS DEBITED / SENT", done: true, time: "14:32:15" },
      { step: "YC PROCESSING", done: true, time: "14:32:40" },
      { step: "SENT ON POLYGON", done: true, time: "14:33:55" },
      { step: "CONFIRMED", done: true, time: "14:34:30" },
    ],
  },
  {
    id: "WDR-002",
    user: "Amara Eze",
    userId: "USR-002",
    subWallet: "SUB-00089",
    amountUsdt: "175.00 USDT",
    netDelivered: "173.25 USDT",
    beneficiaryBank: "KCB ••••5678",
    fiatEquiv: "(≈ KES 23,908)",
    destination: "0xB9c1...de44 (Polygon)",
    status: "pending",
    ageMinutes: 8,
    retryCount: 0,
    oxsRef: "OXS-SND-7841235",
    ycRef: "YC-WD-5523891",
    ledgerRef: "LDG-DEBIT-002",
    webhookRef: null,
    lastProviderResponse: "YC: PROCESSING — awaiting Polygon block confirmation",
    createdAt: "Dec 31, 2024 15:10",
    timeline: [
      { step: "INITIATED", done: true, time: "15:10:00" },
      { step: "OXS DEBITED / SENT", done: true, time: "15:10:22" },
      { step: "YC PROCESSING", done: true, time: "15:10:50" },
      { step: "SENT ON POLYGON", done: false, time: null },
      { step: "CONFIRMED", done: false, time: null },
    ],
  },
  {
    id: "WDR-003",
    user: "Ibrahim Musa",
    userId: "USR-003",
    subWallet: "SUB-00213",
    amountUsdt: "490.00 USDT",
    netDelivered: "485.10 USDT",
    beneficiaryBank: "GCB ••••9012",
    fiatEquiv: "(≈ GHS 7,663)",
    destination: "0xC3a7...ff01 (Polygon)",
    status: "pending",
    ageMinutes: 35,
    retryCount: 1,
    oxsRef: "OXS-SND-7841220",
    ycRef: "YC-WD-9912345",
    ledgerRef: "LDG-DEBIT-003",
    webhookRef: null,
    lastProviderResponse: "YC: TIMEOUT — no block confirmation after 30s, retrying",
    createdAt: "Dec 31, 2024 14:43",
    timeline: [
      { step: "INITIATED", done: true, time: "14:43:00" },
      { step: "OXS DEBITED / SENT", done: true, time: "14:43:18" },
      { step: "YC PROCESSING", done: true, time: "14:43:45" },
      { step: "SENT ON POLYGON", done: false, time: null },
      { step: "CONFIRMED", done: false, time: null },
    ],
  },
  {
    id: "WDR-004",
    user: "Emeka Nwosu",
    userId: "USR-005",
    subWallet: "SUB-00301",
    amountUsdt: "1,180.00 USDT",
    netDelivered: "1,168.20 USDT",
    beneficiaryBank: "FNB ••••3456",
    fiatEquiv: "(≈ ZAR 21,028)",
    destination: "0xD8b3...8Yk3 (Polygon)",
    status: "failed",
    ageMinutes: null,
    retryCount: 3,
    oxsRef: "OXS-SND-7841199",
    ycRef: "YC-WD-3312234",
    ledgerRef: "LDG-DEBIT-004",
    webhookRef: "WH-003",
    lastProviderResponse: "YC: FAILED — destination address failed compliance check",
    createdAt: "Dec 31, 2024 10:22",
    timeline: [
      { step: "INITIATED", done: true, time: "10:22:00" },
      { step: "OXS DEBITED / SENT", done: true, time: "10:22:30" },
      { step: "YC PROCESSING", done: true, time: "10:22:55" },
      { step: "SENT ON POLYGON", done: false, time: null },
      { step: "CONFIRMED", done: false, time: null },
    ],
  },
  {
    id: "WDR-005",
    user: "Ngozi Obi",
    userId: "USR-006",
    subWallet: "SUB-00078",
    amountUsdt: "310.00 USDT",
    netDelivered: "306.90 USDT",
    beneficiaryBank: "Equity ••••7890",
    fiatEquiv: "(≈ KES 42,352)",
    destination: "0xE1f9...mN2p (Polygon)",
    status: "completed",
    ageMinutes: null,
    retryCount: 0,
    oxsRef: "OXS-SND-7841100",
    ycRef: "YC-WD-5523880",
    ledgerRef: "LDG-DEBIT-005",
    webhookRef: "WH-005",
    lastProviderResponse: "YC: CONFIRMED — on-chain tx sent on Polygon",
    createdAt: "Dec 30, 2024 16:45",
    timeline: [
      { step: "INITIATED", done: true, time: "16:45:00" },
      { step: "OXS DEBITED / SENT", done: true, time: "16:45:20" },
      { step: "YC PROCESSING", done: true, time: "16:45:45" },
      { step: "SENT ON POLYGON", done: true, time: "16:46:30" },
      { step: "CONFIRMED", done: true, time: "16:47:05" },
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
        <div>
          <h1 className="page-title">Withdrawals (Network Out)</h1>
          <p className="page-description">
            USDT (Polygon) withdrawals: OpenXSwitch debit → Yellow Card → destination address
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Fixed route: OXS → Yellow Card → Polygon · Asset: USDT
        </div>
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
              <Input type="search" placeholder="Search withdrawal ID, sub-wallet, OXS ref, YC ref..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
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
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline">&gt;30 min</Button>
            <Button size="sm" variant="outline">Failed last 2h</Button>
            <Button size="sm" variant="outline">OXS Stage</Button>
            <Button size="sm" variant="outline">YC Stage</Button>
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
        <SheetContent className="w-[560px] overflow-y-auto">
          {selectedWdr && (
            <>
              <SheetHeader>
                <SheetTitle>Withdrawal — {selectedWdr.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Amount + Status */}
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-3xl font-bold mt-1">{selectedWdr.amountUsdt}</p>
                  <p className="text-sm text-muted-foreground mt-1">→ {selectedWdr.destination}</p>
                  <div className="mt-2">
                    <StatusBadge status={statusConfig[selectedWdr.status as keyof typeof statusConfig]}>
                      {selectedWdr.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>

                {/* Net Delivered + Beneficiary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Net Delivered (USDT)</p>
                    <p className="text-lg font-semibold text-success">{selectedWdr.netDelivered}</p>
                    {selectedWdr.fiatEquiv && <p className="text-xs text-muted-foreground mt-1">{selectedWdr.fiatEquiv}</p>}
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Beneficiary Bank</p>
                    <p className="text-sm font-medium mt-1">{selectedWdr.beneficiaryBank}</p>
                  </div>
                </div>

                {/* Full Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Full Status Timeline</h4>
                  <div className="text-xs text-muted-foreground mb-2">OXS debit → YC processing → Polygon confirmation</div>
                  {selectedWdr.timeline.map((t, i) => {
                    const isHandoff = t.step === "YC PROCESSING";
                    return (
                      <div key={i}>
                        {isHandoff && (
                          <div className="flex items-center gap-2 my-2">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-warning font-medium px-2 py-0.5 rounded bg-warning/10">OXS → YC Handoff</span>
                            <div className="flex-1 h-px bg-border" />
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                            t.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {t.done ? "✓" : i + 1}
                          </div>
                          <span className={cn("text-sm font-medium flex-1", t.done ? "text-foreground" : "text-muted-foreground")}>{t.step}</span>
                          {t.time && <span className="text-xs text-muted-foreground font-mono">{t.time}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Provider References — in drawer only */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Provider References</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">OXS Ref (debit/send)</span>
                      <span className="font-mono text-sm font-medium text-primary">{selectedWdr.oxsRef}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Yellow Card Ref</span>
                      <span className="font-mono text-sm font-medium text-warning">{selectedWdr.ycRef}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">User</p><p className="font-medium">{selectedWdr.user}</p></div>
                  <div><p className="text-xs text-muted-foreground">Sub-wallet</p><p className="font-mono text-sm">{selectedWdr.subWallet}</p></div>
                  <div><p className="text-xs text-muted-foreground">Retry Count</p><p className="font-medium">{selectedWdr.retryCount}</p></div>
                  <div><p className="text-xs text-muted-foreground">Ledger Debit</p><p className="font-mono text-sm">{selectedWdr.ledgerRef}</p></div>
                  {selectedWdr.webhookRef && (
                    <div><p className="text-xs text-muted-foreground">Webhook Log</p><p className="font-mono text-sm text-primary">{selectedWdr.webhookRef}</p></div>
                  )}
                  <div><p className="text-xs text-muted-foreground">Created At</p><p className="font-medium">{selectedWdr.createdAt}</p></div>
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
                      <RefreshCw className="mr-2 h-4 w-4" /> Retry
                    </Button>
                  )}
                  <Button variant="outline">
                    <Flag className="mr-2 h-4 w-4" /> Escalate
                  </Button>
                  <Button variant="outline" disabled={!adminNote}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved
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
    id: string; user: string; userId: string; subWallet: string; amountUsdt: string;
    netDelivered: string; beneficiaryBank: string; fiatEquiv?: string;
    destination: string; status: string; ageMinutes: number | null; createdAt: string;
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
            <th>User / Sub-wallet</th>
            <th>Amount (USDT)</th>
            <th>Net Delivered (USDT)</th>
            <th>Beneficiary Bank</th>
            <th>Destination</th>
            <th>Status</th>
            {showSla && <th>Age (SLA)</th>}
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
              <td className="font-mono text-sm font-medium text-primary">{w.id}</td>
              <td>
                <div>
                  <p className="font-medium">{w.user}</p>
                  <p className="text-xs text-muted-foreground font-mono">{w.subWallet}</p>
                </div>
              </td>
              <td className="font-semibold">{w.amountUsdt}</td>
              <td>
                <div>
                  <p className="font-semibold text-success">{w.netDelivered}</p>
                  {w.fiatEquiv && <p className="text-xs text-muted-foreground">{w.fiatEquiv}</p>}
                </div>
              </td>
              <td className="text-sm">{w.beneficiaryBank}</td>
              <td className="text-muted-foreground text-xs font-mono">{w.destination}</td>
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
              <td className="text-muted-foreground text-sm">{w.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
