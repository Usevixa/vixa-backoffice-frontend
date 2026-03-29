import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { useWithdrawalDetail } from "@/hooks/useWithdrawalQueries";

interface WithdrawalDetailsSheetProps {
  withdrawalId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["completed", "confirmed", "complete"].includes(s)) return "success";
  if (["processing", "pending", "initiated"].includes(s)) return "warning";
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

export function WithdrawalDetailsSheet({ withdrawalId, open, onOpenChange }: WithdrawalDetailsSheetProps) {
  const { data: withdrawal, isLoading } = useWithdrawalDetail(withdrawalId, open && !!withdrawalId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Withdrawal Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !withdrawal ? (
            <p className="text-sm text-muted-foreground">No withdrawal data available.</p>
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="rounded-lg border border-border p-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">Amount Withdrawn</p>
                <p className="text-3xl font-bold">
                  {Number(withdrawal.amount).toFixed(2)} {withdrawal.coin}
                </p>
                {withdrawal.finalAmount != null && (
                  <p className="text-sm text-muted-foreground">
                    Final: {Number(withdrawal.finalAmount).toFixed(2)} {withdrawal.coin}
                    {withdrawal.fiatAmount != null && withdrawal.currency && (
                      <span className="ml-2">
                        ≈ {Number(withdrawal.fiatAmount).toLocaleString()} {withdrawal.currency}
                      </span>
                    )}
                  </p>
                )}
                {withdrawal.destinationAddress && (
                  <p className="text-xs text-muted-foreground font-mono">
                    → {withdrawal.destinationAddress.length > 30
                      ? `${withdrawal.destinationAddress.substring(0, 16)}…${withdrawal.destinationAddress.slice(-8)}`
                      : withdrawal.destinationAddress}
                  </p>
                )}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <StatusBadge status={statusVariant(withdrawal.status)}>
                    {withdrawal.statusDisplay ?? withdrawal.status}
                  </StatusBadge>
                  {withdrawal.chain && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {withdrawal.chain}
                    </span>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {withdrawal.timeline && withdrawal.timeline.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    End-to-End Timeline
                  </h4>
                  <p className="text-xs text-muted-foreground -mt-1">
                    OXS debit → Yellow Card processing → on-chain confirmation
                  </p>
                  {withdrawal.timeline.map((step, i) => (
                    <div key={i}>
                      {step.handoffLabel && (
                        <div className="flex items-center gap-2 my-2">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-xs text-warning font-medium px-2 py-0.5 rounded bg-warning/10">
                            {step.handoffLabel}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}
                      <div className="flex items-start gap-3">
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
                  <DetailRow label="Full Name" value={withdrawal.userFullName} />
                  <DetailRow label="Phone" value={withdrawal.userPhone} />
                  <DetailRow
                    label="Sub-wallet"
                    value={<span className="font-mono text-xs">{withdrawal.subwalletId}</span>}
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Payment Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {withdrawal.bankName && (
                    <DetailRow label="Bank" value={withdrawal.bankName} />
                  )}
                  {withdrawal.accountNumber && (
                    <DetailRow label="Account Number" value={withdrawal.accountNumber} />
                  )}
                  {withdrawal.accountName && (
                    <DetailRow label="Account Name" value={withdrawal.accountName} />
                  )}
                  <DetailRow
                    label="Coin / Chain"
                    value={withdrawal.chain ? `${withdrawal.coin} (${withdrawal.chain})` : withdrawal.coin}
                  />
                  {withdrawal.fiatRate != null && withdrawal.fiatRate > 0 && (
                    <DetailRow
                      label="Fiat Rate"
                      value={`1 ${withdrawal.coin} = ${Number(withdrawal.fiatRate).toLocaleString()} ${withdrawal.currency ?? ""}`}
                    />
                  )}
                  <DetailRow
                    label="Network Fee"
                    value={`${Number(withdrawal.networkFee).toFixed(4)} ${withdrawal.coin}`}
                  />
                  <DetailRow
                    label="Vixa Fee"
                    value={`${Number(withdrawal.vixaFee).toFixed(4)} ${withdrawal.coin}`}
                  />
                  <DetailRow
                    label="Retry Count"
                    value={withdrawal.retryCount}
                  />
                  <DetailRow
                    label="Created At"
                    value={new Date(withdrawal.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                  {withdrawal.updatedAt && (
                    <DetailRow
                      label="Updated At"
                      value={new Date(withdrawal.updatedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  )}
                </div>
                {withdrawal.oxTxHash && (
                  <div>
                    <p className="text-xs text-muted-foreground">On-chain Tx Hash</p>
                    <p className="font-mono text-xs break-all mt-0.5">{withdrawal.oxTxHash}</p>
                  </div>
                )}
              </div>

              {/* References */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  References
                </h4>
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <RefRow label="Withdrawal Ref" value={withdrawal.withdrawalRef} />
                  <RefRow label="OX Reference" value={withdrawal.oxReference} />
                  <RefRow label="YC Reference" value={withdrawal.ycReference} />
                  <RefRow label="Ledger Debit Ref" value={withdrawal.ledgerDebitRef} />
                  <RefRow label="Idempotency Key" value={withdrawal.idempotencyKey} />
                </div>
              </div>

              {/* Last Provider Response */}
              {withdrawal.lastProviderResponse && (
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm font-medium text-foreground">Last Provider Response</p>
                  <p className="text-sm text-muted-foreground mt-1">{withdrawal.lastProviderResponse}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
