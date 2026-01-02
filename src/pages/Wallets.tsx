import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Lock, History, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const wallets = [
  {
    id: "WAL-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    currency: "NGN",
    availableBalance: "₦2,450,000.00",
    ledgerBalance: "₦2,500,000.00",
    status: "active",
    lastActivity: "2 hours ago",
  },
  {
    id: "WAL-002",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    currency: "USDT",
    availableBalance: "2,450.50 USDT",
    ledgerBalance: "2,450.50 USDT",
    status: "active",
    lastActivity: "2 hours ago",
  },
  {
    id: "WAL-003",
    user: "Amara Eze",
    userId: "USR-002",
    currency: "NGN",
    availableBalance: "₦890,000.00",
    ledgerBalance: "₦890,000.00",
    status: "active",
    lastActivity: "5 hours ago",
  },
  {
    id: "WAL-004",
    user: "Amara Eze",
    userId: "USR-002",
    currency: "USDC",
    availableBalance: "875.00 USDC",
    ledgerBalance: "875.00 USDC",
    status: "active",
    lastActivity: "5 hours ago",
  },
  {
    id: "WAL-005",
    user: "Ibrahim Musa",
    userId: "USR-003",
    currency: "NGN",
    availableBalance: "₦5,670,000.00",
    ledgerBalance: "₦5,670,000.00",
    status: "frozen",
    lastActivity: "3 days ago",
  },
  {
    id: "WAL-006",
    user: "Ibrahim Musa",
    userId: "USR-003",
    currency: "USDT",
    availableBalance: "5,500.00 USDT",
    ledgerBalance: "5,500.00 USDT",
    status: "frozen",
    lastActivity: "3 days ago",
  },
  {
    id: "WAL-007",
    user: "Folake Adeyemi",
    userId: "USR-004",
    currency: "NGN",
    availableBalance: "₦120,000.00",
    ledgerBalance: "₦120,000.00",
    status: "active",
    lastActivity: "1 day ago",
  },
  {
    id: "WAL-008",
    user: "Emeka Nwosu",
    userId: "USR-005",
    currency: "NGN",
    availableBalance: "₦15,890,000.00",
    ledgerBalance: "₦15,890,000.00",
    status: "active",
    lastActivity: "30 mins ago",
  },
  {
    id: "WAL-009",
    user: "Emeka Nwosu",
    userId: "USR-005",
    currency: "USDT",
    availableBalance: "15,600.00 USDT",
    ledgerBalance: "15,600.00 USDT",
    status: "active",
    lastActivity: "30 mins ago",
  },
];

const currencyColors = {
  NGN: "bg-success/10 text-success",
  USDT: "bg-primary/10 text-primary",
  USDC: "bg-blue-100 text-blue-700",
};

export default function Wallets() {
  const [selectedWallet, setSelectedWallet] = useState<typeof wallets[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adjustReason, setAdjustReason] = useState("");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Wallets & Balances</h1>
        <p className="page-description">
          Monitor and manage all user wallets (NGN, USDT, USDC)
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="metric-label">Total NGN Float</p>
          <p className="metric-value mt-1">₦847.5M</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total USDT Float</p>
          <p className="metric-value mt-1">524,875 USDT</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total USDC Float</p>
          <p className="metric-value mt-1">125,340 USDC</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Frozen Wallets</p>
          <p className="metric-value mt-1 text-destructive">47</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by wallet ID or user..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Currencies</SelectItem>
            <SelectItem value="ngn">NGN</SelectItem>
            <SelectItem value="usdt">USDT</SelectItem>
            <SelectItem value="usdc">USDC</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="frozen">Frozen</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Wallets Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Wallet ID</th>
              <th>User</th>
              <th>Currency</th>
              <th>Available Balance</th>
              <th>Ledger Balance</th>
              <th>Status</th>
              <th>Last Activity</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.id}>
                <td className="font-medium">{wallet.id}</td>
                <td>
                  <div>
                    <p className="font-medium">{wallet.user}</p>
                    <p className="text-xs text-muted-foreground">{wallet.userId}</p>
                  </div>
                </td>
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      currencyColors[wallet.currency as keyof typeof currencyColors]
                    )}
                  >
                    {wallet.currency}
                  </span>
                </td>
                <td className="font-medium">{wallet.availableBalance}</td>
                <td className="text-muted-foreground">{wallet.ledgerBalance}</td>
                <td>
                  <StatusBadge
                    status={wallet.status === "active" ? "success" : "error"}
                  >
                    {wallet.status}
                  </StatusBadge>
                </td>
                <td className="text-muted-foreground">{wallet.lastActivity}</td>
                <td className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedWallet(wallet);
                        setSheetOpen(true);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Ledger
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <History className="mr-2 h-4 w-4" />
                        Transaction History
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Adjust Balance
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Lock className="mr-2 h-4 w-4" />
                        {wallet.status === "frozen" ? "Unfreeze" : "Freeze"} Wallet
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Wallet Ledger Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[600px] overflow-y-auto">
          {selectedWallet && (
            <>
              <SheetHeader>
                <SheetTitle>Wallet Ledger - {selectedWallet.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Wallet Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground">Available Balance</p>
                    <p className="text-xl font-semibold">{selectedWallet.availableBalance}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs text-muted-foreground">Ledger Balance</p>
                    <p className="text-xl font-semibold">{selectedWallet.ledgerBalance}</p>
                  </div>
                </div>

                {/* Ledger Entries */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Recent Ledger Entries
                  </h4>
                  <div className="space-y-2">
                    {[
                      { type: "credit", amount: "+₦250,000", desc: "Inbound transfer", date: "Dec 31, 2024 14:32" },
                      { type: "debit", amount: "-₦50,000", desc: "Fee deduction", date: "Dec 31, 2024 14:32" },
                      { type: "debit", amount: "-₦180,000", desc: "Outbound payout", date: "Dec 31, 2024 13:45" },
                      { type: "credit", amount: "+₦500,000", desc: "Inbound transfer", date: "Dec 31, 2024 12:18" },
                    ].map((entry, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{entry.desc}</p>
                          <p className="text-xs text-muted-foreground">{entry.date}</p>
                        </div>
                        <p className={cn(
                          "font-semibold",
                          entry.type === "credit" ? "text-success" : "text-destructive"
                        )}>
                          {entry.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual Adjustment */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Manual Balance Adjustment
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Adjustment Type</Label>
                        <Select defaultValue="credit">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit">Credit (+)</SelectItem>
                            <SelectItem value="debit">Debit (-)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason (Required)</Label>
                      <Textarea
                        placeholder="Provide a reason for this adjustment..."
                        value={adjustReason}
                        onChange={(e) => setAdjustReason(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        This will be logged to the Audit Trail
                      </p>
                    </div>
                    <Button disabled={!adjustReason}>Apply Adjustment</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
