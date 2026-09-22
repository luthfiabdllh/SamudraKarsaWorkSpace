import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { requestKeys } from './query-keys';
import type { RequestFilterParams, RequestItem } from '../types';

export interface DivisionOption {
  id: string;
  name: string;
  code: string;
}

/**
 * Mengambil daftar permintaan dari backend NestJS melalui BFF.
 */
export function useRequests(filters?: RequestFilterParams) {
  return useQuery({
    queryKey: requestKeys.list(filters),
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {};

      if (filters?.targetDivisionId) params.targetDivisionId = filters.targetDivisionId;
      if (filters?.requesterId) params.requesterId = filters.requesterId;
      if (filters?.assignedPicId) params.assignedPicId = filters.assignedPicId;
      if (filters?.priority) params.priority = filters.priority;
      if (filters?.status) params.status = filters.status;
      if (filters?.type) params.type = filters.type;
      if (filters?.withoutPic) params.withoutPic = true;
      if (filters?.hasSyncConflict) params.hasSyncConflict = true;
      if (filters?.q) params.q = filters.q;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.offset) params.offset = filters.offset;

      const response = await apiClient.get<RequestItem[]>('/requests', { params });
      return response.data;
    },
  });
}

/**
 * Mengambil daftar divisi organisasi untuk dropdown filter dan formulir pengajuan.
 */
export function useDivisions() {
  return useQuery({
    queryKey: requestKeys.divisions(),
    queryFn: async () => {
      const response = await apiClient.get<DivisionOption[]>('/organization/divisions');
      return response.data;
    },
  });
}
