import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "neutral";
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "status-badge",
        status === "success" && "status-badge-success",
        status === "warning" && "status-badge-warning",
        status === "error" && "status-badge-error",
        status === "info" && "status-badge-info",
        status === "neutral" && "status-badge-neutral"
      )}
    >
      {children}
    </span>
  );
}
