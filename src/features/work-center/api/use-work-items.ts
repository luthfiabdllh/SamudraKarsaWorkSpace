import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { workCenterKeys } from './query-keys';
import type { WorkCenterFilterParams, WorkItem } from '../types';

/**
 * Mengambil daftar pekerjaan dari backend NestJS melalui BFF.
 */
export function useWorkItems(filters?: WorkCenterFilterParams) {
  return useQuery({
    queryKey: workCenterKeys.list(filters),
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {};

      if (filters?.divisionId) params.divisionId = filters.divisionId;
      if (filters?.priority) params.priority = filters.priority;
      if (filters?.status) params.status = filters.status;
      if (filters?.type) params.type = filters.type;
      if (filters?.withoutPic) params.withoutPic = true;
      if (filters?.q) params.q = filters.q;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.offset) params.offset = filters.offset;

      const response = await apiClient.get<WorkItem[]>('/work-items', { params });
      return response.data;
    },
  });
}
