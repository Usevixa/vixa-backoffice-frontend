import { useState } from "react";
import { Save, AlertTriangle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const rateHistory = [
  { timestamp: "Dec 31, 2024 14:00", admin: "John Adeyemi", change: "Deposit USDT markup: 2.0% → 2.5%", type: "deposit" },
  { timestamp: "Dec 31, 2024 10:30", admin: "John Adeyemi", change: "Withdrawal USDT markup: 1.8% → 2.0%", type: "withdrawal" },
  { timestamp: "Dec 30, 2024 09:00", admin: "Super Admin", change: "Swap markup: 0.25% → 0.30%", type: "swap" },
  { timestamp: "Dec 29, 2024 16:00", admin: "Sarah Okafor", change: "Deposit USDT markup: 1.8% → 2.0%", type: "deposit" },
];

export default function Rates() {
  const [depositMarkup, setDepositMarkup] = useState("2.5");
  const [withdrawalMarkup, setWithdrawalMarkup] = useState("2.0");
  const [swapMarkup, setSwapMarkup] = useState("0.30");

  // Deposit: user sends X USDT, we apply markup on top
  const baseRate = 1.000; // 1 USDT = 1 USDT (it's already stablecoin)
  const depositFeeRate = parseFloat(depositMarkup) / 100 || 0;
  const withdrawalFeeRate = parseFloat(withdrawalMarkup) / 100 || 0;

  const [depositPreviewAmount, setDepositPreviewAmount] = useState("500");
  const [withdrawalPreviewAmount, setWithdrawalPreviewAmount] = useState("500");

  const depositFee = (parseFloat(depositPreviewAmount) || 0) * depositFeeRate;
  const depositCredited = (parseFloat(depositPreviewAmount) || 0) - depositFee;

  const withdrawalFee = (parseFloat(withdrawalPreviewAmount) || 0) * withdrawalFeeRate;
  const withdrawalDelivered = (parseFloat(withdrawalPreviewAmount) || 0) - withdrawalFee;

  const hasNegativeSpread = [depositMarkup, withdrawalMarkup, swapMarkup].some(v => parseFloat(v) < 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Rates & Markups</h1>
        <p className="page-description">
          Configure USDT deposit and withdrawal fees, and coin-to-coin swap spread
        </p>
      </div>

      {hasNegativeSpread && (
        <div className="alert-card alert-card-error">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Negative spread detected</p>
            <p className="text-xs text-muted-foreground">Current markup settings will result in a loss. Please adjust before saving.</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="deposits" className="space-y-6">
        <TabsList>
          <TabsTrigger value="deposits">Deposits (USDT)</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals (USDT)</TabsTrigger>
          <TabsTrigger value="swaps">Swaps</TabsTrigger>
          <TabsTrigger value="history">Change History</TabsTrigger>
        </TabsList>

        {/* ── DEPOSITS TAB ── */}
        <TabsContent value="deposits" className="space-y-6">
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3">
            <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary">
              Deposit asset: <strong>USDT only</strong> · Network: <strong>Solana</strong> via Yellow Card.
              The markup is applied as a fee deducted from the deposited amount before crediting to the sub-wallet.
            </p>
          </div>

          {/* KPI row */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <p className="metric-label">Base Rate (YC Pass-through)</p>
              <p className="metric-value mt-1">1.000 USDT</p>
              <p className="text-xs text-muted-foreground mt-1">1:1 stablecoin, live from Yellow Card</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Current Deposit Markup</p>
              <p className="metric-value mt-1 text-primary">{depositMarkup}%</p>
            </div>
            <div className="metric-card border-success/30">
              <p className="metric-label">Effective (User Pays 500 USDT, Gets)</p>
              <p className="metric-value mt-1 text-success">
                {(500 * (1 - (parseFloat(depositMarkup) / 100))).toFixed(2)} USDT
              </p>
            </div>
          </div>

          {/* Config */}
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Deposit Markup Configuration</h3>
            <div className="max-w-xs space-y-2">
              <Label>USDT Deposit Markup (%)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={depositMarkup}
                  onChange={(e) => setDepositMarkup(e.target.value)}
                  className={cn("max-w-32", parseFloat(depositMarkup) < 0 && "border-destructive")}
                />
                <span className="flex items-center text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Fee deducted before crediting to sub-wallet</p>
            </div>

            {/* Preview Widget */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-semibold mb-4">Effective Rate Preview</h4>
              <div className="flex items-end gap-4">
                <div className="space-y-2">
                  <Label>User Deposits (USDT)</Label>
                  <Input
                    type="number"
                    value={depositPreviewAmount}
                    onChange={(e) => setDepositPreviewAmount(e.target.value)}
                    className="w-36"
                    placeholder="500"
                  />
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-xs text-muted-foreground">Fee charged</p>
                  <p className="text-lg font-bold text-destructive">{depositFee.toFixed(4)} USDT</p>
                  <p className="text-xs text-muted-foreground mt-2">Sub-wallet credited</p>
                  <p className="text-xl font-bold text-success">{depositCredited.toFixed(4)} USDT</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button disabled={hasNegativeSpread}>
                <Save className="mr-2 h-4 w-4" />
                Save Deposit Markup
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-right mt-2">Changes logged to Audit Trail</p>
          </div>
        </TabsContent>

        {/* ── WITHDRAWALS TAB ── */}
        <TabsContent value="withdrawals" className="space-y-6">
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3">
            <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary">
              Withdrawal asset: <strong>USDT only</strong> · Network: <strong>Polygon</strong> via Yellow Card.
              The markup is deducted from the withdrawal amount before sending to the destination address.
            </p>
          </div>

          {/* KPI row */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <p className="metric-label">Base Rate (YC Pass-through)</p>
              <p className="metric-value mt-1">1.000 USDT</p>
              <p className="text-xs text-muted-foreground mt-1">1:1 stablecoin, live from Yellow Card</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Current Withdrawal Markup</p>
              <p className="metric-value mt-1 text-primary">{withdrawalMarkup}%</p>
            </div>
            <div className="metric-card border-success/30">
              <p className="metric-label">Effective (User Withdraws 500 USDT, Gets)</p>
              <p className="metric-value mt-1 text-success">
                {(500 * (1 - (parseFloat(withdrawalMarkup) / 100))).toFixed(2)} USDT
              </p>
            </div>
          </div>

          {/* Config */}
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Withdrawal Markup Configuration</h3>
            <div className="max-w-xs space-y-2">
              <Label>USDT Withdrawal Markup (%)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={withdrawalMarkup}
                  onChange={(e) => setWithdrawalMarkup(e.target.value)}
                  className={cn("max-w-32", parseFloat(withdrawalMarkup) < 0 && "border-destructive")}
                />
                <span className="flex items-center text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Fee deducted before sending to destination</p>
            </div>

            {/* Preview Widget */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-semibold mb-4">Effective Rate Preview</h4>
              <div className="flex items-end gap-4">
                <div className="space-y-2">
                  <Label>User Withdraws (USDT)</Label>
                  <Input
                    type="number"
                    value={withdrawalPreviewAmount}
                    onChange={(e) => setWithdrawalPreviewAmount(e.target.value)}
                    className="w-36"
                    placeholder="500"
                  />
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-xs text-muted-foreground">Fee charged</p>
                  <p className="text-lg font-bold text-destructive">{withdrawalFee.toFixed(4)} USDT</p>
                  <p className="text-xs text-muted-foreground mt-2">Delivered to destination</p>
                  <p className="text-xl font-bold text-success">{withdrawalDelivered.toFixed(4)} USDT</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button disabled={hasNegativeSpread}>
                <Save className="mr-2 h-4 w-4" />
                Save Withdrawal Markup
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-right mt-2">Changes logged to Audit Trail</p>
          </div>
        </TabsContent>

        {/* ── SWAPS TAB ── */}
        <TabsContent value="swaps" className="space-y-6">
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-start gap-3">
            <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary">
              Swap spread applies to all <strong>coin-to-coin swaps</strong> (USDT → SOL, ETH → USDC, etc.) executed via OpenXSwitch.
              The spread is the markup retained by VIXA on each swap quote.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <p className="metric-label">Swap Spread (Current)</p>
              <p className="metric-value mt-1 text-primary">{swapMarkup}%</p>
              <p className="text-xs text-muted-foreground mt-1">Applied to all coin pairs</p>
            </div>
            <div className="metric-card border-success/30">
              <p className="metric-label">Example: 1,000 USDT → SOL</p>
              <p className="metric-value mt-1 text-success">
                {(1000 * (1 - parseFloat(swapMarkup) / 100)).toFixed(2)} USDT effective
              </p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Swap Revenue (24h)</p>
              <p className="metric-value mt-1">12.48 USDT</p>
            </div>
          </div>

          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Swap Spread Configuration</h3>
            <div className="max-w-xs space-y-2">
              <Label>Coin-to-Coin Swap Spread (%)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={swapMarkup}
                  onChange={(e) => setSwapMarkup(e.target.value)}
                  className={cn("max-w-32", parseFloat(swapMarkup) < 0 && "border-destructive")}
                />
                <span className="flex items-center text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Applies uniformly to all swap pairs on OpenXSwitch</p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button disabled={parseFloat(swapMarkup) < 0}>
                <Save className="mr-2 h-4 w-4" />
                Save Swap Spread
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-right mt-2">Changes logged to Audit Trail</p>
          </div>
        </TabsContent>

        {/* ── CHANGE HISTORY TAB ── */}
        <TabsContent value="history" className="space-y-4">
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Rate Change History</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin</th>
                  <th>Change</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {rateHistory.map((entry, index) => (
                  <tr key={index}>
                    <td className="text-muted-foreground">{entry.timestamp}</td>
                    <td className="font-medium">{entry.admin}</td>
                    <td>{entry.change}</td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                        entry.type === "deposit" ? "bg-success/10 text-success" :
                        entry.type === "withdrawal" ? "bg-primary/10 text-primary" :
                        "bg-warning/10 text-warning"
                      )}>
                        {entry.type}
                      </span>
                    </td>
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
