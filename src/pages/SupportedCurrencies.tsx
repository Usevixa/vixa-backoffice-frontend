import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Coins, Network, Power, PowerOff, Loader2, MoreHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import {
  operationPayload,
  SupportedCurrencyUpdate,
  useSupportedCurrencies,
  useUpdateSupportedCurrency,
} from "@/hooks/useSupportedCurrencyQueries";
import { SupportedCurrencyChain } from "@/types/supported-currency";

// Preferred column order; any other operation keys returned by the API are appended.
const OPERATION_ORDER = ["deposit", "withdrawal", "send", "receive", "swap", "balance"];

interface CurrencyRow {
  key: string;
  coin: string;
  chain: SupportedCurrencyChain;
}

interface BulkAction {
  row: CurrencyRow;
  enabled: boolean;
}

function operationLabel(op: string) {
  return op.charAt(0).toUpperCase() + op.slice(1);
}

function operationRank(op: string) {
  const i = OPERATION_ORDER.findIndex((o) => op.toLowerCase().startsWith(o.slice(0, 6)));
  return i === -1 ? OPERATION_ORDER.length : i;
}

// The record id the PATCH endpoint expects — per operation if the API sends it, else per chain.
function recordId(chain: SupportedCurrencyChain, op: string): number | undefined {
  return chain.operations?.[op]?.id ?? chain.id;
}

function buildUpdates(
  chain: SupportedCurrencyChain,
  ops: string[],
  enabled: boolean
): SupportedCurrencyUpdate[] {
  const byId = new Map<number, SupportedCurrencyUpdate>();
  for (const op of ops) {
    const id = recordId(chain, op);
    if (id == null) continue;
    const existing = byId.get(id) ?? { id, payload: {} };
    existing.payload = { ...existing.payload, ...operationPayload(op, enabled) };
    byId.set(id, existing);
  }
  return Array.from(byId.values());
}

