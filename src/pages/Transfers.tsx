import { useState } from "react";
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, RefreshCw, AlertTriangle, Flag, CheckCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";

const transfers = [
  {
    id: "TRF-20241231-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    country: "NG",
    direction: "send",
    channel: "Bank",
    amountUsdt: "245.50 USDT",
    fiatEquiv: "(~ ₦249,890)",
    provider: "OpenXSwitch",
    status: "completed",
    createdAt: "Dec 31, 2024 14:32:15",
    bank: "Access Bank",
    accountNumber: "0012345678",
    linkedWalletEvent: "WC-20241231-001",
    statusHistory: ["INITIATED", "PROCESSING", "COMPLETED"],
  },
  {
    id: "TRF-20241231-002",
    user: "Amara Eze",
    userId: "USR-002",
    country: "KE",
    direction: "receive",
    channel: "Mobile Money",
    amountUsdt: "176.80 USDT",
    fiatEquiv: "(~ KES 24,398)",
    provider: "OpenXSwitch",
    status: "completed",
    createdAt: "Dec 31, 2024 13:45:22",
    source: "M-Pesa ***4521",
    linkedWalletEvent: "WC-20241231-002",
    statusHistory: ["INITIATED", "CONFIRMED", "CREDITED"],
  },
  {
    id: "TRF-20241231-003",
    user: "Ibrahim Musa",
    userId: "USR-003",
    country: "GH",
    direction: "send",
    channel: "Bank",
    amountUsdt: "490.00 USDT",
    fiatEquiv: "(~ GHS 7,742)",
    provider: "OpenXSwitch",
    status: "pending",
    createdAt: "Dec 31, 2024 12:18:44",
    bank: "Ecobank Ghana",
    accountNumber: "0234567890",
    age: 35,
    statusHistory: ["INITIATED", "PROCESSING"],
  },
  {
    id: "TRF-20241231-004",
    user: "Folake Adeyemi",
    userId: "USR-004",
    country: "ZA",
    direction: "send",
    channel: "Mobile Money",
    amountUsdt: "73.50 USDT",
    fiatEquiv: "(~ ZAR 1,397)",
    provider: "OpenXSwitch",
    status: "completed",
    createdAt: "Dec 31, 2024 11:05:33",
    linkedWalletEvent: "WC-20241231-004",
    statusHistory: ["INITIATED", "PROCESSING", "COMPLETED"],
  },
  {
    id: "TRF-20241231-005",
    user: "Emeka Nwosu",
    userId: "USR-005",
    country: "NG",
    direction: "send",
    channel: "Bank",
    amountUsdt: "1,178.00 USDT",
    fiatEquiv: "(~ ₦1,199,220)",
    provider: "OpenXSwitch",
    status: "failed",
    createdAt: "Dec 31, 2024 10:22:18",
    failureReason: "Bank timeout - destination unreachable",
    bank: "Zenith Bank",
    accountNumber: "1234567890",
    statusHistory: ["INITIATED", "PROCESSING", "FAILED"],
  },
  {
    id: "TRF-20241230-001",
    user: "Ngozi Obi",
    userId: "USR-006",
    country: "KE",
    direction: "receive",
    channel: "Wallet",
    amountUsdt: "314.00 USDT",
    fiatEquiv: "(~ KES 43,332)",
    provider: "Yellow Card",
    status: "completed",
    createdAt: "Dec 30, 2024 16:45:11",
    source: "Yellow Card Rails",
    linkedWalletEvent: "WC-20241230-001",
    statusHistory: ["INITIATED", "CONFIRMED", "CREDITED"],
  },
];

const payoutQueue = transfers.filter(t => t.status === "pending" && t.direction === "send");

function getSLAIndicator(age: number | undefined) {
  if (!age) return null;
  if (age < 10) return { color: "bg-success", label: "On Track" };
  if (age <= 30) return { color: "bg-warning", label: "At Risk" };
  return { color: "bg-destructive", label: "Breached" };
}

