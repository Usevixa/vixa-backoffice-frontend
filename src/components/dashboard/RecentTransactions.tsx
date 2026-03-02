import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "TXN-001",
    user: "Chinedu O.",
    type: "send",
    amount: "245.50 USDT",
    provider: "OpenXSwitch",
    status: "completed",
    time: "2 mins ago",
  },
  {
    id: "TXN-002",
    user: "Amara E.",
    type: "swap",
    amount: "175 USDT",
    provider: "Yellow Card",
    status: "completed",
    time: "5 mins ago",
  },
  {
    id: "TXN-003",
    user: "Ibrahim M.",
    type: "receive",
    amount: "490.00 USDT",
    provider: "OpenXSwitch",
    status: "pending",
    time: "8 mins ago",
  },
  {
    id: "TXN-004",
    user: "Emeka N.",
    type: "swap",
    amount: "1,180 USDT",
    provider: "Yellow Card",
    status: "failed",
    time: "15 mins ago",
  },
  {
    id: "TXN-005",
    user: "Ngozi O.",
    type: "send",
    amount: "310.00 USDT",
    provider: "OpenXSwitch",
    status: "completed",
    time: "22 mins ago",
  },
];

const typeIcons = {
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  swap: RefreshCw,
};

const typeLabels = {
  send: "SEND",
  receive: "RECEIVE",
  swap: "SWAP",
};

export function RecentTransactions() {
  return (
    <div className="content-card flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="content-card-title">Recent Transactions</h3>
        <a href="/transfers" className="text-xs font-medium text-primary hover:underline">
          View all →
        </a>
      </div>
      <div className="divide-y divide-border flex-1">
        {transactions.map((tx) => {
          const Icon = typeIcons[tx.type as keyof typeof typeIcons];
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0",
                    tx.type === "receive" && "bg-success/10 text-success",
                    tx.type === "send" && "bg-primary/10 text-primary",
                    tx.type === "swap" && "bg-warning/10 text-warning"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tx.user}</p>
                  <p className="text-xs text-muted-foreground">
                    {typeLabels[tx.type as keyof typeof typeLabels]} · {tx.provider}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-sm font-semibold text-foreground">{tx.amount}</p>
                <div className="flex items-center justify-end gap-2 mt-0.5">
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
                  <span className="text-[11px] text-muted-foreground">{tx.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
