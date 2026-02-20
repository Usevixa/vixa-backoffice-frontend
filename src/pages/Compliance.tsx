import { useState } from "react";
import { Search, Filter, CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const kycRequests = [
  { id: "KYC-001", user: "Tolu Bakare", userId: "USR-010", submittedAt: "Dec 31, 2024 14:30", status: "pending", documents: { bvn: "22345678901", nin: "12345678901", idType: "National ID", idNumber: "A12345678" }, verifyMeResult: null },
  { id: "KYC-002", user: "Blessing Udo", userId: "USR-011", submittedAt: "Dec 31, 2024 12:15", status: "pending", documents: { bvn: "22345678902", nin: "12345678902", idType: "Voter's Card", idNumber: "VIN123456789" }, verifyMeResult: { match: true, confidence: 94 } },
  { id: "KYC-003", user: "Uche Ogbu", userId: "USR-012", submittedAt: "Dec 31, 2024 10:45", status: "flagged", documents: { bvn: "22345678903", nin: "12345678903", idType: "Driver's License", idNumber: "DL789456123" }, verifyMeResult: { match: false, confidence: 42, reason: "Name mismatch detected" } },
  { id: "KYC-004", user: "Kemi Afolabi", userId: "USR-013", submittedAt: "Dec 30, 2024 16:20", status: "verified", documents: { bvn: "22345678904", nin: "12345678904", idType: "International Passport", idNumber: "B12345678" }, verifyMeResult: { match: true, confidence: 99 } },
];

const riskFlags = [
  { id: "RISK-001", user: "Anonymous User", userId: "USR-099", type: "high_volume", description: "Unusual transaction volume — ₦15M in 24 hours", createdAt: "Dec 31, 2024 13:00", status: "open" },
  { id: "RISK-002", user: "Ibrahim Musa", userId: "USR-003", type: "frozen_account", description: "Account frozen due to suspicious activity patterns", createdAt: "Dec 29, 2024 10:00", status: "reviewing" },
];

const txFlags = [
  { id: "TXF-001", type: "Large Withdrawal", linkedEntity: "WDR-004", severity: "high", status: "open", createdAt: "Dec 31, 2024 10:22", description: "Withdrawal >10,000 USDT flagged for review" },
  { id: "TXF-002", type: "Rapid Swaps", linkedEntity: "USR-005", severity: "medium", status: "open", createdAt: "Dec 31, 2024 11:00", description: "5 swaps within 30 minutes from same user" },
  { id: "TXF-003", type: "Repeated Failures", linkedEntity: "WDR-004", severity: "low", status: "dismissed", createdAt: "Dec 31, 2024 10:30", description: "3 consecutive failed withdrawals" },
];

const severityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
};

