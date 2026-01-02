import { useState } from "react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const webhooks = [
  {
    id: "WH-001",
    source: "OpenXSwitch",
    endpoint: "/webhooks/openxswitch/transfer",
    event: "transfer.completed",
    status: "success",
    retries: 0,
    linkedTransfer: "TRF-20241231-001",
    timestamp: "Dec 31, 2024 14:32:15",
    responseTime: "124ms",
    payload: '{"event":"transfer.completed","data":{"id":"TRF-20241231-001","amount":250000,"status":"success"}}',
    signatureValid: true,
  },
  {
    id: "WH-002",
    source: "Yellow Card",
    endpoint: "/webhooks/yellowcard/payout",
    event: "payout.completed",
    status: "success",
    retries: 0,
    linkedTransfer: "STO-002",
    timestamp: "Dec 31, 2024 14:30:45",
    responseTime: "89ms",
    payload: '{"event":"payout.completed","data":{"id":"YC-5523891","amount":"175.00","currency":"USDT"}}',
    signatureValid: true,
  },
  {
    id: "WH-003",
    source: "OpenXSwitch",
    endpoint: "/webhooks/openxswitch/transfer",
    event: "transfer.failed",
    status: "failed",
    retries: 3,
    linkedTransfer: "TRF-20241231-005",
    timestamp: "Dec 31, 2024 14:28:22",
    responseTime: "timeout",
    error: "Connection timeout after 30s",
    payload: '{"event":"transfer.failed","data":{"id":"TRF-20241231-005","error":"bank_timeout"}}',
    signatureValid: true,
  },
  {
    id: "WH-004",
    source: "OpenXSwitch",
    endpoint: "/webhooks/openxswitch/settlement",
    event: "settlement.received",
    status: "success",
    retries: 0,
    timestamp: "Dec 31, 2024 14:25:11",
    responseTime: "156ms",
    payload: '{"event":"settlement.received","data":{"amount":45200000,"date":"2024-12-31"}}',
    signatureValid: true,
  },
  {
    id: "WH-005",
    source: "Yellow Card",
    endpoint: "/webhooks/yellowcard/rate",
    event: "rate.updated",
    status: "success",
    retries: 1,
    timestamp: "Dec 31, 2024 14:22:33",
    responseTime: "234ms",
    payload: '{"event":"rate.updated","data":{"pair":"NGN/USDT","rate":1018.50}}',
    signatureValid: true,
  },
  {
    id: "WH-006",
    source: "Yellow Card",
    endpoint: "/webhooks/yellowcard/payout",
    event: "payout.failed",
    status: "failed",
    retries: 3,
    linkedTransfer: "STO-003",
    timestamp: "Dec 31, 2024 14:18:45",
    responseTime: "timeout",
    error: "Invalid signature",
    payload: '{"event":"payout.failed","data":{"id":"YC-8847290"}}',
    signatureValid: false,
  },
];

export default function Webhooks() {
  const [selectedWebhook, setSelectedWebhook] = useState<typeof webhooks[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const successCount = webhooks.filter(w => w.status === "success").length;
  const failedCount = webhooks.filter(w => w.status === "failed").length;
  const successRate = ((successCount / webhooks.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Webhooks & API Logs</h1>
        <p className="page-description">
          Monitor incoming webhooks from OpenXSwitch and Yellow Card
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
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "OpenXSwitch", status: "healthy", latency: "98ms" },
          { name: "Yellow Card", status: "healthy", latency: "156ms" },
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
            <SelectItem value="openxswitch">OpenXSwitch</SelectItem>
            <SelectItem value="yellowcard">Yellow Card</SelectItem>
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
              <th>Linked Transfer</th>
              <th>Response Time</th>
              <th>Timestamp</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((webhook) => (
              <tr
                key={webhook.id}
                className={cn(
                  "cursor-pointer",
                  webhook.status === "failed" && "bg-destructive/5"
                )}
                onClick={() => {
                  setSelectedWebhook(webhook);
                  setSheetOpen(true);
                }}
              >
                <td className="font-mono text-sm">{webhook.id}</td>
                <td>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                    webhook.source === "OpenXSwitch" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                  )}>
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
                <td>
                  {webhook.linkedTransfer ? (
                    <span className="font-mono text-sm text-primary">{webhook.linkedTransfer}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
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
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => {
                      setSelectedWebhook(webhook);
                      setSheetOpen(true);
                    }}>
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

      {/* Webhook Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[600px] overflow-y-auto">
          {selectedWebhook && (
            <>
              <SheetHeader>
                <SheetTitle>Webhook Details - {selectedWebhook.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Status */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    selectedWebhook.status === "success" ? "bg-success/10" : "bg-destructive/10"
                  )}>
                    {selectedWebhook.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{selectedWebhook.event}</p>
                    <StatusBadge
                      status={selectedWebhook.status === "success" ? "success" : "error"}
                    >
                      {selectedWebhook.status}
                    </StatusBadge>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Source</p>
                    <p className="font-medium">{selectedWebhook.source}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Endpoint</p>
                    <p className="font-medium font-mono text-sm">{selectedWebhook.endpoint}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Response Time</p>
                    <p className="font-medium">{selectedWebhook.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Retries</p>
                    <p className="font-medium">{selectedWebhook.retries}</p>
                  </div>
                  {selectedWebhook.linkedTransfer && (
                    <div>
                      <p className="text-xs text-muted-foreground">Linked Transfer</p>
                      <p className="font-medium font-mono">{selectedWebhook.linkedTransfer}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="font-medium">{selectedWebhook.timestamp}</p>
                  </div>
                </div>

                {/* Signature Verification */}
                <div className={cn(
                  "rounded-lg border p-4",
                  selectedWebhook.signatureValid ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
                )}>
                  <div className="flex items-center gap-2">
                    {selectedWebhook.signatureValid ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <p className="text-sm font-medium">
                      Signature {selectedWebhook.signatureValid ? "Valid" : "Invalid"}
                    </p>
                  </div>
                </div>

                {/* Error */}
                {selectedWebhook.error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm font-medium text-destructive">Error</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedWebhook.error}
                    </p>
                  </div>
                )}

                {/* Payload */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Payload</p>
                  <pre className="rounded-lg bg-muted p-4 text-xs font-mono overflow-x-auto">
                    {JSON.stringify(JSON.parse(selectedWebhook.payload), null, 2)}
                  </pre>
                </div>

                {/* Actions */}
                {selectedWebhook.status === "failed" && (
                  <Button className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Webhook
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
