export interface AdminUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  status?: string;
  roles: string[];
  primaryRole: string;
  createdAt: string;
  lastLoginAt: string | null;
  lastActiveDisplay: string | null;
}

export interface CreateAdminPayload {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roleIds: string[];
  isSuperAdmin: boolean;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string | null;
  ipAddress: string;
  result: string;
}

export interface AuditFilter {
  adminId?: string;
  action?: string;
  from?: string;
  to?: string;
  skip?: number;
  take?: number;
}
