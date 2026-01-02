import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, UserX, Flag, Ban, AlertTriangle } from "lucide-react";
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
    balance: "₦2,450,000",
    created: "Dec 15, 2024",
    withdrawalsEnabled: true,
    adminNotes: "",
  },
  {
    id: "USR-002",
    name: "Amara Eze",
    phone: "+234 805 678 9012",
    email: "amara.eze@email.com",
    kyc: "pending",
    wallet: "active",
    riskLevel: "low",
    balance: "₦890,000",
    created: "Dec 18, 2024",
    withdrawalsEnabled: true,
    adminNotes: "",
  },
  {
    id: "USR-003",
    name: "Ibrahim Musa",
    phone: "+234 807 890 1234",
    email: "ibrahim.m@email.com",
    kyc: "verified",
    wallet: "frozen",
    riskLevel: "high",
    balance: "₦5,670,000",
    created: "Nov 22, 2024",
    withdrawalsEnabled: false,
    adminNotes: "Account frozen due to suspicious activity patterns. Under investigation.",
  },
  {
    id: "USR-004",
    name: "Folake Adeyemi",
    phone: "+234 809 012 3456",
    email: "folake.a@email.com",
    kyc: "failed",
    wallet: "active",
    riskLevel: "medium",
    balance: "₦120,000",
    created: "Dec 20, 2024",
    withdrawalsEnabled: true,
    adminNotes: "",
  },
  {
    id: "USR-005",
    name: "Emeka Nwosu",
    phone: "+234 801 234 5678",
    email: "emeka.n@email.com",
    kyc: "verified",
    wallet: "active",
    riskLevel: "low",
    balance: "₦15,890,000",
    created: "Oct 05, 2024",
    withdrawalsEnabled: true,
    adminNotes: "",
  },
  {
    id: "USR-006",
    name: "Ngozi Obi",
    phone: "+234 802 345 6789",
    email: "ngozi.obi@email.com",
    kyc: "verified",
    wallet: "active",
    riskLevel: "medium",
    balance: "₦3,200,000",
    created: "Dec 01, 2024",
    withdrawalsEnabled: true,
    adminNotes: "High volume user - monitor transactions",
  },
];

const riskLevelColors = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

export default function Users() {
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const handleViewUser = (user: typeof users[0]) => {
    setSelectedUser(user);
    setAdminNotes(user.adminNotes);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-description">
          Manage platform users, KYC status, and wallet access
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, phone, or email..."
            className="pl-9"
          />
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

      {/* Users Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>KYC Status</th>
              <th>Risk Level</th>
              <th>Wallet</th>
              <th>Balance</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
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
                    status={
                      user.kyc === "verified"
                        ? "success"
                        : user.kyc === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {user.kyc}
                  </StatusBadge>
                </td>
                <td>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize",
                    riskLevelColors[user.riskLevel as keyof typeof riskLevelColors]
                  )}>
                    {user.riskLevel}
                  </span>
                </td>
                <td>
                  <StatusBadge
                    status={user.wallet === "active" ? "success" : "error"}
                  >
                    {user.wallet}
                  </StatusBadge>
                </td>
                <td className="font-medium">{user.balance}</td>
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
                        Freeze All Wallets
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ban className="mr-2 h-4 w-4" />
                        Disable Withdrawals
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

      {/* User Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedUser && (
            <>
              <SheetHeader>
                <SheetTitle>User Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Risk Alert */}
                {selectedUser.riskLevel === "high" && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <p className="text-sm font-medium text-destructive">High Risk User</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This user has been flagged for elevated risk monitoring
                    </p>
                  </div>
                )}

                {/* Profile Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Profile Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="font-medium">{selectedUser.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Joined</p>
                      <p className="font-medium">{selectedUser.created}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize",
                        riskLevelColors[selectedUser.riskLevel as keyof typeof riskLevelColors]
                      )}>
                        {selectedUser.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Account Status
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">KYC Status</p>
                      <StatusBadge
                        status={
                          selectedUser.kyc === "verified"
                            ? "success"
                            : selectedUser.kyc === "pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {selectedUser.kyc}
                      </StatusBadge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Wallet Status</p>
                      <StatusBadge
                        status={selectedUser.wallet === "active" ? "success" : "error"}
                      >
                        {selectedUser.wallet}
                      </StatusBadge>
                    </div>
                  </div>
                </div>

                {/* Wallet Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Wallet Information
                  </h4>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">NGN Balance</p>
                        <p className="text-xl font-semibold">{selectedUser.balance}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">USDT Balance</p>
                        <p className="text-xl font-semibold">2,450.00</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Controls */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Admin Controls
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Withdrawals Enabled</Label>
                        <p className="text-xs text-muted-foreground">Allow user to make withdrawals</p>
                      </div>
                      <Switch checked={selectedUser.withdrawalsEnabled} />
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Admin Notes
                  </h4>
                  <Textarea
                    placeholder="Add notes about this user..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                  />
                  <Button variant="outline" size="sm">Save Notes</Button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1">
                    <UserX className="mr-2 h-4 w-4" />
                    {selectedUser.wallet === "frozen" ? "Unfreeze" : "Freeze"} All Wallets
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <Flag className="mr-2 h-4 w-4" />
                    Flag User
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
