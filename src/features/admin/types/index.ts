export const RECYCLE_BIN_TABLES = [
  'work_items',
  'requests',
  'letters',
  'budgets',
  'transactions',
  'dues',
  'content_items',
  'creative_projects',
  'partners',
  'inventory_items',
  'shipments',
  'logistics_trips',
  'meetings',
  'announcements',
] as const;

export type RecycleBinTable = (typeof RECYCLE_BIN_TABLES)[number];

export type MemberAccountStatus = 'active' | 'inactive';

export interface AdminMemberItem {
  id: string;
  fullName: string;
  email: string;
  status: MemberAccountStatus;
  roles: string[];
  divisionId?: string | null;
  divisionName?: string | null;
  clusterId?: string | null;
  clusterName?: string | null;
  subunitId?: string | null;
  subunitName?: string | null;
  teamRole?: string | null;
  isKormasit?: boolean;
  isKormater?: boolean;
  periodId?: string | null;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface RecycleBinItem {
  id: string;
  tableName: RecycleBinTable;
  title: string;
  deletedAt: string;
  deletedBy?: string | null;
  deletedByName?: string | null;
  summary?: string | null;
}

export interface AuditLogItem {
  id: string;
  action: string;
  actorId?: string | null;
  actorName?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export type AdminTab = 'members' | 'recycle-bin' | 'audit';
