import { z } from 'zod';

export const LETTER_STATUSES = [
  'draft',
  'reviewed',
  'signed',
  'sent',
  'archived',
] as const;

export type LetterStatus = (typeof LETTER_STATUSES)[number];

export const LETTER_TYPES = ['incoming', 'outgoing'] as const;
export type LetterType = (typeof LETTER_TYPES)[number];

export const letterSchema = z.object({
  id: z.string().uuid(),
  referenceNumber: z.string(),
  type: z.enum(LETTER_TYPES),
  title: z.string().min(1),
  status: z.enum(LETTER_STATUSES),
  divisionCode: z.string(),
  recipient: z.string().min(1),
  date: z.string(),
  fileUrl: z.string().nullable().optional(),
  version: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});

export type Letter = z.infer<typeof letterSchema>;
