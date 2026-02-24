import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, UserX, Flag, Ban, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const users = [
  {
    id: "USR-001",
    name: "Chinedu Okonkwo",
    phone: "+234 803 456 7890",
    email: "chinedu@email.com",
    kyc: "verified",
    wallet: "active",
    riskLevel: "low",
    balanceUsdtEquiv: "2,450.50 USDT",
    tokenBalances: [
      { coin: "USDT", balance: "1,200.00", icon: "💵" },
      { coin: "SOL", balance: "12.45", icon: "◎" },
      { coin: "ETH", balance: "0.85", icon: "⟠" },
      { coin: "ADA", balance: "3,200.00", icon: "₳" },
    ],
    created: "Dec 15, 2024",
    withdrawalsEnabled: true,
    adminNotes: "",
    tier: "Verified",
    bvn: "22345678901",
    nin: "12345678901",
    idType: "National ID",
    verifyMeScore: 99,
  },
  {
    id: "USR-002",
    name: "Amara Eze",
    phone: "+234 805 678 9012",
    email: "amara.eze@email.com",
    kyc: "pending",
    wallet: "active",
    riskLevel: "low",
    balanceUsdtEquiv: "875.00 USDT",
    tokenBalances: [
      { coin: "USDT", balance: "500.00", icon: "💵" },
      { coin: "SOL", balance: "3.20", icon: "◎" },
      { coin: "USDC", balance: "125.00", icon: "🔵" },
    ],
    created: "Dec 18, 2024",
    withdrawalsEnabled: true,
    adminNotes: "",
    tier: "Standard",
    bvn: "22345678902",
    nin: "12345678902",
    idType: "Voter's Card",
    verifyMeScore: null,
  },
  {
    id: "USR-003",
    name: "Ibrahim Musa",
    phone: "+234 807 890 1234",
    email: "ibrahim.m@email.com",
    kyc: "verified",
    wallet: "frozen",
    riskLevel: "high",
    balanceUsdtEquiv: "11,068.00 USDT",
    tokenBalances: [
      { coin: "USDT", balance: "5,500.00", icon: "💵" },
      { coin: "ETH", balance: "2.10", icon: "⟠" },
      { coin: "BTC", balance: "0.045", icon: "₿" },
      { coin: "SOL", balance: "28.50", icon: "◎" },
      { coin: "ADA", balance: "8,400.00", icon: "₳" },
      { coin: "DOT", balance: "120.00", icon: "●" },
    ],
    created: "Nov 22, 2024",
    withdrawalsEnabled: false,
    adminNotes: "Account frozen due to suspicious activity patterns. Under investigation.",
    tier: "High Value",
    bvn: "22345678903",
    nin: "12345678903",
    idType: "Driver's License",
    verifyMeScore: 42,
  },
  {
    id: "USR-004",
    name: "Folake Adeyemi",
    phone: "+234 809 012 3456",
    email: "folake.a@email.com",
    kyc: "failed",
    wallet: "active",
    riskLevel: "medium",
    balanceUsdtEquiv: "117.80 USDT",
    tokenBalances: [
      { coin: "USDT", balance: "117.80", icon: "💵" },
    ],
    created: "Dec 20, 2024",
    withdrawalsEnabled: true,
    adminNotes: "",
    tier: "Standard",
    bvn: "22345678904",
    nin: null,
    idType: "National ID",
    verifyMeScore: 0,
  },
  {
    id: "USR-005",
    name: "Emeka Nwosu",
    phone: "+234 801 234 5678",
    email: "emeka.n@email.com",
    kyc: "verified",
    wallet: "active",
    riskLevel: "low",
    balanceUsdtEquiv: "31,210.00 USDT",
    tokenBalances: [
      { coin: "USDT", balance: "15,600.00", icon: "💵" },
      { coin: "SOL", balance: "85.00", icon: "◎" },
      { coin: "ETH", balance: "3.20", icon: "⟠" },
      { coin: "BTC", balance: "0.12", icon: "₿" },
      { coin: "MATIC", balance: "4,500.00", icon: "⬡" },
    ],
    created: "Oct 05, 2024",
    withdrawalsEnabled: true,
    adminNotes: "",
    tier: "High Value",
    bvn: "22345678905",
    nin: "12345678905",
    idType: "International Passport",
    verifyMeScore: 99,
  },
  {
    id: "USR-006",
    name: "Ngozi Obi",
    phone: "+234 802 345 6789",
    email: "ngozi.obi@email.com",
    kyc: "verified",
    wallet: "active",
    riskLevel: "medium",
    balanceUsdtEquiv: "4,018.45 USDT",
    tokenBalances: [
      { coin: "USDC", balance: "875.00", icon: "🔵" },
      { coin: "SOL", balance: "22.30", icon: "◎" },
      { coin: "ADA", balance: "5,100.00", icon: "₳" },
    ],
    created: "Dec 01, 2024",
    withdrawalsEnabled: true,
    adminNotes: "High volume user — monitor transactions",
    tier: "Verified",
    bvn: "22345678906",
    nin: "12345678906",
    idType: "National ID",
    verifyMeScore: 94,
  },
];

