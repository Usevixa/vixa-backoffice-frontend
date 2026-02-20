
# VIXA Ops Hub — Major Refactor Plan

## What This Changes

This is a significant but surgical refactor — no rebuild. The existing aesthetic, component library, sidebar, table, and card patterns are preserved. We're adding new pages, reworking terminology, wiring an auth gate, and ensuring every screen aligns to VIXA's real operational model (Deposits / Withdrawals / Swaps as first-class primitives, OpenXSwitch and Yellow Card as the only providers).

---

## Summary of All Changes

### New Files to Create
- `src/pages/Login.tsx` — Auth gate (UI-only, mocked)
- `src/pages/Deposits.tsx` — Dedicated deposits module
- `src/pages/Withdrawals.tsx` — Dedicated withdrawals module (ops-critical)
- `src/pages/Swaps.tsx` — Dedicated swaps module (extracted from StablecoinOperations)
- `src/pages/YellowCardConsole.tsx` — Provider-centric Yellow Card view
- `src/context/AuthContext.tsx` — Simple mocked auth state

### Files to Modify
- `src/App.tsx` — Add auth gate, new routes, rename/restructure
- `src/components/layout/Sidebar.tsx` — New nav items + ordering
- `src/components/layout/MainLayout.tsx` — Auth-aware layout
- `src/components/layout/Header.tsx` — Improved search placeholder
- `src/pages/Dashboard.tsx` — Duration selector, USDT-equiv totals, correct KPIs/charts
- `src/pages/Users.tsx` — Pagination, page size selector, full detail screen tabs
- `src/pages/Wallets.tsx` — Rename "Wallets & Ledger", USDT-equiv primary display
- `src/pages/StablecoinOperations.tsx` — Remove Swaps tab (extracted to dedicated page), focus on Yellow Card rail operations
- `src/pages/OpenXSwitchConsole.tsx` — Rename internal labels, reinforce routing/execution framing
- `src/pages/Rates.tsx` — Split into Deposits / Withdrawals tabs
- `src/pages/Compliance.tsx` — Rename to "Compliance & Risk", add transaction flags tab
- `src/pages/Settings.tsx` — Add User Profiling tab, expand Feature Toggles + Alert Thresholds
- `src/pages/Reports.tsx` — Add deposits, withdrawals, swaps, wallets to report types

---

## Technical Implementation Details

### 1. Auth Gate (UI-Only, Mocked)

**New: `src/context/AuthContext.tsx`**
- Simple React context with `isAuthenticated` boolean and `login()` / `logout()` functions
- `login()` sets auth state (no real backend)
- Persists in `sessionStorage` for page refresh tolerance

**New: `src/pages/Login.tsx`**
- Email/Phone + Password fields
- "Login" CTA button — calls `login()` and routes to `/`
- "Forgot Password" secondary link (placeholder, no action)
- Optional 2FA step: after login click, briefly shows "Enter OTP" screen with Verify + Resend OTP buttons, then completes auth
- Uses existing Input, Button, Label components
- Visual design matches VIXA fintech aesthetic: centered card, VIXA logo, clean form

**Modify: `src/App.tsx`**
- Wrap MainLayout routes with auth check: if `!isAuthenticated` → redirect to `/login`
- Add `/login` route outside MainLayout
- Add new module routes: `/deposits`, `/withdrawals`, `/swaps`, `/yellowcard`

**Modify: `src/components/layout/Header.tsx`**
- Update search placeholder: "Search users, deposits, withdrawals, swaps, wallet IDs..."
- Update user profile dropdown to show "Logout" that calls `logout()` from context

### 2. Sidebar Navigation Patch

**Modify: `src/components/layout/Sidebar.tsx`**

New ordered navigation array:
```
1.  Dashboard           /
2.  Users               /users
3.  Wallets & Ledger    /wallets      ← rename from "Wallets & Balances"
4.  Deposits            /deposits     ← NEW
5.  Withdrawals         /withdrawals  ← NEW (was merged into Transfers)
6.  Swaps               /swaps        ← NEW (extracted from StablecoinOperations)
7.  OpenXSwitch Console /openxswitch
8.  Yellow Card Console /yellowcard   ← NEW
9.  Rates & Markups     /rates
10. Compliance & Risk   /compliance   ← rename from "Compliance & KYC"
11. Webhooks & API Logs /webhooks
12. Reconciliation...   /reconciliation
13. Reports & Exports   /reports
14. Admin Roles...      /admin-roles
15. System Settings     /settings
```

