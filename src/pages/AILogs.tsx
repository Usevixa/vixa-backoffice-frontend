import { Search, Filter, MessageSquare, Mic, AlertTriangle, HelpCircle } from "lucide-react";
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

const logs = [
  {
    id: "LOG-001",
    user: "Chinedu Okonkwo",
    userId: "USR-001",
    type: "text",
    message: "I want to buy 500 dollars worth of USDT",
    intent: "buy_crypto",
    confidence: 98,
    response: "Initiated buy order for $500 USDT at current rate ₦1,018/USDT",
    status: "success",
    timestamp: "Dec 31, 2024 14:32",
  },
  {
    id: "LOG-002",
    user: "Amara Eze",
    userId: "USR-002",
    type: "voice",
    message: "[Voice] How much is my wallet balance?",
    intent: "check_balance",
    confidence: 95,
    response: "Your NGN wallet balance is ₦890,000 and USDT balance is 875.00",
    status: "success",
    timestamp: "Dec 31, 2024 13:45",
  },
  {
    id: "LOG-003",
    user: "Ibrahim Musa",
    userId: "USR-003",
    type: "text",
    message: "withdraw money to my bank",
    intent: "withdrawal",
    confidence: 92,
    response: "Please confirm the amount you wish to withdraw to Access Bank •••5678",
    status: "success",
    timestamp: "Dec 31, 2024 12:18",
  },
  {
    id: "LOG-004",
    user: "Folake Adeyemi",
    userId: "USR-004",
    type: "voice",
    message: "[Voice] unintelligible audio",
    intent: "unknown",
    confidence: 23,
    response: "GPT Fallback: I'm sorry, I didn't understand that. Could you please repeat?",
    status: "fallback",
    timestamp: "Dec 31, 2024 11:05",
  },
  {
    id: "LOG-005",
    user: "Emeka Nwosu",
    userId: "USR-005",
    type: "text",
    message: "asdfghjkl",
    intent: "unknown",
    confidence: 5,
    response: "Error: Unable to process request",
    status: "error",
    timestamp: "Dec 31, 2024 10:22",
  },
  {
    id: "LOG-006",
    user: "Ngozi Obi",
    userId: "USR-006",
    type: "text",
    message: "Help me understand how to sell crypto",
    intent: "help",
    confidence: 97,
    response: "Provided step-by-step guide for selling crypto",
    status: "success",
    timestamp: "Dec 31, 2024 09:15",
  },
];

const intentIcons: Record<string, React.ReactNode> = {
  buy_crypto: <span className="text-primary">Buy</span>,
  sell_crypto: <span className="text-success">Sell</span>,
  check_balance: <span className="text-blue-600">Balance</span>,
  withdrawal: <span className="text-warning">Withdraw</span>,
  help: <span className="text-purple-600">Help</span>,
  unknown: <span className="text-muted-foreground">Unknown</span>,
};

export default function AILogs() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">AI & WhatsApp Logs</h1>
        <p className="page-description">
          Monitor conversation intelligence and AI interactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="metric-label">Total Messages (24h)</p>
          <p className="metric-value mt-1">2,847</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Voice Messages</p>
          <p className="metric-value mt-1">412</p>
          <p className="text-xs text-muted-foreground mt-1">14.5% of total</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">GPT Fallbacks</p>
          <p className="metric-value mt-1">89</p>
          <p className="text-xs text-muted-foreground mt-1">3.1% of messages</p>
        </div>
        <div className="metric-card border-destructive/30">
          <p className="metric-label">Errors</p>
          <p className="metric-value mt-1 text-destructive">12</p>
          <p className="text-xs text-muted-foreground mt-1">0.4% error rate</p>
        </div>
      </div>

      {/* Intent Distribution */}
      <div className="content-card p-5">
        <h3 className="content-card-title mb-4">Intent Distribution (24h)</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { intent: "Buy Crypto", count: 892, color: "bg-primary" },
            { intent: "Sell Crypto", count: 654, color: "bg-success" },
            { intent: "Check Balance", count: 523, color: "bg-blue-500" },
            { intent: "Withdrawal", count: 421, color: "bg-warning" },
            { intent: "Help", count: 245, color: "bg-purple-500" },
            { intent: "Unknown", count: 112, color: "bg-muted-foreground" },
          ].map((item) => (
            <div key={item.intent} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", item.color)} />
              <span className="text-sm text-muted-foreground">
                {item.intent}: <span className="font-medium text-foreground">{item.count}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="voice">Voice</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Intent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Intents</SelectItem>
            <SelectItem value="buy_crypto">Buy Crypto</SelectItem>
            <SelectItem value="sell_crypto">Sell Crypto</SelectItem>
            <SelectItem value="check_balance">Check Balance</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="help">Help</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="fallback">Fallback</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Logs Table */}
      <div className="content-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>User</th>
              <th>Message</th>
              <th>Intent</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className={cn(
                  log.status === "error" && "bg-destructive/5",
                  log.status === "fallback" && "bg-warning/5"
                )}
              >
                <td>
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      log.type === "text" ? "bg-primary/10" : "bg-purple-100"
                    )}
                  >
                    {log.type === "text" ? (
                      <MessageSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Mic className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                </td>
                <td>
                  <div>
                    <p className="font-medium">{log.user}</p>
                    <p className="text-xs text-muted-foreground">{log.userId}</p>
                  </div>
                </td>
                <td className="max-w-xs">
                  <p className="truncate text-sm">{log.message}</p>
                  <p className="truncate text-xs text-muted-foreground">{log.response}</p>
                </td>
                <td>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-medium">
                    {intentIcons[log.intent] || log.intent}
                  </span>
                </td>
                <td>
                  <span
                    className={cn(
                      "font-medium",
                      log.confidence >= 80
                        ? "text-success"
                        : log.confidence >= 50
                        ? "text-warning"
                        : "text-destructive"
                    )}
                  >
                    {log.confidence}%
                  </span>
                </td>
                <td>
                  <StatusBadge
                    status={
                      log.status === "success"
                        ? "success"
                        : log.status === "fallback"
                        ? "warning"
                        : "error"
                    }
                  >
                    {log.status}
                  </StatusBadge>
                </td>
                <td className="text-muted-foreground text-sm">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
