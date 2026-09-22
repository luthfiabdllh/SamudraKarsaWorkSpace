import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { workCenterKeys } from './query-keys';
import type { WorkItemDetail } from '../types';

/**
 * Mengambil detail lengkap sebuah pekerjaan (memuat availableTransitions & transitionRequirements)
 */
export function useWorkItemDetail(id: string | null) {
  return useQuery({
    queryKey: workCenterKeys.detail(id ?? ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<WorkItemDetail>(`/work-items/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
