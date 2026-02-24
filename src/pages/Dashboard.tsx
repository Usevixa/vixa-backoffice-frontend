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

export default function Dashboard() {
  const [duration, setDuration] = useState("24h");

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
            value="83,420 USDT"
            change="512 deposits"
            changeType="neutral"
            icon={ArrowDownLeft}
            iconColor="text-success"
          />
          <MetricCard
            title="Withdrawals Volume"
            value="71,050 USDT"
            change="847 withdrawals"
            changeType="neutral"
            icon={ArrowUpRight}
            iconColor="text-primary"
          />
          <MetricCard
            title="Swaps Volume"
            value="41,750 USDT"
            change="288 swaps"
            changeType="neutral"
            icon={RefreshCw}
            iconColor="text-warning"
          />
          <MetricCard
            title="Markup Revenue"
            value="2,340 USDT"
            change="+15.7% from last period"
            changeType="positive"
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
            value="12,847"
            change="+8.2% this period"
            changeType="positive"
            icon={Users}
          />
          <MetricCard
            title="Verified Users"
            value="9,234"
            change="71.8% rate"
            changeType="neutral"
            icon={ShieldCheck}
            iconColor="text-success"
          />
          <MetricCard
            title="Total Wallet Value"
            value="650,215 USDT"
            change="All coins equiv"
            changeType="neutral"
            icon={Wallet}
            iconColor="text-primary"
          />
          <MetricCard
            title="Failed Transactions"
            value="23"
            change="0.8% failure rate"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="text-destructive"
          />
          <MetricCard
            title="Pending Withdrawals"
            value="47"
            change="8,400 USDT queued"
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
          <AlertCard
            type="error"
            title="3 Withdrawals Stuck"
            description="Pending >30 min — SLA breach"
            action="Investigate"
            onAction={() => {}}
          />
          <AlertCard
            type="warning"
            title="5 Webhook Failures"
            description="Yellow Card: 3, OpenXSwitch: 2"
            action="View Logs"
            onAction={() => {}}
          />
          <AlertCard
            type="info"
            title="KYC Queue Backlog"
            description="8 pending reviews"
            action="Review"
            onAction={() => {}}
          />
          <AlertCard
            type="warning"
            title="Swap Imbalance"
            description="2 debits without matching credits"
            action="Reconcile"
            onAction={() => {}}
          />
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="space-y-3">
        <SectionLabel icon={TrendingUp} label="Activity & Transactions" />
        <div className="grid gap-6 lg:grid-cols-2">
          <TransactionChart />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