Remove: "Transfers & Payouts" (replaced by Deposits + Withdrawals + Swaps)

Icons: Deposits → `ArrowDownLeft`, Withdrawals → `ArrowUpRight`, Swaps → `RefreshCw`, Yellow Card → `Zap` or `CreditCard`

### 3. Dashboard Refactor

**Modify: `src/pages/Dashboard.tsx`**

Add duration selector at top right of content area using existing Select component:
- Options: Today, 24h, 7 Days, 30 Days, 90 Days, All Time, Custom Range
- State: `selectedRange` — shows label next to KPI cards

KPI Cards (row 1 — primary money flow):
- Deposits Volume (USDT equiv) + count
- Withdrawals Volume (USDT equiv) + count
- Swaps Volume (USDT equiv) + count
- Markup Revenue (USDT equiv)

KPI Cards (row 2 — platform health):
- Total Users
- Verified Users
- Total Wallet Value (USDT equiv)
- Failed Transactions (24h)
- Pending Withdrawals (count + USDT equiv)

Charts (reuse existing `TransactionChart` component area):
- Chart 1: Flow Volume Trend — Deposits vs Withdrawals (2 series, USDT equiv)
- Chart 2: Provider Split — OpenXSwitch vs Yellow Card volumes

Alerts Panel (reuse existing `AlertCard` components):
- Withdrawals stuck >30 mins
- Webhook failures spike (provider-tagged)
- Compliance queue backlog
- Swap imbalance anomalies

### 4. Users Module Enhancements

**Modify: `src/pages/Users.tsx`**

Table enhancements:
- Add "Withdrawals Status" column (Enabled / Disabled badge)
- Keep existing columns: User ID, Full Name, Phone, KYC Status, Risk Level, Wallet Status, Created Date
- Add pagination below table: Prev / Next, page numbers (1, 2, 3...), current page indicator
- Add page size selector: 25 / 50 / 100 rows per page (Select component)

User Detail Sheet enhancement:
- Add sub-tabs inside the sheet: **Profile** | **KYC** | **Wallets** | **Activity** | **Notes**
- Profile tab: existing profile info + risk level + KYC badge + admin controls
- KYC tab: show KYC data read-only (BVN, NIN, ID type, VerifyMe score)
- Wallets tab: show NGN + USDT + USDC balances with USDT equiv primary
- Activity tab: mini-tabs for Deposits / Withdrawals / Swaps / Provider Events (placeholder tables)
- Notes tab: Admin notes textarea with save button (thread-like display of saved notes)
- Action buttons: Freeze/Unfreeze, Disable Withdrawals, Set Risk Level (Select), Force Re-KYC (placeholder)

### 5. Wallets & Ledger

**Modify: `src/pages/Wallets.tsx`**

- Rename page title to "Wallets & Ledger"
- Wallet table: add "Balance (USDT equiv)" column as **primary** display, native amount as secondary
- Stats row: show total platform value in USDT equiv as primary metric
- Ledger sheet: enhance existing activity summary to show USDT-equivalent values
- Ledger entries table: add `Entity Type` column (Deposit / Withdrawal / Swap / Adjustment) and `Entity ID` link column
- Manual adjustment: already has reason field + audit note — keep, ensure warning text is prominent

### 6. New Deposits Module

**New: `src/pages/Deposits.tsx`**

Modeled after Transfers.tsx pattern but specific to deposits.

Stats cards:
- Deposits Today (USDT equiv)
- Pending Deposits count
- Failed Deposits (24h)
- Success Rate (%)

Filters: Provider (OpenXSwitch / Yellow Card), Channel (Bank / Mobile Money / Stablecoin Rail), Status, Date range, Search

