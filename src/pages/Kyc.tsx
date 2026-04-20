import { useState, useEffect } from "react";
import { Search, ShieldCheck, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
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
import { KycDetailsSheet } from "@/components/kyc/KycDetailsSheet";
import { useKycRecords, useKycStats } from "@/hooks/useKycQueries";

// ─── Status helpers ────────────────────────────────────────────────────────

function statusVariant(status: string): "success" | "warning" | "error" | "neutral" {
  const s = status.toLowerCase();
  if (s === "verified") return "success";
  if (["pending", "pending_approval", "under_review"].includes(s)) return "warning";
  if (["failed", "rejected"].includes(s)) return "error";
  return "neutral";
}

// ─── Page ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

export default function Kyc() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Debounce search — 400ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, dateFrom, dateTo]);

  const { data, isLoading, isError } = useKycRecords({
    Search: search,
    Status: status,
    DateFrom: dateFrom || undefined,
    DateTo: dateTo || undefined,
    PageNo: currentPage,
    PageSize: PAGE_SIZE,
  });

  const { data: stats } = useKycStats();

  const records = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const hasActiveFilters = !!searchInput || status !== "all" || !!dateFrom || !!dateTo;

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">KYC</h1>
          <p className="page-description">
            Identity verification records — review, approve, and manage user KYC submissions
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          KYC · Identity Verification
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <p className="metric-label">Total Users</p>
          </div>
          <p className="metric-value mt-1">{stats?.total ?? "—"}</p>
        </div>
        <div className="metric-card border-success/30">
          <p className="metric-label">Verified</p>
          <p className="metric-value mt-1 text-success">{stats?.verified ?? "—"}</p>
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Pending</p>
          <p className="metric-value mt-1 text-warning">{stats?.pending ?? "—"}</p>
        </div>
        <div className="metric-card border-warning/30">
          <p className="metric-label">Pending Approval</p>
          <p className="metric-value mt-1 text-warning">{stats?.pendingApproval ?? "—"}</p>
          {stats && stats.pendingApproval > 0 && (
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          )}
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Failed / Rejected</p>
          <p className="metric-value mt-1 text-destructive">{stats?.failedOrRejected ?? "—"}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Date range row */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">From</span>
          <Input
            type="date"
            className="w-40"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="text-sm text-muted-foreground">To</span>
          <Input
            type="date"
            className="w-40"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
        {/* Other filters row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search name, email, phone..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>KYC Status</th>
              <th>Submitted</th>
              <th>Last Updated</th>
              <th className="text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  Loading...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-destructive">
                  Failed to load KYC records. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && records.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No KYC records found.
                </td>
              </tr>
            )}
            {records.map((record) => (
              <tr
                key={record.userId}
                className={cn(
                  "cursor-pointer",
                  statusVariant(record.kycStatus) === "error" && "bg-destructive/5"
                )}
                onClick={() => {
                  setSelectedUserId(record.userId);
                  setSheetOpen(true);
                }}
              >
                <td>
                  <p className="font-medium text-sm">{record.fullName}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {record.userId}
                  </p>
                </td>
                <td className="text-sm text-muted-foreground">{record.email}</td>
                <td className="text-sm text-muted-foreground">{record.phone}</td>
                <td className="text-sm text-muted-foreground">
                  {record.dateOfBirth
                    ? new Date(record.dateOfBirth).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td>
                  <StatusBadge status={statusVariant(record.kycStatus)}>
                    {record.kycStatus}
                  </StatusBadge>
                </td>
                <td className="text-muted-foreground text-sm">
                  {record.submittedAt
                    ? new Date(record.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="text-muted-foreground text-sm">
                  {record.lastUpdated
                    ? new Date(record.lastUpdated).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedUserId(record.userId);
                      setSheetOpen(true);
                    }}
                  >
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
            : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                currentPage * PAGE_SIZE,
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

      <KycDetailsSheet
        userId={selectedUserId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
