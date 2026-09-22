import { z } from 'zod';
import { REQUEST_PRIORITIES, REQUEST_STATUSES, REQUEST_TYPES } from '../types';

/**
 * Skema formulir pembuatan pengajuan baru lintas divisi
 */
export const createRequestFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Judul pengajuan minimal 3 karakter.')
    .max(200, 'Judul pengajuan maksimal 200 karakter.'),
  type: z.enum(REQUEST_TYPES).default('other'),
  targetDivisionId: z.string().uuid('Divisi tujuan wajib dipilih.'),
  priority: z.enum(REQUEST_PRIORITIES).default('medium'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .nullish()
    .or(z.literal('')),
  description: z.string().trim().max(5000, 'Deskripsi maksimal 5000 karakter.').nullish(),
});

export type CreateRequestFormValues = z.infer<typeof createRequestFormSchema>;

/**
 * Skema transisi status FSM pengajuan
 */
export const transitionRequestSchema = z.object({
  to: z.enum(REQUEST_STATUSES, {
    message: 'Status tujuan tidak valid.',
  }),
  note: z.string().trim().max(1000, 'Catatan maksimal 1000 karakter.').nullish(),
  clarificationNote: z.string().trim().max(2000, 'Catatan klarifikasi maksimal 2000 karakter.').nullish(),
  resultSummary: z.string().trim().max(5000, 'Ringkasan luaran maksimal 5000 karakter.').nullish(),
  holdReason: z.string().trim().max(2000, 'Alasan penahanan maksimal 2000 karakter.').nullish(),
});

export type TransitionRequestValues = z.infer<typeof transitionRequestSchema>;

/**
 * Skema penyelesaian konflik sinkronisasi (sync_conflict_at)
 */
export const resolveSyncConflictSchema = z.object({
  status: z.enum(REQUEST_STATUSES, {
    message: 'Status kesepakatan tidak valid.',
  }),
  note: z
    .string()
    .trim()
    .min(3, 'Alasan resolusi minimal 3 karakter.')
    .max(2000, 'Alasan resolusi maksimal 2000 karakter.'),
  clarificationNote: z.string().trim().max(2000).nullish(),
  resultSummary: z.string().trim().max(5000).nullish(),
  holdReason: z.string().trim().max(2000).nullish(),
});

export type ResolveSyncConflictValues = z.infer<typeof resolveSyncConflictSchema>;
