import { z } from 'zod';
import { BUDGET_STATUSES, TRANSACTION_TYPES } from '../types';

const angkaPositif = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, 'Harus berupa angka nominal valid (contoh: 50000).');

/**
 * Skema formulir pembuatan proposal anggaran (RAB) baru
 */
export const createBudgetSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Judul proposal anggaran minimal 3 karakter.')
    .max(200, 'Judul proposal anggaran maksimal 200 karakter.'),
  divisionId: z.string().uuid('Divisi tidak valid.').nullish().or(z.literal('')),
  programId: z.string().uuid('Program tidak valid.').nullish().or(z.literal('')),
});

export type CreateBudgetFormValues = z.infer<typeof createBudgetSchema>;

/**
 * Skema penambahan pos rincian anggaran (budget item)
 */
export const createBudgetItemSchema = z.object({
  label: z.string().trim().min(2, 'Uraian pos anggaran minimal 2 karakter.'),
  quantity: angkaPositif.default('1'),
  unit: z.string().trim().max(30).nullish(),
  unitPrice: angkaPositif.default('0'),
  plannedTotal: angkaPositif,
  sortOrder: z.number().int().default(0),
});

export type CreateBudgetItemFormValues = z.infer<typeof createBudgetItemSchema>;

/**
 * Skema transisi alur FSM proposal anggaran
 */
export const transitionBudgetSchema = z.object({
  to: z.enum(BUDGET_STATUSES, {
    message: 'Status tujuan anggaran tidak valid.',
  }),
  reviewNote: z.string().trim().max(1000).nullish(),
});

export type TransitionBudgetFormValues = z.infer<typeof transitionBudgetSchema>;

/**
 * Skema pencatatan transaksi mutasi kas baru
 */
export const createTransactionSchema = z.object({
  transactionType: z.enum(TRANSACTION_TYPES),
  category: z.string().trim().min(2, 'Kategori mutasi minimal 2 karakter.'),
  amount: angkaPositif,
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD.')
    .nullish()
    .or(z.literal('')),
  counterparty: z.string().trim().max(150).nullish(),
  paymentMethod: z.string().trim().max(50).nullish(),
  proofUrl: z.string().trim().url('Format URL bukti tidak valid.').nullish().or(z.literal('')),
  budgetId: z.string().uuid().nullish().or(z.literal('')),
});

export type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>;

/**
 * Skema pencatatan pembayaran iuran anggota
 */
export const addDuesPaymentSchema = z.object({
  amount: angkaPositif,
  paymentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD.'),
  paymentMethod: z.string().trim().max(50).nullish(),
  proofUrl: z.string().trim().url('Format URL bukti tidak valid.').nullish().or(z.literal('')),
  note: z.string().trim().max(500).nullish(),
});

export type AddDuesPaymentFormValues = z.infer<typeof addDuesPaymentSchema>;
