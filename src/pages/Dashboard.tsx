import { useState } from "react";
import {
  Users,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Clock,
  Activity,
  Zap,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardOverview } from "@/hooks/useDashboardQueries";
import { MoneyFlowItem } from "@/types/dashboard";

const durationLabels: Record<string, string> = {
  today: "Today",
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  all: "All Time",
};

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h2>
    </div>
  );
}

function moneyFlowChange(item: MoneyFlowItem, label: string): { change: string; changeType: "positive" | "negative" | "neutral" } {
  if (item.changePercent !== null) {
    const pct = Number(item.changePercent);
    return {
      change: pct >= 0 ? `+${pct.toFixed(1)}% from last period` : `${pct.toFixed(1)}% from last period`,
      changeType: pct > 0 ? "positive" : pct < 0 ? "negative" : "neutral",
    };
  }
  return {
    change: `${item.count} ${label}`,
    changeType: "neutral",
  };
}

export default function Dashboard() {
  const [duration, setDuration] = useState("24h");

  const { data, isLoading } = useDashboardOverview(duration);

  const moneyFlow = data?.moneyFlow;
  const health = data?.platformHealth;
  const alerts = data?.alerts;
  const volumeChart = data?.volumeChart ?? [];
  const recentTransactions = data?.recentTransactions ?? [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">
            VIXA platform overview — {durationLabels[duration]}
          </p>
        </div>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="24h">24h</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Row 1 — Primary Money Flow */}
      <div className="space-y-3">
        <SectionLabel icon={Activity} label="Money Flow" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Deposits Volume"
            value={moneyFlow ? `${Number(moneyFlow.deposits.volumeUsdt).toFixed(2)} USDT` : "—"}
            {...(moneyFlow ? moneyFlowChange(moneyFlow.deposits, "deposits") : { change: undefined, changeType: "neutral" })}
            icon={ArrowDownLeft}
            iconColor="text-success"
          />
          <MetricCard
            title="Withdrawals Volume"
            value={moneyFlow ? `${Number(moneyFlow.withdrawals.volumeUsdt).toFixed(2)} USDT` : "—"}
            {...(moneyFlow ? moneyFlowChange(moneyFlow.withdrawals, "withdrawals") : { change: undefined, changeType: "neutral" })}
            icon={ArrowUpRight}
            iconColor="text-primary"
          />
          <MetricCard
            title="Swaps Volume"
            value={moneyFlow ? `${Number(moneyFlow.swaps.volumeUsdt).toFixed(2)} USDT` : "—"}
            {...(moneyFlow ? moneyFlowChange(moneyFlow.swaps, "swaps") : { change: undefined, changeType: "neutral" })}
            icon={RefreshCw}
            iconColor="text-warning"
          />
          <MetricCard
            title="Markup Revenue"
            value={moneyFlow ? `${Number(moneyFlow.markupRevenue.volumeUsdt).toFixed(2)} USDT` : "—"}
            {...(moneyFlow ? moneyFlowChange(moneyFlow.markupRevenue, "transactions") : { change: undefined, changeType: "neutral" })}
            icon={TrendingUp}
            iconColor="text-success"
          />
        </div>
      </div>

      {/* KPI Row 2 — Platform Health */}
      <div className="space-y-3">
        <SectionLabel icon={Zap} label="Platform Health" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            title="Total Users"
            value={health ? String(health.totalUsers) : "—"}
            icon={Users}
          />
          <MetricCard
            title="Verified Users"
            value={health ? String(health.verifiedUsers) : "—"}
            change={health ? `${Number(health.verifiedRate).toFixed(1)}% verified` : undefined}
            changeType="neutral"
            icon={ShieldCheck}
            iconColor="text-success"
          />
          <MetricCard
            title="Total Wallet Value"
            value={health ? `${Number(health.totalWalletValueUsdt).toFixed(2)} USDT` : "—"}
            change="All coins equiv"
            changeType="neutral"
            icon={Wallet}
            iconColor="text-primary"
          />
          <MetricCard
            title="Failed Transactions"
            value={health ? String(health.failedTransactions24h) : "—"}
            change={health ? `${Number(health.failureRate24h).toFixed(1)}% failure rate` : undefined}
            changeType={health && health.failedTransactions24h > 0 ? "negative" : "neutral"}
            icon={AlertTriangle}
            iconColor="text-destructive"
          />
          <MetricCard
            title="Pending Withdrawals"
            value={health ? String(health.pendingWithdrawals) : "—"}
            change={health ? `${Number(health.pendingWithdrawalsUsdt).toFixed(2)} USDT queued` : undefined}
            changeType="neutral"
            icon={Clock}
            iconColor="text-warning"
          />
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <SectionLabel icon={AlertTriangle} label="Active Alerts" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {alerts ? (
            [alerts.withdrawalsStuck, alerts.webhookFailures, alerts.kycQueueBacklog, alerts.swapImbalance].map((alert) => (
              <AlertCard
                key={alert.key}
                type={alert.severity}
                title={alert.title}
                description={alert.description}
                action="Investigate"
                onAction={() => {}}
              />
            ))
          ) : (
            [
              { key: "withdrawals_stuck", title: "Withdrawals Stuck", description: "—", severity: "info" as const },
              { key: "webhook_failures", title: "Webhook Failures", description: "—", severity: "info" as const },
              { key: "kyc_queue", title: "KYC Queue", description: "—", severity: "info" as const },
              { key: "swap_imbalance", title: "Swap Imbalance", description: "—", severity: "info" as const },
            ].map((alert) => (
              <AlertCard
                key={alert.key}
                type={alert.severity}
                title={alert.title}
                description={alert.description}
                action="Investigate"
                onAction={() => {}}
              />
            ))
          )}
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="space-y-3">
        <SectionLabel icon={TrendingUp} label="Activity & Transactions" />
        <div className="grid gap-6 lg:grid-cols-2">
          <TransactionChart data={volumeChart} isLoading={isLoading} />
          <RecentTransactions data={recentTransactions} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
