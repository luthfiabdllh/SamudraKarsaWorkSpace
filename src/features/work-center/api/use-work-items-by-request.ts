import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { WorkItem } from '../types';

export interface WorkItemsByRequestResponse {
  stories: Array<WorkItem & { tasks: WorkItem[] }>;
  orphanTasks: WorkItem[];
}

export function useWorkItemsByRequest(requestId: string | null) {
  return useQuery({
    queryKey: ['work-items', 'by-request', requestId],
    queryFn: async () => {
      if (!requestId) return null;
      const response = await apiClient.get<WorkItemsByRequestResponse>(
        `/work-items/by-request/${requestId}`
      );
      return response.data;
    },
    enabled: Boolean(requestId),
  });
}
