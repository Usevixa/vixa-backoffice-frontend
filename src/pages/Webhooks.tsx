import { Search, Filter, RefreshCw, Eye, CheckCircle, XCircle } from "lucide-react";
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

const webhooks = [
  {
    id: "WH-001",
    source: "Paystack",
    event: "charge.success",
    status: "success",
    retries: 0,
    timestamp: "Dec 31, 2024 14:32:15",
    responseTime: "124ms",
  },
  {
    id: "WH-002",
    source: "Flutterwave",
    event: "transfer.completed",
    status: "success",
    retries: 0,
    timestamp: "Dec 31, 2024 14:30:45",
    responseTime: "89ms",
  },
  {
    id: "WH-003",
    source: "Quidax",
    event: "order.filled",
    status: "failed",
    retries: 3,
    timestamp: "Dec 31, 2024 14:28:22",
    responseTime: "timeout",
    error: "Connection timeout after 30s",
  },
  {
    id: "WH-004",
    source: "Paystack",
    event: "transfer.success",
    status: "success",
    retries: 0,
    timestamp: "Dec 31, 2024 14:25:11",
    responseTime: "156ms",
  },
  {
    id: "WH-005",
    source: "YellowCard",
    event: "trade.completed",
    status: "success",
    retries: 1,
    timestamp: "Dec 31, 2024 14:22:33",
    responseTime: "234ms",
  },
  {
    id: "WH-006",
    source: "Paystack",
    event: "charge.failed",
    status: "success",
    retries: 0,
    timestamp: "Dec 31, 2024 14:20:08",
    responseTime: "98ms",
  },
  {
    id: "WH-007",
    source: "Flutterwave",
    event: "transfer.failed",
    status: "failed",
    retries: 3,
    timestamp: "Dec 31, 2024 14:18:45",
    responseTime: "timeout",
    error: "Invalid signature",
  },
];

export default function Webhooks() {
  const successCount = webhooks.filter(w => w.status === "success").length;
  const failedCount = webhooks.filter(w => w.status === "failed").length;
  const successRate = ((successCount / webhooks.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Webhooks & API Logs</h1>
        <p className="page-description">
          Monitor incoming webhooks and API reliability
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="metric-label">Total Webhooks (24h)</p>
          <p className="metric-value mt-1">1,247</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Success Rate</p>
          <p className="metric-value mt-1 text-success">{successRate}%</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed (24h)</p>
          <p className="metric-value mt-1 text-destructive">{failedCount}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Avg Response Time</p>
          <p className="metric-value mt-1">142ms</p>
        </div>
      </div>

      {/* Provider Status */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { name: "Paystack", status: "healthy", latency: "98ms" },
          { name: "Flutterwave", status: "healthy", latency: "124ms" },
          { name: "Quidax", status: "degraded", latency: "1.2s" },
          { name: "YellowCard", status: "healthy", latency: "156ms" },
        ].map((provider) => (
          <div key={provider.name} className="content-card p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{provider.name}</span>
              <StatusBadge
                status={provider.status === "healthy" ? "success" : "warning"}
              >
                {provider.status}
              </StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Avg latency: {provider.latency}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search webhooks..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="paystack">Paystack</SelectItem>
            <SelectItem value="flutterwave">Flutterwave</SelectItem>
            <SelectItem value="quidax">Quidax</SelectItem>
            <SelectItem value="yellowcard">YellowCard</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Webhooks Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Source</th>
              <th>Event</th>
              <th>Status</th>
              <th>Retries</th>
              <th>Response Time</th>
              <th>Timestamp</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((webhook) => (
              <tr
                key={webhook.id}
                className={cn(webhook.status === "failed" && "bg-destructive/5")}
              >
                <td className="font-mono text-sm">{webhook.id}</td>
                <td>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-medium">
                    {webhook.source}
                  </span>
                </td>
                <td className="font-mono text-sm text-muted-foreground">
                  {webhook.event}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {webhook.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        webhook.status === "success" ? "text-success" : "text-destructive"
                      )}
                    >
                      {webhook.status}
                    </span>
                  </div>
                </td>
                <td>
                  {webhook.retries > 0 ? (
                    <span className="text-warning font-medium">{webhook.retries}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </td>
                <td
                  className={cn(
                    "font-mono text-sm",
                    webhook.responseTime === "timeout" && "text-destructive"
                  )}
                >
                  {webhook.responseTime}
                </td>
                <td className="text-muted-foreground text-sm">{webhook.timestamp}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {webhook.status === "failed" && (
                      <Button size="sm" variant="outline">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Retry
                      </Button>
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
