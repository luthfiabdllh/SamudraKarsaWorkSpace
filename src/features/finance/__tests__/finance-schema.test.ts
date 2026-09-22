import { describe, expect, it } from 'vitest';
import {
  createBudgetSchema,
  createBudgetItemSchema,
  transitionBudgetSchema,
  createTransactionSchema,
  addDuesPaymentSchema,
} from '../schemas/finance';
import {
  BUDGET_STATUSES,
  TRANSACTION_TYPES,
  DUES_STATUSES,
} from '../types';
import { financeKeys } from '../api/query-keys';

describe('Finance Schemas, Types & Query Keys', () => {
  describe('createBudgetSchema', () => {
    it('should validate valid budget proposal', () => {
      const valid = {
        title: 'Rencana Anggaran Survei Maritim 2026',
        divisionId: '0191e4b8-2a00-7000-8000-000000000001',
      };

      const result = createBudgetSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject title shorter than 3 characters', () => {
      const invalid = {
        title: 'AB',
      };

      const result = createBudgetSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('minimal 3 karakter');
      }
    });
  });

  describe('createBudgetItemSchema', () => {
    it('should validate valid budget item', () => {
      const valid = {
        label: 'Sewa perahu motor',
        quantity: '2',
        unit: 'Hari',
        unitPrice: '500000',
        plannedTotal: '1000000',
        sortOrder: 1,
      };

      const result = createBudgetItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject invalid amount format', () => {
      const invalid = {
        label: 'Konsumsi',
        quantity: 'abc',
        plannedTotal: '-500',
      };

      const result = createBudgetItemSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('transitionBudgetSchema', () => {
    it('should validate all 7 budget FSM statuses', () => {
      for (const status of BUDGET_STATUSES) {
        const result = transitionBudgetSchema.safeParse({
          to: status,
          reviewNote: `Catatan untuk status ${status}`,
        });
        expect(result.success).toBe(true);
      }
    });

    it('should reject invalid budget status', () => {
      const invalid = {
        to: 'unknown_budget_status',
      };

      const result = transitionBudgetSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('createTransactionSchema', () => {
    it('should validate income transaction', () => {
      const valid = {
        transactionType: 'income',
        category: 'Sponsor Kegiatan',
        amount: '2500000',
        transactionDate: '2026-07-20',
        counterparty: 'PT Samudra Bahari',
        paymentMethod: 'Transfer Bank',
      };

      const result = createTransactionSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should validate expense transaction', () => {
      const valid = {
        transactionType: 'expense',
        category: 'Konsumsi Panitia',
        amount: '350000',
        counterparty: 'Warung Bu Siti',
      };

      const result = createTransactionSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject missing category', () => {
      const invalid = {
        transactionType: 'expense',
        category: '   ',
        amount: '10000',
      };

      const result = createTransactionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('addDuesPaymentSchema', () => {
    it('should validate valid dues payment', () => {
      const valid = {
        amount: '50000',
        paymentDate: '2026-07-01',
        paymentMethod: 'QRIS',
        note: 'Iuran kas bulan Juli',
      };

      const result = addDuesPaymentSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      const invalid = {
        amount: '50000',
        paymentDate: '01/07/2026',
      };

      const result = addDuesPaymentSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('financeKeys', () => {
    it('should generate consistent query keys hierarchy', () => {
      expect(financeKeys.all).toEqual(['finance']);
      expect(financeKeys.summary()).toEqual(['finance', 'summary']);
      expect(financeKeys.budgets()).toEqual(['finance', 'budgets']);
      expect(financeKeys.budgetList()).toEqual(['finance', 'budgets', 'list', {}]);
      expect(financeKeys.budgetList({ status: 'approved' })).toEqual([
        'finance',
        'budgets',
        'list',
        { status: 'approved' },
      ]);
      expect(financeKeys.budgetDetail('b-1')).toEqual([
        'finance',
        'budgets',
        'detail',
        'b-1',
      ]);
      expect(financeKeys.transactions()).toEqual(['finance', 'transactions']);
      expect(financeKeys.transactionList()).toEqual(['finance', 'transactions', 'list', {}]);
      expect(financeKeys.transactionList({ transactionType: 'income' })).toEqual([
        'finance',
        'transactions',
        'list',
        { transactionType: 'income' },
      ]);
      expect(financeKeys.dues()).toEqual(['finance', 'dues']);
      expect(financeKeys.duesList()).toEqual(['finance', 'dues', 'list', {}]);
      expect(financeKeys.duesList({ status: 'unpaid' })).toEqual([
        'finance',
        'dues',
        'list',
        { status: 'unpaid' },
      ]);
    });
  });

  describe('constants', () => {
    it('should have 7 budget statuses and 3 dues statuses', () => {
      expect(BUDGET_STATUSES.length).toBe(7);
      expect(TRANSACTION_TYPES).toEqual(['income', 'expense']);
      expect(DUES_STATUSES).toEqual(['unpaid', 'installment', 'paid']);
    });
  });
});
