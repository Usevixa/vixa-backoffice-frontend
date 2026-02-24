import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
}: MetricCardProps) {
  // Derive background tint from iconColor
  const iconBgMap: Record<string, string> = {
    "text-primary": "bg-primary/8",
    "text-success": "bg-success/8",
    "text-warning": "bg-warning/8",
    "text-destructive": "bg-destructive/8",
  };
  const iconBg = iconBgMap[iconColor] || "bg-primary/8";

  return (
    <div className="group metric-card relative overflow-hidden">
      {/* Subtle top accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-[2px] opacity-60 transition-opacity group-hover:opacity-100",
          iconColor === "text-success" && "bg-success",
          iconColor === "text-primary" && "bg-primary",
          iconColor === "text-warning" && "bg-warning",
          iconColor === "text-destructive" && "bg-destructive",
          !["text-success", "text-primary", "text-warning", "text-destructive"].includes(iconColor) && "bg-primary"
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="metric-label">{title}</p>
          <p className="metric-value mt-1.5">{value}</p>
          {change && (
            <div className="mt-2.5 flex items-center gap-1.5">
              {changeType === "positive" && (
                <TrendingUp className="h-3 w-3 flex-shrink-0 text-metric-positive" />
              )}
              {changeType === "negative" && (
                <TrendingDown className="h-3 w-3 flex-shrink-0 text-metric-negative" />
              )}
              <span
                className={cn(
                  "text-xs font-medium leading-tight",
                  changeType === "positive" && "text-metric-positive",
                  changeType === "negative" && "text-metric-negative",
                  changeType === "neutral" && "text-metric-neutral"
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={cn("flex-shrink-0 rounded-xl p-2.5", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}
