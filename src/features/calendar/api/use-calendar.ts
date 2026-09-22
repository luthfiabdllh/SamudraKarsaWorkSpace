import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { calendarKeys } from './query-keys';
import type { CalendarEventItem, CalendarEventDetail } from '../types';
import type {
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
  UpdateRsvpInput,
} from '../schemas/calendar';

export function useCalendarEvents(divisionId?: string) {
  return useQuery({
    queryKey: calendarKeys.eventList(divisionId),
    queryFn: async (): Promise<CalendarEventItem[]> => {
      const sp = new URLSearchParams();
      if (divisionId) sp.set('divisionId', divisionId);

      const qs = sp.toString() ? `?${sp.toString()}` : '';
      const res = await fetch(`/api/v1/calendar/events${qs}`);
      if (!res.ok) {
        throw new Error('Gagal memuat jadwal kegiatan kalender.');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.items ?? [];
    },
  });
}

export function useCalendarEventDetail(id: string | null) {
  return useQuery({
    queryKey: calendarKeys.eventDetail(id || ''),
    queryFn: async (): Promise<CalendarEventDetail> => {
      if (!id) throw new Error('ID kegiatan diperlukan.');
      const res = await fetch(`/api/v1/calendar/events/${id}`);
      if (!res.ok) {
        throw new Error('Gagal memuat detail kegiatan kalender.');
      }
      return res.json();
    },
    enabled: Boolean(id),
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCalendarEventInput): Promise<CalendarEventItem> => {
      const res = await fetch('/api/v1/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal menambahkan kegiatan kalender.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Kegiatan berhasil dijadwalkan pada kalender.');
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useUpdateCalendarEvent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      version,
    }: {
      payload: UpdateCalendarEventInput;
      version?: number;
    }): Promise<CalendarEventItem> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (version !== undefined) {
        headers['If-Match'] = `"${version}"`;
      }

      const res = await fetch(`/api/v1/calendar/events/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal memperbarui kegiatan kalender.');
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success('Kegiatan kalender berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useUpdateRsvp(eventId: string, profileId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateRsvpInput) => {
      const res = await fetch(`/api/v1/calendar/events/${eventId}/attendees/${profileId}/rsvp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Gagal memperbarui status kehadiran.');
      }
    },
    onSuccess: () => {
      toast.success('Status kehadiran Anda berhasil dicatat.');
      queryClient.invalidateQueries({ queryKey: calendarKeys.eventDetail(eventId) });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
