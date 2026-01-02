import { useState } from "react";
import { Search, Filter, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, Eye } from "lucide-react";
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
import { cn } from "@/lib/utils";

const stablecoinOps = [
  {
    id: "STO-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    type: "transfer",
    amount: "245.50 USDT",
    rate: "₦1,018.33",
    yellowCardRef: "YC-8847291",
    status: "completed",
    createdAt: "Dec 31, 2024 14:32",
  },
  {
    id: "STO-002",
    user: "Amara Eze",
    userId: "USR-002",
    type: "payout",
    amount: "175.00 USDT",
    rate: "₦1,028.57",
    yellowCardRef: "YC-5523891",
    status: "completed",
    createdAt: "Dec 31, 2024 13:45",
  },
  {
    id: "STO-003",
    user: "Emeka Nwosu",
    userId: "USR-005",
    type: "transfer",
    amount: "1,180.00 USDT",
    rate: "₦1,016.95",
    yellowCardRef: "YC-8847290",
    status: "failed",
    createdAt: "Dec 31, 2024 10:22",
    failureReason: "Insufficient liquidity",
  },
  {
    id: "STO-004",
    user: "Ngozi Obi",
    userId: "USR-006",
    type: "payout",
    amount: "310.00 USDC",
    rate: "₦1,032.26",
    yellowCardRef: "YC-5523880",
    status: "completed",
    createdAt: "Dec 30, 2024 16:45",
  },
  {
    id: "STO-005",
    user: "Ibrahim Musa",
    userId: "USR-003",
    type: "transfer",
    amount: "490.00 USDT",
    rate: "₦1,020.41",
    yellowCardRef: "YC-9912345",
    status: "processing",
    createdAt: "Dec 31, 2024 15:10",
  },
];

const swaps = [
  {
    id: "SWP-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    fromCurrency: "NGN",
    toCurrency: "USDT",
    amountIn: "₦1,018,500",
    amountOut: "1,000 USDT",
    rateUsed: "₦1,018.50",
    spread: "₦3,500",
    status: "completed",
    debitWallet: "WAL-001",
    creditWallet: "WAL-002",
    timestamp: "Dec 31, 2024 14:32",
  },
  {
    id: "SWP-002",
    user: "Amara Eze",
    userId: "USR-002",
    fromCurrency: "USDT",
    toCurrency: "NGN",
    amountIn: "500 USDT",
    amountOut: "₦509,250",
    rateUsed: "₦1,018.50",
    spread: "₦1,750",
    status: "completed",
    debitWallet: "WAL-004",
    creditWallet: "WAL-003",
    timestamp: "Dec 31, 2024 13:15",
  },
  {
    id: "SWP-003",
    user: "Ibrahim Musa",
    userId: "USR-003",
    fromCurrency: "NGN",
    toCurrency: "USDC",
    amountIn: "₦2,037,000",
    amountOut: "2,000 USDC",
    rateUsed: "₦1,018.50",
    spread: "₦7,000",
    status: "rate_locked",
    debitWallet: "WAL-005",
    creditWallet: "WAL-006",
    timestamp: "Dec 31, 2024 15:45",
  },
  {
    id: "SWP-004",
    user: "Emeka Nwosu",
    userId: "USR-005",
    fromCurrency: "USDC",
    toCurrency: "USDT",
    amountIn: "1,000 USDC",
    amountOut: "999.50 USDT",
    rateUsed: "0.9995",
    spread: "0.50 USDT",
    status: "failed",
    debitWallet: "WAL-009",
    creditWallet: "WAL-010",
    timestamp: "Dec 31, 2024 11:20",
    failureReason: "Insufficient USDT liquidity",
  },
];

const swapStatusColors = {
  initiated: "bg-muted text-muted-foreground",
  rate_locked: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
};

