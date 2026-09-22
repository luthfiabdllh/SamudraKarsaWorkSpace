import { z } from 'zod';

/**
 * 9 Status Resmi FSM Persuratan (sesuai backend letter_status)
 */
export const LETTER_STATUSES = [
  'submitted',
  'needs_completion',
  'verified',
  'drafting',
  'review',
  'awaiting_signature',
  'ready_to_send',
  'sent',
  'done',
] as const;

export type LetterStatus = (typeof LETTER_STATUSES)[number];

/**
 * Arah Persuratan: Masuk (Inbound) atau Keluar (Outbound)
 */
export const LETTER_DIRECTIONS = ['inbound', 'outbound'] as const;
export type LetterDirection = (typeof LETTER_DIRECTIONS)[number];

/**
 * Entitas Berkas Surat dalam Tabel / Daftar
 */
export const letterItemSchema = z.object({
  id: z.string().uuid(),
  letterNumber: z.string(),
  letterKind: z.string(),
  direction: z.enum(LETTER_DIRECTIONS),
  subject: z.string().min(1),
  senderRecipient: z.string().nullable().optional(),
  institution: z.string().nullable().optional(),
  letterDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  picId: z.string().uuid().nullable().optional(),
  picName: z.string().nullable().optional(),
  signerName: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  status: z.enum(LETTER_STATUSES),
  version: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type LetterItem = z.infer<typeof letterItemSchema>;

/**
 * Detail Lengkap Berkas Surat
 */
export interface LetterDetail extends LetterItem {
  availableTransitions?: LetterStatus[];
  transitionRequirements?: Record<string, string[]>;
}

/**
 * Parameter Filter Kueri Persuratan
 */
export interface LetterFilterParams {
  status?: LetterStatus;
  direction?: LetterDirection;
  periodId?: string;
  picId?: string;
  limit?: number;
  cursor?: string;
  q?: string;
}
