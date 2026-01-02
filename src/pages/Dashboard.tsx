import {
  Users,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Overview of VIXA platform metrics and operations
        </p>
      </div>

      {/* KPI Cards - SEND / RECEIVE / SWAP */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="SEND Volume (24h)"
          value="₦85.2M"
          change="847 transfers"
          changeType="neutral"
          icon={ArrowUpRight}
          iconColor="text-primary"
        />
        <MetricCard
          title="RECEIVE Volume (24h)"
          value="₦60.0M"
          change="512 deposits"
          changeType="neutral"
          icon={ArrowDownLeft}
          iconColor="text-success"
        />
        <MetricCard
          title="SWAP Volume (24h)"
          value="₦42.5M"
          change="288 swaps"
          changeType="neutral"
          icon={RefreshCw}
          iconColor="text-warning"
        />
        <MetricCard
          title="Revenue (Markup)"
          value="₦2.34M"
          change="+15.7% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Users"
          value="12,847"
          change="+8.2% from last month"
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title="Verified Users"
          value="9,234"
          change="71.8% verification rate"
          changeType="neutral"
          icon={ShieldCheck}
          iconColor="text-success"
        />
        <MetricCard
          title="Failed Transfers (24h)"
          value="23"
          change="0.8% failure rate"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-destructive"
        />
        <MetricCard
          title="Pending Payouts"
          value="47"
          change="₦8.4M queued"
          changeType="neutral"
          icon={RefreshCw}
          iconColor="text-warning"
        />
      </div>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-4">
        <AlertCard
          type="error"
          title="3 Stuck Payouts"
          description="Payouts pending >30 mins"
          action="Investigate"
          onAction={() => {}}
        />
        <AlertCard
          type="warning"
          title="5 Webhook Failures"
          description="OpenXSwitch: 3, Yellow Card: 2"
          action="View Logs"
          onAction={() => {}}
        />
        <AlertCard
          type="info"
          title="2 High-Risk Users"
          description="Flagged for review"
          action="Review"
          onAction={() => {}}
        />
        <AlertCard
          type="warning"
          title="4 Recon Mismatches"
          description="Settlement exceptions found"
          action="Reconcile"
          onAction={() => {}}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TransactionChart />
        <RecentTransactions />
      </div>
    </div>
  );
}
