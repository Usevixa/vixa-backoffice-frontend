import { Search, Filter, MoreHorizontal, Eye, Lock, History } from "lucide-react";
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

const wallets = [
  {
    id: "WAL-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    currency: "NGN",
    balance: "₦2,450,000.00",
    status: "active",
    lastActivity: "2 hours ago",
  },
  {
    id: "WAL-002",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    currency: "USDT",
    balance: "2,450.50 USDT",
    status: "active",
    lastActivity: "2 hours ago",
  },
  {
    id: "WAL-003",
    user: "Amara Eze",
    userId: "USR-002",
    currency: "NGN",
    balance: "₦890,000.00",
    status: "active",
    lastActivity: "5 hours ago",
  },
  {
    id: "WAL-004",
    user: "Amara Eze",
    userId: "USR-002",
    currency: "USDT",
    balance: "875.00 USDT",
    status: "active",
    lastActivity: "5 hours ago",
  },
  {
    id: "WAL-005",
    user: "Ibrahim Musa",
    userId: "USR-003",
    currency: "NGN",
    balance: "₦5,670,000.00",
    status: "frozen",
    lastActivity: "3 days ago",
  },
  {
    id: "WAL-006",
    user: "Ibrahim Musa",
    userId: "USR-003",
    currency: "USDT",
    balance: "5,500.00 USDT",
    status: "frozen",
    lastActivity: "3 days ago",
  },
  {
    id: "WAL-007",
    user: "Folake Adeyemi",
    userId: "USR-004",
    currency: "NGN",
    balance: "₦120,000.00",
    status: "active",
    lastActivity: "1 day ago",
  },
  {
    id: "WAL-008",
    user: "Emeka Nwosu",
    userId: "USR-005",
    currency: "NGN",
    balance: "₦15,890,000.00",
    status: "active",
    lastActivity: "30 mins ago",
  },
  {
    id: "WAL-009",
    user: "Emeka Nwosu",
    userId: "USR-005",
    currency: "USDT",
    balance: "15,600.00 USDT",
    status: "active",
    lastActivity: "30 mins ago",
  },
];

export default function Wallets() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Wallets</h1>
        <p className="page-description">
          Monitor and manage all user wallets (NGN & Crypto)
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="metric-label">Total NGN Balance</p>
          <p className="metric-value mt-1">₦847.5M</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total USDT Balance</p>
          <p className="metric-value mt-1">524,875 USDT</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Active Wallets</p>
          <p className="metric-value mt-1">25,694</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Frozen Wallets</p>
          <p className="metric-value mt-1">47</p>
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
              <th>Balance</th>
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
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      wallet.currency === "NGN"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {wallet.currency}
                  </span>
                </td>
                <td className="font-medium">{wallet.balance}</td>
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
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Ledger
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <History className="mr-2 h-4 w-4" />
                        Transaction History
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
    </div>
  );
}
