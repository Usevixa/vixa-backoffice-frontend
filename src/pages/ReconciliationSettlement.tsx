import { useState } from "react";
import { Search, Filter, AlertTriangle, CheckCircle, FileText } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const dailyRecon = [
  {
    date: "Dec 31, 2024",
    provider: "OpenXSwitch",
    totalVolume: "₦145.2M",
    expected: "₦145.2M",
    actual: "₦145.0M",
    variance: "₦200,000",
    exceptions: 2,
    status: "exception",
  },
  {
    date: "Dec 31, 2024",
    provider: "Yellow Card",
    totalVolume: "524,875 USDT",
    expected: "524,875 USDT",
    actual: "524,875 USDT",
    variance: "0",
    exceptions: 0,
    status: "matched",
  },
  {
    date: "Dec 30, 2024",
    provider: "OpenXSwitch",
    totalVolume: "₦132.8M",
    expected: "₦132.8M",
    actual: "₦132.8M",
    variance: "0",
    exceptions: 0,
    status: "matched",
  },
  {
    date: "Dec 30, 2024",
    provider: "Yellow Card",
    totalVolume: "498,230 USDT",
    expected: "498,230 USDT",
    actual: "498,210 USDT",
    variance: "20 USDT",
    exceptions: 1,
    status: "exception",
  },
  {
    date: "Dec 29, 2024",
    provider: "OpenXSwitch",
    totalVolume: "₦128.5M",
    expected: "₦128.5M",
    actual: "₦128.5M",
    variance: "0",
    exceptions: 0,
    status: "matched",
  },
];

const exceptions = [
  {
    id: "EXC-001",
    type: "missing_credit",
    provider: "OpenXSwitch",
    amount: "₦150,000",
    transferId: "TRF-20241231-003",
    createdAt: "Dec 31, 2024 16:00",
    status: "open",
    description: "RECEIVE credited to wallet but not settled with provider",
  },
  {
    id: "EXC-002",
    type: "amount_mismatch",
    provider: "OpenXSwitch",
    amount: "₦50,000",
    transferId: "TRF-20241231-005",
    createdAt: "Dec 31, 2024 15:30",
    status: "open",
    description: "SEND settled but amount differs from expected by ₦50,000",
  },
  {
    id: "EXC-003",
    type: "duplicate_debit",
    provider: "Yellow Card",
    amount: "20 USDT",
    transferId: "STO-20241230-012",
    createdAt: "Dec 30, 2024 18:00",
    status: "resolved",
    description: "Duplicate debit detected for stablecoin operation",
    resolution: "Refund processed to user wallet",
  },
  {
    id: "EXC-004",
    type: "swap_imbalance",
    provider: "Yellow Card",
    amount: "₦50,000",
    transferId: "SWP-20241231-003",
    createdAt: "Dec 31, 2024 14:00",
    status: "open",
    description: "SWAP debit from NGN wallet without matching USDT credit",
  },
  {
    id: "EXC-005",
    type: "receive_unconfirmed",
    provider: "OpenXSwitch",
    amount: "₦180,000",
    transferId: "TRF-20241231-010",
    createdAt: "Dec 31, 2024 11:30",
    status: "open",
    description: "RECEIVE credited to wallet but not confirmed by provider",
  },
  {
    id: "EXC-006",
    type: "send_unsettled",
    provider: "OpenXSwitch",
    amount: "₦320,000",
    transferId: "TRF-20241231-008",
    createdAt: "Dec 31, 2024 10:15",
    status: "resolved",
    description: "SEND settled with provider but not debited from wallet",
    resolution: "Manual debit applied with audit note",
  },
];

const exceptionTypes = {
  missing_credit: { label: "Missing Credit", color: "bg-destructive/10 text-destructive" },
  duplicate_debit: { label: "Duplicate Debit", color: "bg-warning/10 text-warning" },
  amount_mismatch: { label: "Amount Mismatch", color: "bg-primary/10 text-primary" },
  swap_imbalance: { label: "Swap Imbalance", color: "bg-warning/10 text-warning" },
  receive_unconfirmed: { label: "Receive Unconfirmed", color: "bg-success/10 text-success" },
  send_unsettled: { label: "Send Unsettled", color: "bg-primary/10 text-primary" },
};

