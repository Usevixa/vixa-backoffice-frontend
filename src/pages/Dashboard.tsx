import {
  Users,
  ShieldCheck,
  Wallet,
  Bitcoin,
  Clock,
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

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          title="Total Wallet Balance"
          value="₦847.5M"
          change="+12.4% from last week"
          changeType="positive"
          icon={Wallet}
          iconColor="text-primary"
        />
        <MetricCard
          title="24h Crypto Volume"
          value="₦45.2M"
          change="-3.1% from yesterday"
          changeType="negative"
          icon={Bitcoin}
          iconColor="text-warning"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Pending Withdrawals"
          value="47"
          change="₦12.8M total value"
          changeType="neutral"
          icon={Clock}
          iconColor="text-warning"
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
          title="Revenue (Markup)"
          value="₦2.34M"
          change="+15.7% from last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-3">
        <AlertCard
          type="warning"
          title="5 Pending KYC Reviews"
          description="Users awaiting verification approval"
          action="Review"
          onAction={() => {}}
        />
        <AlertCard
          type="error"
          title="3 Failed Webhooks"
          description="Payment provider callbacks failed"
          action="Investigate"
          onAction={() => {}}
        />
        <AlertCard
          type="info"
          title="2 High-Risk Flags"
          description="Transactions requiring manual review"
          action="View"
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
