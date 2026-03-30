export interface MoneyFlowItem {
  volumeUsdt: number;
  count: number;
  changePercent: number | null;
}

export interface MoneyFlow {
  deposits: MoneyFlowItem;
  withdrawals: MoneyFlowItem;
  swaps: MoneyFlowItem;
  markupRevenue: MoneyFlowItem;
}

export interface PlatformHealth {
  totalUsers: number;
  verifiedUsers: number;
  verifiedRate: number;
  totalWalletValueUsdt: number;
  activeWallets: number;
  failedTransactions24h: number;
  failureRate24h: number;
  pendingWithdrawals: number;
  pendingWithdrawalsUsdt: number;
}

export interface DashboardAlert {
  key: string;
  title: string;
  count: number;
  description: string;
  severity: "info" | "warning" | "error";
}

export interface DashboardAlerts {
  withdrawalsStuck: DashboardAlert;
  webhookFailures: DashboardAlert;
  kycQueueBacklog: DashboardAlert;
  swapImbalance: DashboardAlert;
}

export interface VolumeChartPoint {
  date: string;
  sendVolume: number;
  receiveVolume: number;
  swapVolume: number;
}

export interface DashboardRecentTx {
  id: number;
  reference: string;
  userFullName: string;
  userId: string;
  type: string;
  coin: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface DashboardOverview {
  moneyFlow: MoneyFlow;
  platformHealth: PlatformHealth;
  alerts: DashboardAlerts;
  volumeChart: VolumeChartPoint[];
  recentTransactions: DashboardRecentTx[];
}
