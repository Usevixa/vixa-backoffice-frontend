import { useState, useEffect } from "react";
import {
  Search, Plus, MoreHorizontal, Shield, Eye, Edit, ChevronRight, ChevronLeft, X, Check, Loader2, Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAdminUsers, useAuditLogs, useCreateAdmin, useResendAdminInvite } from "@/hooks/useAdminManagementQueries";
import { AuditLog } from "@/types/admin-management";

// ─── Static Role Data ─────────────────────────────────────────────────────────

const roles = [
  { id: "super_admin", name: "Super Admin", description: "Full access to all features and settings", color: "bg-destructive/10 text-destructive" },
  { id: "ops_admin", name: "Ops Admin", description: "Manage withdrawals, deposits, send/receive/swap, logs", color: "bg-primary/10 text-primary" },
  { id: "compliance", name: "Compliance Admin", description: "Review KYC, manage risk flags, audit logs", color: "bg-warning/10 text-warning" },
  { id: "analyst", name: "Read-only Analyst", description: "View-only access to reports and dashboards", color: "bg-muted text-muted-foreground" },
  { id: "custom", name: "Custom", description: "Define granular permissions per module", color: "bg-success/10 text-success" },
];

// ─── Granular Permission Groups ───────────────────────────────────────────────

const PERMISSION_GROUPS = [
  {
    module: "Dashboard",
    perms: [
      { id: "dashboard.view", label: "View dashboard" },
    ],
  },
  {
    module: "Users",
    perms: [
      { id: "users.view_list", label: "View users list" },
      { id: "users.view_detail", label: "View user detail" },
      { id: "users.add_note", label: "Add user note" },
      { id: "users.set_risk", label: "Set risk level" },
      { id: "users.freeze", label: "Freeze user" },
      { id: "users.unfreeze", label: "Unfreeze user" },
      { id: "users.disable_withdrawals", label: "Disable withdrawals (user-level)" },
      { id: "users.enable_withdrawals", label: "Enable withdrawals (user-level)" },
      { id: "users.force_rekyc", label: "Force re-KYC (placeholder)" },
    ],
  },
  {
    module: "Wallets (OpenXSwitch)",
    perms: [
      { id: "wallets.view_overview", label: "View wallet overview" },
      { id: "wallets.view_major", label: "View major wallets" },
      { id: "wallets.view_list", label: "View sub-wallet list" },
      { id: "wallets.view_detail", label: "View sub-wallet detail" },
      { id: "wallets.view_ledger", label: "View ledger" },
      { id: "wallets.freeze", label: "Freeze wallet" },
      { id: "wallets.unfreeze", label: "Unfreeze wallet" },
      { id: "wallets.manual_adjustment", label: "⚠️ Manual adjustment (high risk)" },
    ],
  },
  {
    module: "Send (OpenXSwitch)",
    perms: [
      { id: "send.view_list", label: "View send list" },
      { id: "send.view_detail", label: "View send detail" },
      { id: "send.retry", label: "Retry send" },
      { id: "send.escalate", label: "Escalate send" },
    ],
  },
  {
    module: "Receive (OpenXSwitch)",
    perms: [
      { id: "receive.view_list", label: "View receive list" },
      { id: "receive.view_detail", label: "View receive detail" },
      { id: "receive.reprocess", label: "Reprocess receive" },
      { id: "receive.escalate", label: "Escalate receive" },
    ],
  },
  {
    module: "Swap (OpenXSwitch)",
    perms: [
      { id: "swap.view_list", label: "View swap list" },
      { id: "swap.view_detail", label: "View swap detail" },
      { id: "swap.retry", label: "Retry swap" },
      { id: "swap.flag_anomaly", label: "Flag anomaly" },
    ],
  },
  {
    module: "Deposits (USDT Solana)",
    perms: [
      { id: "deposits.view", label: "View deposits" },
      { id: "deposits.view_detail", label: "View deposit detail" },
      { id: "deposits.reprocess_webhook", label: "Reprocess deposit webhook" },
      { id: "deposits.mark_resolved", label: "Mark resolved" },
    ],
  },
  {
    module: "Withdrawals (USDT Polygon)",
    perms: [
      { id: "withdrawals.view", label: "View withdrawals" },
      { id: "withdrawals.view_detail", label: "View withdrawal detail" },
      { id: "withdrawals.retry", label: "Retry withdrawal" },
      { id: "withdrawals.mark_resolved", label: "Mark resolved" },
      { id: "withdrawals.escalate", label: "Escalate withdrawal" },
    ],
  },
  {
    module: "Webhooks & Provider Logs",
    perms: [
      { id: "webhooks.view_list", label: "View logs list" },
      { id: "webhooks.view_payload", label: "View log payload" },
      { id: "webhooks.reprocess", label: "Reprocess webhook" },
      { id: "webhooks.download", label: "Download payload" },
    ],
  },
  {
    module: "Rates & Markups",
    perms: [
      { id: "rates.view", label: "View rate config" },
      { id: "rates.edit_deposit", label: "Edit deposit markup" },
      { id: "rates.edit_withdrawal", label: "Edit withdrawal markup" },
      { id: "rates.view_history", label: "View change history" },
    ],
  },
  {
    module: "Reconciliation & Settlement",
    perms: [
      { id: "recon.view_summary", label: "View reconciliation summary" },
      { id: "recon.view_exceptions", label: "View exceptions" },
      { id: "recon.mark_resolved", label: "Mark exception resolved" },
      { id: "recon.create_adjustment", label: "Create adjustment request" },
    ],
  },
  {
    module: "Reports & Exports",
    perms: [
      { id: "reports.view", label: "View exports" },
      { id: "reports.create", label: "Create export" },
      { id: "reports.download", label: "Download export" },
    ],
  },
  {
    module: "System Settings",
    perms: [
      { id: "settings.view", label: "View settings" },
      { id: "settings.edit_toggles", label: "Edit feature toggles" },
      { id: "settings.edit_thresholds", label: "Edit alert thresholds" },
      { id: "settings.maintenance_mode", label: "Toggle maintenance mode" },
    ],
  },
  {
    module: "Admin Management",
    perms: [
      { id: "admins.view", label: "View admins" },
      { id: "admins.add", label: "Add admin" },
      { id: "admins.edit", label: "Edit admin" },
      { id: "admins.disable", label: "Disable admin" },
      { id: "admins.edit_permissions", label: "Edit roles/permissions" },
    ],
  },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: PERMISSION_GROUPS.flatMap(g => g.perms.map(p => p.id)),
  ops_admin: [
    "dashboard.view",
    "users.view_list", "users.view_detail", "users.add_note",
    "wallets.view_overview", "wallets.view_major", "wallets.view_list", "wallets.view_detail", "wallets.view_ledger",
    "send.view_list", "send.view_detail", "send.retry", "send.escalate",
    "receive.view_list", "receive.view_detail", "receive.reprocess", "receive.escalate",
    "swap.view_list", "swap.view_detail", "swap.retry",
    "deposits.view", "deposits.view_detail", "deposits.reprocess_webhook", "deposits.mark_resolved",
    "withdrawals.view", "withdrawals.view_detail", "withdrawals.retry", "withdrawals.mark_resolved", "withdrawals.escalate",
    "webhooks.view_list", "webhooks.view_payload", "webhooks.reprocess",
    "rates.view", "rates.view_history",
    "recon.view_summary", "recon.view_exceptions",
    "reports.view", "reports.create", "reports.download",
  ],
  compliance: [
    "dashboard.view",
    "users.view_list", "users.view_detail", "users.add_note", "users.set_risk", "users.force_rekyc",
    "wallets.view_overview", "wallets.view_list", "wallets.view_detail", "wallets.view_ledger",
    "deposits.view", "deposits.view_detail",
    "withdrawals.view", "withdrawals.view_detail",
    "webhooks.view_list",
    "rates.view", "rates.view_history",
    "recon.view_summary", "recon.view_exceptions",
    "reports.view",
    "admins.view",
  ],
  analyst: [
    "dashboard.view",
    "users.view_list", "users.view_detail",
    "wallets.view_overview", "wallets.view_major", "wallets.view_list",
    "deposits.view",
    "withdrawals.view",
    "rates.view", "rates.view_history",
    "recon.view_summary",
    "reports.view", "reports.download",
  ],
  custom: [],
};

