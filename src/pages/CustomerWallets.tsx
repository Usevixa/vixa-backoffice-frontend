import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Lock, StickyNote, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const subWallets = [
  { id: "SUB-00142", user: "Chinedu Okonkwo", userId: "USR-001", phone: "+234 803 456 7890", balanceUsdt: "2,450.50 USDT", breakdown: { usdt: "2,450.50 USDT", usdc: "0 USDC", ngn: "₦0" }, status: "active", lastActivity: "2 hours ago" },
  { id: "SUB-00089", user: "Amara Eze", userId: "USR-002", phone: "+234 805 678 9012", balanceUsdt: "874.13 USDT", breakdown: { usdt: "0 USDT", usdc: "875.00 USDC", ngn: "₦0" }, status: "active", lastActivity: "5 hours ago" },
  { id: "SUB-00213", user: "Ibrahim Musa", userId: "USR-003", phone: "+234 807 890 1234", balanceUsdt: "11,068.00 USDT", breakdown: { usdt: "5,500.00 USDT", usdc: "0 USDC", ngn: "₦5,670,000" }, status: "frozen", lastActivity: "3 days ago" },
  { id: "SUB-00301", user: "Emeka Nwosu", userId: "USR-005", phone: "+234 801 234 5678", balanceUsdt: "31,210.00 USDT", breakdown: { usdt: "15,600.00 USDT", usdc: "0 USDC", ngn: "₦15,890,000" }, status: "active", lastActivity: "30 mins ago" },
  { id: "SUB-00078", user: "Ngozi Obi", userId: "USR-006", phone: "+234 802 345 6789", balanceUsdt: "4,018.45 USDT", breakdown: { usdt: "0 USDT", usdc: "875.00 USDC", ngn: "₦3,200,000" }, status: "active", lastActivity: "1 hour ago" },
  { id: "SUB-00418", user: "Folake Adeyemi", userId: "USR-004", phone: "+234 809 012 3456", balanceUsdt: "117.80 USDT", breakdown: { usdt: "0 USDT", usdc: "0 USDC", ngn: "₦120,000" }, status: "active", lastActivity: "1 day ago" },
];

const ledgerEntries = [
  { type: "credit", entity: "Receive", entityId: "RCV-001", amount: "+240.50 USDT", date: "Dec 31, 14:32" },
  { type: "debit", entity: "Send", entityId: "SND-001", amount: "-250.00 USDT", date: "Dec 31, 14:30" },
  { type: "debit", entity: "Swap", entityId: "OXS-SWP-002", amount: "-500 USDT", date: "Dec 31, 13:15" },
  { type: "credit", entity: "Receive", entityId: "RCV-005", amount: "+305.00 USDT", date: "Dec 30, 16:45" },
];

const PAGE_SIZE_OPTIONS = [25, 50, 100];

