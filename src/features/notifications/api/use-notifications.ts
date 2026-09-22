import { useQuery } from '@tanstack/react-query';
import type { NotificationItem } from '../types';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (since?: string) => [...notificationKeys.all, { since }] as const,
};

export function useNotifications(since?: string) {
  return useQuery({
    queryKey: notificationKeys.list(since),
    queryFn: async (): Promise<NotificationItem[]> => {
      const sp = new URLSearchParams();
      if (since) sp.set('since', since);

      const qs = sp.toString() ? `?${sp.toString()}` : '';
      const res = await fetch(`/api/v1/notifications${qs}`);
      if (!res.ok) {
        return [];
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 30_000, // Polling every 30 seconds
    staleTime: 20_000,
  });
}
