import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowLeftRight,
  Bitcoin,
  Gift,
  Banknote,
  MessageSquare,
  Percent,
  ShieldCheck,
  Webhook,
  FileBarChart,
  Settings,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Wallets", href: "/wallets", icon: Wallet },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Crypto Exchange", href: "/crypto", icon: Bitcoin },
  { name: "Gift Cards", href: "/gift-cards", icon: Gift },
  { name: "Withdrawals", href: "/withdrawals", icon: Banknote },
  { name: "AI & WhatsApp Logs", href: "/ai-logs", icon: MessageSquare },
  { name: "Rates & Markups", href: "/rates", icon: Percent },
  { name: "Compliance & KYC", href: "/compliance", icon: ShieldCheck },
  { name: "Webhooks & API", href: "/webhooks", icon: Webhook },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Admin Roles", href: "/admin-roles", icon: UserCog },
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