Table columns:
- Deposit ID
- User (name + ID)
- Amount (USDT equiv) [primary], Native Amount [secondary]
- Channel badge (Bank / Mobile Money / Stablecoin Rail)
- Provider badge (OpenXSwitch / Yellow Card)
- Status badge (Initiated / Confirmed / Credited / Failed)
- Created At

Row drawer (Sheet):
- Status timeline: INITIATED → CONFIRMED → CREDITED → SETTLED
- Provider reference IDs
- Linked wallet ledger entries
- Related webhook logs (linked transfer IDs)
- Admin notes field

### 7. New Withdrawals Module (Ops-Critical)

**New: `src/pages/Withdrawals.tsx`**

This is the highest-priority operational screen.

Stats cards:
- Withdrawals Today (USDT equiv)
- Pending count
- Failed (24h)
- Avg Processing Time

Tabs: **All Withdrawals** | **Queue** (pending/processing sorted by age)

All Withdrawals table columns:
- Withdrawal ID
- User (name + ID)
- Amount (USDT equiv) [primary]
- Destination (masked bank/MOMO — e.g., "Access Bank ***4521")
- Provider badge (OpenXSwitch / Yellow Card)
- Status badge
- Age (mins since initiated for pending, — for completed)
- Created At

Queue tab:
- Same columns + SLA indicator (Green <10min, Amber 10-30min, Red >30min)
- Quick filter buttons: ">30 min", "Failed last 2h", "OpenXSwitch", "Yellow Card"
- SLA breach alert banner if any red items exist

Row drawer (Sheet):
- Full status timeline
- Provider reference IDs
- Retry count
- Last provider response summary
- Linked ledger debit reference
- Related webhook log IDs
- Admin notes

Row actions:
- Retry (failed only)
- Escalate (flags + note)
- Mark Resolved (adds note)

### 8. New Swaps Module

**New: `src/pages/Swaps.tsx`**

Extracted from `StablecoinOperations.tsx` Swaps tab. Now a top-level module.

Stats cards:
- Swaps Today (USDT equiv)
- Active Swaps
- Failed Swaps (24h)
- Total Spread Earned

Filters: From/To currency, Status, Date range, Search

Table columns:
- Swap ID
- User
- From Currency → To Currency (with arrow)
- Amount In (native)
- Amount Out (native)
- USDT Equiv
- Rate Used
- Spread / Markup
- Status (INITIATED / RATE_LOCKED / COMPLETED / FAILED)
- Timestamp

Row drawer:
- Rate snapshot (base + markup breakdown)
- Debit wallet reference + Credit wallet reference
- Provider involvement (if Yellow Card was used for rate)
- Timeline events
- Anomaly flag button

### 9. Stablecoin Operations (Yellow Card Rail Focus)

**Modify: `src/pages/StablecoinOperations.tsx`**
- Remove Swaps tab (now its own page)
- Rename description to make clear this is Yellow Card stablecoin rail visibility
- Operations tab becomes "Yellow Card Operations" focus
- Table updated: link operations to Deposits or Withdrawals where applicable
- Add operation types: Deposit Confirmation, Withdrawal Payout, Swap Rate provision

### 10. New Yellow Card Console

**New: `src/pages/YellowCardConsole.tsx`**

Provider-centric view for Yellow Card, mirroring OpenXSwitch Console pattern.

Provider status banner (like OpenXSwitch Console).

Tabs:
1. **Operations** — table of Yellow Card operations: Operation ID, Linked Entity (Deposit/Withdrawal/Swap), Currency, Amount, Status, Timestamp, YC Ref
2. **Rail Health** — Success rate, avg latency, failure count (24h), downtime status; simple table by operation type

### 11. Rates & Markups (Deposits / Withdrawals Tabs)

**Modify: `src/pages/Rates.tsx`**

Change tabs from "Stablecoin Rates" / "Transaction Bands" / "Change History" to:
- **Deposits** tab: base rate display + deposit markup config + effective rate preview
- **Withdrawals** tab: base rate display + withdrawal markup config + effective rate preview
- **Change History** tab: keep existing

