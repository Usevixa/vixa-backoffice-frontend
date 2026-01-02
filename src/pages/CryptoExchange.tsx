import { Search, Filter, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
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

const cryptoOrders = [
  {
    id: "CRY-001",
    user: "Chinedu Okonkwo",
    type: "buy",
    amount: "₦250,000",
    crypto: "245.50 USDT",
    rate: "₦1,018.33",
    provider: "Quidax",
    spread: "₦2,500",
    status: "completed",
    timestamp: "Dec 31, 2024 14:32",
  },
  {
    id: "CRY-002",
    user: "Amara Eze",
    type: "sell",
    amount: "₦180,000",
    crypto: "175.00 USDT",
    rate: "₦1,028.57",
    provider: "YellowCard",
    spread: "₦1,800",
    status: "completed",
    timestamp: "Dec 31, 2024 13:45",
  },
  {
    id: "CRY-003",
    user: "Emeka Nwosu",
    type: "buy",
    amount: "₦1,200,000",
    crypto: "1,180.00 USDT",
    rate: "₦1,016.95",
    provider: "Quidax",
    spread: "₦0",
    status: "failed",
    timestamp: "Dec 31, 2024 10:22",
    failureReason: "Insufficient liquidity",
  },
  {
    id: "CRY-004",
    user: "Ngozi Obi",
    type: "sell",
    amount: "₦320,000",
    crypto: "310.00 USDT",
    rate: "₦1,032.26",
    provider: "YellowCard",
    spread: "₦3,200",
    status: "completed",
    timestamp: "Dec 30, 2024 16:45",
  },
  {
    id: "CRY-005",
    user: "Ibrahim Musa",
    type: "buy",
    amount: "₦500,000",
    crypto: "490.00 USDT",
    rate: "₦1,020.41",
    provider: "Quidax",
    spread: "₦5,000",
    status: "processing",
    timestamp: "Dec 31, 2024 15:10",
  },
];

export default function CryptoExchange() {
  const buyVolume = "₦28.5M";
  const sellVolume = "₦16.8M";
  const totalSpread = "₦234,500";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Crypto Exchange</h1>
        <p className="page-description">
          Monitor buy/sell orders and provider operations
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-primary" />
            <p className="metric-label">Buy Volume (24h)</p>
          </div>
          <p className="metric-value mt-1">{buyVolume}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <p className="metric-label">Sell Volume (24h)</p>
          </div>
          <p className="metric-value mt-1">{sellVolume}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Spread Earned (24h)</p>
          <p className="metric-value mt-1 text-success">{totalSpread}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Failed Orders</p>
          <p className="metric-value mt-1 text-destructive">3</p>
        </div>
      </div>

      {/* Provider Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="content-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="font-semibold text-blue-600">Q</span>
              </div>
              <div>
                <p className="font-semibold">Quidax</p>
                <p className="text-xs text-muted-foreground">Primary Provider</p>
              </div>
            </div>
            <StatusBadge status="success">Online</StatusBadge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Current Rate</p>
              <p className="font-medium">₦1,015.00/USDT</p>
            </div>
            <div>
              <p className="text-muted-foreground">24h Volume</p>
              <p className="font-medium">₦32.4M</p>
            </div>
          </div>
        </div>
        <div className="content-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <span className="font-semibold text-yellow-600">Y</span>
              </div>
              <div>
                <p className="font-semibold">YellowCard</p>
                <p className="text-xs text-muted-foreground">Secondary Provider</p>
              </div>
            </div>
            <StatusBadge status="success">Online</StatusBadge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Current Rate</p>
              <p className="font-medium">₦1,018.50/USDT</p>
            </div>
            <div>
              <p className="text-muted-foreground">24h Volume</p>
              <p className="font-medium">₦12.9M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="quidax">Quidax</SelectItem>
            <SelectItem value="yellowcard">YellowCard</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Orders Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Rate</th>
              <th>Provider</th>
              <th>Spread</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cryptoOrders.map((order) => (
              <tr
                key={order.id}
                className={cn(order.status === "failed" && "bg-destructive/5")}
              >
                <td className="font-medium">{order.id}</td>
                <td className="text-muted-foreground">{order.user}</td>
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      order.type === "buy"
                        ? "bg-primary/10 text-primary"
                        : "bg-success/10 text-success"
                    )}
                  >
                    {order.type.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div>
                    <p className="font-medium">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.crypto}</p>
                  </div>
                </td>
                <td className="text-muted-foreground">{order.rate}</td>
                <td className="text-muted-foreground">{order.provider}</td>
                <td className="font-medium text-success">{order.spread}</td>
                <td>
                  <StatusBadge
                    status={
                      order.status === "completed"
                        ? "success"
                        : order.status === "processing"
                        ? "warning"
                        : "error"
                    }
                  >
                    {order.status}
                  </StatusBadge>
                </td>
                <td className="text-right">
                  {order.status === "failed" && (
                    <Button size="sm" variant="outline">
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Retry
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
