import { useState } from "react";
import { Save, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const rateHistory = [
  { timestamp: "Dec 31, 2024 14:00", admin: "Admin User", change: "Deposit USDT markup: 2.0% → 2.5%", type: "deposit" },
  { timestamp: "Dec 31, 2024 10:30", admin: "Admin User", change: "Withdrawal USDC markup: 1.8% → 2.0%", type: "withdrawal" },
  { timestamp: "Dec 30, 2024 09:00", admin: "Super Admin", change: "Withdrawal high volume band: 1.5% → 1.2%", type: "withdrawal" },
  { timestamp: "Dec 29, 2024 16:00", admin: "Admin User", change: "Deposit band rate updated (₦500k–₦2M): 2.0% → 1.8%", type: "deposit" },
];

export default function Rates() {
  const [depositMarkupUsdt, setDepositMarkupUsdt] = useState("2.5");
  const [depositMarkupUsdc, setDepositMarkupUsdc] = useState("2.0");
  const [withdrawalMarkupUsdt, setWithdrawalMarkupUsdt] = useState("2.0");
  const [withdrawalMarkupUsdc, setWithdrawalMarkupUsdc] = useState("1.8");
  const [previewAmount, setPreviewAmount] = useState("100000");

  const baseRate = 1015;
  const effectiveDepositUsdt = baseRate * (1 + parseFloat(depositMarkupUsdt) / 100);
  const effectiveDepositUsdc = baseRate * (1 + parseFloat(depositMarkupUsdc) / 100);
  const effectiveWithdrawalUsdt = baseRate * (1 - parseFloat(withdrawalMarkupUsdt) / 100);

  const hasNegativeSpread = [depositMarkupUsdt, depositMarkupUsdc, withdrawalMarkupUsdt, withdrawalMarkupUsdc].some(v => parseFloat(v) < 0);

  const previewNgn = parseFloat(previewAmount) || 0;
  const previewUsdt = (previewNgn / effectiveDepositUsdt).toFixed(4);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Rates & Markups</h1>
        <p className="page-description">
          Configure deposit and withdrawal pricing — markups applied to Yellow Card base rates
        </p>
      </div>

      {hasNegativeSpread && (
        <div className="alert-card alert-card-error">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Negative spread detected</p>
            <p className="text-xs text-muted-foreground">Current markup settings will result in a loss. Please adjust.</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="deposits" className="space-y-6">
        <TabsList>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="history">Change History</TabsTrigger>
        </TabsList>

        {/* DEPOSITS TAB */}
        <TabsContent value="deposits" className="space-y-6">
          {/* Live Rate */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="metric-card">
              <p className="metric-label">Base Rate (Yellow Card)</p>
              <p className="metric-value mt-1">₦{baseRate.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Live from provider</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Deposit USDT Markup</p>
              <p className="metric-value mt-1">{depositMarkupUsdt}%</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Deposit USDC Markup</p>
              <p className="metric-value mt-1">{depositMarkupUsdc}%</p>
            </div>
            <div className="metric-card border-primary/30">
              <p className="metric-label">Effective USDT Rate (User Pays)</p>
              <p className="metric-value mt-1 text-primary">₦{effectiveDepositUsdt.toFixed(2)}</p>
            </div>
          </div>

          {/* Markup Config */}
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Deposit Markup Configuration</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>NGN/USDT Deposit Markup (%)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={depositMarkupUsdt}
                    onChange={(e) => setDepositMarkupUsdt(e.target.value)}
                    className={cn("max-w-32", parseFloat(depositMarkupUsdt) < 0 && "border-destructive")}
                  />
                  <span className="flex items-center text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">User pays ₦{effectiveDepositUsdt.toFixed(2)} per USDT deposited</p>
              </div>
              <div className="space-y-2">
                <Label>NGN/USDC Deposit Markup (%)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={depositMarkupUsdc}
                    onChange={(e) => setDepositMarkupUsdc(e.target.value)}
                    className={cn("max-w-32", parseFloat(depositMarkupUsdc) < 0 && "border-destructive")}
                  />
                  <span className="flex items-center text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">User pays ₦{effectiveDepositUsdc.toFixed(2)} per USDC deposited</p>
              </div>
            </div>

            {/* Effective Rate Preview */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-semibold mb-4">Effective Rate Preview</h4>
              <div className="flex items-end gap-4">
                <div className="space-y-2">
                  <Label>NGN Amount</Label>
                  <Input
                    type="number"
                    value={previewAmount}
                    onChange={(e) => setPreviewAmount(e.target.value)}
                    className="w-40"
                    placeholder="100000"
                  />
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-xs text-muted-foreground">User receives (USDT)</p>
                  <p className="text-xl font-bold text-primary">{previewUsdt} USDT</p>
                  <p className="text-xs text-muted-foreground mt-1">at ₦{effectiveDepositUsdt.toFixed(2)}/USDT</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button disabled={hasNegativeSpread}>
                <Save className="mr-2 h-4 w-4" />
                Save Deposit Rates
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* WITHDRAWALS TAB */}
        <TabsContent value="withdrawals" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="metric-card">
              <p className="metric-label">Base Rate (Yellow Card)</p>
              <p className="metric-value mt-1">₦{baseRate.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Live from provider</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Withdrawal USDT Markup</p>
              <p className="metric-value mt-1">{withdrawalMarkupUsdt}%</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Withdrawal USDC Markup</p>
              <p className="metric-value mt-1">{withdrawalMarkupUsdc}%</p>
            </div>
            <div className="metric-card border-primary/30">
              <p className="metric-label">Effective USDT Rate (User Gets)</p>
              <p className="metric-value mt-1 text-primary">₦{effectiveWithdrawalUsdt.toFixed(2)}</p>
            </div>
          </div>

          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Withdrawal Markup Configuration</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>USDT/NGN Withdrawal Markup (%)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={withdrawalMarkupUsdt}
                    onChange={(e) => setWithdrawalMarkupUsdt(e.target.value)}
                    className={cn("max-w-32", parseFloat(withdrawalMarkupUsdt) < 0 && "border-destructive")}
                  />
                  <span className="flex items-center text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">User receives ₦{effectiveWithdrawalUsdt.toFixed(2)} per USDT withdrawn</p>
              </div>
              <div className="space-y-2">
                <Label>USDC/NGN Withdrawal Markup (%)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={withdrawalMarkupUsdc}
                    onChange={(e) => setWithdrawalMarkupUsdc(e.target.value)}
                    className={cn("max-w-32", parseFloat(withdrawalMarkupUsdc) < 0 && "border-destructive")}
                  />
                  <span className="flex items-center text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            {/* Volume Bands */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-semibold mb-4">Volume-Based Markup Bands</h4>
              <div className="space-y-3">
                {[
                  { band: "₦0 – ₦500,000", markup: "2.0" },
                  { band: "₦500,001 – ₦2,000,000", markup: "1.8" },
                  { band: "₦2,000,001 – ₦10,000,000", markup: "1.5" },
                  { band: "₦10,000,001+", markup: "1.2" },
                ].map((tier, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">{tier.band}</p>
                      <p className="text-xs text-muted-foreground">Withdrawal volume band</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" step="0.1" defaultValue={tier.markup} className="w-20" />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button disabled={hasNegativeSpread}>
                <Save className="mr-2 h-4 w-4" />
                Save Withdrawal Rates
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* HISTORY TAB */}
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
                        entry.type === "deposit" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
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
