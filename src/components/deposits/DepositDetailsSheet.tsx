import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { useDepositDetail } from "@/hooks/useDepositQueries";

interface DepositDetailsSheetProps {
  depositId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["credited", "completed", "confirmed", "complete"].includes(s)) return "success";
  if (["processing", "pending", "detected"].includes(s)) return "warning";
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

export function DepositDetailsSheet({ depositId, open, onOpenChange }: DepositDetailsSheetProps) {
  const { data: deposit, isLoading } = useDepositDetail(depositId, open && !!depositId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Deposit Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !deposit ? (
            <p className="text-sm text-muted-foreground">No deposit data available.</p>
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="rounded-lg border border-success/20 bg-success/5 p-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">Amount Deposited</p>
                <p className="text-3xl font-bold text-success">
                  {Number(deposit.amountUsdt).toFixed(2)} {deposit.asset}
                </p>
                {deposit.amountNgn > 0 && (
                  <p className="text-sm text-muted-foreground">
                    ≈ ₦{Number(deposit.amountNgn).toLocaleString()} NGN
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  via {deposit.ycChannel} · {deposit.network}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <StatusBadge status={statusVariant(deposit.status)}>
                    {deposit.statusDisplay ?? deposit.status}
                  </StatusBadge>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                    {deposit.country}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              {deposit.timeline && deposit.timeline.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    End-to-End Timeline
                  </h4>
                  <p className="text-xs text-muted-foreground -mt-1">
                    Yellow Card → OpenXSwitch sub-wallet credit chain
                  </p>
                  {deposit.timeline.map((step, i) => (
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
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {step.subLabel}
                          </p>
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

              {/* User & Wallet */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  User & Wallet
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Full Name" value={deposit.userFullName} />
                  <DetailRow label="Phone" value={deposit.userPhone} />
                  <DetailRow
                    label="Sub-wallet"
                    value={<span className="font-mono text-xs">{deposit.subwalletId}</span>}
                  />
                  <DetailRow label="Country" value={deposit.country} />
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Payment Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="YC Channel" value={deposit.ycChannel} />
                  {deposit.ycBankName && (
                    <DetailRow label="Bank" value={deposit.ycBankName} />
                  )}
                  {deposit.ycAccountNumber && (
                    <DetailRow label="Account Number" value={deposit.ycAccountNumber} />
                  )}
                  {deposit.ycAccountName && (
                    <DetailRow label="Account Name" value={deposit.ycAccountName} />
                  )}
                  <DetailRow label="Asset / Network" value={`${deposit.asset} (${deposit.network})`} />
                  <DetailRow
                    label="Unit Price"
                    value={deposit.unitPrice > 0 ? `$${Number(deposit.unitPrice).toFixed(4)}` : "—"}
                  />
                  <DetailRow
                    label="Fee %"
                    value={deposit.feePercent > 0 ? `${deposit.feePercent}%` : "—"}
                  />
                  {deposit.expiresAtUtc && (
                    <DetailRow
                      label="Expires At"
                      value={new Date(deposit.expiresAtUtc).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  )}
                  <DetailRow
                    label="Created At"
                    value={new Date(deposit.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                </div>
              </div>

              {/* References */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  References
                </h4>
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <RefRow label="Deposit Ref" value={deposit.depositRef} />
                  <RefRow label="YC Reference" value={deposit.ycReference} />
                  <RefRow label="OXS Reference" value={deposit.oxsReference} />
                  <RefRow label="YC Deposit ID" value={deposit.ycDepositId} />
                </div>
              </div>

              {/* Error */}
              {deposit.errorMessage && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive">Error</p>
                  <p className="text-sm text-muted-foreground mt-1">{deposit.errorMessage}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
