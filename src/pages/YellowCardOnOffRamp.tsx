import { useState } from "react";
import { Search, Filter, Zap, CheckCircle, AlertTriangle, Globe } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const depositRails = [
  { network: "Solana", asset: "USDT", depositAddress: "5Hg3...xY7k", status: "active", depositsToday: 142, volumeToday: "84,320 USDT" },
  { network: "Polygon", asset: "USDT", depositAddress: "0x4f2...3ac9", status: "active", depositsToday: 87, volumeToday: "51,200 USDT" },
  { network: "Ethereum", asset: "USDT", depositAddress: "0x9b1...de44", status: "active", depositsToday: 23, volumeToday: "28,900 USDT" },
  { network: "Tron", asset: "USDT", depositAddress: "TRqX...8Yk3", status: "active", depositsToday: 56, volumeToday: "34,750 USDT" },
  { network: "Solana", asset: "USDC", depositAddress: "8Bz1...mN2p", status: "active", depositsToday: 34, volumeToday: "18,400 USDT" },
  { network: "Polygon", asset: "USDC", depositAddress: "0x2a8...ff01", status: "degraded", depositsToday: 8, volumeToday: "4,200 USDT" },
];

const depositEvents = [
  { id: "YCD-001", network: "Solana", asset: "USDT", amountUsdt: "240.50 USDT", status: "credited", subWallet: "SUB-00142", ycRef: "YC-DEP-5523891", oxsCreditRef: "OXS-RCV-8847291", timestamp: "Dec 31, 2024 14:32" },
  { id: "YCD-002", network: "Polygon", asset: "USDC", amountUsdt: "175.00 USDT", status: "credited", subWallet: "SUB-00089", ycRef: "YC-DEP-5523890", oxsCreditRef: "OXS-RCV-5523891", timestamp: "Dec 31, 2024 13:45" },
  { id: "YCD-003", network: "Ethereum", asset: "USDT", amountUsdt: "490.00 USDT", status: "confirmed", subWallet: "SUB-00213", ycRef: "YC-DEP-9912345", oxsCreditRef: null, timestamp: "Dec 31, 2024 15:10" },
  { id: "YCD-004", network: "Tron", asset: "USDT", amountUsdt: "118.00 USDT", status: "failed", subWallet: null, ycRef: "YC-DEP-5231987", oxsCreditRef: null, timestamp: "Dec 31, 2024 10:22", failureReason: "Blacklisted address" },
  { id: "YCD-005", network: "Solana", asset: "USDC", amountUsdt: "305.00 USDT", status: "credited", subWallet: "SUB-00078", ycRef: "YC-DEP-5523880", oxsCreditRef: "OXS-RCV-5523880", timestamp: "Dec 30, 2024 16:45" },
];

const withdrawalEvents = [
  { id: "YCW-001", network: "Polygon", asset: "USDT", amountUsdt: "250.00 USDT", status: "confirmed", oxsSendRef: "OXS-SND-7841234", ycRef: "YC-WD-8847291", timestamp: "Dec 31, 2024 14:32" },
  { id: "YCW-002", network: "Solana", asset: "USDT", amountUsdt: "175.00 USDT", status: "processing", oxsSendRef: "OXS-SND-7841235", ycRef: "YC-WD-5523891", timestamp: "Dec 31, 2024 15:10" },
  { id: "YCW-003", network: "Ethereum", asset: "USDC", amountUsdt: "490.00 USDT", status: "requested", oxsSendRef: "OXS-SND-7841220", ycRef: "YC-WD-9912345", timestamp: "Dec 31, 2024 14:43" },
  { id: "YCW-004", network: "Tron", asset: "USDT", amountUsdt: "1,180.00 USDT", status: "failed", oxsSendRef: "OXS-SND-7841199", ycRef: "YC-WD-3312234", timestamp: "Dec 31, 2024 10:22", failureReason: "Network congestion timeout" },
  { id: "YCW-005", network: "Polygon", asset: "USDT", amountUsdt: "310.00 USDT", status: "confirmed", oxsSendRef: "OXS-SND-7841100", ycRef: "YC-WD-5523880", timestamp: "Dec 30, 2024 16:45" },
];

const depositStatusConfig = {
  detected: "neutral",
  confirmed: "info",
  credited: "success",
  failed: "error",
} as const;

const withdrawalStatusConfig = {
  requested: "neutral",
  processing: "warning",
  sent: "info",
  confirmed: "success",
  failed: "error",
} as const;

const networkColors: Record<string, string> = {
  Solana: "bg-success/10 text-success",
  Polygon: "bg-primary/10 text-primary",
  Ethereum: "bg-muted text-muted-foreground",
  Tron: "bg-warning/10 text-warning",
};

