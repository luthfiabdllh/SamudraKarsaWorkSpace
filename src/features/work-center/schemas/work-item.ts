import { z } from 'zod';
import { WORK_ITEM_PRIORITIES, WORK_ITEM_STATUSES, WORK_ITEM_TYPES } from '../types';

/**
 * Skema formulir pembuatan pekerjaan baru
 */
export const createWorkItemFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Judul pekerjaan minimal 3 karakter.')
    .max(200, 'Judul pekerjaan maksimal 200 karakter.'),
  type: z.enum(WORK_ITEM_TYPES).default('task'),
  description: z.string().trim().max(5000, 'Deskripsi maksimal 5000 karakter.').nullish(),
  priority: z.enum(WORK_ITEM_PRIORITIES).default('medium'),
  divisionId: z.string().uuid('Divisi tidak valid.').nullish(),
  primaryPicId: z.string().uuid('PIC tidak valid.').nullish(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD').nullish().or(z.literal('')),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD').nullish().or(z.literal('')),
  progressPercentage: z.coerce.number().int().min(0).max(100).default(0),
});

export type CreateWorkItemFormValues = z.infer<typeof createWorkItemFormSchema>;

/**
 * Skema transisi status FSM
 */
export const transitionWorkItemSchema = z.object({
  to: z.enum(WORK_ITEM_STATUSES, {
    message: 'Status tujuan tidak valid.',
  }),
  note: z.string().trim().max(1000, 'Catatan maksimal 1000 karakter.').nullish(),
  holdReason: z.string().trim().max(2000, 'Alasan penahanan maksimal 2000 karakter.').nullish(),
  completionSummary: z.string().trim().max(5000, 'Ringkasan penyelesaian maksimal 5000 karakter.').nullish(),
  progressPercentage: z.coerce.number().int().min(0).max(100).optional(),
});

export type TransitionWorkItemValues = z.infer<typeof transitionWorkItemSchema>;

/**
 * Skema penetapan / pelepasan PIC
 */
export const setWorkItemPicSchema = z.object({
  primaryPicId: z.string().uuid('ID PIC tidak valid.').nullable(),
  note: z.string().trim().max(500, 'Catatan maksimal 500 karakter.').nullish(),
});

export type SetWorkItemPicValues = z.infer<typeof setWorkItemPicSchema>;
