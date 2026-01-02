import { useState } from "react";
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Gift, Banknote, X } from "lucide-react";
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
    type: "buy",
    amount: "₦250,000",
    crypto: "245.50 USDT",
    rate: "₦1,018.33/USDT",
    status: "completed",
    provider: "Quidax",
    timestamp: "Dec 31, 2024 14:32:15",
    fee: "₦2,500",
    reference: "QDX-8847291",
  },
  {
    id: "TXN-20241231-002",
    user: "Amara Eze",
    userId: "USR-002",
    type: "sell",
    amount: "₦180,000",
    crypto: "175.00 USDT",
    rate: "₦1,028.57/USDT",
    status: "completed",
    provider: "YellowCard",
    timestamp: "Dec 31, 2024 13:45:22",
    fee: "₦1,800",
    reference: "YC-5523891",
  },
  {
    id: "TXN-20241231-003",
    user: "Ibrahim Musa",
    userId: "USR-003",
    type: "withdrawal",
    amount: "₦500,000",
    crypto: "",
    rate: "",
    status: "pending",
    provider: "Paystack",
    timestamp: "Dec 31, 2024 12:18:44",
    fee: "₦100",
    reference: "PS-7782134",
    bank: "Access Bank - 0012345678",
  },
  {
    id: "TXN-20241231-004",
    user: "Folake Adeyemi",
    userId: "USR-004",
    type: "gift_card",
    amount: "₦75,000",
    crypto: "$50 Amazon",
    rate: "₦1,500/$1",
    status: "completed",
    provider: "Internal",
    timestamp: "Dec 31, 2024 11:05:33",
    fee: "₦0",
    reference: "GC-9923456",
  },
  {
    id: "TXN-20241231-005",
    user: "Emeka Nwosu",
    userId: "USR-005",
    type: "buy",
    amount: "₦1,200,000",
    crypto: "1,180.00 USDT",
    rate: "₦1,016.95/USDT",
    status: "failed",
    provider: "Quidax",
    timestamp: "Dec 31, 2024 10:22:18",
    fee: "₦0",
    reference: "QDX-8847290",
    failureReason: "Insufficient liquidity at provider",
  },
  {
    id: "TXN-20241230-001",
    user: "Ngozi Obi",
    userId: "USR-006",
    type: "sell",
    amount: "₦320,000",
    crypto: "310.00 USDT",
    rate: "₦1,032.26/USDT",
    status: "completed",
    provider: "YellowCard",
    timestamp: "Dec 30, 2024 16:45:11",
    fee: "₦3,200",
    reference: "YC-5523880",
  },
];

const typeIcons = {
  buy: ArrowDownLeft,
  sell: ArrowUpRight,
  withdrawal: Banknote,
  gift_card: Gift,
};

const typeLabels = {
  buy: "Buy Crypto",
  sell: "Sell Crypto",
  withdrawal: "Withdrawal",
  gift_card: "Gift Card",
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
            View and manage all platform transactions
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
            <SelectItem value="buy">Buy Crypto</SelectItem>
            <SelectItem value="sell">Sell Crypto</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="gift_card">Gift Card</SelectItem>
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

      {/* Transactions Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>User</th>
              <th>Amount</th>
              <th>Rate</th>
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
                          tx.type === "buy" && "bg-primary/10 text-primary",
                          tx.type === "sell" && "bg-success/10 text-success",
                          tx.type === "withdrawal" && "bg-warning/10 text-warning",
                          tx.type === "gift_card" && "bg-purple-100 text-purple-600"
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
                    <div>
                      <p className="font-medium">{tx.amount}</p>
                      {tx.crypto && (
                        <p className="text-xs text-muted-foreground">{tx.crypto}</p>
                      )}
                    </div>
                  </td>
                  <td className="text-muted-foreground">{tx.rate || "—"}</td>
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
                      selectedTx.type === "buy" && "bg-primary/10 text-primary",
                      selectedTx.type === "sell" && "bg-success/10 text-success",
                      selectedTx.type === "withdrawal" && "bg-warning/10 text-warning",
                      selectedTx.type === "gift_card" && "bg-purple-100 text-purple-600"
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
                    <p className="text-2xl font-bold">{selectedTx.amount}</p>
                    {selectedTx.crypto && (
                      <p className="text-sm text-muted-foreground">{selectedTx.crypto}</p>
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
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="font-medium text-sm">{selectedTx.userId}</p>
                    </div>
                    {selectedTx.rate && (
                      <div>
                        <p className="text-xs text-muted-foreground">Rate</p>
                        <p className="font-medium text-sm">{selectedTx.rate}</p>
                      </div>
                    )}
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

                {/* Bank Info for Withdrawals */}
                {selectedTx.bank && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Bank Details
                    </h4>
                    <div className="rounded-lg border border-border p-4">
                      <p className="font-medium">{selectedTx.bank}</p>
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
