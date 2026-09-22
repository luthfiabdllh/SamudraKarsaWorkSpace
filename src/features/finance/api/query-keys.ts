export const financeKeys = {
  all: ['finance'] as const,
  summary: () => [...financeKeys.all, 'summary'] as const,
  budgets: () => [...financeKeys.all, 'budgets'] as const,
  transactions: () => [...financeKeys.all, 'transactions'] as const,
  dues: () => [...financeKeys.all, 'dues'] as const,
};
