import { useState } from "react";
import { Save, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const rateHistory = [
  { timestamp: "Dec 31, 2024 14:00", admin: "Admin User", change: "NGN/USDT markup: 2.0% → 2.5%", type: "stablecoin" },
  { timestamp: "Dec 31, 2024 10:30", admin: "Admin User", change: "NGN/USDC markup: 1.8% → 2.0%", type: "stablecoin" },
  { timestamp: "Dec 30, 2024 16:00", admin: "Super Admin", change: "Promo rate enabled", type: "promo" },
  { timestamp: "Dec 29, 2024 09:00", admin: "Admin User", change: "High volume band: 1.5% → 1.2%", type: "band" },
];

export default function Rates() {
  const [usdtMarkup, setUsdtMarkup] = useState("2.5");
  const [usdcMarkup, setUsdcMarkup] = useState("2.0");
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState("0.5");

  // Calculate effective rate
  const baseRate = 1015;
  const effectiveUsdtRate = baseRate * (1 + parseFloat(usdtMarkup) / 100);
  const effectiveUsdcRate = baseRate * (1 + parseFloat(usdcMarkup) / 100);

  // Check for negative spread
  const hasNegativeSpread = parseFloat(usdtMarkup) < 0 || parseFloat(usdcMarkup) < 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Rates & Markups</h1>
        <p className="page-description">
          Configure stablecoin rates and markup percentages
        </p>
      </div>

      <Tabs defaultValue="stablecoin" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stablecoin">Stablecoin Rates</TabsTrigger>
          <TabsTrigger value="bands">Transaction Bands</TabsTrigger>
          <TabsTrigger value="history">Change History</TabsTrigger>
        </TabsList>

        <TabsContent value="stablecoin" className="space-y-6">
          {/* Negative Spread Warning */}
          {hasNegativeSpread && (
            <div className="alert-card alert-card-error">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Negative spread detected
                </p>
                <p className="text-xs text-muted-foreground">
                  Current markup settings will result in a loss. Please adjust.
                </p>
              </div>
            </div>
          )}

          {/* Current Rates Display */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="metric-card">
              <p className="metric-label">Base Rate (Yellow Card)</p>
              <p className="metric-value mt-1">₦{baseRate.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Live from provider</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">USDT Markup</p>
              <p className="metric-value mt-1">{usdtMarkup}%</p>
              <p className="text-xs text-muted-foreground mt-1">Configurable</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">USDC Markup</p>
              <p className="metric-value mt-1">{usdcMarkup}%</p>
              <p className="text-xs text-muted-foreground mt-1">Configurable</p>
            </div>
            <div className="metric-card border-primary/30">
              <p className="metric-label">Effective USDT Rate</p>
              <p className="metric-value mt-1 text-primary">
                ₦{effectiveUsdtRate.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">What users pay</p>
            </div>
          </div>

          {/* Markup Configuration */}
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Stablecoin Markup Configuration</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="usdtMarkup">NGN/USDT Markup (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="usdtMarkup"
                    type="number"
                    step="0.1"
                    value={usdtMarkup}
                    onChange={(e) => setUsdtMarkup(e.target.value)}
                    className={cn("max-w-32", parseFloat(usdtMarkup) < 0 && "border-destructive")}
                  />
                  <span className="flex items-center text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Effective rate: ₦{effectiveUsdtRate.toFixed(2)}/USDT
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usdcMarkup">NGN/USDC Markup (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="usdcMarkup"
                    type="number"
                    step="0.1"
                    value={usdcMarkup}
                    onChange={(e) => setUsdcMarkup(e.target.value)}
                    className={cn("max-w-32", parseFloat(usdcMarkup) < 0 && "border-destructive")}
                  />
                  <span className="flex items-center text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Effective rate: ₦{effectiveUsdcRate.toFixed(2)}/USDC
                </p>
              </div>
            </div>

            {/* Promo Toggle */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Promotional Rate</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reduce markup during promotions
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={promoEnabled}
                    onCheckedChange={setPromoEnabled}
                  />
                  {promoEnabled && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={promoDiscount}
                        onChange={(e) => setPromoDiscount(e.target.value)}
                        className="w-20"
                      />
                      <span className="text-muted-foreground">% off</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button disabled={hasNegativeSpread}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bands" className="space-y-6">
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Transaction Band Markups</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Set different markup rates based on transaction volume
            </p>
            <div className="space-y-4">
              {[
                { band: "₦0 - ₦500,000", markup: "2.5" },
                { band: "₦500,001 - ₦2,000,000", markup: "2.0" },
                { band: "₦2,000,001 - ₦10,000,000", markup: "1.5" },
                { band: "₦10,000,001+", markup: "1.2" },
              ].map((tier, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">{tier.band}</p>
                    <p className="text-xs text-muted-foreground">Volume band</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      defaultValue={tier.markup}
                      className="w-20"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Band Rates
              </Button>
            </div>
          </div>
        </TabsContent>

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
                      <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-medium">
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
