import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { useReceiveDetail } from "@/hooks/useReceiveQueries";

interface ReceiveDetailsSheetProps {
  receiveId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const txTypeColors: Record<string, string> = {
  "On-Chain": "bg-primary/10 text-primary",
  "On-Ramp": "bg-success/10 text-success",
  Internal: "bg-muted text-muted-foreground",
};

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["completed", "credited", "confirmed", "complete"].includes(s)) return "success";
  if (["pending", "processing", "initiated", "detected"].includes(s)) return "warning";
  return "error";
}

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm break-all">{value ?? "—"}</p>
    </div>
  );
}

function RefRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs text-muted-foreground w-36 flex-shrink-0">{label}</p>
      <p className="font-mono text-xs text-right break-all">{value || "—"}</p>
    </div>
  );
}

export function ReceiveDetailsSheet({ receiveId, open, onOpenChange }: ReceiveDetailsSheetProps) {
  const { data: receive, isLoading } = useReceiveDetail(receiveId, open && !!receiveId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Receive Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !receive ? (
            <p className="text-sm text-muted-foreground">No receive data available.</p>
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="rounded-lg border border-success/20 bg-success/5 p-4 text-center space-y-2">
                <p className="text-3xl font-bold text-success">
                  {Number(receive.amount).toFixed(4)} {receive.coin}
                </p>
                {receive.toSubwalletId && (
                  <p className="text-sm text-muted-foreground font-mono">
                    → {receive.toSubwalletId}
                  </p>
                )}
                <div className="flex items-center justify-center gap-2">
                  <StatusBadge status={statusVariant(receive.status)}>
                    {receive.statusDisplay ?? receive.status}
                  </StatusBadge>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      txTypeColors[receive.txType] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {receive.txType}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              {receive.timeline && receive.timeline.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Status Timeline
                  </h4>
                  {receive.timeline.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5",
                          step.failed
                            ? "bg-destructive text-destructive-foreground"
                            : step.completed
                            ? "bg-success text-success-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {step.failed ? "✗" : step.completed ? "✓" : i + 1}
                      </div>
                      <div className="flex-1">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            step.failed
                              ? "text-destructive"
                              : step.completed
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </span>
                        {step.subLabel && (
                          <p className="text-xs text-muted-foreground">{step.subLabel}</p>
                        )}
                      </div>
                      {step.timestamp && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(step.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="User" value={receive.userFullName} />
                  <DetailRow label="Phone" value={receive.userPhone} />
                  <DetailRow
                    label="To Sub-wallet"
                    value={receive.toSubwalletId ? <span className="font-mono text-xs">{receive.toSubwalletId}</span> : undefined}
                  />
                  <DetailRow label="Coin / Chain" value={`${receive.coin} (${receive.chain})`} />
                  <DetailRow label="Tx Type" value={receive.txType} />
                  <DetailRow
                    label="Created At"
                    value={new Date(receive.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                  {receive.updatedAt && (
                    <DetailRow
                      label="Updated At"
                      value={new Date(receive.updatedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  )}
                </div>
              </div>

              {/* References */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  References
                </h4>
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <RefRow label="Receive Ref" value={receive.receiveRef} />
                  <RefRow label="Provider Ref" value={receive.providerRef} />
                  <RefRow label="External Ref" value={receive.externalRef} />
                  <RefRow label="Ledger Credit Ref" value={receive.ledgerCreditRef} />
                  <RefRow label="Correlation ID" value={receive.correlationId} />
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
