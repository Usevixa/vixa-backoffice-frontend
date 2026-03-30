import { ArrowRight, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { useSwapDetail } from "@/hooks/useSwapQueries";

interface SwapDetailsSheetProps {
  swapId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["completed", "swap_completed"].includes(s)) return "success";
  if (["pending", "processing", "initiated", "rate_locked"].includes(s)) return "warning";
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
      <p className="text-xs text-muted-foreground w-32 flex-shrink-0">{label}</p>
      <p className="font-mono text-xs text-right break-all">{value || "—"}</p>
    </div>
  );
}

export function SwapDetailsSheet({ swapId, open, onOpenChange }: SwapDetailsSheetProps) {
  const { data: swap, isLoading } = useSwapDetail(swapId, open && !!swapId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Swap Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !swap ? (
            <p className="text-sm text-muted-foreground">No swap data available.</p>
          ) : (
            <div className="space-y-6">
              {/* Conversion Summary */}
              <div className="rounded-lg border border-border p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">FROM</p>
                    <span className="inline-flex items-center px-3 py-1 rounded text-sm font-bold bg-destructive/10 text-destructive">
                      {swap.fromCoin}
                    </span>
                    <p className="text-2xl font-bold mt-1">{Number(swap.amountIn).toFixed(4)}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">TO</p>
                    <span className="inline-flex items-center px-3 py-1 rounded text-sm font-bold bg-success/10 text-success">
                      {swap.toCoin}
                    </span>
                    <p className="text-2xl font-bold text-success mt-1">{Number(swap.amountOut).toFixed(4)}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{swap.swapPriceDisplay}</p>
                <StatusBadge status={statusVariant(swap.statusDisplay)}>
                  {swap.statusDisplay ?? swap.status}
                </StatusBadge>
              </div>

              {/* Timeline */}
              {swap.timeline && swap.timeline.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Status Timeline
                  </h4>
                  {swap.timeline.map((step, i) => (
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

              {/* Swap Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="User" value={swap.userFullName} />
                  <DetailRow label="Phone" value={swap.userPhone} />
                  <DetailRow label="Rate" value={swap.swapPriceDisplay} />
                  <DetailRow label="Raw Price" value={swap.swapPriceRaw} />
                  <DetailRow
                    label="Markup"
                    value={swap.markupPct != null ? `${swap.markupPct}%` : "—"}
                  />
                  <DetailRow
                    label="Fee"
                    value={swap.fee > 0 ? Number(swap.fee).toFixed(4) : "0"}
                  />
                  <DetailRow
                    label="Sub-wallet"
                    value={<span className="font-mono text-xs">{swap.subwalletId}</span>}
                  />
                  <DetailRow
                    label="Created At"
                    value={new Date(swap.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                  {swap.debitLedgerRef && (
                    <DetailRow
                      label="Debit Ledger"
                      value={<span className="font-mono text-xs">{swap.debitLedgerRef}</span>}
                    />
                  )}
                  {swap.creditLedgerRef && (
                    <DetailRow
                      label="Credit Ledger"
                      value={<span className="font-mono text-xs">{swap.creditLedgerRef}</span>}
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
                  <RefRow label="Swap Ref" value={swap.swapRef} />
                  <RefRow label="Quote ID" value={swap.quoteId} />
                  <RefRow label="OXS Ref" value={swap.oxsRef} />
                  <RefRow label="OX Swap ID" value={swap.oxSwapId} />
                </div>
              </div>

              {/* Error */}
              {swap.errorMessage && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive">Error Details</p>
                  <p className="text-sm text-muted-foreground mt-1">{swap.errorMessage}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
