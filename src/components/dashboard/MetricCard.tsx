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
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-label">{title}</p>
          <p className="metric-value mt-1">{value}</p>
          {change && (
            <div className="mt-2 flex items-center gap-1">
              {changeType === "positive" && (
                <TrendingUp className="h-3 w-3 text-metric-positive" />
              )}
              {changeType === "negative" && (
                <TrendingDown className="h-3 w-3 text-metric-negative" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
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
        <div className={cn("rounded-lg bg-primary/10 p-2.5", iconColor.replace("text-", "bg-").replace("-500", "/10"))}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}