export default function ReconciliationSettlement() {
  const [selectedExc, setSelectedExc] = useState<typeof exceptions[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  const openExceptions = exceptions.filter(e => e.status === "open").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Reconciliation & Settlement</h1>
        <p className="page-description">
          Daily reconciliation and exception management
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="metric-label">Today's Volume</p>
          <p className="metric-value mt-1">₦145.2M</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <p className="metric-label">Matched</p>
          </div>
          <p className="metric-value mt-1 text-success">98.6%</p>
        </div>
        <div className="metric-card border-warning/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <p className="metric-label">Open Exceptions</p>
          </div>
          <p className="metric-value mt-1 text-warning">{openExceptions}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Pending Settlement</p>
          <p className="metric-value mt-1">₦8.4M</p>
        </div>
      </div>

      {/* Alert for Open Exceptions */}
      {openExceptions > 0 && (
        <div className="alert-card alert-card-warning">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {openExceptions} unresolved exception(s) require attention
            </p>
            <p className="text-xs text-muted-foreground">
              Review and resolve to complete daily reconciliation
            </p>
          </div>
          <Button size="sm" variant="outline">
            View Exceptions
          </Button>
        </div>
      )}

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList>
          <TabsTrigger value="daily">Daily Reconciliation</TabsTrigger>
          <TabsTrigger value="exceptions" className="relative">
            Exceptions
            {openExceptions > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning text-xs text-warning-foreground">
                {openExceptions}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <Input type="date" className="w-40" defaultValue="2024-12-31" />
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
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="exception">Exception</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Daily Recon Table */}
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Provider</th>
                  <th>Total Volume</th>
                  <th>Expected</th>
                  <th>Actual</th>
                  <th>Variance</th>
                  <th>Exceptions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dailyRecon.map((recon, index) => (
                  <tr
                    key={index}
                    className={cn(recon.status === "exception" && "bg-warning/5")}
                  >
                    <td className="font-medium">{recon.date}</td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                        recon.provider === "OpenXSwitch" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                      )}>
                        {recon.provider}
                      </span>
                    </td>
                    <td className="font-medium">{recon.totalVolume}</td>
                    <td className="text-muted-foreground">{recon.expected}</td>
                    <td className="text-muted-foreground">{recon.actual}</td>
                    <td className={cn(
                      "font-medium",
                      recon.variance !== "0" && "text-destructive"
                    )}>
                      {recon.variance}
                    </td>
                    <td>
                      {recon.exceptions > 0 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-warning text-xs font-medium text-warning-foreground">
                          {recon.exceptions}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge
                        status={recon.status === "matched" ? "success" : "warning"}
                      >
                        {recon.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="exceptions" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search exceptions..."
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="missing_credit">Missing Credit</SelectItem>
                <SelectItem value="duplicate_debit">Duplicate Debit</SelectItem>
                <SelectItem value="amount_mismatch">Amount Mismatch</SelectItem>
                <SelectItem value="swap_imbalance">Swap Imbalance</SelectItem>
                <SelectItem value="receive_unconfirmed">Receive Unconfirmed</SelectItem>
                <SelectItem value="send_unsettled">Send Unsettled</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="open">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Exceptions Table */}
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Exception ID</th>
                  <th>Type</th>
                  <th>Provider</th>
                  <th>Amount</th>
                  <th>Transfer ID</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exceptions.map((exc) => {
                  const typeInfo = exceptionTypes[exc.type as keyof typeof exceptionTypes];
                  return (
                    <tr
                      key={exc.id}
                      className={cn(
                        "cursor-pointer",
                        exc.status === "open" && "bg-warning/5"
                      )}
                      onClick={() => {
                        setSelectedExc(exc);
                        setSheetOpen(true);
                      }}
                    >
                      <td className="font-medium">{exc.id}</td>
                      <td>
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                          typeInfo.color
                        )}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td>
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                          exc.provider === "OpenXSwitch" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                        )}>
                          {exc.provider}
                        </span>
                      </td>
                      <td className="font-medium">{exc.amount}</td>
                      <td className="font-mono text-sm text-muted-foreground">{exc.transferId}</td>
                      <td>
                        <StatusBadge
                          status={exc.status === "open" ? "warning" : "success"}
                        >
                          {exc.status}
                        </StatusBadge>
                      </td>
                      <td className="text-muted-foreground">{exc.createdAt}</td>
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        {exc.status === "open" && (
                          <Button size="sm" variant="outline">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Resolve
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Exception Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedExc && (
            <>
              <SheetHeader>
                <SheetTitle>Exception Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Exception Type */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      {exceptionTypes[selectedExc.type as keyof typeof exceptionTypes].label}
                    </p>
                    <StatusBadge
                      status={selectedExc.status === "open" ? "warning" : "success"}
                    >
                      {selectedExc.status}
                    </StatusBadge>
                  </div>
                </div>

                {/* Amount */}
                <div className="rounded-lg border border-border p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedExc.amount}</p>
                    <p className="text-sm text-muted-foreground">{selectedExc.provider}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Exception Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Exception ID</p>
                      <p className="font-medium text-sm">{selectedExc.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Transfer ID</p>
                      <p className="font-medium text-sm font-mono">{selectedExc.transferId}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="font-medium text-sm">{selectedExc.description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created At</p>
                      <p className="font-medium text-sm">{selectedExc.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* Resolution (if resolved) */}
                {selectedExc.resolution && (
                  <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                    <p className="text-sm font-medium text-success">Resolution</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedExc.resolution}
                    </p>
                  </div>
                )}

                {/* Actions (if open) */}
                {selectedExc.status === "open" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Resolution Note</p>
                      <Textarea
                        placeholder="Describe how this exception was resolved..."
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                      />
                    </div>
                    <Button className="w-full">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </Button>
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
