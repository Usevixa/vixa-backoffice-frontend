import { useState } from "react";
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
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

const transactions = [
  {
    id: "TXN-20241231-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    country: "NG",
    type: "deposit",
    amountUsdt: "245.50 USDT",
    fiatEquiv: "(~ ₦249,890)",
    status: "completed",
    provider: "Yellow Card",
    timestamp: "Dec 31, 2024 14:32:15",
    fee: "6.14 USDT",
    reference: "YC-8847291",
  },
  {
    id: "TXN-20241231-002",
    user: "Amara Eze",
    userId: "USR-002",
    country: "KE",
    type: "withdrawal",
    amountUsdt: "175.00 USDT",
    fiatEquiv: "(~ KES 24,150)",
    status: "completed",
    provider: "Yellow Card",
    timestamp: "Dec 31, 2024 13:45:22",
    fee: "3.50 USDT",
    reference: "YC-5523891",
  },
  {
    id: "TXN-20241231-003",
    user: "Ibrahim Musa",
    userId: "USR-003",
    country: "GH",
    type: "withdrawal",
    amountUsdt: "490.00 USDT",
    fiatEquiv: "(~ GHS 7,742)",
    status: "pending",
    provider: "OpenXSwitch",
    timestamp: "Dec 31, 2024 12:18:44",
    fee: "9.80 USDT",
    reference: "OXS-7782134",
  },
  {
    id: "TXN-20241231-004",
    user: "Folake Adeyemi",
    userId: "USR-004",
    country: "ZA",
    type: "swap",
    amountUsdt: "500.00 USDT",
    fiatEquiv: "",
    status: "completed",
    provider: "OpenXSwitch",
    timestamp: "Dec 31, 2024 11:05:33",
    fee: "1.50 USDT",
    reference: "OXS-9923456",
  },
  {
    id: "TXN-20241231-005",
    user: "Emeka Nwosu",
    userId: "USR-005",
    country: "NG",
    type: "deposit",
    amountUsdt: "1,180.00 USDT",
    fiatEquiv: "(~ ₦1,201,260)",
    status: "failed",
    provider: "Yellow Card",
    timestamp: "Dec 31, 2024 10:22:18",
    fee: "0 USDT",
    reference: "YC-8847290",
    failureReason: "Insufficient liquidity at provider",
  },
  {
    id: "TXN-20241230-001",
    user: "Ngozi Obi",
    userId: "USR-006",
    country: "KE",
    type: "withdrawal",
    amountUsdt: "310.00 USDT",
    fiatEquiv: "(~ KES 42,780)",
    status: "completed",
    provider: "Yellow Card",
    timestamp: "Dec 30, 2024 16:45:11",
    fee: "6.20 USDT",
    reference: "YC-5523880",
  },
];

const typeIcons = {
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  swap: RefreshCw,
};

const typeLabels = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  swap: "Swap",
};

export default function Transactions() {
  const [selectedTx, setSelectedTx] = useState<typeof transactions[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewTransaction = (tx: typeof transactions[0]) => {
    setSelectedTx(tx);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Transactions</h1>
          <p className="page-description">
            View and manage all platform transactions — amounts in USDT
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

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
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="swap">Swap</SelectItem>
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
        <Input type="date" className="w-40" />
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Transactions Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>User</th>
              <th>Country</th>
              <th>Amount (USDT)</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const Icon = typeIcons[tx.type as keyof typeof typeIcons];
              return (
                <tr
                  key={tx.id}
                  className="cursor-pointer"
                  onClick={() => handleViewTransaction(tx)}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          tx.type === "deposit" && "bg-success/10 text-success",
                          tx.type === "withdrawal" && "bg-primary/10 text-primary",
                          tx.type === "swap" && "bg-warning/10 text-warning"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {typeLabels[tx.type as keyof typeof typeLabels]}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.id}</p>
                      </div>
                    </div>
                  </td>
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
                      {tx.fiatEquiv && (
                        <p className="text-xs text-muted-foreground">{tx.fiatEquiv}</p>
                      )}
                    </div>
                  </td>
                  <td className="text-muted-foreground">{tx.fee}</td>
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
                  <td className="text-muted-foreground">{tx.timestamp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedTx && (
            <>
              <SheetHeader className="flex flex-row items-center justify-between">
                <SheetTitle>Transaction Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Transaction Type */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      selectedTx.type === "deposit" && "bg-success/10 text-success",
                      selectedTx.type === "withdrawal" && "bg-primary/10 text-primary",
                      selectedTx.type === "swap" && "bg-warning/10 text-warning"
                    )}
                  >
                    {(() => {
                      const Icon = typeIcons[selectedTx.type as keyof typeof typeIcons];
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      {typeLabels[selectedTx.type as keyof typeof typeLabels]}
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

                {/* Details Grid */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Transaction Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Transaction ID</p>
                      <p className="font-medium text-sm">{selectedTx.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reference</p>
                      <p className="font-medium text-sm">{selectedTx.reference}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User</p>
                      <p className="font-medium text-sm">{selectedTx.user}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Country</p>
                      <p className="font-medium text-sm">{selectedTx.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fee</p>
                      <p className="font-medium text-sm">{selectedTx.fee}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Provider</p>
                      <p className="font-medium text-sm">{selectedTx.provider}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Timestamp</p>
                      <p className="font-medium text-sm">{selectedTx.timestamp}</p>
                    </div>
                  </div>
                </div>

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
                  <Button className="w-full">Retry Transaction</Button>
                )}
                {selectedTx.status === "pending" && (
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      Mark as Resolved
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Escalate
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
