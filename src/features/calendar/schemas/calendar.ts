import { z } from 'zod';
import { CALENDAR_EVENT_TYPES, RSVP_STATUSES } from '../types';

export const createCalendarEventSchema = z.object({
  title: z.string().trim().min(1, 'Judul kegiatan tidak boleh kosong'),
  eventType: z.enum(CALENDAR_EVENT_TYPES),
  startAt: z.string().min(1, 'Waktu mulai wajib diisi'),
  endAt: z.string().min(1, 'Waktu selesai wajib diisi'),
  location: z.string().trim().optional().nullable(),
  meetingLink: z.string().url('Tautan rapat harus berupa URL yang valid').optional().nullable().or(z.literal('')),
  agenda: z.string().trim().optional().nullable(),
  divisionId: z.string().uuid().optional().nullable(),
});

export type CreateCalendarEventInput = z.infer<typeof createCalendarEventSchema>;

export const updateCalendarEventSchema = createCalendarEventSchema
  .partial()
  .extend({
    isCancelled: z.boolean().optional(),
  });

export type UpdateCalendarEventInput = z.infer<typeof updateCalendarEventSchema>;

export const updateRsvpSchema = z.object({
  status: z.enum(RSVP_STATUSES, {
    message: 'Status RSVP tidak valid',
  }),
  note: z.string().trim().optional().nullable(),
});

export type UpdateRsvpInput = z.infer<typeof updateRsvpSchema>;
