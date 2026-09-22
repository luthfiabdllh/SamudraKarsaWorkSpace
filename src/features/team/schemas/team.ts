import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(1, 'Judul pengumuman tidak boleh kosong'),
  body: z.string().trim().min(1, 'Isi pengumuman tidak boleh kosong'),
  pinned: z.boolean().default(false),
  divisionId: z.string().uuid().optional().nullable(),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

export const createFeedbackSchema = z.object({
  message: z.string().trim().min(1, 'Pesan aspirasi atau evaluasi tidak boleh kosong'),
  visibility: z.enum(['anonymous', 'named']).default('named'),
  category: z.string().trim().optional(),
  targetNote: z.string().trim().optional().nullable(),
  isPrivate: z.boolean().default(false),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
