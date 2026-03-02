import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Percent,
  Webhook,
  Scale,
  Settings,
  UserCog,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Wallets (OpenXSwitch)", href: "/wallets", icon: Building2 },
  { name: "Send (OpenXSwitch)", href: "/oxs-send", icon: ArrowUpRight },
  { name: "Receive (OpenXSwitch)", href: "/oxs-receive", icon: ArrowDownLeft },
  { name: "Swap (OpenXSwitch)", href: "/oxs-swap", icon: RefreshCw },
  { name: "Deposits (Network In)", href: "/deposits", icon: ArrowDownLeft },
  { name: "Withdrawals (Network Out)", href: "/withdrawals", icon: ArrowUpRight },
  { name: "Transaction History", href: "/transaction-history", icon: History },
  { name: "Rates & Markups", href: "/rates", icon: Percent },
  { name: "Webhooks & Provider Logs", href: "/webhooks", icon: Webhook },
  { name: "Reconciliation & Settlement", href: "/reconciliation", icon: Scale },
  { name: "Admin Roles & Audit Trail", href: "/admin-roles", icon: UserCog },
  { name: "System Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">V</span>
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">VIXA</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin p-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={cn(
                      "nav-item",
                      isActive ? "nav-item-active" : "nav-item-inactive",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-item nav-item-inactive w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
