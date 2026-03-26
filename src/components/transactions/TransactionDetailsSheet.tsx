import { Loader2, ArrowUpRight, ArrowDownLeft, RefreshCw, Send, Inbox } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { useTransactionDetail } from "@/hooks/useTransactionQueries";

interface TransactionDetailsSheetProps {
  transactionId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeIcons: Record<string, typeof ArrowDownLeft> = {
  Withdrawal: ArrowUpRight,
  Deposit: ArrowDownLeft,
  Swap: RefreshCw,
  Send: Send,
  Receive: Inbox,
};

const typeColors: Record<string, string> = {
  Withdrawal: "bg-primary/10 text-primary",
  Deposit: "bg-success/10 text-success",
  Swap: "bg-warning/10 text-warning",
  Send: "bg-primary/10 text-primary",
  Receive: "bg-success/10 text-success",
};

const txTypeColors: Record<string, string> = {
  "On-Chain": "bg-primary/10 text-primary",
  "On-Ramp": "bg-success/10 text-success",
  Internal: "bg-muted text-muted-foreground",
};

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["completed", "confirmed", "credited", "complete"].includes(s)) return "success";
  if (["pending", "processing"].includes(s)) return "warning";
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
      <p className="text-xs text-muted-foreground w-28 flex-shrink-0">{label}</p>
      <p className="font-mono text-xs text-right break-all">{value || "—"}</p>
    </div>
  );
}

export function TransactionDetailsSheet({
  transactionId,
  open,
  onOpenChange,
}: TransactionDetailsSheetProps) {
  const { data: tx, isLoading } = useTransactionDetail(
    transactionId,
    open && !!transactionId
  );

  const Icon = tx ? (typeIcons[tx.type] ?? ArrowDownLeft) : ArrowDownLeft;
  const iconColor = tx ? (typeColors[tx.type] ?? "bg-muted text-muted-foreground") : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !tx ? (
            <p className="text-sm text-muted-foreground">No transaction data available.</p>
          ) : (
            <div className="space-y-6">
              {/* Type + Status header */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
                    iconColor
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-lg font-semibold">{tx.type}</p>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                        txTypeColors[tx.transactionType] ?? "bg-muted text-muted-foreground"
                      )}
                    >
                      {tx.transactionType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={statusVariant(tx.status)}>{tx.status}</StatusBadge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Card */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    {Number(tx.amount).toFixed(6)} {tx.coinPair}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Number(tx.usdtEquivalent).toFixed(2)} USDT equivalent
                  </p>
                </div>
                <div className="border-t border-border pt-3 grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Fee</p>
                    <p className="text-sm font-semibold">{tx.fee}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Network Fee</p>
                    <p className="text-sm font-semibold">{tx.networkFee}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Partner Fee</p>
                    <p className="text-sm font-semibold">{tx.partnerFee}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-sm font-semibold text-success">{tx.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Transaction Info
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="ID" value={tx.id} />
                  <DetailRow label="Coin" value={`${tx.coin} (${tx.chain})`} />
                  <DetailRow label="Coin Pair" value={tx.coinPair} />
                  <DetailRow label="Wallet ID" value={tx.walletId} />
                  <DetailRow
                    label="Sub-wallet ID"
                    value={<span className="font-mono text-xs">{tx.subwalletId}</span>}
                  />
                  <DetailRow label="Response Code" value={tx.responseCode} />
                  <DetailRow
                    label="Updated At"
                    value={new Date(tx.updatedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                  <DetailRow label="Channel" value={tx.channel} />
                </div>
              </div>

              {/* User */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  User
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Full Name" value={tx.userFullName} />
                  <DetailRow
                    label="User ID"
                    value={<span className="font-mono text-xs">{tx.userId}</span>}
                  />
                  <DetailRow label="Phone" value={tx.userPhone} />
                  <DetailRow label="Email" value={tx.userEmail} />
                </div>
              </div>

              {/* References */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  References
                </p>
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <RefRow label="Reference" value={tx.reference} />
                  <RefRow label="External Ref" value={tx.externalRef} />
                  <RefRow label="OXS Ref" value={tx.oxsRef} />
                  <RefRow label="YC Ref" value={tx.ycRef} />
                  <RefRow label="Correlation ID" value={tx.correlationId} />
                </div>
              </div>

              {/* Narration */}
              {tx.narration && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Narration
                  </p>
                  <p className="text-sm rounded-lg bg-muted/50 p-3">{tx.narration}</p>
                </div>
              )}

              {/* Remarks */}
              {tx.remarks && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Remarks
                  </p>
                  <p className="text-sm rounded-lg bg-muted/50 p-3">{tx.remarks}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
