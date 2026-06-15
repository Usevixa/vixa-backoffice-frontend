import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidateInviteToken, useAcceptInviteMutation } from "@/hooks/useAuthMutations";

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "At least 8 characters required";
  if (!/[A-Z]/.test(pw)) return "Must contain at least one uppercase letter";
  if (!/[0-9]/.test(pw)) return "Must contain at least one number";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Must contain at least one special character";
  return null;
}

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: inviteData, isLoading: validating, isError: tokenInvalid } = useValidateInviteToken(token);
  const mutation = useAcceptInviteMutation(() => navigate("/login"));

  const passwordError = password.length > 0 ? validatePassword(password) : null;
  const passwordMismatch = password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmit =
    !!token &&
    !tokenInvalid &&
    !validating &&
    password.length > 0 &&
    !passwordError &&
    !passwordMismatch &&
    !mutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !token) return;
    mutation.mutate({ token, password, confirmPassword });
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 shadow-sm text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary mx-auto">
            <span className="text-base font-bold text-primary-foreground">V</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Invalid invite link</h1>
          <p className="text-sm text-muted-foreground">
            This invite link is missing required information. Please check your email for the correct link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-base font-bold text-primary-foreground">V</span>
          </div>
          {validating ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying invite...
            </div>
          ) : tokenInvalid ? (
            <>
              <h1 className="text-xl font-semibold tracking-tight">Invite link expired</h1>
              <p className="text-sm text-destructive">
                This invite link is invalid or has expired. Please request a new invite.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold tracking-tight">
                Set password for {inviteData?.email}
              </h1>
              {(inviteData?.firstName || inviteData?.lastName) && (
                <p className="text-sm text-muted-foreground">
                  Welcome, {[inviteData.firstName, inviteData.lastName].filter(Boolean).join(" ")}
                </p>
              )}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={tokenInvalid || validating || mutation.isPending}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-destructive">{passwordError}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={tokenInvalid || validating || mutation.isPending}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordMismatch && (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Set Password
          </Button>
        </form>
      </div>
    </div>
  );
}
