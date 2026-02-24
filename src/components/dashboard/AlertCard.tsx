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
        "alert-card group transition-all duration-200 hover:shadow-sm",
        type === "warning" && "alert-card-warning",
        type === "error" && "alert-card-error",
        type === "info" && "alert-card-info"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
          type === "warning" && "bg-warning/15",
          type === "error" && "bg-destructive/15",
          type === "info" && "bg-primary/15"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4",
            type === "warning" && "text-warning",
            type === "error" && "text-destructive",
            type === "info" && "text-primary"
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {action && (
        <button
          onClick={onAction}
          className={cn(
            "flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors",
            type === "error" && "text-destructive bg-destructive/10 hover:bg-destructive/20",
            type === "warning" && "text-warning bg-warning/10 hover:bg-warning/20",
            type === "info" && "text-primary bg-primary/10 hover:bg-primary/20"
          )}
        >
          {action}
        </button>
      )}
    </div>
  );
}
