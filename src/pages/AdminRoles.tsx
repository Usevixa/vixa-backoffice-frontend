import { useState } from "react";
import { Search, Plus, MoreHorizontal, Shield, Eye, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";

const admins = [
  {
    id: "ADM-001",
    name: "John Adeyemi",
    email: "john@vixa.com",
    role: "super_admin",
    status: "active",
    lastActive: "2 mins ago",
  },
  {
    id: "ADM-002",
    name: "Sarah Okafor",
    email: "sarah@vixa.com",
    role: "ops_admin",
    status: "active",
    lastActive: "15 mins ago",
  },
  {
    id: "ADM-003",
    name: "Michael Eze",
    email: "michael@vixa.com",
    role: "compliance",
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: "ADM-004",
    name: "Grace Nwosu",
    email: "grace@vixa.com",
    role: "analyst",
    status: "active",
    lastActive: "3 hours ago",
  },
  {
    id: "ADM-005",
    name: "David Musa",
    email: "david@vixa.com",
    role: "ops_admin",
    status: "inactive",
    lastActive: "2 days ago",
  },
];

const roles = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access to all features and settings",
    color: "bg-destructive/10 text-destructive",
  },
  {
    id: "ops_admin",
    name: "Ops Admin",
    description: "Manage transactions, users, and daily operations",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "compliance",
    name: "Compliance Officer",
    description: "Review KYC, manage risk flags, audit logs",
    color: "bg-warning/10 text-warning",
  },
  {
    id: "analyst",
    name: "Read-Only Analyst",
    description: "View-only access to reports and dashboards",
    color: "bg-muted text-muted-foreground",
  },
];

const permissions = [
  { id: "dashboard", label: "Dashboard", super_admin: true, ops_admin: true, compliance: true, analyst: true },
  { id: "users_view", label: "View Users", super_admin: true, ops_admin: true, compliance: true, analyst: true },
  { id: "users_edit", label: "Edit Users", super_admin: true, ops_admin: true, compliance: false, analyst: false },
  { id: "wallets_view", label: "View Wallets", super_admin: true, ops_admin: true, compliance: true, analyst: true },
  { id: "wallets_adjust", label: "Adjust Balances", super_admin: true, ops_admin: false, compliance: false, analyst: false },
  { id: "transactions", label: "View Transactions", super_admin: true, ops_admin: true, compliance: true, analyst: true },
  { id: "kyc_review", label: "Review KYC", super_admin: true, ops_admin: true, compliance: true, analyst: false },
  { id: "rates_edit", label: "Edit Rates", super_admin: true, ops_admin: false, compliance: false, analyst: false },
  { id: "settings", label: "System Settings", super_admin: true, ops_admin: false, compliance: false, analyst: false },
  { id: "admin_manage", label: "Manage Admins", super_admin: true, ops_admin: false, compliance: false, analyst: false },
];

export default function AdminRoles() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Admin Roles & Permissions</h1>
          <p className="page-description">
            Manage admin users and their access levels
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Role Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {roles.map((role) => (
          <div key={role.id} className="content-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${role.color}`}>
                {role.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{role.description}</p>
            <p className="text-sm font-medium mt-2">
              {admins.filter((a) => a.role === role.id).length} admins
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
            />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Admin</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => {
              const role = roles.find((r) => r.id === admin.role);
              return (
                <tr key={admin.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {admin.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${role?.color}`}>
                      {role?.name}
                    </span>
                  </td>
                  <td>
                    <StatusBadge
                      status={admin.status === "active" ? "success" : "neutral"}
                    >
                      {admin.status}
                    </StatusBadge>
                  </td>
                  <td className="text-muted-foreground">{admin.lastActive}</td>
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Activity
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Admin
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

      {/* Permissions Matrix */}
      <div className="content-card">
        <div className="content-card-header">
          <h3 className="content-card-title">Permissions Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Permission</th>
                <th className="text-center">Super Admin</th>
                <th className="text-center">Ops Admin</th>
                <th className="text-center">Compliance</th>
                <th className="text-center">Analyst</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.id}>
                  <td className="font-medium">{perm.label}</td>
                  <td className="text-center">
                    <Checkbox checked={perm.super_admin} disabled />
                  </td>
                  <td className="text-center">
                    <Checkbox checked={perm.ops_admin} disabled />
                  </td>
                  <td className="text-center">
                    <Checkbox checked={perm.compliance} disabled />
                  </td>
                  <td className="text-center">
                    <Checkbox checked={perm.analyst} disabled />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
