import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { useWebhookLogDetail } from "@/hooks/useWebhookQueries";

interface WebhookDetailsSheetProps {
  webhookId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusVariant(status: string): "success" | "warning" | "error" {
  const s = status.toLowerCase();
  if (["success", "completed", "complete"].includes(s)) return "success";
  if (["processing", "pending"].includes(s)) return "warning";
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

function formatPayload(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

export function WebhookDetailsSheet({ webhookId, open, onOpenChange }: WebhookDetailsSheetProps) {
  const { data: detail, isLoading } = useWebhookLogDetail(webhookId, open && !!webhookId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Webhook Log Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !detail ? (
            <p className="text-sm text-muted-foreground">No webhook data available.</p>
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0",
                      statusVariant(detail.status) === "success"
                        ? "bg-success/10"
                        : "bg-destructive/10"
                    )}
                  >
                    {statusVariant(detail.status) === "success" ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold font-mono text-sm truncate">{detail.event}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={statusVariant(detail.status)}>
                        {detail.status}
                      </StatusBadge>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                          detail.source === "OpenXSwitch"
                            ? "bg-primary/10 text-primary"
                            : "bg-warning/10 text-warning"
                        )}
                      >
                        {detail.source}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                        {detail.eventCategory}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Event Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow
                    label="Endpoint"
                    value={<span className="font-mono text-xs">{detail.endpoint}</span>}
                  />
                  <DetailRow label="Category" value={detail.eventCategory} />
                  <DetailRow
                    label="Response Time"
                    value={detail.responseTimeMs > 0 ? `${detail.responseTimeMs}ms` : "—"}
                  />
                  <DetailRow
                    label="Retries"
                    value={
                      detail.retries > 0 ? (
                        <span className="text-warning font-medium">{detail.retries}</span>
                      ) : (
                        "0"
                      )
                    }
                  />
                  <DetailRow
                    label="Timestamp"
                    value={new Date(detail.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                  <DetailRow label="ID" value={<span className="font-mono text-xs">{detail.id}</span>} />
                </div>
              </div>

              {/* References */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  References
                </h4>
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <RefRow label="Linked Transfer" value={detail.linkedTransfer} />
                  <RefRow label="Correlation ID" value={detail.correlationId} />
                </div>
              </div>

              {/* Signature Verification */}
              <div
                className={cn(
                  "rounded-lg border p-4",
                  detail.signatureValid
                    ? "border-success/30 bg-success/5"
                    : "border-destructive/30 bg-destructive/5"
                )}
              >
                <div className="flex items-center gap-2">
                  {detail.signatureValid ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  <p
                    className={cn(
                      "text-sm font-medium",
                      detail.signatureValid ? "text-success" : "text-destructive"
                    )}
                  >
                    Signature {detail.signatureValid ? "Valid" : "Invalid"}
                  </p>
                </div>
              </div>

              {/* Error */}
              {detail.error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive">Error</p>
                  <p className="text-sm text-muted-foreground mt-1">{detail.error}</p>
                </div>
              )}

              {/* Raw Payload */}
              {detail.rawPayload && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Raw Payload
                  </h4>
                  <pre className="rounded-lg bg-muted p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                    {formatPayload(detail.rawPayload)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
