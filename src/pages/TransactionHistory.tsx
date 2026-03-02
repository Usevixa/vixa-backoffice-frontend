import { useState } from "react";
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, RefreshCw, Send, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

const allTransactions = [
  { id: "TXH-001", timestamp: "Dec 31, 2024 14:32", type: "Deposit", txType: "On-Ramp", userWallet: "Chinedu Okonkwo / SUB-00142", coinPair: "USDT", amountUsdt: "240.50 USDT", status: "completed", refs: "YC-DEP-001 / OXS-RCV-8847291" },
  { id: "TXH-002", timestamp: "Dec 31, 2024 14:32", type: "Send", txType: "On-Chain", userWallet: "Chinedu Okonkwo / SUB-00142", coinPair: "USDT", amountUsdt: "250.00 USDT", status: "confirmed", refs: "OXS-SND-7841234" },
  { id: "TXH-003", timestamp: "Dec 31, 2024 14:32", type: "Withdrawal", txType: "On-Chain", userWallet: "Chinedu Okonkwo / SUB-00142", coinPair: "USDT", amountUsdt: "250.00 USDT", status: "completed", refs: "WDR-001 / YC-WD-8847291" },
  { id: "TXH-004", timestamp: "Dec 31, 2024 14:32", type: "Swap", txType: "Internal", userWallet: "Chinedu Okonkwo / WAL-001", coinPair: "USDT → SOL", amountUsdt: "1,000.00 USDT", status: "completed", refs: "SWP-001 / OXS-RATE-8847291" },
  { id: "TXH-005", timestamp: "Dec 31, 2024 15:10", type: "Receive", txType: "On-Ramp", userWallet: "Amara Eze / SUB-00089", coinPair: "USDT", amountUsdt: "175.00 USDT", status: "credited", refs: "RCV-002 / OXS-RCV-5523891" },
  { id: "TXH-006", timestamp: "Dec 31, 2024 15:10", type: "Send", txType: "On-Ramp", userWallet: "Amara Eze / SUB-00089", coinPair: "USDT", amountUsdt: "175.00 USDT", status: "processing", refs: "SND-002 / OXS-SND-7841235" },
  { id: "TXH-007", timestamp: "Dec 31, 2024 14:43", type: "Send", txType: "On-Chain", userWallet: "Ibrahim Musa / SUB-00213", coinPair: "USDC", amountUsdt: "490.00 USDT", status: "failed", refs: "SND-003 / OXS-SND-7841220" },
  { id: "TXH-008", timestamp: "Dec 31, 2024 13:15", type: "Swap", txType: "Internal", userWallet: "Amara Eze / WAL-004", coinPair: "SOL → USDC", amountUsdt: "500.00 USDT", status: "completed", refs: "SWP-002 / OXS-RATE-5523891" },
  { id: "TXH-009", timestamp: "Dec 31, 2024 10:22", type: "Withdrawal", txType: "On-Chain", userWallet: "Emeka Nwosu / SUB-00301", coinPair: "USDT", amountUsdt: "1,180.00 USDT", status: "failed", refs: "WDR-004 / YC-WD-3312234" },
  { id: "TXH-010", timestamp: "Dec 31, 2024 10:22", type: "Send", txType: "Internal", userWallet: "Emeka Nwosu / SUB-00301", coinPair: "USDT", amountUsdt: "1,180.00 USDT", status: "confirmed", refs: "SND-004 / OXS-SND-7841199" },
  { id: "TXH-011", timestamp: "Dec 30, 2024 16:45", type: "Receive", txType: "On-Ramp", userWallet: "Ngozi Obi / SUB-00078", coinPair: "USDC", amountUsdt: "305.00 USDT", status: "credited", refs: "RCV-005 / OXS-RCV-5523880" },
  { id: "TXH-012", timestamp: "Dec 30, 2024 16:45", type: "Deposit", txType: "On-Ramp", userWallet: "Ngozi Obi / SUB-00078", coinPair: "USDT", amountUsdt: "310.00 USDT", status: "completed", refs: "DEP-005 / YC-DEP-004" },
];

const typeIcons: Record<string, typeof ArrowDownLeft> = {
  Deposit: ArrowDownLeft,
  Withdrawal: ArrowUpRight,
  Swap: RefreshCw,
  Send: Send,
  Receive: Inbox,
};

const typeColors: Record<string, string> = {
  Deposit: "bg-success/10 text-success",
  Withdrawal: "bg-primary/10 text-primary",
  Swap: "bg-warning/10 text-warning",
  Send: "bg-primary/10 text-primary",
  Receive: "bg-success/10 text-success",
};

const txTypeColors: Record<string, string> = {
  "On-Chain": "bg-primary/10 text-primary",
  "On-Ramp": "bg-success/10 text-success",
  "Internal": "bg-muted text-muted-foreground",
};

export default function TransactionHistory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Transaction History</h1>
          <p className="page-description">
            Unified view of all deposits, withdrawals, sends, receives, and swaps — USDT reporting
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search user, wallet, tx hash, OXS ref, YC ref..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="send">Send</SelectItem>
            <SelectItem value="receive">Receive</SelectItem>
            <SelectItem value="swap">Swap</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tx Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tx Types</SelectItem>
            <SelectItem value="on-chain">On-Chain</SelectItem>
            <SelectItem value="on-ramp">On-Ramp</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="credited">Credited</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Coin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Coins</SelectItem>
            <SelectItem value="usdt">USDT</SelectItem>
            <SelectItem value="usdc">USDC</SelectItem>
            <SelectItem value="sol">SOL</SelectItem>
            <SelectItem value="eth">ETH</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-40" />
        <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
      </div>

      {/* Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Transaction Type</th>
              <th>User / Sub-wallet</th>
              <th>Coin / Pair</th>
              <th>Amount (USDT equiv)</th>
              <th>Status</th>
              <th>Reference IDs</th>
            </tr>
          </thead>
          <tbody>
            {allTransactions.map((tx) => {
              const Icon = typeIcons[tx.type] || ArrowDownLeft;
              const statusMap: Record<string, string> = {
                completed: "success",
                confirmed: "success",
                credited: "success",
                processing: "warning",
                pending: "warning",
                failed: "error",
              };
              return (
                <tr key={tx.id} className={cn("cursor-pointer", tx.status === "failed" && "bg-destructive/5")}>
                  <td className="text-muted-foreground text-sm">{tx.timestamp}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={cn("flex h-7 w-7 items-center justify-center rounded-full", typeColors[tx.type])}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium">{tx.type}</span>
                    </div>
                  </td>
                  <td>
                    <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", txTypeColors[tx.txType])}>
                      {tx.txType}
                    </span>
                  </td>
                  <td>
                    <p className="text-sm font-medium">{tx.userWallet}</p>
                  </td>
                  <td className="font-medium text-sm">{tx.coinPair}</td>
                  <td className="font-semibold">{tx.amountUsdt}</td>
                  <td>
                    <StatusBadge status={(statusMap[tx.status] || "neutral") as any}>
                      {tx.status}
                    </StatusBadge>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">{tx.refs}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