export default function YellowCardOnOffRamp() {
  const [activeDeposits] = useState(depositEvents.filter(e => e.status !== "failed" && e.status !== "credited").length);
  const [failedDeposits] = useState(depositEvents.filter(e => e.status === "failed").length);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Yellow Card On/Off-Ramp</h1>
        <p className="page-description">
          Network deposit rails and withdrawal bridging — Yellow Card generates deposit addresses and processes network payouts
        </p>
      </div>

      {/* Provider Status */}
      <div className="content-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-semibold">Yellow Card</p>
              <p className="text-xs text-muted-foreground">On/Off-Ramp · Network deposit rails + withdrawal bridging</p>
            </div>
          </div>
          <StatusBadge status="success">All Systems Operational</StatusBadge>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Active Networks</p>
            <p className="font-medium">4 (Solana, Polygon, ETH, Tron)</p>
          </div>
          <div>
            <p className="text-muted-foreground">Deposits Today</p>
            <p className="font-medium text-success">350 · 217,770 USDT</p>
          </div>
          <div>
            <p className="text-muted-foreground">Withdrawals Today</p>
            <p className="font-medium text-primary">198 · 124,500 USDT</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Deposit Confirm</p>
            <p className="font-medium">~45s</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="rails" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rails">Deposit Rails</TabsTrigger>
          <TabsTrigger value="deposits">Deposit Events</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal Events</TabsTrigger>
        </TabsList>

        {/* DEPOSIT RAILS */}
        <TabsContent value="rails" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <p className="metric-label">Active Rails</p>
              </div>
              <p className="metric-value mt-1 text-primary">{depositRails.filter(r => r.status === "active").length}</p>
            </div>
            <div className="metric-card border-warning/30">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="metric-label">Degraded</p>
              </div>
              <p className="metric-value mt-1 text-warning">{depositRails.filter(r => r.status === "degraded").length}</p>
            </div>
            <div className="metric-card border-success/30">
              <p className="metric-label">Total Volume Today</p>
              <p className="metric-value mt-1 text-success">221,770 USDT</p>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Network Deposit Addresses (Yellow Card Rails)</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Network</th>
                  <th>Asset</th>
                  <th>Deposit Address</th>
                  <th>Status</th>
                  <th>Deposits Today</th>
                  <th>Volume Today</th>
                </tr>
              </thead>
              <tbody>
                {depositRails.map((rail, i) => (
                  <tr key={i}>
                    <td>
                      <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", networkColors[rail.network] ?? "bg-muted text-muted-foreground")}>
                        {rail.network}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">{rail.asset}</span>
                    </td>
                    <td className="font-mono text-sm text-muted-foreground">{rail.depositAddress}</td>
                    <td>
                      <StatusBadge status={rail.status === "active" ? "success" : "warning"}>{rail.status}</StatusBadge>
                    </td>
                    <td className="font-medium">{rail.depositsToday}</td>
                    <td className="font-semibold text-success">{rail.volumeToday}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* DEPOSIT EVENTS */}
        <TabsContent value="deposits" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <p className="metric-label">Credited to OXS</p>
              </div>
              <p className="metric-value mt-1 text-success">{depositEvents.filter(e => e.status === "credited").length}</p>
            </div>
            <div className="metric-card border-warning/30">
              <p className="metric-label">Pending Credit</p>
              <p className="metric-value mt-1 text-warning">{activeDeposits}</p>
            </div>
            <div className="metric-card border-destructive/30">
              <p className="metric-label">Failed</p>
              <p className="metric-value mt-1 text-destructive">{failedDeposits}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search deposit event, YC ref, sub-wallet..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-36"><SelectValue placeholder="Network" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="tron">Tron</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="detected">Detected</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="credited">Credited</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>

          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Network</th>
                  <th>Asset</th>
                  <th>Amount (USDT)</th>
                  <th>Status</th>
                  <th>Linked Sub-wallet</th>
                  <th>YC Ref</th>
                  <th>OXS Credit Ref</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {depositEvents.map((evt) => (
                  <tr key={evt.id} className={cn(evt.status === "failed" && "bg-destructive/5")}>
                    <td className="font-mono text-sm font-medium text-success">{evt.id}</td>
                    <td>
                      <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", networkColors[evt.network] ?? "bg-muted text-muted-foreground")}>
                        {evt.network}
                      </span>
                    </td>
                    <td><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">{evt.asset}</span></td>
                    <td className="font-semibold text-success">{evt.amountUsdt}</td>
                    <td>
                      <StatusBadge status={depositStatusConfig[evt.status as keyof typeof depositStatusConfig] ?? "neutral"}>
                        {evt.status}
                      </StatusBadge>
                    </td>
                    <td className="font-mono text-sm text-primary">{evt.subWallet ?? "—"}</td>
                    <td className="font-mono text-xs text-muted-foreground">{evt.ycRef}</td>
                    <td className="font-mono text-xs text-muted-foreground">{evt.oxsCreditRef ?? "—"}</td>
                    <td className="text-muted-foreground text-sm">{evt.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* WITHDRAWAL EVENTS */}
        <TabsContent value="withdrawals" className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search withdrawal event, YC ref, OXS ref..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-36"><SelectValue placeholder="Network" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="tron">Tron</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>

          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Network Out</th>
                  <th>Asset</th>
                  <th>Amount (USDT)</th>
                  <th>Status</th>
                  <th>OXS Send Ref</th>
                  <th>YC Ref</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalEvents.map((evt) => (
                  <tr key={evt.id} className={cn(evt.status === "failed" && "bg-destructive/5")}>
                    <td className="font-mono text-sm font-medium text-primary">{evt.id}</td>
                    <td>
                      <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", networkColors[evt.network] ?? "bg-muted text-muted-foreground")}>
                        {evt.network}
                      </span>
                    </td>
                    <td><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">{evt.asset}</span></td>
                    <td className="font-semibold">{evt.amountUsdt}</td>
                    <td>
                      <StatusBadge status={withdrawalStatusConfig[evt.status as keyof typeof withdrawalStatusConfig] ?? "neutral"}>
                        {evt.status}
                      </StatusBadge>
                    </td>
                    <td className="font-mono text-xs text-muted-foreground">{evt.oxsSendRef}</td>
                    <td className="font-mono text-xs text-muted-foreground">{evt.ycRef}</td>
                    <td className="text-muted-foreground text-sm">{evt.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
