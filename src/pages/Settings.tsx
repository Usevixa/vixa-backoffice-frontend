import { Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-description">Configure platform features, user profiling, reporting, and operational thresholds</p>
      </div>

      <Tabs defaultValue="reporting" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="profiling">User Profiling</TabsTrigger>
          <TabsTrigger value="features">Feature Toggles</TabsTrigger>
          <TabsTrigger value="thresholds">Alert Thresholds</TabsTrigger>
        </TabsList>

        {/* REPORTING CONFIGURATION */}
        <TabsContent value="reporting" className="space-y-6">
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Reporting Configuration</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <Label>Base Reporting Currency</Label>
                  <p className="text-xs text-muted-foreground mt-1">All KPIs, summaries, and dashboards report in this currency</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary/10 text-primary">USDT</span>
                  <span className="text-xs text-muted-foreground">(locked)</span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Fiat Display Mode</p>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <Label>Show Fiat Secondary Values</Label>
                    <p className="text-xs text-muted-foreground mt-1">Display local fiat equivalent below USDT amounts (e.g., ~ ₦249,890)</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <Label>Hide Fiat Values Completely</Label>
                    <p className="text-xs text-muted-foreground mt-1">Show only USDT amounts — no local fiat context</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Default Dashboard Duration</Label>
                <Input defaultValue="24h" className="w-40" />
                <p className="text-xs text-muted-foreground">Options: today, 24h, 7d, 30d, 90d, all</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* USER PROFILING */}
        <TabsContent value="profiling" className="space-y-6">
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">User Tiers</h3>
            <div className="space-y-4">
              {[
                { tier: "Standard", desc: "New users, unverified or basic KYC", withdrawalLimit: "500 USDT/day" },
                { tier: "Verified", desc: "Full KYC passed, verification score ≥80%", withdrawalLimit: "5,000 USDT/day" },
                { tier: "High Value", desc: "Verified + volume >10,000 USDT monthly", withdrawalLimit: "50,000 USDT/day" },
              ].map((t) => (
                <div key={t.tier} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-semibold">{t.tier}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Withdrawal Limit</p>
                      <Input defaultValue={t.withdrawalLimit} className="w-40 text-right" />
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Risk Level Mapping Rules</h3>
            <div className="space-y-4">
              {[
                { rule: "Failed withdrawals ≥ 3 in 24h", result: "→ Set risk: Medium" },
                { rule: "Transaction volume > 10,000 USDT in 24h", result: "→ Set risk: High" },
                { rule: "KYC verification score < 50%", result: "→ Set risk: Medium" },
                { rule: "Rapid swaps > 5 in 30 mins", result: "→ Flag for review" },
              ].map((rule, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-sm">{rule.rule}</p>
                    <p className="text-xs text-muted-foreground">{rule.result}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* FEATURE TOGGLES */}
        <TabsContent value="features" className="space-y-6">
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Core Primitive Toggles</h3>
            <div className="space-y-6">
              {[
                { label: "Deposits Enabled", desc: "Allow value to enter VIXA wallets via all channels" },
                { label: "Withdrawals Enabled", desc: "Allow value to leave VIXA wallets to destination addresses" },
                { label: "Swaps Enabled", desc: "Allow internal coin-to-coin conversions" },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between">
                  <div><Label>{t.label}</Label><p className="text-xs text-muted-foreground mt-1">{t.desc}</p></div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Provider Toggles</h3>
            <div className="space-y-6">
              {[
                { label: "OpenXSwitch Enabled", desc: "Fiat payout routing and settlement execution" },
                { label: "Yellow Card Enabled", desc: "Stablecoin rails and conversion confirmations" },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between">
                  <div><Label>{t.label}</Label><p className="text-xs text-muted-foreground mt-1">{t.desc}</p></div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
          <div className="content-card p-6 border-warning/30">
            <h3 className="content-card-title mb-6">Operational Mode Toggles</h3>
            <div className="space-y-6">
              {[
                { label: "Maintenance Mode", desc: "Pauses all user operations. Admins only.", default: false },
                { label: "Manual Review Mode for Withdrawals", desc: "All withdrawals queued for manual approval", default: false },
                { label: "Auto-Retry Failed Withdrawals", desc: "Automatically retry failed withdrawals up to 3x", default: true },
                { label: "Allow Receive-Only When User Frozen", desc: "Frozen wallets can still receive deposits", default: true },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between">
                  <div><Label>{t.label}</Label><p className="text-xs text-muted-foreground mt-1">{t.desc}</p></div>
                  <Switch defaultChecked={t.default} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ALERT THRESHOLDS */}
        <TabsContent value="thresholds" className="space-y-6">
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">SLA Queue Thresholds (Minutes)</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-success">🟢 Green (On Track)</Label>
                <Input type="number" defaultValue="10" />
                <p className="text-xs text-muted-foreground">Withdrawal age under this = green</p>
              </div>
              <div className="space-y-2">
                <Label className="text-warning">🟡 Amber (At Risk)</Label>
                <Input type="number" defaultValue="30" />
                <p className="text-xs text-muted-foreground">Withdrawal age under this = amber</p>
              </div>
              <div className="space-y-2">
                <Label className="text-destructive">🔴 Red (SLA Breach)</Label>
                <Input type="number" defaultValue="30" />
                <p className="text-xs text-muted-foreground">Withdrawal age above amber = red</p>
              </div>
            </div>
          </div>
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Alert Thresholds</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { label: "Withdrawal Stuck Threshold (mins)", value: "30" },
                { label: "Webhook Failure Spike (count/hour)", value: "10" },
                { label: "Success Rate Drop Alert (%)", value: "95" },
                { label: "Swap Imbalance Threshold (count)", value: "3" },
                { label: "High Value Deposit Alert (USDT)", value: "5000" },
                { label: "Reconciliation Variance Alert (USDT)", value: "100" },
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <Label>{field.label}</Label>
                  <Input type="number" defaultValue={field.value} />
                </div>
              ))}
            </div>
          </div>
          <div className="content-card p-6 border-warning/30">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="content-card-title">Maintenance Mode</h3>
                <p className="text-sm text-muted-foreground mt-1">When enabled, all user operations will be paused. Only admins can access the platform.</p>
                <div className="mt-4 flex items-center gap-4">
                  <Switch />
                  <span className="text-sm text-muted-foreground">Currently: Off</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button><Save className="mr-2 h-4 w-4" />Save All Settings</Button>
      </div>
    </div>
  );
}
