import { z } from 'zod';

export const REQUEST_STATUSES = [
  'draft',
  'submitted',
  'in_review',
  'approved',
  'rejected',
  'completed',
  'cancelled',
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_CATEGORIES = [
  'dana',
  'logistik',
  'surat',
  'kemitraan',
  'umum',
] as const;

export type RequestCategory = (typeof REQUEST_CATEGORIES)[number];

export const requestSchema = z.object({
  id: z.string().uuid(),
  ticketNumber: z.string(),
  title: z.string().min(1),
  category: z.enum(REQUEST_CATEGORIES),
  status: z.enum(REQUEST_STATUSES),
  divisionCode: z.string(),
  requesterId: z.string().uuid(),
  amount: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  version: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable().optional(),
});

export type RequestItem = z.infer<typeof requestSchema>;

export interface RequestFilterParams {
  category?: RequestCategory;
  status?: RequestStatus;
  divisionCode?: string;
  search?: string;
}
