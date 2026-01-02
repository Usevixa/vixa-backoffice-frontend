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
    direction: "outbound",
    channel: "Bank",
    amount: "₦250,000",
    currency: "NGN",
    provider: "OpenXSwitch",
    status: "completed",
    createdAt: "Dec 31, 2024 14:32:15",
    bank: "Access Bank",
    accountNumber: "0012345678",
  },
  {
    id: "TRF-20241231-002",
    user: "Amara Eze",
    userId: "USR-002",
    direction: "inbound",
    channel: "Wallet",
    amount: "₦180,000",
    currency: "NGN",
    provider: "OpenXSwitch",
    status: "completed",
    createdAt: "Dec 31, 2024 13:45:22",
  },
  {
    id: "TRF-20241231-003",
    user: "Ibrahim Musa",
    userId: "USR-003",
    direction: "outbound",
    channel: "Bank",
    amount: "₦500,000",
    currency: "NGN",
    provider: "OpenXSwitch",
    status: "pending",
    createdAt: "Dec 31, 2024 12:18:44",
    bank: "GTBank",
    accountNumber: "0234567890",
    age: 35, // minutes
  },
  {
    id: "TRF-20241231-004",
    user: "Folake Adeyemi",
    userId: "USR-004",
    direction: "outbound",
    channel: "Mobile Money",
    amount: "₦75,000",
    currency: "NGN",
    provider: "OpenXSwitch",
    status: "completed",
    createdAt: "Dec 31, 2024 11:05:33",
  },
  {
    id: "TRF-20241231-005",
    user: "Emeka Nwosu",
    userId: "USR-005",
    direction: "outbound",
    channel: "Bank",
    amount: "₦1,200,000",
    currency: "NGN",
    provider: "OpenXSwitch",
    status: "failed",
    createdAt: "Dec 31, 2024 10:22:18",
    failureReason: "Bank timeout - destination unreachable",
    bank: "Zenith Bank",
    accountNumber: "1234567890",
  },
  {
    id: "TRF-20241230-001",
    user: "Ngozi Obi",
    userId: "USR-006",
    direction: "inbound",
    channel: "Bank",
    amount: "₦320,000",
    currency: "NGN",
    provider: "OpenXSwitch",
    status: "completed",
    createdAt: "Dec 30, 2024 16:45:11",
  },
];

const payoutQueue = transfers.filter(t => t.status === "pending" && t.direction === "outbound");

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
            Monitor and manage all platform transfers
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
                <SelectItem value="inbound">Inbound</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
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
                  <th>Direction</th>
                  <th>Channel</th>
                  <th>Amount</th>
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
                      <div className="flex items-center gap-2">
                        {tx.direction === "inbound" ? (
                          <ArrowDownLeft className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-primary" />
                        )}
                        <span className="capitalize">{tx.direction}</span>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-medium">
                        {tx.channel}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{tx.amount}</p>
                        <p className="text-xs text-muted-foreground">{tx.currency}</p>
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
                  <th>Amount</th>
                  <th>Destination</th>
                  <th>Age</th>
                  <th>SLA Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payoutQueue.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
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
                        <td className="font-semibold">{tx.amount}</td>
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
                      selectedTx.direction === "inbound" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                    )}
                  >
                    {selectedTx.direction === "inbound" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold capitalize">
                      {selectedTx.direction} Transfer
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
                    <p className="text-2xl font-bold">{selectedTx.amount}</p>
                    <p className="text-sm text-muted-foreground">{selectedTx.currency}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Transfer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Transfer ID</p>
                      <p className="font-medium text-sm">{selectedTx.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Channel</p>
                      <p className="font-medium text-sm">{selectedTx.channel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User</p>
                      <p className="font-medium text-sm">{selectedTx.user}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="font-medium text-sm">{selectedTx.userId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Provider</p>
                      <p className="font-medium text-sm">{selectedTx.provider}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created At</p>
                      <p className="font-medium text-sm">{selectedTx.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Info */}
                {selectedTx.bank && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Destination
                    </h4>
                    <div className="rounded-lg border border-border p-4">
                      <p className="font-medium">{selectedTx.bank}</p>
                      <p className="text-sm text-muted-foreground">{selectedTx.accountNumber}</p>
                    </div>
                  </div>
                )}

                {/* Failure Reason */}
                {selectedTx.failureReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Failure Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTx.failureReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {selectedTx.status === "failed" && (
                  <Button className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Payout
                  </Button>
                )}
                {selectedTx.status === "pending" && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Resolved
                      </Button>
                      <Button variant="destructive" className="flex-1">
                        <Flag className="mr-2 h-4 w-4" />
                        Escalate
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Escalation Note</p>
                      <Textarea
                        placeholder="Add a note for escalation..."
                        value={escalateNote}
                        onChange={(e) => setEscalateNote(e.target.value)}
                      />
                    </div>
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
