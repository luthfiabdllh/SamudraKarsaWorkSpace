import type {
  BudgetFilterParams,
  TransactionFilterParams,
  DuesFilterParams,
} from '../types';

export const financeKeys = {
  all: ['finance'] as const,
  summary: () => [...financeKeys.all, 'summary'] as const,
  budgets: () => [...financeKeys.all, 'budgets'] as const,
  budgetList: (filters?: BudgetFilterParams) =>
    [...financeKeys.budgets(), 'list', filters ?? {}] as const,
  budgetDetail: (id: string) =>
    [...financeKeys.budgets(), 'detail', id] as const,
  transactions: () => [...financeKeys.all, 'transactions'] as const,
  transactionList: (filters?: TransactionFilterParams) =>
    [...financeKeys.transactions(), 'list', filters ?? {}] as const,
  dues: () => [...financeKeys.all, 'dues'] as const,
  duesList: (filters?: DuesFilterParams) =>
    [...financeKeys.dues(), 'list', filters ?? {}] as const,
};
