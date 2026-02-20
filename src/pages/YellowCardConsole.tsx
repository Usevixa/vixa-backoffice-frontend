import { Search, Filter, CheckCircle, AlertTriangle, Clock } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const operations = [
  {
    id: "YCO-001",
    linkedEntity: "DEP-002",
    entityType: "Deposit",
    currency: "USDT",
    amount: "175.00 USDT",
    status: "completed",
    ycRef: "YC-5523891",
    timestamp: "Dec 31, 2024 13:45",
  },
  {
    id: "YCO-002",
    linkedEntity: "WDR-005",
    entityType: "Withdrawal",
    currency: "USDT",
    amount: "310.00 USDT",
    status: "completed",
    ycRef: "YC-5523880",
    timestamp: "Dec 30, 2024 16:45",
  },
  {
    id: "YCO-003",
    linkedEntity: "SWP-001",
    entityType: "Swap",
    currency: "USDT",
    amount: "1,000.00 USDT",
    status: "completed",
    ycRef: "YC-8847291",
    timestamp: "Dec 31, 2024 14:32",
  },
  {
    id: "YCO-004",
    linkedEntity: "SWP-003",
    entityType: "Swap",
    currency: "USDC",
    amount: "2,000.00 USDC",
    status: "processing",
    ycRef: "YC-9912345",
    timestamp: "Dec 31, 2024 15:45",
  },
  {
    id: "YCO-005",
    linkedEntity: "SWP-004",
    entityType: "Swap",
    currency: "USDT",
    amount: "1,000.00 USDT",
    status: "failed",
    ycRef: "YC-3312234",
    timestamp: "Dec 31, 2024 11:20",
    failureReason: "Insufficient liquidity",
  },
];

const railHealth = [
  { operationType: "Deposit Confirmation", successRate: 99.1, avgLatency: "145ms", failures24h: 2, status: "healthy" },
  { operationType: "Withdrawal Payout", successRate: 98.4, avgLatency: "189ms", failures24h: 4, status: "healthy" },
  { operationType: "Swap Rate Provision", successRate: 97.8, avgLatency: "98ms", failures24h: 7, status: "healthy" },
  { operationType: "USDT Settlement", successRate: 99.8, avgLatency: "201ms", failures24h: 1, status: "healthy" },
  { operationType: "USDC Settlement", successRate: 98.9, avgLatency: "178ms", failures24h: 3, status: "healthy" },
];

const entityTypeColors: Record<string, string> = {
  Deposit: "bg-success/10 text-success",
  Withdrawal: "bg-primary/10 text-primary",
  Swap: "bg-warning/10 text-warning",
};

export default function YellowCardConsole() {
  const totalOps = operations.length;
  const successOps = operations.filter(o => o.status === "completed").length;
  const failedOps = operations.filter(o => o.status === "failed").length;
  const successRate = ((successOps / totalOps) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Yellow Card Console</h1>
        <p className="page-description">
          Stablecoin rails provider — deposit/withdrawal confirmations and conversion events
        </p>
      </div>

      {/* Provider Status Banner */}
      <div className="content-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <span className="text-lg font-bold text-warning">YC</span>
            </div>
            <div>
              <p className="font-semibold">Yellow Card</p>
              <p className="text-xs text-muted-foreground">Stablecoin Rails · Conversion + Settlement</p>
            </div>
          </div>
          <StatusBadge status="success">All Systems Operational</StatusBadge>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">24h Volume</p>
            <p className="font-medium">524,875 USDT</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current USDT Rate</p>
            <p className="font-medium">₦1,018.50</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current USDC Rate</p>
            <p className="font-medium">₦1,017.20</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Latency</p>
            <p className="font-medium">156ms</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="metric-label">Operations (24h)</p>
          <p className="metric-value mt-1">1,842</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <p className="metric-label">Success Rate</p>
          </div>
          <p className="metric-value mt-1 text-success">{successRate}%</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed (24h)</p>
          <p className="metric-value mt-1 text-destructive">{failedOps}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="metric-label">Avg Latency</p>
          </div>
          <p className="metric-value mt-1">162ms</p>
        </div>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="rail">Rail Health</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search operation ID, linked entity, YC ref..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="swap">Swap</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>

          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Operation ID</th>
                  <th>Linked Entity</th>
                  <th>Entity Type</th>
                  <th>Currency</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>YC Reference</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op) => (
                  <tr key={op.id} className={cn(op.status === "failed" && "bg-destructive/5")}>
                    <td className="font-mono text-sm font-medium">{op.id}</td>
                    <td className="font-mono text-sm text-primary">{op.linkedEntity}</td>
                    <td>
                      <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", entityTypeColors[op.entityType])}>
                        {op.entityType}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted">
                        {op.currency}
                      </span>
                    </td>
                    <td className="font-semibold">{op.amount}</td>
                    <td>
                      <StatusBadge
                        status={op.status === "completed" ? "success" : op.status === "processing" ? "warning" : "error"}
                      >
                        {op.status}
                      </StatusBadge>
                    </td>
                    <td className="font-mono text-sm text-muted-foreground">{op.ycRef}</td>
                    <td className="text-muted-foreground">{op.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="rail" className="space-y-4">
          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <p className="metric-label">Healthy Rails</p>
              </div>
              <p className="metric-value mt-1">{railHealth.filter(r => r.status === "healthy").length}</p>
            </div>
            <div className="metric-card border-warning/30">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="metric-label">Degraded</p>
              </div>
              <p className="metric-value mt-1 text-warning">{railHealth.filter(r => r.status === "degraded").length}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Overall Success Rate</p>
              <p className="metric-value mt-1 text-success">98.8%</p>
            </div>
          </div>

          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Operation Type</th>
                  <th>Success Rate</th>
                  <th>Avg Latency</th>
                  <th>Failures (24h)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {railHealth.map((rail) => (
                  <tr key={rail.operationType}>
                    <td className="font-medium">{rail.operationType}</td>
                    <td>
                      <span className={cn("font-medium", rail.successRate >= 99 ? "text-success" : rail.successRate >= 97 ? "text-warning" : "text-destructive")}>
                        {rail.successRate}%
                      </span>
                    </td>
                    <td className="font-mono text-sm text-muted-foreground">{rail.avgLatency}</td>
                    <td>
                      <span className={cn("font-medium", rail.failures24h > 5 ? "text-warning" : "text-muted-foreground")}>
                        {rail.failures24h}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={rail.status === "healthy" ? "success" : "warning"}>
                        {rail.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
