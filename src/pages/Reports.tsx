import { Download, Calendar, FileSpreadsheet, Users, ArrowLeftRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reportTypes = [
  {
    id: "users",
    name: "Users Report",
    description: "Export all user data including KYC status and wallet balances",
    icon: Users,
    lastGenerated: "Dec 31, 2024 10:00",
  },
  {
    id: "transfers",
    name: "Transfers Report",
    description: "Full transfer history with amounts, providers, and status",
    icon: ArrowLeftRight,
    lastGenerated: "Dec 31, 2024 09:30",
  },
  {
    id: "revenue",
    name: "Revenue Report",
    description: "Markup earnings, fees collected, and profit margins",
    icon: Wallet,
    lastGenerated: "Dec 30, 2024 18:00",
  },
  {
    id: "audit",
    name: "Audit Log",
    description: "All admin actions and system changes",
    icon: FileSpreadsheet,
    lastGenerated: "Dec 31, 2024 12:00",
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Reports & Exports</h1>
        <p className="page-description">
          Generate and download reports for analysis
        </p>
      </div>

      {/* Quick Export */}
      <div className="content-card p-6">
        <h3 className="content-card-title mb-4">Quick Export</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select defaultValue="transfers">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="transfers">Transfers</SelectItem>
                <SelectItem value="stablecoin">Stablecoin Ops</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="audit">Audit Log</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" className="w-40" defaultValue="2024-12-01" />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" className="w-40" defaultValue="2024-12-31" />
          </div>
          <div className="space-y-2">
            <Label>Format</Label>
            <Select defaultValue="csv">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <div key={report.id} className="content-card p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <report.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{report.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {report.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last generated: {report.lastGenerated}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-3 w-3" />
                Export
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <div className="content-card">
        <div className="content-card-header">
          <h3 className="content-card-title">Scheduled Reports</h3>
          <Button variant="outline" size="sm">
            Add Schedule
          </Button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Report</th>
              <th>Frequency</th>
              <th>Recipients</th>
              <th>Next Run</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">Daily Transfers Summary</td>
              <td>Daily at 6:00 AM</td>
              <td className="text-muted-foreground">admin@vixa.com, ops@vixa.com</td>
              <td className="text-muted-foreground">Jan 1, 2025 06:00</td>
              <td className="text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
            <tr>
              <td className="font-medium">Weekly Revenue Report</td>
              <td>Mondays at 9:00 AM</td>
              <td className="text-muted-foreground">finance@vixa.com</td>
              <td className="text-muted-foreground">Jan 6, 2025 09:00</td>
              <td className="text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
            <tr>
              <td className="font-medium">Monthly Audit Log</td>
              <td>1st of month at 12:00 AM</td>
              <td className="text-muted-foreground">compliance@vixa.com</td>
              <td className="text-muted-foreground">Feb 1, 2025 00:00</td>
              <td className="text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
