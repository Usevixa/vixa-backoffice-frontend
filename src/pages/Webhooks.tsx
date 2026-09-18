import { useState, useEffect } from "react";
import {
  Search,
  Webhook,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
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
import { useWebhookLogs } from "@/hooks/useWebhookQueries";
import { WebhookDetailsSheet } from "@/components/webhooks/WebhookDetailsSheet";

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["success", "completed", "complete"].includes(s)) return "success";
  if (["processing", "pending"].includes(s)) return "warning";
  return "error";
}

const FALLBACK_PROVIDERS = [
  { name: "OpenXSwitch", status: "" },
  { name: "Yellow Card", status: "" },
];

export default function Webhooks() {
  const [selectedWebhookId, setSelectedWebhookId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, source, category, status]);

  const { data, isLoading, isError } = useWebhookLogs({
    search,
    source,
    category,
    status,
    page: currentPage,
    pageSize,
  });

  const webhooks = data?.items ?? [];
  const stats = data?.stats;
  const providers = data?.providers?.length ? data.providers : FALLBACK_PROVIDERS;
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  const hasActiveFilters =
    !!searchInput || source !== "all" || category !== "all" || status !== "all";

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setSource("all");
    setCategory("all");
    setStatus("all");
    setCurrentPage(1);
  };

  const openDetail = (id: number) => {
    setSelectedWebhookId(id);
    setSheetOpen(true);
  };

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
          <div className="flex items-center gap-2">
            <Webhook className="h-4 w-4 text-muted-foreground" />
            <p className="metric-label">Total (24h)</p>
          </div>
          <p className="metric-value mt-1">{stats?.totalWebhooks24h ?? "—"}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Success Rate</p>
          <p className="metric-value mt-1 text-success">
            {stats != null ? `${Number(stats.successRate).toFixed(1)}%` : "—"}
          </p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed (24h)</p>
          <p className="metric-value mt-1 text-destructive">{stats?.failed24h ?? "—"}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Avg Response Time</p>
          <p className="metric-value mt-1">
            {stats?.avgResponseTimeMs != null ? `${stats.avgResponseTimeMs}ms` : "—"}
          </p>
        </div>
      </div>

      {/* Provider Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {providers.map((provider) => (
          <div key={provider.name} className="content-card p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{provider.name}</span>
              {provider.status ? (
                <StatusBadge
                  status={
                    provider.status.toLowerCase() === "healthy" ? "success" : "warning"
                  }
                >
                  {provider.status}
                </StatusBadge>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
            {provider.avgLatencyMs != null && (
              <p className="text-xs text-muted-foreground mt-2">
                Avg latency: {provider.avgLatencyMs}ms
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search event, transfer ID, correlation ID..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="OpenXSwitch">OpenXSwitch</SelectItem>
            <SelectItem value="YellowCard">Yellow Card</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="SEND">SEND</SelectItem>
            <SelectItem value="RECEIVE">RECEIVE</SelectItem>
            <SelectItem value="SWAP">SWAP</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Source</th>
              <th>Category</th>
              <th>Event</th>
              <th>Status</th>
              <th>Retries</th>
              <th>Linked Transfer</th>
              <th>Response Time</th>
              <th>Timestamp</th>
              <th className="text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={10} className="py-12">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-sm text-destructive">
                  Failed to load webhook logs. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && webhooks.length === 0 && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                  No webhook logs found.
                </td>
              </tr>
            )}
            {webhooks.map((wh) => (
              <tr
                key={wh.id}
                className={cn(
                  "cursor-pointer",
                  statusVariant(wh.status) === "error" && "bg-destructive/5"
                )}
                onClick={() => openDetail(wh.id)}
              >
                <td className="font-mono text-sm">{wh.id}</td>
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      wh.source === "OpenXSwitch"
                        ? "bg-primary/10 text-primary"
                        : "bg-warning/10 text-warning"
                    )}
                  >
                    {wh.source}
                  </span>
                </td>
                <td>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                    {wh.eventCategory}
                  </span>
                </td>
                <td className="font-mono text-sm text-muted-foreground">{wh.event}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {statusVariant(wh.status) === "success" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <StatusBadge status={statusVariant(wh.status)}>{wh.status}</StatusBadge>
                  </div>
                </td>
                <td>
                  {wh.retries > 0 ? (
                    <span className="text-warning font-medium">{wh.retries}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </td>
                <td>
                  {wh.linkedTransfer ? (
                    <span className="font-mono text-xs text-primary">{wh.linkedTransfer}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="font-mono text-sm">
                  {wh.responseTimeMs > 0 ? `${wh.responseTimeMs}ms` : "—"}
                </td>
                <td className="text-muted-foreground text-sm">
                  {new Date(wh.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" onClick={() => openDetail(wh.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {totalCount === 0
            ? "0"
            : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                currentPage * pageSize,
                totalCount
              )}`}{" "}
          of {totalCount}
        </span>
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

      <WebhookDetailsSheet
        webhookId={selectedWebhookId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