export default function Compliance() {
  const [selectedKyc, setSelectedKyc] = useState<typeof kycRequests[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pendingCount = kycRequests.filter(k => k.status === "pending").length;
  const flaggedCount = kycRequests.filter(k => k.status === "flagged").length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Compliance & Risk</h1>
        <p className="page-description">Review KYC submissions, manage risk flags, and investigate transaction anomalies</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card"><p className="metric-label">Pending KYC Reviews</p><p className="metric-value mt-1">{pendingCount}</p></div>
        <div className="metric-card border-warning/30"><p className="metric-label">Flagged KYC</p><p className="metric-value mt-1 text-warning">{flaggedCount}</p></div>
        <div className="metric-card"><p className="metric-label">Verified Today</p><p className="metric-value mt-1">23</p></div>
        <div className="metric-card border-destructive/30"><p className="metric-label">Open Risk Flags</p><p className="metric-value mt-1 text-destructive">{riskFlags.filter(r => r.status === "open").length + txFlags.filter(t => t.status === "open").length}</p></div>
      </div>

      <Tabs defaultValue="kyc" className="space-y-6">
        <TabsList>
          <TabsTrigger value="kyc">KYC Reviews</TabsTrigger>
          <TabsTrigger value="risks">Risk Flags</TabsTrigger>
          <TabsTrigger value="txflags">Transaction Flags</TabsTrigger>
        </TabsList>

        <TabsContent value="kyc" className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search by user or KYC ID..." className="pl-9" />
            </div>
            <Select defaultValue="pending"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="flagged">Flagged</SelectItem><SelectItem value="verified">Verified</SelectItem></SelectContent></Select>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>
          <div className="content-card">
            <table className="data-table">
              <thead><tr><th>KYC ID</th><th>User</th><th>Document Type</th><th>VerifyMe Result</th><th>Status</th><th>Submitted</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {kycRequests.map((kyc) => (
                  <tr key={kyc.id}>
                    <td className="font-medium">{kyc.id}</td>
                    <td><div><p className="font-medium">{kyc.user}</p><p className="text-xs text-muted-foreground">{kyc.userId}</p></div></td>
                    <td className="text-muted-foreground">{kyc.documents.idType}</td>
                    <td>{kyc.verifyMeResult ? <span className={cn("text-sm font-medium", kyc.verifyMeResult.match ? "text-success" : "text-destructive")}>{kyc.verifyMeResult.confidence}%</span> : <span className="text-xs text-muted-foreground">Awaiting</span>}</td>
                    <td><StatusBadge status={kyc.status === "verified" ? "success" : kyc.status === "pending" ? "warning" : kyc.status === "flagged" ? "info" : "error"}>{kyc.status}</StatusBadge></td>
                    <td className="text-muted-foreground">{kyc.submittedAt}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => { setSelectedKyc(kyc); setSheetOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        {(kyc.status === "pending" || kyc.status === "flagged") && (<><Button size="sm" variant="outline" className="text-success"><CheckCircle className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-destructive"><XCircle className="h-4 w-4" /></Button></>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="content-card">
            <table className="data-table">
              <thead><tr><th>Flag ID</th><th>User</th><th>Type</th><th>Description</th><th>Status</th><th>Created</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {riskFlags.map((flag) => (
                  <tr key={flag.id}>
                    <td className="font-medium">{flag.id}</td>
                    <td><div><p className="font-medium">{flag.user}</p><p className="text-xs text-muted-foreground">{flag.userId}</p></div></td>
                    <td><StatusBadge status="error">{flag.type.replace("_", " ")}</StatusBadge></td>
                    <td className="max-w-xs truncate text-muted-foreground">{flag.description}</td>
                    <td><StatusBadge status={flag.status === "open" ? "error" : "warning"}>{flag.status}</StatusBadge></td>
                    <td className="text-muted-foreground">{flag.createdAt}</td>
                    <td className="text-right"><Button size="sm" variant="outline">Investigate</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="txflags" className="space-y-4">
          <div className="content-card">
            <table className="data-table">
              <thead><tr><th>Flag ID</th><th>Type</th><th>Linked Entity</th><th>Severity</th><th>Status</th><th>Created</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {txFlags.map((flag) => (
                  <tr key={flag.id}>
                    <td className="font-medium">{flag.id}</td>
                    <td><span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted">{flag.type}</span></td>
                    <td className="font-mono text-sm text-primary">{flag.linkedEntity}</td>
                    <td><span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize", severityColors[flag.severity])}>{flag.severity}</span></td>
                    <td><StatusBadge status={flag.status === "open" ? "error" : "neutral"}>{flag.status}</StatusBadge></td>
                    <td className="text-muted-foreground">{flag.createdAt}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {flag.status === "open" && <><Button size="sm" variant="outline">Investigate</Button><Button size="sm" variant="ghost" className="text-muted-foreground">Dismiss</Button></>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedKyc && (
            <>
              <SheetHeader><SheetTitle>KYC Review — {selectedKyc.id}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{selectedKyc.user}</p></div>
                  <div><p className="text-xs text-muted-foreground">User ID</p><p className="font-medium">{selectedKyc.userId}</p></div>
                  <div><p className="text-xs text-muted-foreground">BVN</p><p className="font-medium">{selectedKyc.documents.bvn}</p></div>
                  <div><p className="text-xs text-muted-foreground">NIN</p><p className="font-medium">{selectedKyc.documents.nin}</p></div>
                  <div><p className="text-xs text-muted-foreground">ID Type</p><p className="font-medium">{selectedKyc.documents.idType}</p></div>
                  <div><p className="text-xs text-muted-foreground">ID Number</p><p className="font-medium">{selectedKyc.documents.idNumber}</p></div>
                </div>
                {selectedKyc.verifyMeResult && (
                  <div className={cn("rounded-lg border p-4", selectedKyc.verifyMeResult.match ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5")}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{selectedKyc.verifyMeResult.match ? "Match Found" : "No Match"}</span>
                      <span className="text-2xl font-bold">{selectedKyc.verifyMeResult.confidence}%</span>
                    </div>
                    {"reason" in selectedKyc.verifyMeResult && selectedKyc.verifyMeResult.reason && <p className="mt-2 text-sm text-muted-foreground">{selectedKyc.verifyMeResult.reason}</p>}
                  </div>
                )}
                {(selectedKyc.status === "pending" || selectedKyc.status === "flagged") && (
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-success hover:bg-success/90"><CheckCircle className="mr-2 h-4 w-4" />Approve</Button>
                    <Button variant="destructive" className="flex-1"><XCircle className="mr-2 h-4 w-4" />Reject</Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
