import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Lock, History, Edit, AlertTriangle } from "lucide-react";
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
  { id: "WAL-001", user: "Chinedu Okonkwo", userId: "USR-001", coin: "USDT", availableBalance: "2,450.50 USDT", ledgerBalance: "2,450.50 USDT", usdtEquiv: "2,450.50 USDT", status: "active", lastActivity: "2 hours ago" },
  { id: "WAL-002", user: "Chinedu Okonkwo", userId: "USR-001", coin: "SOL", availableBalance: "12.45 SOL", ledgerBalance: "12.45 SOL", usdtEquiv: "1,818.00 USDT", status: "active", lastActivity: "2 hours ago" },
  { id: "WAL-003", user: "Amara Eze", userId: "USR-002", coin: "USDC", availableBalance: "875.00 USDC", ledgerBalance: "875.00 USDC", usdtEquiv: "874.13 USDT", status: "active", lastActivity: "5 hours ago" },
  { id: "WAL-004", user: "Amara Eze", userId: "USR-002", coin: "ETH", availableBalance: "0.85 ETH", ledgerBalance: "0.85 ETH", usdtEquiv: "2,956.30 USDT", status: "active", lastActivity: "5 hours ago" },
  { id: "WAL-005", user: "Ibrahim Musa", userId: "USR-003", coin: "USDT", availableBalance: "5,500.00 USDT", ledgerBalance: "5,500.00 USDT", usdtEquiv: "5,500.00 USDT", status: "frozen", lastActivity: "3 days ago" },
  { id: "WAL-006", user: "Ibrahim Musa", userId: "USR-003", coin: "ADA", availableBalance: "8,400.00 ADA", ledgerBalance: "8,400.00 ADA", usdtEquiv: "5,068.30 USDT", status: "frozen", lastActivity: "3 days ago" },
  { id: "WAL-007", user: "Folake Adeyemi", userId: "USR-004", coin: "USDT", availableBalance: "117.80 USDT", ledgerBalance: "117.80 USDT", usdtEquiv: "117.80 USDT", status: "active", lastActivity: "1 day ago" },
  { id: "WAL-008", user: "Emeka Nwosu", userId: "USR-005", coin: "USDT", availableBalance: "15,600.00 USDT", ledgerBalance: "15,600.00 USDT", usdtEquiv: "15,600.00 USDT", status: "active", lastActivity: "30 mins ago" },
  { id: "WAL-009", user: "Emeka Nwosu", userId: "USR-005", coin: "SOL", availableBalance: "85.00 SOL", ledgerBalance: "85.00 SOL", usdtEquiv: "12,409.00 USDT", status: "active", lastActivity: "30 mins ago" },
];

const coinColors: Record<string, string> = {
  USDT: "bg-primary/10 text-primary",
  USDC: "bg-warning/10 text-warning",
  SOL: "bg-success/10 text-success",
  ETH: "bg-primary/10 text-primary",
  ADA: "bg-warning/10 text-warning",
  BTC: "bg-warning/10 text-warning",
};

