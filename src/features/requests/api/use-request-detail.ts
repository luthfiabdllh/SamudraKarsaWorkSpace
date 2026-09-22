import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { requestKeys } from './query-keys';
import type { RequestDetail } from '../types';

/**
 * Mengambil detail lengkap sebuah pengajuan (termasuk availableTransitions, transitionRequirements, syncConflictAt, linkedWorkItemId).
 */
export function useRequestDetail(id: string | null) {
  return useQuery({
    queryKey: requestKeys.detail(id ?? ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<RequestDetail>(`/requests/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
