import { ArrowUpRight, ArrowDownLeft, Gift, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "TXN-001",
    user: "Chinedu Okonkwo",
    type: "buy",
    amount: "₦250,000",
    crypto: "245.50 USDT",
    status: "completed",
    time: "2 mins ago",
  },
  {
    id: "TXN-002",
    user: "Amara Eze",
    type: "sell",
    amount: "₦180,000",
    crypto: "175.00 USDT",
    status: "completed",
    time: "5 mins ago",
  },
  {
    id: "TXN-003",
    user: "Ibrahim Musa",
    type: "withdrawal",
    amount: "₦500,000",
    crypto: "",
    status: "pending",
    time: "8 mins ago",
  },
  {
    id: "TXN-004",
    user: "Folake Adeyemi",
    type: "gift_card",
    amount: "₦75,000",
    crypto: "$50 Amazon",
    status: "completed",
    time: "12 mins ago",
  },
  {
    id: "TXN-005",
    user: "Emeka Nwosu",
    type: "buy",
    amount: "₦1,200,000",
    crypto: "1,180.00 USDT",
    status: "failed",
    time: "15 mins ago",
  },
];

const typeIcons = {
  buy: ArrowDownLeft,
  sell: ArrowUpRight,
  withdrawal: Banknote,
  gift_card: Gift,
};

const typeLabels = {
  buy: "Buy Crypto",
  sell: "Sell Crypto",
  withdrawal: "Withdrawal",
  gift_card: "Gift Card",
};

export function RecentTransactions() {
  return (
    <div className="content-card">
      <div className="content-card-header">
        <h3 className="content-card-title">Recent Transactions</h3>
        <a href="/transactions" className="text-xs font-medium text-primary hover:underline">
          View all
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const Icon = typeIcons[tx.type as keyof typeof typeIcons];
              return (
                <tr key={tx.id} className="cursor-pointer">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          tx.type === "buy" && "bg-primary/10 text-primary",
                          tx.type === "sell" && "bg-success/10 text-success",
                          tx.type === "withdrawal" && "bg-warning/10 text-warning",
                          tx.type === "gift_card" && "bg-purple-100 text-purple-600"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {typeLabels[tx.type as keyof typeof typeLabels]}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{tx.user}</td>
                  <td>
                    <div>
                      <p className="font-medium">{tx.amount}</p>
                      {tx.crypto && (
                        <p className="text-xs text-muted-foreground">{tx.crypto}</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={cn(
                        "status-badge",
                        tx.status === "completed" && "status-badge-success",
                        tx.status === "pending" && "status-badge-warning",
                        tx.status === "failed" && "status-badge-error"
                      )}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{tx.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