export default function Wallets() {
  const [selectedWallet, setSelectedWallet] = useState<typeof wallets[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adjustReason, setAdjustReason] = useState("");

  const totalUsdtEquiv = "46,793.03 USDT";
  const frozenCount = wallets.filter(w => w.status === "frozen").length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Wallets & Ledger</h1>
        <p className="page-description">
          Monitor and manage all user wallets — multi-coin. All totals shown in USDT equivalent.
        </p>
      </div>

      {/* Stats — USDT equiv as primary */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card border-primary/30">
          <p className="metric-label">Total Custody Value</p>
          <p className="metric-value mt-1 text-primary">{totalUsdtEquiv}</p>
          <p className="text-xs text-muted-foreground mt-1">USDT equivalent (all wallets)</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">USDT Float</p>
          <p className="metric-value mt-1">23,668.30 USDT</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Other Coins Float</p>
          <p className="metric-value mt-1">23,124.73 USDT</p>
          <p className="text-xs text-muted-foreground mt-1">SOL, ETH, ADA, USDC equiv</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Frozen Wallets</p>
          <p className="metric-value mt-1 text-destructive">{frozenCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search by wallet ID or user..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Coin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Coins</SelectItem>
            <SelectItem value="usdt">USDT</SelectItem>
            <SelectItem value="usdc">USDC</SelectItem>
            <SelectItem value="sol">SOL</SelectItem>
            <SelectItem value="eth">ETH</SelectItem>
            <SelectItem value="ada">ADA</SelectItem>
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
              <th>Coin</th>
              <th>Balance (USDT Equiv)</th>
              <th>Native Balance</th>
              <th>Status</th>
              <th>Last Activity</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.id}>
                <td className="font-medium font-mono text-sm">{wallet.id}</td>
                <td>
                  <div>
                    <p className="font-medium">{wallet.user}</p>
                    <p className="text-xs text-muted-foreground">{wallet.userId}</p>
                  </div>
                </td>
                <td>
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", coinColors[wallet.coin] || "bg-muted text-muted-foreground")}>
                    {wallet.coin}
                  </span>
                </td>
                <td className="font-semibold text-success">{wallet.usdtEquiv}</td>
                <td className="text-muted-foreground">{wallet.availableBalance}</td>
                <td>
                  <StatusBadge status={wallet.status === "active" ? "success" : "error"}>
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
                      <DropdownMenuItem onClick={() => { setSelectedWallet(wallet); setSheetOpen(true); }}>
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
        <SheetContent className="w-[620px] overflow-y-auto">
          {selectedWallet && (
            <>
              <SheetHeader>
                <SheetTitle>Wallet Ledger — {selectedWallet.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Balances */}
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Balance (USDT Equivalent) — Primary</p>
                  <p className="text-3xl font-bold text-success">{selectedWallet.usdtEquiv}</p>
                </div>
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

                {/* Activity Summary */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Activity Summary (USDT equiv)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                      <p className="text-xs text-muted-foreground">Total Deposited</p>
                      <p className="text-lg font-semibold text-primary">2,450.00 USDT</p>
                    </div>
                    <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
                      <p className="text-xs text-muted-foreground">Total Withdrawn</p>
                      <p className="text-lg font-semibold text-destructive">1,250.00 USDT</p>
                    </div>
                    <div className="rounded-lg bg-success/5 border border-success/20 p-3">
                      <p className="text-xs text-muted-foreground">Total Swapped In</p>
                      <p className="text-lg font-semibold text-success">320.00 USDT</p>
                    </div>
                    <div className="rounded-lg bg-warning/5 border border-warning/20 p-3">
                      <p className="text-xs text-muted-foreground">Total Swapped Out</p>
                      <p className="text-lg font-semibold text-warning">180.00 USDT</p>
                    </div>
                  </div>
                </div>

                {/* Ledger Entries */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recent Ledger Entries</h4>
                  <div className="content-card overflow-hidden">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Entity Type</th>
                          <th>Entity ID</th>
                          <th>Amount</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { type: "credit", entityType: "Deposit", entityId: "DEP-001", amount: "+240.50 USDT", date: "Dec 31, 14:32" },
                          { type: "debit", entityType: "Withdrawal", entityId: "WDR-001", amount: "-250.00 USDT", date: "Dec 31, 14:30" },
                          { type: "debit", entityType: "Swap", entityId: "SWP-002", amount: "-500 USDT", date: "Dec 31, 13:15" },
                          { type: "credit", entityType: "Deposit", entityId: "DEP-005", amount: "+305.00 USDT", date: "Dec 30, 16:45" },
                        ].map((entry, i) => (
                          <tr key={i}>
                            <td>
                              <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", entry.type === "credit" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                                {entry.type}
                              </span>
                            </td>
                            <td className="text-muted-foreground">{entry.entityType}</td>
                            <td className="font-mono text-sm text-primary">{entry.entityId}</td>
                            <td className={cn("font-semibold", entry.type === "credit" ? "text-success" : "text-destructive")}>
                              {entry.amount}
                            </td>
                            <td className="text-muted-foreground">{entry.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Manual Adjustment */}
                <div className="space-y-4 border-t border-border pt-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Manual Balance Adjustment
                    </h4>
                  </div>
                  <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                    <p className="text-xs text-warning font-medium">⚠ This action will be logged to the Audit Trail and is irreversible without a counter-adjustment.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Adjustment Type</Label>
                      <Select defaultValue="credit">
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <p className="text-xs text-muted-foreground">This will be permanently logged to the Audit Trail</p>
                  </div>
                  <Button disabled={!adjustReason}>Apply Adjustment</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
