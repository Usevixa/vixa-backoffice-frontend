import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { KycDetail } from "@/types/kyc";

// TODO: When endpoints are available, replace prop-based record with:
// import { useApproveKyc, useDeclineKyc } from "@/hooks/useKycQueries";
// and fetch via useKycDetail(id, open) instead of passing record directly.

interface KycDetailsSheetProps {
  record: KycDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function statusVariant(status: string): "success" | "warning" | "error" | "neutral" {
  const s = status.toLowerCase();
  if (s === "verified") return "success";
  if (["pending", "pending_approval", "under_review"].includes(s)) return "warning";
  if (["failed", "rejected"].includes(s)) return "error";
  return "neutral";
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

export function KycDetailsSheet({ record, open, onOpenChange }: KycDetailsSheetProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPendingApproval = record?.status === "pending_approval";
  const canSubmit = comment.trim().length > 0 && !isSubmitting;

  // TODO: Replace stub handlers with real mutations when endpoints are available:
  // const approveMutation = useApproveKyc();
  // const declineMutation = useDeclineKyc();
  // Then call: approveMutation.mutate({ id: record.id, payload: { comment } }, { onSuccess: () => { ... } })

  function handleDecision(action: "approve" | "decline") {
    if (!record || !canSubmit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setComment("");
      onOpenChange(false);
      toast.success(
        action === "approve"
          ? `KYC approved for ${record.userFullName}`
          : `KYC declined for ${record.userFullName}`
      );
    }, 600);
  }

  function handleOpenChange(val: boolean) {
    if (!val) setComment("");
    onOpenChange(val);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>KYC Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {!record ? (
            <p className="text-sm text-muted-foreground">No record selected.</p>
          ) : (
            <div className="space-y-6">

              {/* Status Summary */}
              <div className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold">{record.userFullName}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {record.userId}
                    </p>
                  </div>
                  <StatusBadge status={statusVariant(record.status)}>
                    {record.statusDisplay}
                  </StatusBadge>
                </div>
                {record.submittedAt && (
                  <p className="text-xs text-muted-foreground">
                    Submitted{" "}
                    {new Date(record.submittedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>

              {/* User Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  User Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Full Name" value={record.userFullName} />
                  <DetailRow label="User ID" value={<span className="font-mono text-xs">{record.userId}</span>} />
                  <DetailRow label="Email" value={record.email} />
                  <DetailRow label="Phone" value={record.phone} />
                  <DetailRow
                    label="Date of Birth"
                    value={
                      record.dateOfBirth
                        ? new Date(record.dateOfBirth).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"
                    }
                  />
                  <DetailRow label="Nationality" value={record.nationality} />
                </div>
              </div>

              {/* Submitted Documents */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Submitted Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Document Type" value={record.documentType} />
                  <DetailRow
                    label="Document Number"
                    value={
                      record.documentNumber ? (
                        <span className="font-mono text-xs">{record.documentNumber}</span>
                      ) : undefined
                    }
                  />
                  <DetailRow label="Issuing Country" value={record.issuingCountry} />
                  <DetailRow label="Address" value={record.address} />
                </div>
              </div>

              {/* Approve / Decline — only visible when pending_approval */}
              {isPendingApproval && (
                <div className="rounded-lg border border-warning/40 bg-warning/5 p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-warning uppercase tracking-wide">
                    Review Decision
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    A comment is required before approving or declining this KYC submission.
                  </p>
                  <textarea
                    className={cn(
                      "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      "placeholder:text-muted-foreground focus-visible:outline-none",
                      "focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    )}
                    rows={3}
                    placeholder="Enter review comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                      disabled={!canSubmit}
                      onClick={() => handleDecision("approve")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      disabled={!canSubmit}
                      onClick={() => handleDecision("decline")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                  </div>
                </div>
              )}

              {/* Review Information — shown if reviewed */}
              {record.reviewedAt && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Review Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailRow label="Reviewed By" value={record.reviewerName} />
                    <DetailRow
                      label="Reviewed At"
                      value={new Date(record.reviewedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  </div>
                  {record.reviewComment && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground mb-1">Review Comment</p>
                      <p className="text-sm">{record.reviewComment}</p>
                    </div>
                  )}
                </div>
              )}

              {/* References */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  References
                </h4>
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <RefRow label="User ID" value={record.userId} />
                  <RefRow label="Document Number" value={record.documentNumber} />
                </div>
              </div>

              {/* Review History */}
              {record.reviewHistory.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Review History
                  </h4>
                  <div className="space-y-2">
                    {record.reviewHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-lg border border-border p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <StatusBadge
                            status={entry.action === "approved" ? "success" : "error"}
                          >
                            {entry.actionDisplay}
                          </StatusBadge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(entry.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">by {entry.reviewerName}</p>
                        <p className="text-sm">{entry.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