export default function SupportedCurrencies() {
  const [coinInput, setCoinInput] = useState("");
  const [chainInput, setChainInput] = useState("");
  const [coin, setCoin] = useState("");
  const [chain, setChain] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [isEnabled, setIsEnabled] = useState("all");
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState<BulkAction | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setCoin(coinInput);
      setChain(chainInput);
    }, 400);
    return () => clearTimeout(t);
  }, [coinInput, chainInput]);

  const { data, isLoading, isError } = useSupportedCurrencies({
    coin,
    chain,
    transactionType,
    isEnabled,
  });
  const updateMutation = useUpdateSupportedCurrency();

  const rows: CurrencyRow[] = useMemo(
    () =>
      (data?.currencies ?? []).flatMap((c) =>
        (c.chains ?? []).map((ch) => ({ key: `${c.coin}:${ch.chain}`, coin: c.coin, chain: ch }))
      ),
    [data]
  );

  // Remember every operation key seen so columns and the type filter stay stable while filtering.
  const seenOps = useRef<Set<string>>(new Set());
  const operations = useMemo(() => {
    rows.forEach((r) => Object.keys(r.chain.operations ?? {}).forEach((op) => seenOps.current.add(op)));
    return Array.from(seenOps.current).sort((a, b) => operationRank(a) - operationRank(b));
  }, [rows]);

  const disabledOpsCount = rows.reduce(
    (sum, r) => sum + Object.values(r.chain.operations ?? {}).filter((o) => !o.enabled).length,
    0
  );

  const hasActiveFilters =
    !!coinInput || !!chainInput || transactionType !== "all" || isEnabled !== "all";

  const clearFilters = () => {
    setCoinInput("");
    setChainInput("");
    setCoin("");
    setChain("");
    setTransactionType("all");
    setIsEnabled("all");
  };

  const toggleOperation = (row: CurrencyRow, op: string, enabled: boolean) => {
    const updates = buildUpdates(row.chain, [op], enabled);
    if (!updates.length) return;
    const key = `${row.key}:${op}`;
    setPendingKey(key);
    updateMutation.mutate(updates, { onSettled: () => setPendingKey(null) });
  };

  const confirmBulk = () => {
    if (!bulkAction) return;
    const { row, enabled } = bulkAction;
    const updates = buildUpdates(row.chain, Object.keys(row.chain.operations ?? {}), enabled);
    if (!updates.length) {
      setBulkAction(null);
      return;
    }
    setPendingKey(row.key);
    updateMutation.mutate(updates, {
      onSettled: () => {
        setPendingKey(null);
        setBulkAction(null);
      },
    });
  };

  const colSpan = 7 + operations.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Supported Currencies</h1>
        <p className="page-description">
          Manage which coins and chains are enabled for each operation
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <p className="metric-label">Total Coins</p>
          </div>
          <p className="metric-value mt-1">{data ? data.totalCoins : "—"}</p>
        </div>
        <div className="metric-card">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-muted-foreground" />
            <p className="metric-label">Total Chains</p>
          </div>
          <p className="metric-value mt-1">{data ? data.totalChains : "—"}</p>
        </div>
        <div className={cn("metric-card", disabledOpsCount > 0 && "border-warning/30")}>
          <div className="flex items-center gap-2">
            <PowerOff className="h-4 w-4 text-muted-foreground" />
            <p className="metric-label">Disabled Operations</p>
          </div>
          <p className={cn("metric-value mt-1", disabledOpsCount > 0 && "text-warning")}>
            {data ? disabledOpsCount : "—"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Coin (e.g. USDT)"
            className="pl-9"
            value={coinInput}
            onChange={(e) => setCoinInput(e.target.value)}
          />
        </div>
        <div className="relative w-full max-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Chain (e.g. TRON)"
            className="pl-9"
            value={chainInput}
            onChange={(e) => setChainInput(e.target.value)}
          />
        </div>
        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {operations.map((op) => (
              <SelectItem key={op} value={op}>
                {operationLabel(op)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={isEnabled} onValueChange={setIsEnabled}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
            <SelectItem value="false">Disabled</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="content-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Chain</th>
              <th>OXS Network</th>
              <th>Tag / Memo</th>
              <th>Min Deposit</th>
              <th>Min Withdraw</th>
              <th>Decimals</th>
              {operations.map((op) => (
                <th key={op} className="text-center">
                  {operationLabel(op)}
                </th>
              ))}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={colSpan + 1} className="py-12">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={colSpan + 1} className="py-12 text-center text-sm text-destructive">
                  Failed to load supported currencies. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && rows.length === 0 && (
              <tr>
                <td colSpan={colSpan + 1} className="py-12 text-center text-sm text-muted-foreground">
                  No supported currencies found.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const ops = row.chain.operations ?? {};
              const rowPending = pendingKey === row.key;
              const canEdit = Object.keys(ops).some((op) => recordId(row.chain, op) != null);
              return (
                <tr key={row.key}>
                  <td className="font-medium">{row.coin}</td>
                  <td>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                      {row.chain.chain}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">
                    {row.chain.oxsNetworkSlug || "—"}
                  </td>
                  <td>
                    {row.chain.needTag ? (
                      <StatusBadge status="info">Required</StatusBadge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="font-mono text-sm">{row.chain.minDepositAmount ?? "—"}</td>
                  <td className="font-mono text-sm">{row.chain.minWithdrawAmount ?? "—"}</td>
                  <td className="font-mono text-sm">{row.chain.decimals ?? "—"}</td>
                  {operations.map((op) => {
                    const operation = ops[op];
                    if (!operation) {
                      return (
                        <td key={op} className="text-center text-muted-foreground">
                          —
                        </td>
                      );
                    }
                    const cellPending = rowPending || pendingKey === `${row.key}:${op}`;
                    const editable = recordId(row.chain, op) != null;
                    return (
                      <td key={op} className="text-center">
                        <div className="flex justify-center">
                          {cellPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          ) : (
                            <Switch
                              checked={operation.enabled}
                              disabled={!editable || updateMutation.isPending}
                              onCheckedChange={(checked) => toggleOperation(row, op, checked)}
                              aria-label={`${operation.enabled ? "Disable" : "Enable"} ${operationLabel(op)} for ${row.coin} on ${row.chain.chain}`}
                              title={editable ? undefined : "Record ID not returned by the API"}
                            />
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={!canEdit || updateMutation.isPending}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {row.coin} · {row.chain.chain}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setBulkAction({ row, enabled: true })}>
                          <Power className="mr-2 h-4 w-4 text-success" />
                          Enable all operations
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setBulkAction({ row, enabled: false })}
                          className="text-destructive focus:text-destructive"
                        >
                          <PowerOff className="mr-2 h-4 w-4" />
                          Disable all operations
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!bulkAction} onOpenChange={(open) => !open && setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction?.enabled ? "Enable" : "Disable"} all operations?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will {bulkAction?.enabled ? "enable" : "disable"} every operation for{" "}
              <span className="font-medium text-foreground">
                {bulkAction?.row.coin} on {bulkAction?.row.chain.chain}
              </span>
              . {bulkAction?.enabled ? "" : "Users will not be able to transact with it until it is re-enabled."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmBulk();
              }}
              disabled={updateMutation.isPending}
              className={cn(
                !bulkAction?.enabled && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
            >
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {bulkAction?.enabled ? "Enable" : "Disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