const riskLevelColors = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const PAGE_SIZE_OPTIONS = [25, 50, 100];

export default function Users() {
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleViewUser = (user: typeof users[0]) => {
    setSelectedUser(user);
    setAdminNotes(user.adminNotes);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-description">
          Manage platform users, KYC status, risk levels, and wallet access
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search by name, phone, user ID..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="KYC Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Wallet Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wallets</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="frozen">Frozen</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>KYC Status</th>
              <th>Risk Level</th>
              <th>Wallet</th>
              <th>Withdrawals</th>
              <th>USDT Equiv Balance</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="cursor-pointer" onClick={() => handleViewUser(user)}>
                <td>
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.id}</p>
                  </div>
                </td>
                <td className="text-muted-foreground">{user.phone}</td>
                <td>
                  <StatusBadge
                    status={user.kyc === "verified" ? "success" : user.kyc === "pending" ? "warning" : "error"}
                  >
                    {user.kyc}
                  </StatusBadge>
                </td>
                <td>
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize", riskLevelColors[user.riskLevel as keyof typeof riskLevelColors])}>
                    {user.riskLevel}
                  </span>
                </td>
                <td>
                  <StatusBadge status={user.wallet === "active" ? "success" : "error"}>
                    {user.wallet}
                  </StatusBadge>
                </td>
                <td>
                  <StatusBadge status={user.withdrawalsEnabled ? "success" : "error"}>
                    {user.withdrawalsEnabled ? "Enabled" : "Disabled"}
                  </StatusBadge>
                </td>
                <td className="font-semibold text-success">{user.balanceUsdtEquiv}</td>
                <td className="text-muted-foreground">{user.created}</td>
                <td className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewUser(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserX className="mr-2 h-4 w-4" />
                        {user.wallet === "frozen" ? "Unfreeze" : "Freeze"} Wallets
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ban className="mr-2 h-4 w-4" />
                        {user.withdrawalsEnabled ? "Disable" : "Enable"} Withdrawals
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Flag className="mr-2 h-4 w-4" />
                        Flag User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * pageSize + 1, users.length)}–{Math.min(currentPage * pageSize, users.length)} of {users.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={currentPage === p ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(p)}
              className="w-8 px-0"
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[560px] overflow-y-auto">
          {selectedUser && (
            <>
              <SheetHeader>
                <SheetTitle>User Details — {selectedUser.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {selectedUser.riskLevel === "high" && (
                  <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <p className="text-sm font-medium text-destructive">High Risk User</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Flagged for elevated risk monitoring
                    </p>
                  </div>
                )}

                <Tabs defaultValue="profile" className="space-y-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                    <TabsTrigger value="kyc" className="flex-1">KYC</TabsTrigger>
                    <TabsTrigger value="wallets" className="flex-1">Wallets</TabsTrigger>
                    <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                    <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
                  </TabsList>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-xs text-muted-foreground">Full Name</p><p className="font-medium">{selectedUser.name}</p></div>
                      <div><p className="text-xs text-muted-foreground">User ID</p><p className="font-medium font-mono text-sm">{selectedUser.id}</p></div>
                      <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{selectedUser.phone}</p></div>
                      <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{selectedUser.email}</p></div>
                      <div><p className="text-xs text-muted-foreground">Joined</p><p className="font-medium">{selectedUser.created}</p></div>
                      <div><p className="text-xs text-muted-foreground">Tier</p><p className="font-medium">{selectedUser.tier}</p></div>
                      <div>
                        <p className="text-xs text-muted-foreground">Risk Level</p>
                        <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize mt-1", riskLevelColors[selectedUser.riskLevel as keyof typeof riskLevelColors])}>
                          {selectedUser.riskLevel}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">KYC Status</p>
                        <div className="mt-1">
                          <StatusBadge status={selectedUser.kyc === "verified" ? "success" : selectedUser.kyc === "pending" ? "warning" : "error"}>
                            {selectedUser.kyc}
                          </StatusBadge>
                        </div>
                      </div>
                    </div>

                    {/* Admin Controls */}
                    <div className="border-t border-border pt-4 space-y-4">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Admin Controls</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Withdrawals Enabled</Label>
                          <p className="text-xs text-muted-foreground">Allow user to make withdrawals</p>
                        </div>
                        <Switch checked={selectedUser.withdrawalsEnabled} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Risk Level</Label>
                          <p className="text-xs text-muted-foreground">Set risk classification</p>
                        </div>
                        <Select defaultValue={selectedUser.riskLevel}>
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <UserX className="mr-2 h-4 w-4" />
                        {selectedUser.wallet === "frozen" ? "Unfreeze" : "Freeze"} Wallets
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Force Re-KYC
                      </Button>
                      <Button variant="destructive">
                        <Flag className="mr-2 h-4 w-4" />
                        Flag
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">All actions logged to Audit Trail</p>
                  </TabsContent>

                  {/* KYC Tab */}
                  <TabsContent value="kyc" className="space-y-4">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">KYC Information (Read-only)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-xs text-muted-foreground">BVN</p><p className="font-mono font-medium">{selectedUser.bvn}</p></div>
                      <div><p className="text-xs text-muted-foreground">NIN</p><p className="font-mono font-medium">{selectedUser.nin ?? "Not provided"}</p></div>
                      <div><p className="text-xs text-muted-foreground">ID Type</p><p className="font-medium">{selectedUser.idType}</p></div>
                      <div>
                        <p className="text-xs text-muted-foreground">VerifyMe Score</p>
                        {selectedUser.verifyMeScore !== null ? (
                          <p className={cn("font-bold text-lg", selectedUser.verifyMeScore >= 80 ? "text-success" : selectedUser.verifyMeScore >= 50 ? "text-warning" : "text-destructive")}>
                            {selectedUser.verifyMeScore}%
                          </p>
                        ) : <p className="text-muted-foreground">Awaiting</p>}
                      </div>
                    </div>
                    <div className={cn("rounded-lg border p-4", selectedUser.kyc === "verified" ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5")}>
                      <p className="text-sm font-medium">KYC Status: {selectedUser.kyc.toUpperCase()}</p>
                    </div>
                  </TabsContent>

                  {/* Wallets Tab */}
                  <TabsContent value="wallets" className="space-y-4">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Wallet Balances</p>
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <p className="text-xs text-muted-foreground">Total Balance (USDT Equivalent)</p>
                      <p className="text-2xl font-bold text-success">{selectedUser.balanceUsdtEquiv}</p>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mt-2">Token Balances</p>
                    <div className="space-y-2">
                      {selectedUser.tokenBalances.map((token) => (
                        <div key={token.coin} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{token.icon}</span>
                            <span className="font-medium text-sm">{token.coin}</span>
                          </div>
                          <span className="font-semibold text-sm">{token.balance}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="space-y-4">
                    <Tabs defaultValue="deposits">
                      <TabsList className="w-full">
                        <TabsTrigger value="deposits" className="flex-1">Deposits</TabsTrigger>
                        <TabsTrigger value="withdrawals" className="flex-1">Withdrawals</TabsTrigger>
                        <TabsTrigger value="swaps" className="flex-1">Swaps</TabsTrigger>
                      </TabsList>
                      <TabsContent value="deposits">
                        <p className="text-sm text-muted-foreground py-8 text-center">Recent deposit history for this user</p>
                      </TabsContent>
                      <TabsContent value="withdrawals">
                        <p className="text-sm text-muted-foreground py-8 text-center">Recent withdrawal history for this user</p>
                      </TabsContent>
                      <TabsContent value="swaps" className="space-y-2 pt-2">
                        {[
                          { id: "SWP-041", from: "USDT", to: "SOL", amountIn: "500.00", amountOut: "3.42", status: "Completed", date: "Jan 12, 2025" },
                          { id: "SWP-039", from: "SOL", to: "ETH", amountIn: "5.00", amountOut: "0.48", status: "Completed", date: "Jan 10, 2025" },
                          { id: "SWP-035", from: "USDT", to: "ADA", amountIn: "200.00", amountOut: "580.00", status: "Completed", date: "Jan 8, 2025" },
                          { id: "SWP-028", from: "ETH", to: "USDC", amountIn: "0.30", amountOut: "720.50", status: "Failed", date: "Jan 5, 2025" },
                        ].map((swap) => (
                          <div key={swap.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs text-muted-foreground">{swap.id}</span>
                              <span className="text-sm font-medium">{swap.from} → {swap.to}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-muted-foreground">{swap.amountIn} {swap.from} → {swap.amountOut} {swap.to}</span>
                              <StatusBadge status={swap.status === "Completed" ? "success" : "error"}>{swap.status}</StatusBadge>
                              <span className="text-xs text-muted-foreground">{swap.date}</span>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  {/* Notes Tab */}
                  <TabsContent value="notes" className="space-y-4">
                    {selectedUser.adminNotes && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-xs text-muted-foreground mb-1">Previous note</p>
                        <p className="text-sm">{selectedUser.adminNotes}</p>
                      </div>
                    )}
                    <Textarea
                      placeholder="Add admin note about this user..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                    />
                    <Button variant="outline" size="sm">Save Note</Button>
                    <p className="text-xs text-muted-foreground">Notes are logged to Audit Trail</p>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
