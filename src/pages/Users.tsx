import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  UserX,
  Flag,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { useUsers, useFreezeWallets, useUnfreezeWallet, useFlagUser } from "@/hooks/useUserQueries";
import { UserDetailsSheet } from "@/components/users/UserDetailsSheet";

const riskLevelColors = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const PAGE_SIZE_OPTIONS = [25, 50, 100];

export default function Users() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filter state
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [kycStatus, setKycStatus] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");
  const [walletStatus, setWalletStatus] = useState("all");

  // Debounce search input — waits 400ms after the user stops typing
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, kycStatus, riskLevel, walletStatus]);

  const { data: users = [], isLoading, isError } = useUsers({
    Search: search,
    KycStatus: kycStatus,
    RiskLevel: riskLevel,
    WalletStatus: walletStatus,
  });

  // Quick-action mutations for the table row dropdown
  const freezeWalletsMutation = useFreezeWallets();
  const unfreezeWalletMutation = useUnfreezeWallet();
  const flagUserMutation = useFlagUser();

  const selectedUser = users.find((u) => u.userId === selectedUserId) ?? null;

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleViewUser = (user: User) => {
    setSelectedUserId(user.userId);
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
          <Input
            type="search"
            placeholder="Search by name, phone, user ID..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select value={kycStatus} onValueChange={setKycStatus}>
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
        <Select value={riskLevel} onValueChange={setRiskLevel}>
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
        <Select value={walletStatus} onValueChange={setWalletStatus}>
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
              <th>USDT Balance</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="py-12">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-destructive">
                  Failed to load users. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && users.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
            {paginatedUsers.map((user) => (
              <tr
                key={user.userId}
                className="cursor-pointer"
                onClick={() => handleViewUser(user)}
              >
                <td>
                  <div>
                    <p className="font-medium text-foreground">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{user.userId}</p>
                  </div>
                </td>
                <td className="text-muted-foreground">{user.phone}</td>
                <td>
                  <StatusBadge
                    status={
                      user.kycStatus.toLowerCase() === "verified"
                        ? "success"
                        : user.kycStatus.toLowerCase() === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {user.kycStatus}
                  </StatusBadge>
                </td>
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize",
                      riskLevelColors[user.riskLevel as keyof typeof riskLevelColors] ??
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    {user.riskLevel}
                  </span>
                </td>
                <td>
                  <StatusBadge status={user.walletStatus === "active" ? "success" : "error"}>
                    {user.walletStatus}
                  </StatusBadge>
                </td>
                <td className="font-semibold text-success">
                  {user.usdtBalance.toFixed(2)} USDT
                </td>
                <td className="text-muted-foreground">
                  {new Date(user.joinedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          if (user.walletStatus === "frozen") {
                            unfreezeWalletMutation.mutate(user.userId);
                          } else {
                            freezeWalletsMutation.mutate(user.userId);
                          }
                        }}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        {user.walletStatus === "frozen" ? "Unfreeze" : "Freeze"} Wallets
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          flagUserMutation.mutate({
                            userId: user.userId,
                            payload: { isFlagged: !user.isFlagged, reason: "" },
                          });
                        }}
                      >
                        <Flag className="mr-2 h-4 w-4" />
                        {user.isFlagged ? "Remove Flag" : "Flag User"}
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
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Showing{" "}
            {users.length === 0
              ? 0
              : Math.min((currentPage - 1) * pageSize + 1, users.length)}
            –{Math.min(currentPage * pageSize, users.length)} of {users.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
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
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <UserDetailsSheet
        user={selectedUser}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
