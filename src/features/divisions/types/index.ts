import type { Role } from '@/features/auth/types';

export interface Division {
  id: string;
  code: string;
  name: string;
  icon: string | null;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cluster {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subunit {
  id: string;
  code: string;
  name: string;
  villageName: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DivisionMemberItem {
  id: string;
  fullName: string | null;
  email?: string | null;
  nickname: string | null;
  roles: readonly Role[];
  divisionId: string | null;
  clusterId?: string | null;
  subunitId?: string | null;
  teamRole: string | null;
  status: string;
  photoUrl: string | null;
}
