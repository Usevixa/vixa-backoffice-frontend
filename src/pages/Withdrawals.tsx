import { Search, Filter, AlertCircle, RefreshCw, CheckCircle, XCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";

const withdrawals = [
  {
    id: "WDL-001",
    user: "Ibrahim Musa",
    userId: "USR-003",
    amount: "₦500,000",
    bank: "Access Bank",
    accountNumber: "0012345678",
    accountName: "Ibrahim Musa",
    status: "pending",
    provider: "Paystack",
    createdAt: "Dec 31, 2024 12:18",
    attempts: 1,
  },
  {
    id: "WDL-002",
    user: "Emeka Nwosu",
    userId: "USR-005",
    amount: "₦2,500,000",
    bank: "GTBank",
    accountNumber: "0234567890",
    accountName: "Emeka Nwosu",
    status: "processing",
    provider: "Flutterwave",
    createdAt: "Dec 31, 2024 11:45",
    attempts: 1,
  },
  {
    id: "WDL-003",
    user: "Ngozi Obi",
    userId: "USR-006",
    amount: "₦180,000",
    bank: "First Bank",
    accountNumber: "3456789012",
    accountName: "Ngozi Obi",
    status: "failed",
    provider: "Paystack",
    createdAt: "Dec 31, 2024 10:22",
    attempts: 3,
    failureReason: "Invalid account number",
  },
  {
    id: "WDL-004",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    amount: "₦750,000",
    bank: "Zenith Bank",
    accountNumber: "1234567890",
    accountName: "Chinedu Okonkwo",
    status: "completed",
    provider: "Paystack",
    createdAt: "Dec 31, 2024 09:15",
    attempts: 1,
  },
  {
    id: "WDL-005",
    user: "Amara Eze",
    userId: "USR-002",
    amount: "₦320,000",
    bank: "UBA",
    accountNumber: "2345678901",
    accountName: "Amara Eze",
    status: "completed",
    provider: "Flutterwave",
    createdAt: "Dec 30, 2024 16:30",
    attempts: 1,
  },
  {
    id: "WDL-006",
    user: "Folake Adeyemi",
    userId: "USR-004",
    amount: "₦95,000",
    bank: "Kuda Bank",
    accountNumber: "4567890123",
    accountName: "Folake Adeyemi",
    status: "pending",
    provider: "Paystack",
    createdAt: "Dec 31, 2024 13:05",
    attempts: 1,
  },
];

const pendingCount = withdrawals.filter(w => w.status === "pending" || w.status === "processing").length;
const failedCount = withdrawals.filter(w => w.status === "failed").length;
const totalPending = withdrawals
  .filter(w => w.status === "pending" || w.status === "processing")
  .reduce((sum, w) => sum + parseInt(w.amount.replace(/[₦,]/g, "")), 0);

export default function Withdrawals() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Withdrawals</h1>
        <p className="page-description">
          Monitor and manage bank withdrawal requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="metric-label">Pending Withdrawals</p>
          <p className="metric-value mt-1">{pendingCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            ₦{(totalPending / 1000000).toFixed(2)}M total value
          </p>
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Failed Today</p>
          <p className="metric-value mt-1 text-warning">{failedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Completed Today</p>
          <p className="metric-value mt-1">127</p>
          <p className="text-xs text-muted-foreground mt-1">₦45.2M processed</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Avg Processing Time</p>
          <p className="metric-value mt-1">2.4 min</p>
          <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
        </div>
      </div>

      {/* Urgent Alert */}
      {failedCount > 0 && (
        <div className="alert-card alert-card-error">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {failedCount} withdrawal(s) require attention
            </p>
            <p className="text-xs text-muted-foreground">
              Failed transactions need manual review or retry
            </p>
          </div>
          <Button size="sm" variant="outline">
            View Failed
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by user or reference..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="paystack">Paystack</SelectItem>
            <SelectItem value="flutterwave">Flutterwave</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Withdrawals Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>User</th>
              <th>Amount</th>
              <th>Bank Details</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal) => (
              <tr
                key={withdrawal.id}
                className={cn(
                  withdrawal.status === "failed" && "bg-destructive/5",
                  withdrawal.status === "pending" && "bg-warning/5"
                )}
              >
                <td className="font-medium">{withdrawal.id}</td>
                <td>
                  <div>
                    <p className="font-medium">{withdrawal.user}</p>
                    <p className="text-xs text-muted-foreground">{withdrawal.userId}</p>
                  </div>
                </td>
                <td className="font-semibold">{withdrawal.amount}</td>
                <td>
                  <div>
                    <p className="font-medium">{withdrawal.bank}</p>
                    <p className="text-xs text-muted-foreground">
                      {withdrawal.accountNumber} • {withdrawal.accountName}
                    </p>
                  </div>
                </td>
                <td className="text-muted-foreground">{withdrawal.provider}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={
                        withdrawal.status === "completed"
                          ? "success"
                          : withdrawal.status === "failed"
                          ? "error"
                          : "warning"
                      }
                    >
                      {withdrawal.status}
                    </StatusBadge>
                    {withdrawal.attempts > 1 && (
                      <span className="text-xs text-muted-foreground">
                        ({withdrawal.attempts} attempts)
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-muted-foreground">{withdrawal.createdAt}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {withdrawal.status === "failed" && (
                      <Button size="sm" variant="outline">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Retry
                      </Button>
                    )}
                    {withdrawal.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button size="sm" variant="ghost">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                    {withdrawal.status === "completed" && (
                      <span className="text-xs text-muted-foreground">Completed</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
