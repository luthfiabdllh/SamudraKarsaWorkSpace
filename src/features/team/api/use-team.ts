import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { teamKeys } from './query-keys';
import type { AnnouncementItem, FeedbackItem } from '../types';
import type {
  CreateAnnouncementInput,
  CreateFeedbackInput,
} from '../schemas/team';

export function useAnnouncements(divisionId?: string) {
  return useQuery({
    queryKey: teamKeys.announcements(divisionId),
    queryFn: async (): Promise<AnnouncementItem[]> => {
      const sp = new URLSearchParams();
      if (divisionId) sp.set('divisionId', divisionId);

      const qs = sp.toString() ? `?${sp.toString()}` : '';
      const res = await fetch(`/api/v1/announcements${qs}`);
      if (!res.ok) {
        throw new Error('Gagal memuat daftar pengumuman.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAnnouncementInput): Promise<AnnouncementItem> => {
      const res = await fetch('/api/v1/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal mempublikasikan pengumuman.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Pengumuman resmi berhasil dipublikasikan.');
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useFeedbackList(periodId?: string) {
  return useQuery({
    queryKey: teamKeys.feedback(periodId),
    queryFn: async (): Promise<FeedbackItem[]> => {
      const sp = new URLSearchParams();
      if (periodId) sp.set('periodId', periodId);

      const qs = sp.toString() ? `?${sp.toString()}` : '';
      const res = await fetch(`/api/v1/feedback${qs}`);
      if (!res.ok) {
        throw new Error('Gagal memuat catatan aspirasi.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateFeedbackInput): Promise<FeedbackItem> => {
      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal mengirimkan aspirasi.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Aspirasi Anda berhasil dikirimkan.');
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
