import { Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
        <p className="page-description">
          Configure platform features and operational settings
        </p>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Feature Toggles</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Crypto Trading</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable/disable buy and sell crypto functionality
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Gift Card Redemption</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allow users to submit gift cards for redemption
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Bank Withdrawals</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable withdrawals to bank accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Voice Commands</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Process voice messages via WhatsApp
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>New User Registration</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allow new users to create accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Payment Providers</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Paystack</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Primary payment gateway for deposits
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Flutterwave</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Secondary payment gateway and transfers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Crypto Providers</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Quidax</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Primary crypto exchange provider
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>YellowCard</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Secondary/fallback crypto provider
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="content-card p-6">
            <h3 className="content-card-title mb-6">Alert Thresholds</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>High Value Transaction Alert (NGN)</Label>
                <Input type="number" defaultValue="5000000" />
                <p className="text-xs text-muted-foreground">
                  Alert when transaction exceeds this amount
                </p>
              </div>
              <div className="space-y-2">
                <Label>Daily Volume Alert (NGN)</Label>
                <Input type="number" defaultValue="50000000" />
                <p className="text-xs text-muted-foreground">
                  Alert when daily volume exceeds this amount
                </p>
              </div>
              <div className="space-y-2">
                <Label>Failed Transaction Threshold</Label>
                <Input type="number" defaultValue="10" />
                <p className="text-xs text-muted-foreground">
                  Alert when failures exceed this count per hour
                </p>
              </div>
              <div className="space-y-2">
                <Label>Webhook Failure Threshold</Label>
                <Input type="number" defaultValue="5" />
                <p className="text-xs text-muted-foreground">
                  Alert when webhook failures exceed this count
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="content-card p-6 border-warning/30">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="content-card-title">Maintenance Mode</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When enabled, all user operations will be paused. Only admins can access the platform.
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <Switch />
                  <span className="text-sm text-muted-foreground">Currently: Off</span>
                </div>
              </div>
            </div>
          </div>

          <div className="content-card p-6">
            <h3 className="content-card-title mb-4">Maintenance Message</h3>
            <Input
              defaultValue="We're currently performing scheduled maintenance. Please try again later."
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Message displayed to users during maintenance
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
