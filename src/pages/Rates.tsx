import { useState } from "react";
import { Save, History, ToggleLeft, ToggleRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const rateHistory = [
  { timestamp: "Dec 31, 2024 14:00", admin: "Admin User", change: "Crypto markup: 2.0% → 2.5%", type: "crypto" },
  { timestamp: "Dec 31, 2024 10:30", admin: "Admin User", change: "Amazon rate: ₦1,450 → ₦1,500", type: "gift_card" },
  { timestamp: "Dec 30, 2024 16:00", admin: "Super Admin", change: "Promo rate enabled", type: "promo" },
  { timestamp: "Dec 29, 2024 09:00", admin: "Admin User", change: "Steam rate: ₦1,300 → ₦1,350", type: "gift_card" },
];

export default function Rates() {
  const [cryptoMarkup, setCryptoMarkup] = useState("2.5");
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState("0.5");

  const [giftCardRates, setGiftCardRates] = useState({
    amazon: "1500",
    itunes: "1400",
    steam: "1350",
    googlePlay: "1450",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Rates & Markups</h1>
        <p className="page-description">
          Configure exchange rates and markup percentages
        </p>
      </div>

      <Tabs defaultValue="crypto" className="space-y-6">
        <TabsList>
          <TabsTrigger value="crypto">Crypto Rates</TabsTrigger>
          <TabsTrigger value="gift_cards">Gift Card Rates</TabsTrigger>
          <TabsTrigger value="history">Change History</TabsTrigger>
        </TabsList>

        <TabsContent value="crypto" className="space-y-6">
          {/* Current Rates Display */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="metric-card">
              <p className="metric-label">Base Rate (Quidax)</p>
              <p className="metric-value mt-1">₦1,015.00</p>
              <p className="text-xs text-muted-foreground mt-1">Live from provider</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Admin Markup</p>
              <p className="metric-value mt-1">{cryptoMarkup}%</p>
              <p className="text-xs text-muted-foreground mt-1">Configurable</p>
            </div>
            <div className="metric-card border-primary/30">
              <p className="metric-label">Effective User Rate</p>
              <p className="metric-value mt-1 text-primary">
                ₦{(1015 * (1 + parseFloat(cryptoMarkup) / 100)).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">What users pay</p>
            </div>
          </div>

          {/* Markup Configuration */}
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Crypto Markup Configuration</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="buyMarkup">Buy Markup (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="buyMarkup"
                    type="number"
                    step="0.1"
                    value={cryptoMarkup}
                    onChange={(e) => setCryptoMarkup(e.target.value)}
                    className="max-w-32"
                  />
                  <span className="flex items-center text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Added to base rate for buy orders
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellMarkup">Sell Markup (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="sellMarkup"
                    type="number"
                    step="0.1"
                    defaultValue="1.5"
                    className="max-w-32"
                  />
                  <span className="flex items-center text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Subtracted from base rate for sell orders
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
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gift_cards" className="space-y-6">
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Gift Card Rates (NGN per $1)</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amazonRate">Amazon</Label>
                <div className="flex gap-2">
                  <span className="flex items-center text-muted-foreground">₦</span>
                  <Input
                    id="amazonRate"
                    type="number"
                    value={giftCardRates.amazon}
                    onChange={(e) =>
                      setGiftCardRates({ ...giftCardRates, amazon: e.target.value })
                    }
                    className="max-w-32"
                  />
                  <span className="flex items-center text-muted-foreground">/ $1</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="itunesRate">iTunes</Label>
                <div className="flex gap-2">
                  <span className="flex items-center text-muted-foreground">₦</span>
                  <Input
                    id="itunesRate"
                    type="number"
                    value={giftCardRates.itunes}
                    onChange={(e) =>
                      setGiftCardRates({ ...giftCardRates, itunes: e.target.value })
                    }
                    className="max-w-32"
                  />
                  <span className="flex items-center text-muted-foreground">/ $1</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="steamRate">Steam</Label>
                <div className="flex gap-2">
                  <span className="flex items-center text-muted-foreground">₦</span>
                  <Input
                    id="steamRate"
                    type="number"
                    value={giftCardRates.steam}
                    onChange={(e) =>
                      setGiftCardRates({ ...giftCardRates, steam: e.target.value })
                    }
                    className="max-w-32"
                  />
                  <span className="flex items-center text-muted-foreground">/ $1</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="googleRate">Google Play</Label>
                <div className="flex gap-2">
                  <span className="flex items-center text-muted-foreground">₦</span>
                  <Input
                    id="googleRate"
                    type="number"
                    value={giftCardRates.googlePlay}
                    onChange={(e) =>
                      setGiftCardRates({ ...giftCardRates, googlePlay: e.target.value })
                    }
                    className="max-w-32"
                  />
                  <span className="flex items-center text-muted-foreground">/ $1</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
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
                        {entry.type.replace("_", " ")}
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
