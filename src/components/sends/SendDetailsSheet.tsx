import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { useSendDetail } from "@/hooks/useSendQueries";

interface SendDetailsSheetProps {
  sendId: number | null;
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
  if (["completed", "confirmed", "credited", "complete"].includes(s)) return "success";
  if (["pending", "processing", "initiated"].includes(s)) return "warning";
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

export function SendDetailsSheet({ sendId, open, onOpenChange }: SendDetailsSheetProps) {
  const { data: send, isLoading } = useSendDetail(sendId, open && !!sendId);

  const toDestination = send?.toSubwalletId || send?.toAddress || send?.toPhone || send?.destination;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Send Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !send ? (
            <p className="text-sm text-muted-foreground">No send data available.</p>
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
                <p className="text-3xl font-bold text-primary">
                  {Number(send.amount).toFixed(4)} {send.coin}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  {send.fromSubwalletId} → {toDestination}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <StatusBadge status={statusVariant(send.status)}>
                    {send.statusDisplay ?? send.status}
                  </StatusBadge>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                      txTypeColors[send.txType] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {send.txType}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              {send.timeline && send.timeline.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Status Timeline
                  </h4>
                  {send.timeline.map((step, i) => (
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

              {/* Transaction Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow
                    label="From Sub-wallet"
                    value={<span className="font-mono text-xs">{send.fromSubwalletId}</span>}
                  />
                  <DetailRow
                    label={send.toSubwalletId ? "To Sub-wallet" : send.toAddress ? "To Address" : "To Phone"}
                    value={<span className="font-mono text-xs">{toDestination}</span>}
                  />
                  <DetailRow label="User" value={send.userFullName} />
                  <DetailRow label="Phone" value={send.userPhone} />
                  <DetailRow label="Coin / Chain" value={`${send.coin} (${send.chain})`} />
                  <DetailRow
                    label="Final Amount"
                    value={send.finalAmount != null ? Number(send.finalAmount).toFixed(4) : "—"}
                  />
                  <DetailRow label="Vixa Fee" value={Number(send.vixaFee).toFixed(4)} />
                  <DetailRow label="Network Fee" value={Number(send.networkFee).toFixed(4)} />
                  <DetailRow label="Retry Count" value={send.retryCount} />
                  <DetailRow
                    label="Created At"
                    value={new Date(send.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                  {send.txHash && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Tx Hash</p>
                      <p className="font-mono text-xs text-primary break-all">{send.txHash}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* References */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  References
                </h4>
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <RefRow label="Send Ref" value={send.sendRef} />
                  <RefRow label="OXS Ref" value={send.oxsRef} />
                  <RefRow label="Idempotency Key" value={send.idempotencyKey} />
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
