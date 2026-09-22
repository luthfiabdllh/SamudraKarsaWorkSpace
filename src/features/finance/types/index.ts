import { z } from 'zod';

export const BUDGET_STATUSES = [
  'draft',
  'submitted',
  'verified',
  'approved',
  'rejected',
] as const;

export type BudgetStatus = (typeof BUDGET_STATUSES)[number];

export const TRANSACTION_TYPES = ['income', 'expense'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const transactionSchema = z.object({
  id: z.string().uuid(),
  transactionNumber: z.string(),
  type: z.enum(TRANSACTION_TYPES),
  amount: z.number().positive(),
  category: z.string(),
  description: z.string().min(1),
  divisionCode: z.string().nullable().optional(),
  date: z.string(),
  receiptUrl: z.string().nullable().optional(),
  version: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});

export type Transaction = z.infer<typeof transactionSchema>;
