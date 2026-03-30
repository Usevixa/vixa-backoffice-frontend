import { ArrowUpRight, ArrowDownLeft, RefreshCw, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { DashboardRecentTx } from "@/types/dashboard";

interface RecentTransactionsProps {
  data: DashboardRecentTx[];
  isLoading: boolean;
}

function getTypeIcon(type: string) {
  const t = type.toLowerCase();
  if (t === "deposit") return ArrowDownLeft;
  if (t === "swap") return RefreshCw;
  return ArrowUpRight;
}

function getTypeColor(type: string) {
  const t = type.toLowerCase();
  if (t === "deposit") return "bg-success/10 text-success";
  if (t === "swap") return "bg-warning/10 text-warning";
  return "bg-primary/10 text-primary";
}

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toUpperCase();
  if (s === "COMPLETED") return "success";
  if (s === "PENDING") return "warning";
  return "error";
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function RecentTransactions({ data, isLoading }: RecentTransactionsProps) {
  return (
    <div className="content-card flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="content-card-title">Recent Transactions</h3>
        <a href="/transfers" className="text-xs font-medium text-primary hover:underline">
          View all →
        </a>
      </div>
      <div className="divide-y divide-border flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            No recent transactions.
          </div>
        ) : (
          data.map((tx) => {
            const Icon = getTypeIcon(tx.type);
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0",
                      getTypeColor(tx.type)
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{tx.userFullName}</p>
                    <p className="text-xs text-muted-foreground">{tx.type.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-sm font-semibold text-foreground">
                    {Number(tx.amount).toFixed(2)} {tx.coin}
                  </p>
                  <div className="flex items-center justify-end gap-2 mt-0.5">
                    <StatusBadge status={statusVariant(tx.status)}>
                      {tx.status}
                    </StatusBadge>
                    <span className="text-[11px] text-muted-foreground">{relativeTime(tx.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