export default function CustomerWallets() {
  const [selectedWallet, setSelectedWallet] = useState<typeof subWallets[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.max(1, Math.ceil(subWallets.length / pageSize));
  const paginatedWallets = subWallets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalCustody = "49,738.88 USDT";
  const frozenCount = subWallets.filter(w => w.status === "frozen").length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Customer Wallets (Sub-wallets)</h1>
        <p className="page-description">
          OpenXSwitch customer sub-wallets — individual custody accounts per user
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card border-primary/30">
          <p className="metric-label">Total Sub-wallet Value</p>
          <p className="metric-value mt-1 text-primary">{totalCustody}</p>
          <p className="text-xs text-muted-foreground mt-1">USDT equivalent</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total Sub-wallets</p>
          <p className="metric-value mt-1">{subWallets.length.toLocaleString()}</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Frozen</p>
          <p className="metric-value mt-1 text-destructive">{frozenCount}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Active</p>
          <p className="metric-value mt-1 text-success">{subWallets.length - frozenCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search sub-wallet ID, user, phone..." className="pl-9" />
        </div>
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
        <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
      </div>

      {/* Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sub-wallet ID</th>
              <th>User</th>
              <th>Balance (USDT Equiv)</th>
              <th>Native Breakdown</th>
              <th>Status</th>
              <th>Last Activity</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedWallets.map((wallet) => (
              <tr
                key={wallet.id}
                className="cursor-pointer"
                onClick={() => { setSelectedWallet(wallet); setSheetOpen(true); }}
              >
                <td className="font-mono text-sm font-medium text-primary">{wallet.id}</td>
                <td>
                  <div>
                    <p className="font-medium">{wallet.user}</p>
                    <p className="text-xs text-muted-foreground">{wallet.phone}</p>
                  </div>
                </td>
                <td className="font-semibold text-success">{wallet.balanceUsdt}</td>
                <td>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {wallet.breakdown.usdt !== "0 USDT" && <div>{wallet.breakdown.usdt}</div>}
                    {wallet.breakdown.usdc !== "0 USDC" && <div>{wallet.breakdown.usdc}</div>}
                    {wallet.breakdown.ngn !== "₦0" && <div>{wallet.breakdown.ngn}</div>}
                  </div>
                </td>
                <td>
                  <StatusBadge status={wallet.status === "active" ? "success" : "error"}>
                    {wallet.status}
                  </StatusBadge>
                </td>
                <td className="text-muted-foreground">{wallet.lastActivity}</td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedWallet(wallet); setSheetOpen(true); }}>
                        <Eye className="mr-2 h-4 w-4" /> View Wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Lock className="mr-2 h-4 w-4" />
                        {wallet.status === "frozen" ? "Unfreeze" : "Freeze"} Wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <StickyNote className="mr-2 h-4 w-4" /> Add Note
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
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * pageSize + 1, subWallets.length)}–{Math.min(currentPage * pageSize, subWallets.length)} of {subWallets.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button key={p} variant={currentPage === p ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(p)} className="w-8 px-0">
              {p}
            </Button>
          ))}
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sub-wallet Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[580px] overflow-y-auto">
          {selectedWallet && (
            <>
              <SheetHeader>
                <SheetTitle>Sub-wallet — {selectedWallet.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Balance */}
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Total Balance (USDT Equivalent)</p>
                  <p className="text-3xl font-bold text-success">{selectedWallet.balanceUsdt}</p>
                </div>

                {/* Native Breakdown */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border p-3 text-center">
                    <p className="text-xs text-muted-foreground">USDT</p>
                    <p className="font-semibold text-sm mt-1">{selectedWallet.breakdown.usdt}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3 text-center">
                    <p className="text-xs text-muted-foreground">USDC</p>
                    <p className="font-semibold text-sm mt-1">{selectedWallet.breakdown.usdc}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3 text-center">
                    <p className="text-xs text-muted-foreground">NGN</p>
                    <p className="font-semibold text-sm mt-1">{selectedWallet.breakdown.ngn}</p>
                  </div>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">User</p><p className="font-medium">{selectedWallet.user}</p></div>
                  <div><p className="text-xs text-muted-foreground">User ID</p><p className="font-mono text-sm">{selectedWallet.userId}</p></div>
                  <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{selectedWallet.phone}</p></div>
                  <div><p className="text-xs text-muted-foreground">Status</p><div className="mt-1"><StatusBadge status={selectedWallet.status === "active" ? "success" : "error"}>{selectedWallet.status}</StatusBadge></div></div>
                </div>

                {/* Activity Tabs */}
                <Tabs defaultValue="ledger" className="space-y-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="ledger" className="flex-1">Ledger</TabsTrigger>
                    <TabsTrigger value="sends" className="flex-1">Sends</TabsTrigger>
                    <TabsTrigger value="receives" className="flex-1">Receives</TabsTrigger>
                    <TabsTrigger value="swaps" className="flex-1">Swaps</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ledger">
                    <div className="content-card overflow-hidden">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Entity</th>
                            <th>Amount</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ledgerEntries.map((e, i) => (
                            <tr key={i}>
                              <td>
                                <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", e.type === "credit" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                                  {e.type}
                                </span>
                              </td>
                              <td>
                                <div>
                                  <p className="text-xs font-medium">{e.entity}</p>
                                  <p className="font-mono text-xs text-primary">{e.entityId}</p>
                                </div>
                              </td>
                              <td className={cn("font-semibold text-sm", e.type === "credit" ? "text-success" : "text-destructive")}>{e.amount}</td>
                              <td className="text-muted-foreground text-xs">{e.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  <TabsContent value="sends">
                    <p className="text-sm text-muted-foreground text-center py-8">Send history filtered to this sub-wallet</p>
                  </TabsContent>
                  <TabsContent value="receives">
                    <p className="text-sm text-muted-foreground text-center py-8">Receive history filtered to this sub-wallet</p>
                  </TabsContent>
                  <TabsContent value="swaps">
                    <p className="text-sm text-muted-foreground text-center py-8">Swap history filtered to this sub-wallet</p>
                  </TabsContent>
                </Tabs>

                <p className="text-xs text-muted-foreground text-center">Actions logged to Audit Trail</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