export default function StablecoinOperations() {
  const [selectedOp, setSelectedOp] = useState<typeof stablecoinOps[0] | null>(null);
  const [selectedSwap, setSelectedSwap] = useState<typeof swaps[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [swapSheetOpen, setSwapSheetOpen] = useState(false);

  const transferVolume = "524,875 USDT";
  const payoutVolume = "₦234.5M";
  const swapVolume = "₦42.5M";
  const totalSpread = "₦1.2M";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Stablecoin Operations</h1>
        <p className="page-description">
          Monitor stablecoin transfers, payouts, and swaps via Yellow Card
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="metric-label">Transfer Volume (24h)</p>
          </div>
          <p className="metric-value mt-1">{transferVolume}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-success" />
            <p className="metric-label">Payout Volume (24h)</p>
          </div>
          <p className="metric-value mt-1">{payoutVolume}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-warning" />
            <p className="metric-label">SWAP Volume (24h)</p>
          </div>
          <p className="metric-value mt-1">{swapVolume}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Spread Earned (24h)</p>
          <p className="metric-value mt-1 text-success">{totalSpread}</p>
        </div>
      </div>

      {/* Yellow Card Provider Status */}
      <div className="content-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <span className="font-semibold text-warning">Y</span>
            </div>
            <div>
              <p className="font-semibold">Yellow Card</p>
              <p className="text-xs text-muted-foreground">Stablecoin Provider</p>
            </div>
          </div>
          <StatusBadge status="success">Online</StatusBadge>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Current USDT Rate</p>
            <p className="font-medium">₦1,018.50</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current USDC Rate</p>
            <p className="font-medium">₦1,017.20</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Latency</p>
            <p className="font-medium">156ms</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="swaps" className="relative">
            Swaps
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning/20 text-xs text-warning">
              {swaps.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search operations..."
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="payout">Payout</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Operations Table */}
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Operation ID</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Rate</th>
                  <th>Yellow Card Ref</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stablecoinOps.map((op) => (
                  <tr
                    key={op.id}
                    className={cn(
                      "cursor-pointer",
                      op.status === "failed" && "bg-destructive/5"
                    )}
                    onClick={() => {
                      setSelectedOp(op);
                      setSheetOpen(true);
                    }}
                  >
                    <td className="font-medium">{op.id}</td>
                    <td>
                      <div>
                        <p className="font-medium">{op.user}</p>
                        <p className="text-xs text-muted-foreground">{op.userId}</p>
                      </div>
                    </td>
                    <td>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                          op.type === "transfer"
                            ? "bg-primary/10 text-primary"
                            : "bg-success/10 text-success"
                        )}
                      >
                        {op.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="font-medium">{op.amount}</td>
                    <td className="text-muted-foreground">{op.rate}</td>
                    <td className="font-mono text-sm text-muted-foreground">{op.yellowCardRef}</td>
                    <td>
                      <StatusBadge
                        status={
                          op.status === "completed"
                            ? "success"
                            : op.status === "processing"
                            ? "warning"
                            : "error"
                        }
                      >
                        {op.status}
                      </StatusBadge>
                    </td>
                    <td className="text-muted-foreground">{op.createdAt}</td>
                    <td className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {op.status === "failed" && (
                          <Button size="sm" variant="outline">
                            <RefreshCw className="mr-1 h-3 w-3" />
                            Retry
                          </Button>
                        )}
                        {op.status === "failed" && (
                          <Button size="sm" variant="ghost" className="text-warning">
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="swaps" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search swaps..."
                className="pl-9"
              />
            </div>
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Swaps Table */}
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Swap ID</th>
                  <th>User</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount In</th>
                  <th>Amount Out</th>
                  <th>Rate</th>
                  <th>Spread</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {swaps.map((swap) => (
                  <tr
                    key={swap.id}
                    className={cn(
                      "cursor-pointer",
                      swap.status === "failed" && "bg-destructive/5"
                    )}
                    onClick={() => {
                      setSelectedSwap(swap);
                      setSwapSheetOpen(true);
                    }}
                  >
                    <td className="font-medium">{swap.id}</td>
                    <td>
                      <div>
                        <p className="font-medium">{swap.user}</p>
                        <p className="text-xs text-muted-foreground">{swap.userId}</p>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted">
                        {swap.fromCurrency}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted">
                        {swap.toCurrency}
                      </span>
                    </td>
                    <td className="font-medium">{swap.amountIn}</td>
                    <td className="font-medium">{swap.amountOut}</td>
                    <td className="text-muted-foreground">{swap.rateUsed}</td>
                    <td className="text-success font-medium">{swap.spread}</td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                        swapStatusColors[swap.status as keyof typeof swapStatusColors]
                      )}>
                        {swap.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="text-muted-foreground">{swap.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Operation Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedOp && (
            <>
              <SheetHeader>
                <SheetTitle>Operation Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Operation Type */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
                    <span className="font-semibold text-warning">Y</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold capitalize">{selectedOp.type}</p>
                    <StatusBadge
                      status={
                        selectedOp.status === "completed"
                          ? "success"
                          : selectedOp.status === "processing"
                          ? "warning"
                          : "error"
                      }
                    >
                      {selectedOp.status}
                    </StatusBadge>
                  </div>
                </div>

                {/* Amount */}
                <div className="rounded-lg border border-border p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedOp.amount}</p>
                    <p className="text-sm text-muted-foreground">at {selectedOp.rate}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Operation Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Operation ID</p>
                      <p className="font-medium text-sm">{selectedOp.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Yellow Card Ref</p>
                      <p className="font-medium text-sm font-mono">{selectedOp.yellowCardRef}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User</p>
                      <p className="font-medium text-sm">{selectedOp.user}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="font-medium text-sm">{selectedOp.userId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created At</p>
                      <p className="font-medium text-sm">{selectedOp.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* Failure Reason */}
                {selectedOp.failureReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Failure Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedOp.failureReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {selectedOp.status === "failed" && (
                  <div className="flex gap-3">
                    <Button className="flex-1">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Operation
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Flag Anomaly
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Swap Detail Sheet */}
      <Sheet open={swapSheetOpen} onOpenChange={setSwapSheetOpen}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedSwap && (
            <>
              <SheetHeader>
                <SheetTitle>Swap Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Swap Header */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">SWAP</p>
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      swapStatusColors[selectedSwap.status as keyof typeof swapStatusColors]
                    )}>
                      {selectedSwap.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Swap Flow */}
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="text-xl font-bold">{selectedSwap.amountIn}</p>
                      <p className="text-sm text-muted-foreground">{selectedSwap.fromCurrency}</p>
                    </div>
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">To</p>
                      <p className="text-xl font-bold">{selectedSwap.amountOut}</p>
                      <p className="text-sm text-muted-foreground">{selectedSwap.toCurrency}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Swap Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Swap ID</p>
                      <p className="font-medium text-sm">{selectedSwap.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rate Used</p>
                      <p className="font-medium text-sm">{selectedSwap.rateUsed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Spread Earned</p>
                      <p className="font-medium text-sm text-success">{selectedSwap.spread}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User</p>
                      <p className="font-medium text-sm">{selectedSwap.user}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Debit Wallet</p>
                      <p className="font-medium text-sm font-mono">{selectedSwap.debitWallet}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Credit Wallet</p>
                      <p className="font-medium text-sm font-mono">{selectedSwap.creditWallet}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Timestamp</p>
                      <p className="font-medium text-sm">{selectedSwap.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Failure Reason */}
                {selectedSwap.failureReason && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Failure Reason</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedSwap.failureReason}
                    </p>
                  </div>
                )}

                {/* Audit Link */}
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">Audit Trail</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This swap is logged in the audit trail for compliance purposes.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                    View in Audit Trail →
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}