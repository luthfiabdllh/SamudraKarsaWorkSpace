import { z } from 'zod';
import { MEETING_TYPES } from '../types';

export const createMeetingSchema = z.object({
  title: z.string().trim().min(1, 'Judul rapat tidak boleh kosong'),
  meetingType: z.enum(MEETING_TYPES, {
    message: 'Jenis rapat tidak valid',
  }),
  heldAt: z.string().min(1, 'Waktu pelaksanaan wajib diisi'),
  locationOrMedia: z.string().trim().optional().nullable(),
  agenda: z.string().trim().optional().nullable(),
  summary: z.string().trim().optional().nullable(),
  divisionId: z.string().uuid().optional().nullable(),
});

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;

export const updateMeetingSchema = createMeetingSchema.partial();

export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;

export const createMeetingDecisionSchema = z.object({
  decisionText: z.string().trim().min(1, 'Keputusan tidak boleh kosong'),
  picId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

export type CreateMeetingDecisionInput = z.infer<typeof createMeetingDecisionSchema>;

export const updateMeetingDecisionSchema = createMeetingDecisionSchema
  .partial()
  .extend({
    status: z.string().optional(),
  });

export type UpdateMeetingDecisionInput = z.infer<typeof updateMeetingDecisionSchema>;
