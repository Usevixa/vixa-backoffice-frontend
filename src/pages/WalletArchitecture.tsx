import { useState } from "react";
import { Building2, Layers, Wallet, TrendingUp, Eye } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const primeWallet = {
  id: "PRIME-001",
  label: "VIXA Prime Wallet",
  balanceUsdt: "1,246,890.00 USDT",
  description: "Root custody wallet — top-level OpenXSwitch custody account",
  status: "active",
};

const majorWallets = [
  {
    id: "MAJ-001",
    label: "USDT Major Wallet",
    currencySet: ["USDT"],
    balanceUsdt: "524,875.00 USDT",
    nativeBalance: "524,875 USDT",
    subWalletCount: 1842,
    lastActivity: "2 minutes ago",
    status: "active",
  },
  {
    id: "MAJ-002",
    label: "USDC Major Wallet",
    currencySet: ["USDC"],
    balanceUsdt: "89,340.00 USDT",
    nativeBalance: "89,385 USDC",
    subWalletCount: 412,
    lastActivity: "18 minutes ago",
    status: "active",
  },
  {
    id: "MAJ-003",
    label: "NGN Major Wallet",
    currencySet: ["NGN"],
    balanceUsdt: "632,675.00 USDT",
    nativeBalance: "₦643,755,000",
    subWalletCount: 9147,
    lastActivity: "5 minutes ago",
    status: "active",
  },
];

const walletActivitySummary = [
  { type: "Send (24h)", count: 512, volume: "124,500 USDT" },
  { type: "Receive (24h)", count: 634, volume: "156,200 USDT" },
  { type: "Swap (24h)", count: 288, volume: "89,750 USDT" },
];

export default function WalletArchitecture() {
  const [selectedMajor, setSelectedMajor] = useState<typeof majorWallets[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const totalSubWallets = majorWallets.reduce((sum, w) => sum + w.subWalletCount, 0);
  const totalUsdt = "1,246,890.00 USDT";

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Wallet Architecture</h1>
        <p className="page-description">
          OpenXSwitch custody hierarchy — Prime Wallet → Major Wallets → Customer Sub-wallets
        </p>
      </div>

      {/* Architecture Diagram Header */}
      <div className="content-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">OpenXSwitch Custody Architecture</p>
            <p className="text-xs text-muted-foreground">3-tier wallet hierarchy: Prime → Major → Sub-wallets</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tier 1</p>
            <p className="font-bold text-primary mt-1">Prime Wallet</p>
            <p className="text-xs text-muted-foreground mt-1">Root custody account</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tier 2</p>
            <p className="font-bold mt-1">{majorWallets.length} Major Wallets</p>
            <p className="text-xs text-muted-foreground mt-1">Per-currency pools</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tier 3</p>
            <p className="font-bold mt-1">{totalSubWallets.toLocaleString()} Sub-wallets</p>
            <p className="text-xs text-muted-foreground mt-1">Customer-level accounts</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card border-primary/30">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <p className="metric-label">Prime Wallet</p>
          </div>
          <p className="metric-value mt-1 text-primary">{totalUsdt}</p>
          <p className="text-xs text-muted-foreground mt-1">Total custody value</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <p className="metric-label">Major Wallets</p>
          </div>
          <p className="metric-value mt-1">{majorWallets.length}</p>
          <p className="text-xs text-muted-foreground mt-1">USDT · USDC · NGN</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <p className="metric-label">Total Sub-wallets</p>
          </div>
          <p className="metric-value mt-1">{totalSubWallets.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Customer accounts</p>
        </div>
        <div className="metric-card border-success/30">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <p className="metric-label">24h Activity</p>
          </div>
          <p className="metric-value mt-1 text-success">1,434</p>
          <p className="text-xs text-muted-foreground mt-1">Send + Receive + Swap</p>
        </div>
      </div>

      {/* Prime Wallet */}
      <div className="content-card p-6">
        <h3 className="content-card-title mb-4 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Prime Wallet (Custody Root)
        </h3>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm font-medium text-muted-foreground">{primeWallet.id}</p>
              <p className="text-2xl font-bold text-primary mt-1">{primeWallet.balanceUsdt}</p>
              <p className="text-xs text-muted-foreground mt-1">{primeWallet.description}</p>
            </div>
            <StatusBadge status="success">{primeWallet.status}</StatusBadge>
          </div>
        </div>
      </div>

      {/* Major Wallets */}
      <div className="content-card">
        <div className="content-card-header">
          <h3 className="content-card-title flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Major Wallets (Per-Currency Pools)
          </h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Major Wallet ID</th>
              <th>Label</th>
              <th>Currency Set</th>
              <th>Balance (USDT Equiv)</th>
              <th>Native Balance</th>
              <th>Sub-wallets</th>
              <th>Last Activity</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {majorWallets.map((wallet) => (
              <tr
                key={wallet.id}
                className="cursor-pointer"
                onClick={() => { setSelectedMajor(wallet); setSheetOpen(true); }}
              >
                <td className="font-mono text-sm font-medium">{wallet.id}</td>
                <td className="font-medium">{wallet.label}</td>
                <td>
                  <div className="flex gap-1">
                    {wallet.currencySet.map((c) => (
                      <span key={c} className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                        c === "USDT" ? "bg-primary/10 text-primary" :
                        c === "USDC" ? "bg-warning/10 text-warning" :
                        "bg-success/10 text-success"
                      )}>
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="font-semibold text-primary">{wallet.balanceUsdt}</td>
                <td className="text-muted-foreground">{wallet.nativeBalance}</td>
                <td className="font-medium">{wallet.subWalletCount.toLocaleString()}</td>
                <td className="text-muted-foreground">{wallet.lastActivity}</td>
                <td>
                  <StatusBadge status="success">{wallet.status}</StatusBadge>
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    onClick={() => { setSelectedMajor(wallet); setSheetOpen(true); }}
                  >
                    <Eye className="h-3 w-3" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Summary */}
      <div className="content-card p-6">
        <h3 className="content-card-title mb-4">24h Activity Summary (All Major Wallets)</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {walletActivitySummary.map((item) => (
            <div key={item.type} className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">{item.type}</p>
              <p className="text-xl font-bold mt-1">{item.count}</p>
              <p className="text-sm text-success font-medium mt-1">{item.volume}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Major Wallet Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedMajor && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedMajor.label} — {selectedMajor.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                  <p className="text-xs text-muted-foreground">Balance (USDT Equivalent)</p>
                  <p className="text-3xl font-bold text-primary">{selectedMajor.balanceUsdt}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMajor.nativeBalance} native</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Linked Sub-wallets</p>
                    <p className="text-2xl font-bold mt-1">{selectedMajor.subWalletCount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3 text-center">
                    <p className="text-xs text-muted-foreground">Last Activity</p>
                    <p className="text-sm font-semibold mt-2">{selectedMajor.lastActivity}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs text-muted-foreground">Wallet ID</p><p className="font-mono text-sm">{selectedMajor.id}</p></div>
                    <div><p className="text-xs text-muted-foreground">Currency Set</p>
                      <div className="flex gap-1 mt-1">
                        {selectedMajor.currencySet.map((c) => (
                          <span key={c} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div><p className="text-xs text-muted-foreground">Status</p>
                      <div className="mt-1"><StatusBadge status="success">{selectedMajor.status}</StatusBadge></div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">OpenXSwitch Provider Reference</p>
                  <p className="font-mono text-sm mt-1">{selectedMajor.id}-OXS-REF</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
