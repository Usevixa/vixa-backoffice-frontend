import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  ScanLine,
  Users,
  CheckCircle2,
  TrendingDown,
  BanIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useOnboardingDropoffs,
  useOnboardingFunnel,
  useTriggerOnboardingScan,
} from "@/hooks/useOnboardingQueries";
import { OnboardingDetailsSheet } from "@/components/onboarding/OnboardingDetailsSheet";
import { OnboardingDropoff } from "@/types/onboarding";

const PAGE_SIZE = 20;

const STAGES = [
  "Started",
  "PhoneVerified",
  "EmailVerified",
  "PersonalDetails",
  "KycStarted",
  "KycSubmitted",
  "Completed",
];

export default function Onboarding() {
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [onlyActive, setOnlyActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, stage, onlyActive]);

  const { data, isLoading, isError } = useOnboardingDropoffs({
    search,
    stage,
    onlyActive,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const { data: funnel } = useOnboardingFunnel();

  const triggerScanMutation = useTriggerOnboardingScan();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const hasActiveFilters = !!searchInput || stage !== "all" || onlyActive;

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStage("all");
    setOnlyActive(false);
    setCurrentPage(1);
  };

  const openDetail = (phone: string) => {
    setSelectedPhone(phone);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Onboarding Tracker</h1>
          <p className="page-description">
            Monitor user onboarding progress, drop-offs, and funnel health
          </p>
        </div>
        <Button
          onClick={() => triggerScanMutation.mutate()}
          disabled={triggerScanMutation.isPending}
          size="sm"
        >
          {triggerScanMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ScanLine className="mr-2 h-4 w-4" />
          )}
          Trigger Scan
        </Button>
      </div>

      {/* Funnel summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <p className="metric-label">Total Started</p>
          </div>
          <p className="metric-value mt-1">{funnel?.totalStarted ?? "—"}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <p className="metric-label">Completion Rate</p>
          </div>
          <p className="metric-value mt-1 text-success">
            {funnel != null ? `${Number(funnel.completionRatePct).toFixed(1)}%` : "—"}
          </p>
        </div>
        <div className="metric-card border-warning/30">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-warning" />
            <p className="metric-label">Active Drop-offs</p>
          </div>
          <p className="metric-value mt-1 text-warning">{funnel?.activeDropOffs ?? "—"}</p>
        </div>
        <div className="metric-card border-destructive/30">
          <div className="flex items-center gap-2">
            <BanIcon className="h-4 w-4 text-destructive" />
            <p className="metric-label">Opted Out</p>
          </div>
          <p className="metric-value mt-1 text-destructive">{funnel?.optedOut ?? "—"}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search phone, email, name..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Switch
            id="only-active"
            checked={onlyActive}
            onCheckedChange={(val) => setOnlyActive(val)}
          />
          <label htmlFor="only-active" className="text-sm cursor-pointer select-none">
            Only Active
          </label>
        </div>
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
              <th>Phone Number</th>
              <th>Email</th>
              <th>Stage</th>
              <th>Reminders</th>
              <th>Hours Stuck</th>
              <th>Last Updated</th>
              <th>Opted Out</th>
              <th className="text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="py-12">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-destructive">
                  Failed to load onboarding drop-offs. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && items.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  No drop-offs found.
                </td>
              </tr>
            )}
            {items.map((row) => (
              <DropoffRow key={row.progressId} row={row} onSelect={openDetail} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {total === 0
            ? "0"
            : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                currentPage * PAGE_SIZE,
                total
              )}`}{" "}
          of {total}
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

      <OnboardingDetailsSheet
        phoneNumber={selectedPhone}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}

function DropoffRow({
  row,
  onSelect,
}: {
  row: OnboardingDropoff;
  onSelect: (phone: string) => void;
}) {
  return (
    <tr className="cursor-pointer" onClick={() => onSelect(row.phoneNumber)}>
      <td className="font-mono text-sm">{row.phoneNumber}</td>
      <td className="text-sm text-muted-foreground">{row.email ?? "—"}</td>
      <td>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
          {row.stage}
        </span>
      </td>
      <td className="text-sm">{row.reminderCount}</td>
      <td>
        <span
          className={cn(
            "text-sm font-medium",
            row.hoursStuck >= 48 ? "text-destructive" : row.hoursStuck >= 24 ? "text-warning" : ""
          )}
        >
          {row.hoursStuck}h
        </span>
      </td>
      <td className="text-sm text-muted-foreground">
        {new Date(row.lastUpdatedAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
      <td>
        {row.hasOptedOut ? (
          <span className="text-xs font-medium text-destructive">Opted Out</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="text-right" onClick={(e) => e.stopPropagation()}>
        <Button size="sm" variant="ghost" onClick={() => onSelect(row.phoneNumber)}>
          <Eye className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