Each tab:
- Base rate (read-only label: "Live from Yellow Card")
- Markup input: % or fixed
- Effective user rate preview widget: "For X NGN deposit → user receives Y USDT at Z rate"
- Guardrail banner if negative spread (already implemented, keep)

Remove any "stablecoin exchange" or "promo" language not relevant to deposit/withdrawal pricing.

### 12. Compliance & Risk

**Modify: `src/pages/Compliance.tsx`**

- Rename page title from "Compliance & KYC" to "Compliance & Risk"
- Add third tab: **Transaction Flags** alongside KYC Reviews and Risk Flags
- Transaction Flags table: Flag ID, Type (Large Withdrawal / Rapid Swaps / Repeated Failures), Linked Entity, Severity, Status, Created At, Actions (Investigate / Dismiss)
- Add dummy flag data for realistic ops feel

### 13. System Settings Enhancement

**Modify: `src/pages/Settings.tsx`**

Restructure tabs to three sections:

**Tab A: User Profiling**
- User tiers list: Standard / Verified / High Value (simple editable list UI with labels)
- Risk level mapping: dropdown rules (e.g., if 3+ failed transfers → set risk = medium)
- Withdrawal permissions per tier: toggle per tier

**Tab B: Feature Toggles** (expand existing)
Add toggles:
- Deposits enabled
- Withdrawals enabled
- Swaps enabled
- OpenXSwitch enabled
- Yellow Card enabled
- Maintenance mode (already exists)
- Manual review mode for withdrawals
- Auto-retry failed withdrawals
- Allow receive-only when user is frozen

**Tab C: Alert Thresholds** (expand existing)
Add config fields:
- Withdrawal stuck threshold (minutes)
- Webhook failure spike threshold (count per hour)
- Success rate drop threshold (%)
- Swap imbalance threshold (count)
- SLA queue thresholds:
  - Green (minutes)
  - Amber (minutes)
  - Red (minutes)

### 14. Reports & Exports Enhancement

**Modify: `src/pages/Reports.tsx`**

Add report types: Deposits Report, Withdrawals Report, Swaps Report, Wallets Report
Update Quick Export dropdown to include all new types
Keep existing scheduled reports section

---

## Files Summary

| Action | File |
|--------|------|
| CREATE | `src/pages/Login.tsx` |
| CREATE | `src/pages/Deposits.tsx` |
| CREATE | `src/pages/Withdrawals.tsx` |
| CREATE | `src/pages/Swaps.tsx` |
| CREATE | `src/pages/YellowCardConsole.tsx` |
| CREATE | `src/context/AuthContext.tsx` |
| MODIFY | `src/App.tsx` |
| MODIFY | `src/components/layout/Sidebar.tsx` |
| MODIFY | `src/components/layout/MainLayout.tsx` |
| MODIFY | `src/components/layout/Header.tsx` |
| MODIFY | `src/pages/Dashboard.tsx` |
| MODIFY | `src/pages/Users.tsx` |
| MODIFY | `src/pages/Wallets.tsx` |
| MODIFY | `src/pages/StablecoinOperations.tsx` |
| MODIFY | `src/pages/Rates.tsx` |
| MODIFY | `src/pages/Compliance.tsx` |
| MODIFY | `src/pages/Settings.tsx` |
| MODIFY | `src/pages/Reports.tsx` |

---

## Design Constraints (Strictly Preserved)
- All existing CSS classes: `content-card`, `metric-card`, `data-table`, `nav-item`, `page-title`, `status-badge` etc. — untouched
- Color system (primary blue, success green, warning amber, destructive red) — untouched
- Sidebar collapse behavior — untouched
- Sheet/Drawer pattern for details — untouched
- Table + filter pattern — untouched
- Font (Inter) and spacing — untouched

## Validation Checklist (Post-Implementation)
- Zero Gift Card references
- Zero Quidax references
- Only OpenXSwitch + Yellow Card as providers
- All platform totals displayed in USDT equivalent
- Deposits / Withdrawals / Swaps are first-class modules
- Admin login gates the entire app
- Dashboard duration selector present
- Users list has pagination + page size
- Withdrawals queue has SLA indicators
- Settings has User Profiling + expanded Feature Toggles + Alert Thresholds
