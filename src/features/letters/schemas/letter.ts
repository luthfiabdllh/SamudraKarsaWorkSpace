import { z } from 'zod';
import { LETTER_DIRECTIONS, LETTER_STATUSES } from '../types';

/**
 * Skema formulir registrasi surat masuk / surat keluar baru
 */
export const createLetterSchema = z.object({
  letterKind: z
    .string()
    .trim()
    .min(1, 'Kode jenis surat wajib diisi.')
    .max(20, 'Kode jenis surat maksimal 20 karakter.')
    .default('UND'),
  direction: z.enum(LETTER_DIRECTIONS).default('outbound'),
  subject: z
    .string()
    .trim()
    .min(3, 'Perihal surat minimal 3 karakter.')
    .max(255, 'Perihal surat maksimal 255 karakter.'),
  senderRecipient: z.string().trim().max(200).nullish(),
  institution: z.string().trim().max(200).nullish(),
  signerName: z.string().trim().max(150).nullish(),
  letterDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD.')
    .nullish()
    .or(z.literal('')),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD.')
    .nullish()
    .or(z.literal('')),
  note: z.string().trim().max(2000).nullish(),
});

export type CreateLetterFormValues = z.infer<typeof createLetterSchema>;

/**
 * Skema transisi alur FSM berkas surat
 */
export const transitionLetterSchema = z.object({
  to: z.enum(LETTER_STATUSES, {
    message: 'Status tujuan persuratan tidak valid.',
  }),
  note: z.string().trim().max(1000).nullish(),
});

export type TransitionLetterFormValues = z.infer<typeof transitionLetterSchema>;