// ─── Add Admin Multi-step Modal ───────────────────────────────────────────────

type NewAdmin = {
  firstName: string; lastName: string; username: string; email: string;
  isSuperAdmin: boolean; role: string; customPerms: Set<string>;
};

const defaultNewAdmin = (): NewAdmin => ({
  firstName: "", lastName: "", username: "", email: "",
  isSuperAdmin: false, role: "", customPerms: new Set(),
});

function AddAdminModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<NewAdmin>(defaultNewAdmin());

  const selectedRole = roles.find(r => r.id === form.role);
  const effectivePerms: Set<string> = form.role === "custom"
    ? form.customPerms
    : new Set(ROLE_PERMISSIONS[form.role] ?? []);

  const createAdminMutation = useCreateAdmin(handleClose);

  function toggleCustomPerm(id: string) {
    setForm(f => {
      const next = new Set(f.customPerms);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...f, customPerms: next };
    });
  }

  function handleClose() {
    setStep(1);
    setForm(defaultNewAdmin());
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Admin — Step {step} of 4</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {["Basic Details", "Role", "Permissions", "Review"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold",
                step > i + 1 ? "bg-success text-success-foreground" :
                step === i + 1 ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              )}>
                {step > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn("text-xs font-medium", step === i + 1 ? "text-foreground" : "text-muted-foreground")}>{label}</span>
              {i < 3 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Basic Details ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Obi" />
              </div>
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="jane.obi" />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@vixa.com" />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Switch checked={form.isSuperAdmin} onCheckedChange={(v: boolean) => setForm(f => ({ ...f, isSuperAdmin: v }))} />
              <div>
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-muted-foreground">Grant super admin privileges</p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Role ── */}
        {step === 2 && (
          <div className="space-y-3">
            {roles.map(role => (
              <button
                key={role.id}
                className={cn(
                  "w-full text-left rounded-lg border p-4 transition-colors",
                  form.role === role.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                )}
                onClick={() => setForm(f => ({ ...f, role: role.id }))}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", form.role === role.id ? "bg-primary" : "bg-muted")} />
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", role.color)}>{role.name}</span>
                    <span className="text-sm text-muted-foreground">{role.description}</span>
                  </div>
                  {form.role === role.id && <Check className="h-4 w-4 text-primary" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 3: Permissions ── */}
        {step === 3 && (
          <div className="space-y-4">
            {form.role !== "custom" ? (
              <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                Permissions are pre-set for <strong>{selectedRole?.name}</strong>. Switch to <strong>Custom</strong> role to override individual permissions.
              </div>
            ) : (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm text-primary">
                Custom role selected — configure granular permissions below.
              </div>
            )}

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {PERMISSION_GROUPS.map(group => (
                <div key={group.module}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{group.module}</p>
                  <div className="space-y-1 pl-3">
                    {group.perms.map(perm => {
                      const checked = form.role === "custom" ? form.customPerms.has(perm.id) : effectivePerms.has(perm.id);
                      return (
                        <div key={perm.id} className="flex items-center gap-3 py-0.5">
                          <Checkbox
                            checked={checked}
                            disabled={form.role !== "custom"}
                            onCheckedChange={() => form.role === "custom" && toggleCustomPerm(perm.id)}
                          />
                          <label className={cn("text-sm", checked ? "text-foreground" : "text-muted-foreground")}>{perm.label}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: Review ── */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <h4 className="text-sm font-semibold">Admin Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><p className="text-xs text-muted-foreground">First Name</p><p className="font-medium">{form.firstName || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Last Name</p><p className="font-medium">{form.lastName || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Username</p><p className="font-medium">{form.username || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{form.email || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Role</p>
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1", selectedRole?.color)}>
                    {selectedRole?.name ?? "—"}
                  </span>
                </div>
                <div><p className="text-xs text-muted-foreground">Super Admin</p><p className="font-medium">{form.isSuperAdmin ? "Yes" : "No"}</p></div>
                <div><p className="text-xs text-muted-foreground">Permissions</p><p className="font-medium">{effectivePerms.size} granted</p></div>
              </div>
            </div>
            <div className="rounded-lg bg-warning/5 border border-warning/20 p-3 text-sm text-muted-foreground">
              ⚠️ Creating this admin will send an invite email. The admin must set their password before they can log in. This action will be logged to the Audit Trail.
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => step > 1 ? setStep(s => s - 1) : handleClose()}>
            {step > 1 ? <><ChevronLeft className="h-4 w-4 mr-1" /> Back</> : "Cancel"}
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={step === 1 && (!form.firstName || !form.lastName || !form.username || !form.email)}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => createAdminMutation.mutate({
                email: form.email,
                username: form.username,
                firstName: form.firstName,
                lastName: form.lastName,
                roleIds: form.role ? [form.role] : [],
                isSuperAdmin: form.isSuperAdmin,
              })}
              disabled={createAdminMutation.isPending}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              {createAdminMutation.isPending
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending invite...</>
                : <><Check className="h-4 w-4 mr-2" /> Send Invite</>}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Audit Details Dialog ─────────────────────────────────────────────────────

function parseDetails(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function AuditDetailsDialog({
  log,
  open,
  onOpenChange,
}: {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!log) return null;
  const parsed = parseDetails(log.details);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Log metadata */}
          <div className="rounded-lg border border-border p-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Timestamp</p>
                <p className="font-medium">
                  {new Date(log.timestamp).toLocaleString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Result</p>
                <div className="mt-0.5">
                  <StatusBadge status={log.result.toUpperCase() === "OK" ? "success" : "error"}>
                    {log.result}
                  </StatusBadge>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Admin</p>
                <p className="font-medium">{log.adminName}</p>
                <p className="text-xs text-muted-foreground font-mono">{log.adminEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">IP Address</p>
                <p className="font-mono text-xs mt-0.5">{log.ipAddress}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Action</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-xs font-mono mt-0.5">
                  {log.action}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entity</p>
                <p className="text-sm">{log.entityType}</p>
                <p className="text-xs text-muted-foreground font-mono">{log.entityId}</p>
              </div>
            </div>
          </div>

          {/* Details payload */}
          {log.details && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Payload Details
              </p>
              {parsed ? (
                <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
                  {Object.entries(parsed).map(([k, v]) => (
                    <div key={k} className="flex items-start gap-3">
                      <p className="text-xs text-muted-foreground w-28 flex-shrink-0 pt-0.5">{k}</p>
                      <p className="text-xs font-medium break-all font-mono">
                        {typeof v === "object" ? JSON.stringify(v) : String(v)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs font-mono text-muted-foreground break-all">{log.details}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const AUDIT_TAKE = 20;

export default function AdminRoles() {
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const resendInviteMutation = useResendAdminInvite();

  // ── Admin Users ──
  const [adminSearch, setAdminSearch] = useState("");
  const { data: adminUsers, isLoading: isAdminLoading, isError: isAdminError } = useAdminUsers();

  const filteredAdmins = (adminUsers ?? []).filter(u => {
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    );
  });

  // ── Audit Trail ──
  const [auditSkip, setAuditSkip] = useState(0);
  const [adminIdInput, setAdminIdInput] = useState("");
  const [adminId, setAdminId] = useState("");
  const [actionInput, setActionInput] = useState("");
  const [auditAction, setAuditAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(null);
  const [auditDetailOpen, setAuditDetailOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAdminId(adminIdInput), 400);
    return () => clearTimeout(t);
  }, [adminIdInput]);

  useEffect(() => {
    const t = setTimeout(() => setAuditAction(actionInput), 400);
    return () => clearTimeout(t);
  }, [actionInput]);

  useEffect(() => {
    setAuditSkip(0);
  }, [adminId, auditAction, from, to]);

  const { data: auditLogs, isLoading: isAuditLoading, isError: isAuditError } = useAuditLogs({
    adminId,
    action: auditAction,
    from: from || undefined,
    to: to || undefined,
    skip: auditSkip,
    take: AUDIT_TAKE,
  });

  const auditItems = auditLogs ?? [];
  const auditPage = Math.floor(auditSkip / AUDIT_TAKE) + 1;
  const hasNextAudit = auditItems.length >= AUDIT_TAKE;
  const hasPrevAudit = auditSkip > 0;
  const hasAuditFilters = !!adminIdInput || !!actionInput || !!from || !!to;

  const clearAuditFilters = () => {
    setAdminIdInput("");
    setAdminId("");
    setActionInput("");
    setAuditAction("");
    setFrom("");
    setTo("");
    setAuditSkip(0);
  };

  const openAuditDetail = (log: AuditLog) => {
    setSelectedAuditLog(log);
    setAuditDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Admin Roles & Audit Trail</h1>
          <p className="page-description">
            Manage admin users with granular permissions and view audit logs
          </p>
        </div>
        <Button onClick={() => setAddAdminOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      <Tabs defaultValue="admins" className="space-y-6">
        <TabsList>
          <TabsTrigger value="admins">Admins & Permissions</TabsTrigger>
          <TabsTrigger value="matrix">Permissions Matrix</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* ── ADMINS TAB ── */}
        <TabsContent value="admins" className="space-y-6">
          {/* Role summary cards */}
          <div className="grid gap-4 md:grid-cols-5">
            {roles.map(role => (
              <div key={role.id} className="content-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium", role.color)}>{role.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{role.description}</p>
                <p className="text-sm font-medium mt-2">
                  {(adminUsers ?? []).filter(u => u.primaryRole === role.name).length} admins
                </p>
              </div>
            ))}
          </div>

          {/* Admin Users Table */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Admin Users</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search admins..."
                  className="pl-9"
                  value={adminSearch}
                  onChange={e => setAdminSearch(e.target.value)}
                />
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Username</th>
                  <th>Primary Role</th>
                  <th>Status</th>
                  <th>Super Admin</th>
                  <th>Last Login</th>
                  <th>Last Active</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isAdminLoading && (
                  <tr>
                    <td colSpan={8} className="py-12">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </td>
                  </tr>
                )}
                {isAdminError && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-destructive">
                      Failed to load admin users. Please try again.
                    </td>
                  </tr>
                )}
                {!isAdminLoading && !isAdminError && filteredAdmins.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                      No admins found.
                    </td>
                  </tr>
                )}
                {filteredAdmins.map(admin => (
                  <tr key={admin.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">{admin.initials}</span>
                        </div>
                        <div>
                          <p className="font-medium">{admin.fullName}</p>
                          <p className="text-xs text-muted-foreground">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-muted-foreground font-mono">{admin.username}</td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                        {admin.primaryRole}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={admin.status === "Pending" ? "warning" : admin.isActive ? "success" : "error"}>
                        {admin.status === "Pending" ? "Pending" : admin.isActive ? "Active" : "Inactive"}
                      </StatusBadge>
                    </td>
                    <td>
                      {admin.isSuperAdmin ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">
                          Super Admin
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {admin.lastLoginAt
                        ? new Date(admin.lastLoginAt).toLocaleString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })
                        : "Never"}
                    </td>
                    <td className="text-sm text-muted-foreground">{admin.lastActiveDisplay ?? "—"}</td>
                    <td className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Activity</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Role</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          {!admin.isActive && (
                            <DropdownMenuItem
                              onClick={() => resendInviteMutation.mutate(admin.id)}
                              disabled={resendInviteMutation.isPending}
                            >
                              <Mail className="mr-2 h-4 w-4" /> Resend Invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className={admin.isActive ? "text-destructive" : "text-success"}>
                            {admin.isActive ? "Disable Admin" : "Enable Admin"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ── PERMISSIONS MATRIX TAB ── */}
        <TabsContent value="matrix" className="space-y-4">
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Permissions Matrix (Role Templates)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Module / Permission</th>
                    <th className="text-center">Super Admin</th>
                    <th className="text-center">Ops Admin</th>
                    <th className="text-center">Compliance</th>
                    <th className="text-center">Analyst</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_GROUPS.map(group => (
                    <>
                      <tr key={group.module + "-header"} className="bg-muted/30">
                        <td colSpan={5} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide py-2">
                          {group.module}
                        </td>
                      </tr>
                      {group.perms.map(perm => (
                        <tr key={perm.id}>
                          <td className="pl-4 text-sm text-muted-foreground">{perm.label}</td>
                          {(["super_admin", "ops_admin", "compliance", "analyst"] as const).map(roleId => (
                            <td key={roleId} className="text-center">
                              <Checkbox checked={ROLE_PERMISSIONS[roleId]?.includes(perm.id) ?? false} disabled />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ── AUDIT TRAIL TAB ── */}
        <TabsContent value="audit" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Admin ID</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Filter by admin ID..."
                  className="pl-9 w-52"
                  value={adminIdInput}
                  onChange={e => setAdminIdInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Action</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Filter by action..."
                  className="pl-9 w-48"
                  value={actionInput}
                  onChange={e => setActionInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">From</span>
              <Input
                type="date"
                className="w-40"
                value={from}
                onChange={e => setFrom(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">To</span>
              <Input
                type="date"
                className="w-40"
                value={to}
                onChange={e => setTo(e.target.value)}
              />
            </div>
            {hasAuditFilters && (
              <Button variant="ghost" size="sm" onClick={clearAuditFilters} className="text-muted-foreground self-end">
                <X className="mr-1 h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="content-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>IP Address</th>
                  <th>Result</th>
                  <th className="text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {isAuditLoading && (
                  <tr>
                    <td colSpan={7} className="py-12">
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </td>
                  </tr>
                )}
                {isAuditError && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-destructive">
                      Failed to load audit logs. Please try again.
                    </td>
                  </tr>
                )}
                {!isAuditLoading && !isAuditError && auditItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      No audit logs found.
                    </td>
                  </tr>
                )}
                {auditItems.map(log => (
                  <tr key={log.id}>
                    <td className="text-muted-foreground font-mono text-sm whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td>
                      <p className="font-medium text-sm">{log.adminName}</p>
                      <p className="text-xs text-muted-foreground">{log.adminEmail}</p>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <p className="font-medium text-sm">{log.entityType}</p>
                      <p className="text-xs text-muted-foreground font-mono">{log.entityId}</p>
                    </td>
                    <td className="font-mono text-sm text-muted-foreground">{log.ipAddress}</td>
                    <td>
                      <StatusBadge status={log.result.toUpperCase() === "OK" ? "success" : "error"}>
                        {log.result}
                      </StatusBadge>
                    </td>
                    <td className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => openAuditDetail(log)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Skip/take pagination */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {auditItems.length === 0 ? "No entries" : `Page ${auditPage} · ${auditItems.length} entries`}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasPrevAudit}
                onClick={() => setAuditSkip(s => Math.max(0, s - AUDIT_TAKE))}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="text-sm font-medium px-2">Page {auditPage}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasNextAudit}
                onClick={() => setAuditSkip(s => s + AUDIT_TAKE)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AddAdminModal open={addAdminOpen} onClose={() => setAddAdminOpen(false)} />
      <AuditDetailsDialog
        log={selectedAuditLog}
        open={auditDetailOpen}
        onOpenChange={setAuditDetailOpen}
      />
    </div>
  );
}
