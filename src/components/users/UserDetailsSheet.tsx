import { useState } from "react";
import { Loader2, UserX, Flag, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import {
  useUserProfile,
  useUserKyc,
  useUserWallet,
  useUserActivity,
  useUserNotes,
  useUpdateUserNotes,
  useFreezeWallets,
  useUnfreezeWallet,
  useToggleWithdrawal,
  useFlagUser,
} from "@/hooks/useUserQueries";

interface UserDetailsSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const riskLevelColors = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

function TabSpinner() {
  return (
    <div className="flex justify-center py-8">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}

const ACTIVITY_PAGE_SIZE = 10;
const NOTES_PAGE_SIZE = 5;

export function UserDetailsSheet({ user, open, onOpenChange }: UserDetailsSheetProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [activityPage, setActivityPage] = useState(1);
  const [notesPage, setNotesPage] = useState(1);

  const enabled = open && !!user;

  const { data: profileData, isLoading: profileLoading } = useUserProfile(
    user?.userId ?? null,
    enabled
  );
  const { data: kycData, isLoading: kycLoading } = useUserKyc(user?.userId ?? null, enabled);
  const { data: walletData, isLoading: walletLoading } = useUserWallet(
    user?.userId ?? null,
    enabled
  );
  const { data: transactions = [], isLoading: activityLoading } = useUserActivity(
    user?.userId ?? null,
    enabled
  );
  const { data: notes = [], isLoading: notesLoading } = useUserNotes(
    user?.userId ?? null,
    enabled
  );

  const freezeWalletsMutation = useFreezeWallets();
  const unfreezeWalletMutation = useUnfreezeWallet();
  const toggleWithdrawalMutation = useToggleWithdrawal();
  const flagUserMutation = useFlagUser();
  const updateNotesMutation = useUpdateUserNotes(() => setAdminNotes(""));

  if (!user) return null;

  const profile = profileData as any;
  const kyc = kycData as any;
  const wallet = walletData as any;

  const withdrawalsEnabled = user.canWithdraw;
  const tokenBalances: any[] = wallet?.wallets ?? wallet?.balances ?? wallet?.tokenBalances ?? wallet?.tokens ?? [];
  const totalUsdtEquiv = wallet?.totalBalanceUsdt ?? wallet?.totalUsdtEquiv ?? wallet?.usdtEquiv ?? user.usdtBalance ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User Details — {user.fullName}</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {user.riskLevel === "high" && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">High Risk User</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Flagged for elevated risk monitoring
              </p>
            </div>
          )}

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
              <TabsTrigger value="kyc" className="flex-1">KYC</TabsTrigger>
              <TabsTrigger value="wallets" className="flex-1">Wallets</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">User ID</p>
                  <p className="font-medium font-mono text-sm">{user.userId.substring(0, 8)}****-****-****</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {new Date(user.joinedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Flagged</p>
                  <div className="mt-1">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                        user.isFlagged
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-foreground"
                      )}
                    >
                      {user.isFlagged ? "Flagged" : "Not Flagged"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize mt-1",
                      riskLevelColors[user.riskLevel as keyof typeof riskLevelColors] ??
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    {user.riskLevel}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">KYC Status</p>
                  <div className="mt-1">
                    <StatusBadge
                      status={
                        user.kycStatus.toLowerCase() === "verified"
                          ? "success"
                          : user.kycStatus.toLowerCase() === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {user.kycStatus}
                    </StatusBadge>
                  </div>
                </div>
              </div>

              {/* Admin Controls */}
              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Admin Controls
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Withdrawals Enabled</Label>
                    <p className="text-xs text-muted-foreground">Allow user to make withdrawals</p>
                  </div>
                  <Switch
                    checked={withdrawalsEnabled}
                    disabled={profileLoading || toggleWithdrawalMutation.isPending}
                    onCheckedChange={(checked) => {
                      toggleWithdrawalMutation.mutate({
                        userId: user.userId,
                        payload: { enabled: checked, reason: "admin" },
                      });
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Risk Level</Label>
                    <p className="text-xs text-muted-foreground">Set risk classification</p>
                  </div>
                  <Select defaultValue={user.riskLevel}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={freezeWalletsMutation.isPending || unfreezeWalletMutation.isPending}
                  onClick={() => {
                    if (user.walletStatus === "frozen") {
                      unfreezeWalletMutation.mutate(user.userId);
                    } else {
                      freezeWalletsMutation.mutate(user.userId);
                    }
                  }}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  {user.walletStatus === "frozen" ? "Unfreeze" : "Freeze"} Wallets
                </Button>
                <Button variant="outline" className="flex-1">
                  Force Re-KYC
                </Button>
                <Button
                  variant={user.isFlagged ? "outline" : "destructive"}
                  className="flex-1"
                  disabled={flagUserMutation.isPending}
                  onClick={() =>
                    flagUserMutation.mutate({
                      userId: user.userId,
                      payload: { isFlagged: !user.isFlagged, reason: "" },
                    })
                  }
                >
                  <Flag className="mr-2 h-4 w-4" />
                  {user.isFlagged ? "Remove Flag" : "Flag"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                All actions logged to Audit Trail
              </p>
            </TabsContent>

            {/* KYC Tab */}
            <TabsContent value="kyc" className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                KYC Information (Read-only)
              </p>
              {kycLoading ? (
                <TabSpinner />
              ) : !kycData ? (
                <p className="text-sm text-muted-foreground">No KYC data available.</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">BVN</p>
                      <p className="font-mono font-medium">{kyc?.bvn ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">NIN</p>
                      <p className="font-mono font-medium">{kyc?.nin ?? "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ID Type</p>
                      <p className="font-medium">
                        {kyc?.idType ?? kyc?.identificationType ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">VerifyMe Score</p>
                      {kyc?.verifyMeScore != null ? (
                        <p
                          className={cn(
                            "font-bold text-lg",
                            kyc.verifyMeScore >= 80
                              ? "text-success"
                              : kyc.verifyMeScore >= 50
                              ? "text-warning"
                              : "text-destructive"
                          )}
                        >
                          {kyc.verifyMeScore}%
                        </p>
                      ) : (
                        <p className="text-muted-foreground">Awaiting</p>
                      )}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border p-4",
                      user.kycStatus.toLowerCase() === "verified"
                        ? "border-success/30 bg-success/5"
                        : "border-destructive/30 bg-destructive/5"
                    )}
                  >
                    <p className="text-sm font-medium">
                      KYC Status: {user.kycStatus.toUpperCase()}
                    </p>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Wallets Tab */}
            <TabsContent value="wallets" className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Wallet Balances
              </p>
              {walletLoading ? (
                <TabSpinner />
              ) : (
                <>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <p className="text-xs text-muted-foreground">
                      Total Balance (USDT Equivalent)
                    </p>
                    <p className="text-2xl font-bold text-success">
                      {Number(totalUsdtEquiv).toFixed(2)} USDT
                    </p>
                  </div>
                  {tokenBalances.length > 0 && (
                    <>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mt-2">
                        Token Balances
                      </p>
                      <div className="space-y-2">
                        {tokenBalances.map((token: any, i: number) => (
                          <div
                            key={token.coin ?? token.currency ?? i}
                            className="flex items-center justify-between rounded-lg border border-border p-3"
                          >
                            <span className="font-medium text-sm">
                              {token.currency ?? token.coin ?? token.symbol}
                            </span>
                            <div className="text-right">
                              <p className="font-semibold text-sm">
                                {Number(token.availableBalance ?? token.balance ?? token.amount ?? 0).toFixed(6)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Ledger: {Number(token.ledgerBalance ?? 0).toFixed(6)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {tokenBalances.length === 0 && (
                    <p className="text-sm text-muted-foreground">No token balances found.</p>
                  )}
                </>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Transaction History
              </p>
              {activityLoading ? (
                <TabSpinner />
              ) : transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity found.</p>
              ) : (() => {
                const totalActivityPages = Math.max(1, Math.ceil(transactions.length / ACTIVITY_PAGE_SIZE));
                const pagedTransactions = transactions.slice(
                  (activityPage - 1) * ACTIVITY_PAGE_SIZE,
                  activityPage * ACTIVITY_PAGE_SIZE
                );
                return (
                  <>
                    <div className="content-card overflow-hidden">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Tx Type</th>
                            <th>Coin</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedTransactions.map((tx: any, i: number) => (
                            <tr key={tx.id ?? i}>
                              <td className="text-xs text-muted-foreground">
                                {tx.date ?? tx.createdAt
                                  ? new Date(tx.date ?? tx.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "—"}
                              </td>
                              <td className="text-sm font-medium">{tx.type ?? "—"}</td>
                              <td>
                                <span
                                  className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                    tx.transactionType === "On-Chain"
                                      ? "bg-primary/10 text-primary"
                                      : tx.transactionType === "On-Ramp"
                                      ? "bg-success/10 text-success"
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {tx.txType ?? tx.transactionType ?? "—"}
                                </span>
                              </td>
                              <td className="text-sm">{tx.coin ?? tx.currency ?? "—"}</td>
                              <td className="font-semibold text-sm">{tx.amount ?? "—"}</td>
                              <td>
                                <StatusBadge
                                  status={(() => {
                                    const s = (tx.status ?? "").toLowerCase();
                                    if (["completed", "confirmed", "credited"].includes(s)) return "success";
                                    if (["processing", "pending", "leg1_pending"].includes(s)) return "warning";
                                    return "error";
                                  })()}
                                >
                                  {tx.status}
                                </StatusBadge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalActivityPages > 1 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {(activityPage - 1) * ACTIVITY_PAGE_SIZE + 1}–
                          {Math.min(activityPage * ACTIVITY_PAGE_SIZE, transactions.length)} of{" "}
                          {transactions.length}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={activityPage === 1}
                            onClick={() => setActivityPage((p) => p - 1)}
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </Button>
                          <span className="text-xs px-2">
                            {activityPage} / {totalActivityPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={activityPage === totalActivityPages}
                            onClick={() => setActivityPage((p) => p + 1)}
                          >
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Notes
              </p>
              {notesLoading ? (
                <TabSpinner />
              ) : (
                <>
                  {notes.length > 0 && (() => {
                    const totalNotesPages = Math.max(1, Math.ceil(notes.length / NOTES_PAGE_SIZE));
                    const pagedNotes = notes.slice(
                      (notesPage - 1) * NOTES_PAGE_SIZE,
                      notesPage * NOTES_PAGE_SIZE
                    );
                    return (
                      <>
                        <div className="space-y-3">
                          {pagedNotes.map((note) => (
                            <div key={note.id} className="rounded-lg bg-muted/50 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-foreground">
                                  {note.createdByName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(note.createdAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <p className="text-sm">{note.noteText}</p>
                            </div>
                          ))}
                        </div>
                        {totalNotesPages > 1 && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {(notesPage - 1) * NOTES_PAGE_SIZE + 1}–
                              {Math.min(notesPage * NOTES_PAGE_SIZE, notes.length)} of {notes.length}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={notesPage === 1}
                                onClick={() => setNotesPage((p) => p - 1)}
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </Button>
                              <span className="text-xs px-2">
                                {notesPage} / {totalNotesPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={notesPage === totalNotesPages}
                                onClick={() => setNotesPage((p) => p + 1)}
                              >
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                  <Textarea
                    placeholder="Add admin note about this user..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updateNotesMutation.isPending || !adminNotes.trim()}
                    onClick={() => {
                      if (adminNotes.trim()) {
                        updateNotesMutation.mutate({
                          userId: user.userId,
                          payload: { notes: adminNotes },
                        });
                      }
                    }}
                  >
                    {updateNotesMutation.isPending ? "Saving..." : "Save Note"}
                  </Button>
                  <p className="text-xs text-muted-foreground">Notes are logged to Audit Trail</p>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