export default function Transfers() {
  const [selectedTx, setSelectedTx] = useState<typeof transfers[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [escalateNote, setEscalateNote] = useState("");

  const handleViewTransfer = (tx: typeof transfers[0]) => {
    setSelectedTx(tx);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Transfers & Payouts</h1>
          <p className="page-description">
            Monitor and manage all platform transfers — amounts in USDT
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Transfers</TabsTrigger>
          <TabsTrigger value="queue" className="relative">
            Payout Queue
            {payoutQueue.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning text-xs text-warning-foreground">
                {payoutQueue.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, user, or reference..."
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Directions</SelectItem>
                <SelectItem value="send">SEND</SelectItem>
                <SelectItem value="receive">RECEIVE</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="mobile">Mobile Money</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="NG">Nigeria</SelectItem>
                <SelectItem value="KE">Kenya</SelectItem>
                <SelectItem value="GH">Ghana</SelectItem>
                <SelectItem value="ZA">South Africa</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="w-40" />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Transfers Table */}
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transfer ID</th>
                  <th>User</th>
                  <th>Country</th>
                  <th>Direction</th>
                  <th>Channel</th>
                  <th>Amount (USDT)</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((tx) => (
                  <tr
                    key={tx.id}
                    className={cn(
                      "cursor-pointer",
                      tx.status === "failed" && "bg-destructive/5"
                    )}
                    onClick={() => handleViewTransfer(tx)}
                  >
                    <td className="font-medium">{tx.id}</td>
                    <td>
                      <div>
                        <p className="font-medium">{tx.user}</p>
                        <p className="text-xs text-muted-foreground">{tx.userId}</p>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">
                        {tx.country}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {tx.direction === "receive" ? (
                          <ArrowDownLeft className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-primary" />
                        )}
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                          tx.direction === "receive" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                        )}>
                          {tx.direction.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-medium">
                        {tx.channel}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold">{tx.amountUsdt}</p>
                        {tx.fiatEquiv && <p className="text-xs text-muted-foreground">{tx.fiatEquiv}</p>}
                      </div>
                    </td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                        tx.provider === "OpenXSwitch" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                      )}>
                        {tx.provider}
                      </span>
                    </td>
                    <td>
                      <StatusBadge
                        status={
                          tx.status === "completed"
                            ? "success"
                            : tx.status === "pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {tx.status}
                      </StatusBadge>
                    </td>
                    <td className="text-muted-foreground">{tx.createdAt}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {tx.status === "failed" && (
                          <Button size="sm" variant="outline">
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Retry
                          </Button>
                        )}
                        {tx.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Resolve
                            </Button>
                            <Button size="sm" variant="ghost" className="text-warning">
                              <Flag className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          {/* Payout Queue Alert */}
          {payoutQueue.some(p => (p.age || 0) > 30) && (
            <div className="alert-card alert-card-error">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  SLA Breached: {payoutQueue.filter(p => (p.age || 0) > 30).length} payout(s) exceeding 30 min threshold
                </p>
                <p className="text-xs text-muted-foreground">
                  Immediate action required
                </p>
              </div>
            </div>
          )}

          {/* Payout Queue Table */}
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transfer ID</th>
                  <th>User</th>
                  <th>Country</th>
                  <th>Amount (USDT)</th>
                  <th>Destination</th>
                  <th>Age</th>
                  <th>SLA Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payoutQueue.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No pending payouts in queue
                    </td>
                  </tr>
                ) : (
                  payoutQueue.map((tx) => {
                    const sla = getSLAIndicator(tx.age);
                    return (
                      <tr key={tx.id}>
                        <td className="font-medium">{tx.id}</td>
                        <td>
                          <div>
                            <p className="font-medium">{tx.user}</p>
                            <p className="text-xs text-muted-foreground">{tx.userId}</p>
                          </div>
                        </td>
                        <td>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">
                            {tx.country}
                          </span>
                        </td>
                        <td>
                          <div>
                            <p className="font-semibold">{tx.amountUsdt}</p>
                            {tx.fiatEquiv && <p className="text-xs text-muted-foreground">{tx.fiatEquiv}</p>}
                          </div>
                        </td>
                        <td>
                          <div>
                            <p className="font-medium">{tx.bank}</p>
                            <p className="text-xs text-muted-foreground">{tx.accountNumber}</p>
                          </div>
                        </td>
                        <td className="font-medium">{tx.age} mins</td>
                        <td>
                          {sla && (
                            <div className="flex items-center gap-2">
                              <div className={cn("h-2 w-2 rounded-full", sla.color)} />
                              <span className="text-sm">{sla.label}</span>
                            </div>
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <RefreshCw className="mr-1 h-3 w-3" />
                              Retry
                            </Button>
                            <Button size="sm" variant="ghost" className="text-warning">
                              <Flag className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transfer Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedTx && (
            <>
              <SheetHeader>
                <SheetTitle>Transfer Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Transfer Status */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      selectedTx.direction === "receive" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                    )}
                  >
                    {selectedTx.direction === "receive" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      {selectedTx.direction.toUpperCase()} Transfer
                    </p>
                    <StatusBadge
                      status={
                        selectedTx.status === "completed"
                          ? "success"
                          : selectedTx.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {selectedTx.status}
                    </StatusBadge>
                  </div>
                </div>

                {/* Amount */}
                <div className="rounded-lg border border-border p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedTx.amountUsdt}</p>
                    {selectedTx.fiatEquiv && (
                      <p className="text-sm text-muted-foreground">{selectedTx.fiatEquiv}</p>
                    )}
                  </div>
                </div>

                {/* Status History */}
                {selectedTx.statusHistory && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Status Lifecycle
                    </h4>
                    <div className="flex items-center gap-2">
                      {selectedTx.statusHistory.map((status, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                            i < selectedTx.statusHistory.length - 1 || selectedTx.status === "completed" ? "bg-success/10 text-success" :
                            selectedTx.status === "failed" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                          )}>
                            {status}
                          </span>
                          {i < selectedTx.statusHistory.length - 1 && (
                            <span className="text-muted-foreground">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-muted-foreground">Transfer ID</p><p className="font-medium text-sm">{selectedTx.id}</p></div>
                  <div><p className="text-xs text-muted-foreground">Country</p><p className="font-medium text-sm">{selectedTx.country}</p></div>
                  <div><p className="text-xs text-muted-foreground">User</p><p className="font-medium text-sm">{selectedTx.user}</p></div>
                  <div><p className="text-xs text-muted-foreground">Channel</p><p className="font-medium text-sm">{selectedTx.channel}</p></div>
                  <div><p className="text-xs text-muted-foreground">Provider</p><p className="font-medium text-sm">{selectedTx.provider}</p></div>
                  <div><p className="text-xs text-muted-foreground">Created At</p><p className="font-medium text-sm">{selectedTx.createdAt}</p></div>
                </div>

                {/* Bank Details */}
                {selectedTx.bank && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Bank Details
                    </h4>
                    <div className="rounded-lg border border-border p-4">
                      <p className="font-medium">{selectedTx.bank} — {selectedTx.accountNumber}</p>
                    </div>
                  </div>
                )}

                {/* Failure Reason */}
                {selectedTx.failureReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Failure Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTx.failureReason}</p>
                  </div>
                )}

                {/* Actions */}
                {selectedTx.status === "pending" && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Escalation / resolution note..."
                      value={escalateNote}
                      onChange={(e) => setEscalateNote(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <RefreshCw className="mr-2 h-4 w-4" /> Retry
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Flag className="mr-2 h-4 w-4" /> Escalate
                      </Button>
                      <Button className="flex-1" disabled={!escalateNote}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Resolve
                      </Button>
                    </div>
                  </div>
                )}
                {selectedTx.status === "failed" && (
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Retry Transfer
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
