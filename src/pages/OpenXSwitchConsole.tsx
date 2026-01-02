import { Search, Filter, Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
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

const switchTransfers = [
  {
    id: "OXS-001",
    user: "Chinedu Okonkwo",
    destination: "Access Bank",
    amount: "₦250,000",
    status: "completed",
    latency: "1.2s",
    createdAt: "Dec 31, 2024 14:32",
  },
  {
    id: "OXS-002",
    user: "Amara Eze",
    destination: "GTBank",
    amount: "₦180,000",
    status: "completed",
    latency: "0.8s",
    createdAt: "Dec 31, 2024 13:45",
  },
  {
    id: "OXS-003",
    user: "Ibrahim Musa",
    destination: "First Bank",
    amount: "₦500,000",
    status: "pending",
    latency: "—",
    createdAt: "Dec 31, 2024 12:18",
  },
  {
    id: "OXS-004",
    user: "Emeka Nwosu",
    destination: "Zenith Bank",
    amount: "₦1,200,000",
    status: "failed",
    latency: "30s",
    createdAt: "Dec 31, 2024 10:22",
    error: "Bank timeout",
  },
  {
    id: "OXS-005",
    user: "Folake Adeyemi",
    destination: "MTN MoMo",
    amount: "₦75,000",
    status: "completed",
    latency: "2.1s",
    createdAt: "Dec 31, 2024 11:05",
  },
];

const routingEvents = [
  {
    id: "RTE-001",
    source: "VIXA Wallet",
    destination: "Access Bank",
    route: "Primary",
    timestamp: "Dec 31, 2024 14:32:15",
  },
  {
    id: "RTE-002",
    source: "VIXA Wallet",
    destination: "GTBank",
    route: "Primary",
    timestamp: "Dec 31, 2024 13:45:22",
  },
  {
    id: "RTE-003",
    source: "VIXA Wallet",
    destination: "Zenith Bank",
    route: "Fallback",
    timestamp: "Dec 31, 2024 10:22:18",
  },
];

const serviceHealth = [
  { destination: "Access Bank", successRate: 99.2, latency: "1.1s", lastFailure: "2 days ago", status: "healthy" },
  { destination: "GTBank", successRate: 98.7, latency: "0.9s", lastFailure: "5 hours ago", status: "healthy" },
  { destination: "First Bank", successRate: 97.1, latency: "1.8s", lastFailure: "1 hour ago", status: "healthy" },
  { destination: "Zenith Bank", successRate: 94.5, latency: "2.4s", lastFailure: "15 mins ago", status: "degraded" },
  { destination: "UBA", successRate: 98.9, latency: "1.0s", lastFailure: "3 days ago", status: "healthy" },
  { destination: "MTN MoMo", successRate: 96.3, latency: "2.1s", lastFailure: "4 hours ago", status: "healthy" },
  { destination: "Airtel Money", successRate: 95.8, latency: "2.5s", lastFailure: "2 hours ago", status: "healthy" },
];

export default function OpenXSwitchConsole() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">OpenXSwitch Console</h1>
        <p className="page-description">
          Monitor transfer routing, events, and service health
        </p>
      </div>

      {/* Provider Status Card */}
      <div className="content-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">OpenXSwitch</p>
              <p className="text-xs text-muted-foreground">Transfer Routing & Settlement</p>
            </div>
          </div>
          <StatusBadge status="success">All Systems Operational</StatusBadge>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">24h Volume</p>
            <p className="font-medium">₦145.2M</p>
          </div>
          <div>
            <p className="text-muted-foreground">Success Rate</p>
            <p className="font-medium text-success">97.8%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Latency</p>
            <p className="font-medium">1.4s</p>
          </div>
          <div>
            <p className="text-muted-foreground">Failed (24h)</p>
            <p className="font-medium text-destructive">23</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="transfers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transfers">Switch Transfers</TabsTrigger>
          <TabsTrigger value="routing">Routing Events</TabsTrigger>
          <TabsTrigger value="health">Service Health</TabsTrigger>
        </TabsList>

        <TabsContent value="transfers" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transfers..."
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banks</SelectItem>
                <SelectItem value="access">Access Bank</SelectItem>
                <SelectItem value="gtbank">GTBank</SelectItem>
                <SelectItem value="first">First Bank</SelectItem>
                <SelectItem value="zenith">Zenith Bank</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Transfers Table */}
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transfer ID</th>
                  <th>User</th>
                  <th>Destination</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {switchTransfers.map((transfer) => (
                  <tr
                    key={transfer.id}
                    className={cn(transfer.status === "failed" && "bg-destructive/5")}
                  >
                    <td className="font-medium">{transfer.id}</td>
                    <td className="text-muted-foreground">{transfer.user}</td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-medium">
                        {transfer.destination}
                      </span>
                    </td>
                    <td className="font-medium">{transfer.amount}</td>
                    <td>
                      <StatusBadge
                        status={
                          transfer.status === "completed"
                            ? "success"
                            : transfer.status === "pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {transfer.status}
                      </StatusBadge>
                    </td>
                    <td className={cn(
                      "font-mono text-sm",
                      transfer.latency === "30s" && "text-destructive"
                    )}>
                      {transfer.latency}
                    </td>
                    <td className="text-muted-foreground">{transfer.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Route</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {routingEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="font-medium">{event.id}</td>
                    <td className="text-muted-foreground">{event.source}</td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-medium">
                        {event.destination}
                      </span>
                    </td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                        event.route === "Primary" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      )}>
                        {event.route}
                      </span>
                    </td>
                    <td className="text-muted-foreground font-mono text-sm">{event.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          {/* Health Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <p className="metric-label">Healthy Destinations</p>
              </div>
              <p className="metric-value mt-1">{serviceHealth.filter(s => s.status === "healthy").length}</p>
            </div>
            <div className="metric-card border-warning/30">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="metric-label">Degraded</p>
              </div>
              <p className="metric-value mt-1 text-warning">{serviceHealth.filter(s => s.status === "degraded").length}</p>
            </div>
            <div className="metric-card">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="metric-label">Avg Latency</p>
              </div>
              <p className="metric-value mt-1">1.4s</p>
            </div>
          </div>

          {/* Health Table */}
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Success Rate</th>
                  <th>Avg Latency</th>
                  <th>Last Failure</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {serviceHealth.map((service) => (
                  <tr key={service.destination}>
                    <td className="font-medium">{service.destination}</td>
                    <td>
                      <span className={cn(
                        "font-medium",
                        service.successRate >= 98 ? "text-success" : service.successRate >= 95 ? "text-warning" : "text-destructive"
                      )}>
                        {service.successRate}%
                      </span>
                    </td>
                    <td className="font-mono text-sm text-muted-foreground">{service.latency}</td>
                    <td className="text-muted-foreground">{service.lastFailure}</td>
                    <td>
                      <StatusBadge
                        status={service.status === "healthy" ? "success" : "warning"}
                      >
                        {service.status}
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
