import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  title: string;
  description: string;
  type: "warning" | "error" | "info";
  action?: string;
  onAction?: () => void;
}

export function AlertCard({ title, description, type, action, onAction }: AlertCardProps) {
  const icons = {
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "alert-card",
        type === "warning" && "alert-card-warning",
        type === "error" && "alert-card-error",
        type === "info" && "alert-card-info"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 flex-shrink-0",
          type === "warning" && "text-warning",
          type === "error" && "text-destructive",
          type === "info" && "text-primary"
        )}
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-xs font-medium text-primary hover:underline"
        >
          {action}
        </button>
      )}
    </div>
  );
}
