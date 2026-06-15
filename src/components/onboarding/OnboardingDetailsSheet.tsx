import React from "react";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useOnboardingUserDetail } from "@/hooks/useOnboardingQueries";
import { OnboardingStageStep } from "@/types/onboarding";

interface OnboardingDetailsSheetProps {
  phoneNumber: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm break-all">{value ?? "—"}</p>
    </div>
  );
}

function FailureDetails({ raw }: { raw: string }) {
  let parsed: {
    message?: string;
    statusCode?: number;
    status?: number;
    error?: string;
  } | null = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }

  if (!parsed) {
    return <p className="text-xs text-muted-foreground font-mono break-all">{raw}</p>;
  }

  const statusCode = parsed.statusCode ?? parsed.status;
  return (
    <div className="space-y-2">
      {parsed.message && (
        <div>
          <p className="text-xs text-muted-foreground">Error Message</p>
          <p className="text-sm font-medium text-destructive">{parsed.message}</p>
        </div>
      )}
      {statusCode != null && (
        <div>
          <p className="text-xs text-muted-foreground">Status Code</p>
          <p className="text-sm font-medium">{statusCode}</p>
        </div>
      )}
      {parsed.error && (
        <div>
          <p className="text-xs text-muted-foreground">Error Type</p>
          <p className="text-sm font-medium font-mono">{parsed.error}</p>
        </div>
      )}
    </div>
  );
}

function formatTs(ts: string): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StageTimelineStep({
  step,
  index,
  total,
  isCurrentStage,
}: {
  step: OnboardingStageStep;
  index: number;
  total: number;
  isCurrentStage: boolean;
}) {
  const isCompleted = step.status === "Completed";
  const isFailed = step.status === "Failed";

  return (
    <div className="relative pb-5 last:pb-0">
      {/* Connecting line to next step */}
      {index < total - 1 && (
        <div className="absolute left-3 top-6 bottom-0 w-px bg-border" />
      )}

      <div className="flex items-start gap-3">
        {/* Status circle */}
        <div
          className={cn(
            "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10",
            isFailed
              ? "bg-destructive text-destructive-foreground"
              : isCompleted
              ? "bg-success text-success-foreground"
              : isCurrentStage
              ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-background ring-offset-2"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isFailed ? "✗" : isCompleted ? "✓" : index + 1}
        </div>

        {/* Stage content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-sm font-medium",
                isFailed
                  ? "text-destructive"
                  : isCompleted
                  ? "text-foreground"
                  : isCurrentStage
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {step.stage}
            </span>
            {isCurrentStage && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium leading-none">
                Current
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-0.5">
            {step.occurredAt ? formatTs(step.occurredAt) : "Not reached yet"}
          </p>

          {/* Expandable failure reason */}
          {isFailed && step.failureReason && (
            <Accordion type="single" collapsible className="mt-2">
              <AccordionItem
                value="failure"
                className="border border-destructive/30 rounded-md overflow-hidden"
              >
                <AccordionTrigger className="px-3 py-2 text-xs text-destructive font-medium hover:no-underline hover:bg-destructive/5">
                  View Failure Details
                </AccordionTrigger>
                <AccordionContent className="px-3">
                  <FailureDetails raw={step.failureReason} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}

export function OnboardingDetailsSheet({ phoneNumber, open, onOpenChange }: OnboardingDetailsSheetProps) {
  const { data: detail, isLoading } = useOnboardingUserDetail(phoneNumber, open && !!phoneNumber);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Onboarding Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !detail ? (
            <p className="text-sm text-muted-foreground">No onboarding data available.</p>
          ) : (
            <div className="space-y-6">
              {/* Summary card */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-base">{detail.fullName ?? "Unknown"}</p>
                    <p className="text-sm text-muted-foreground font-mono">{detail.phoneNumber}</p>
                    {detail.email && (
                      <p className="text-xs text-muted-foreground mt-0.5">{detail.email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Current Stage</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {detail.stage}
                    </span>
                  </div>
                </div>
                {detail.hasOptedOut && (
                  <div className="flex items-center gap-2 text-xs text-destructive font-medium pt-1 border-t border-border">
                    <span className="h-2 w-2 rounded-full bg-destructive inline-block" />
                    Opted out of reminders
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  User Info
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Full Name" value={detail.fullName} />
                  <DetailRow
                    label="Phone Number"
                    value={<span className="font-mono">{detail.phoneNumber}</span>}
                  />
                  <DetailRow label="Email" value={detail.email} />
                  <DetailRow
                    label="User ID"
                    value={
                      detail.userId ? (
                        <span className="font-mono text-xs">{detail.userId}</span>
                      ) : null
                    }
                  />
                  <DetailRow label="Onboarding Status" value={detail.onboardingStatus} />
                  <DetailRow label="Hours Stuck" value={`${detail.hoursStuck}h`} />
                  <DetailRow label="Reminder Count" value={detail.reminderCount} />
                  <DetailRow label="Opted Out" value={detail.hasOptedOut ? "Yes" : "No"} />
                  <DetailRow
                    label="Started At"
                    value={formatTs(detail.createdAt)}
                  />
                  {detail.lastReminderSentAt && (
                    <DetailRow
                      label="Last Reminder Sent"
                      value={formatTs(detail.lastReminderSentAt)}
                    />
                  )}
                </div>
              </div>

              {/* Stage Timeline */}
              {detail.stageTimeline && detail.stageTimeline.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Stage Timeline
                  </h4>
                  <div>
                    {detail.stageTimeline.map((step, i) => (
                      <StageTimelineStep
                        key={i}
                        step={step}
                        index={i}
                        total={detail.stageTimeline.length}
                        isCurrentStage={step.stage === detail.stage && step.status !== "Completed"}
                      />
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
