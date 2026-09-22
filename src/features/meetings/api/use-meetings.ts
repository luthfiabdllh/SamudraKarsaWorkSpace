import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { meetingKeys } from './query-keys';
import type { MeetingItem, MeetingDetail, MeetingDecision } from '../types';
import type {
  CreateMeetingInput,
  UpdateMeetingInput,
  CreateMeetingDecisionInput,
} from '../schemas/meeting';

export function useMeetings(periodId?: string) {
  return useQuery({
    queryKey: meetingKeys.list(periodId),
    queryFn: async (): Promise<MeetingItem[]> => {
      const sp = new URLSearchParams();
      if (periodId) sp.set('periodId', periodId);

      const qs = sp.toString() ? `?${sp.toString()}` : '';
      const res = await fetch(`/api/v1/meetings${qs}`);
      if (!res.ok) {
        throw new Error('Gagal memuat agenda rapat.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useMeetingDetail(id: string | null) {
  return useQuery({
    queryKey: meetingKeys.detail(id || ''),
    queryFn: async (): Promise<MeetingDetail> => {
      if (!id) throw new Error('ID rapat diperlukan.');
      const res = await fetch(`/api/v1/meetings/${id}`);
      if (!res.ok) {
        throw new Error('Gagal memuat detail rapat dan notulensi.');
      }
      return res.json();
    },
    enabled: Boolean(id),
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateMeetingInput): Promise<MeetingItem> => {
      const res = await fetch('/api/v1/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal menjadwalkan rapat.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Rapat berhasil dijadwalkan.');
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useUpdateMeeting(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      version,
    }: {
      payload: UpdateMeetingInput;
      version?: number;
    }): Promise<MeetingItem> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (version !== undefined) {
        headers['If-Match'] = `"${version}"`;
      }

      const res = await fetch(`/api/v1/meetings/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal memperbarui notulensi rapat.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Notulensi rapat berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useCreateMeetingDecision(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateMeetingDecisionInput): Promise<MeetingDecision> => {
      const res = await fetch(`/api/v1/meetings/${meetingId}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal menambahkan keputusan rapat.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Butir keputusan rapat berhasil dicatat.');
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useFollowUpMeetingDecision(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (decisionId: string) => {
      const res = await fetch(`/api/v1/meetings/${meetingId}/decisions/${decisionId}/follow-up`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.message ||
            'Gagal mengalihkan butir keputusan rapat menjadi Work Item.'
        );
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Keputusan berhasil dialihkan menjadi Work Item di Work Center!');
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: ['work-items'] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
