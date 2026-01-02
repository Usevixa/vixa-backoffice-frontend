import { ArrowUpRight, ArrowDownLeft, Coins } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "TXN-001",
    user: "Chinedu O.",
    type: "outbound",
    amount: "₦250,000",
    provider: "OpenXSwitch",
    status: "completed",
    time: "2 mins ago",
  },
  {
    id: "TXN-002",
    user: "Amara E.",
    type: "stablecoin",
    amount: "175 USDT",
    provider: "Yellow Card",
    status: "completed",
    time: "5 mins ago",
  },
  {
    id: "TXN-003",
    user: "Ibrahim M.",
    type: "inbound",
    amount: "₦500,000",
    provider: "OpenXSwitch",
    status: "pending",
    time: "8 mins ago",
  },
  {
    id: "TXN-004",
    user: "Emeka N.",
    type: "stablecoin",
    amount: "1,180 USDT",
    provider: "Yellow Card",
    status: "failed",
    time: "15 mins ago",
  },
  {
    id: "TXN-005",
    user: "Ngozi O.",
    type: "outbound",
    amount: "₦320,000",
    provider: "OpenXSwitch",
    status: "completed",
    time: "22 mins ago",
  },
];

const typeIcons = {
  inbound: ArrowDownLeft,
  outbound: ArrowUpRight,
  stablecoin: Coins,
};

const typeLabels = {
  inbound: "Inbound",
  outbound: "Outbound",
  stablecoin: "Stablecoin",
};

export function RecentTransactions() {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Recent Transactions</h3>
        <a href="/transfers" className="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      <div className="divide-y divide-border">
        {transactions.map((tx) => {
          const Icon = typeIcons[tx.type as keyof typeof typeIcons];
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    tx.type === "inbound" && "bg-success/10 text-success",
                    tx.type === "outbound" && "bg-primary/10 text-primary",
                    tx.type === "stablecoin" && "bg-warning/10 text-warning"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{tx.user}</p>
                  <p className="text-xs text-muted-foreground">
                    {typeLabels[tx.type as keyof typeof typeLabels]} • {tx.provider}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{tx.amount}</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <StatusBadge
                    status={
                      tx.status === "completed"
                        ? "success"
                        : tx.status === "pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {tx.status}
                  </StatusBadge>
                  <span className="text-xs text-muted-foreground">{tx.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
