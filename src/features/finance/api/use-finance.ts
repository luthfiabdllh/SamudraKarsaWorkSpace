import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { financeKeys } from './query-keys';
import type {
  Budget,
  BudgetDetail,
  BudgetFilterParams,
  BudgetItem,
  DuesFilterParams,
  DuesItem,
  Transaction,
  TransactionFilterParams,
} from '../types';
import type {
  AddDuesPaymentFormValues,
  CreateBudgetItemFormValues,
  CreateBudgetFormValues,
  CreateTransactionFormValues,
  TransitionBudgetFormValues,
} from '../schemas/finance';

/**
 * Mengambil daftar proposal anggaran (RAB)
 */
export function useBudgets(filters?: BudgetFilterParams) {
  return useQuery({
    queryKey: financeKeys.budgetList(filters),
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters?.status) params.status = filters.status;
      if (filters?.divisionId) params.divisionId = filters.divisionId;
      if (filters?.periodId) params.periodId = filters.periodId;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.offset) params.offset = filters.offset;

      const response = await apiClient.get<Budget[]>('/finance/budgets', { params });
      return response.data;
    },
  });
}

/**
 * Mengambil detail proposal anggaran lengkap dengan daftar item rincian
 */
export function useBudgetDetail(id: string | null) {
  return useQuery({
    queryKey: financeKeys.budgetDetail(id ?? ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<BudgetDetail>(`/finance/budgets/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Mengambil daftar transaksi kas operasional
 */
export function useTransactions(filters?: TransactionFilterParams) {
  return useQuery({
    queryKey: financeKeys.transactionList(filters),
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {};
      if (filters?.transactionType) params.transactionType = filters.transactionType;
      if (filters?.budgetId) params.budgetId = filters.budgetId;
      if (filters?.periodId) params.periodId = filters.periodId;
      if (filters?.verified !== undefined) params.verified = filters.verified;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.offset) params.offset = filters.offset;

      const response = await apiClient.get<Transaction[]>('/finance/transactions', { params });
      return response.data;
    },
  });
}

/**
 * Mengambil daftar tagihan iuran anggota
 */
export function useDues(filters?: DuesFilterParams) {
  return useQuery({
    queryKey: financeKeys.duesList(filters),
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters?.status) params.status = filters.status;
      if (filters?.memberId) params.memberId = filters.memberId;
      if (filters?.periodId) params.periodId = filters.periodId;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.cursor) params.cursor = filters.cursor;

      const response = await apiClient.get<DuesItem[]>('/dues', { params });
      return response.data;
    },
  });
}

/**
 * Mutasi pembuatan proposal anggaran baru
 */
export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateBudgetFormValues) => {
      const payload = {
        title: values.title,
        divisionId: values.divisionId || null,
        programId: values.programId || null,
      };

      const response = await apiClient.post<Budget>('/finance/budgets', payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: financeKeys.budgets() });
    },
  });
}

/**
 * Mutasi transisi status alur FSM proposal anggaran
 */
export function useTransitionBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TransitionBudgetFormValues;
    }) => {
      const response = await apiClient.post<Budget>(
        `/finance/budgets/${id}/transitions`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: financeKeys.budgetDetail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: financeKeys.budgets() });
    },
  });
}

/**
 * Mutasi penambahan item / pos kebutuhan anggaran
 */
export function useAddBudgetItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      budgetId,
      data,
    }: {
      budgetId: string;
      data: CreateBudgetItemFormValues;
    }) => {
      const response = await apiClient.post<BudgetItem>(
        `/finance/budgets/${budgetId}/items`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: financeKeys.budgetDetail(variables.budgetId) });
      void queryClient.invalidateQueries({ queryKey: financeKeys.budgets() });
    },
  });
}

/**
 * Mutasi pencatatan mutasi kas operasional baru
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateTransactionFormValues) => {
      const payload = {
        transactionType: values.transactionType,
        category: values.category,
        amount: values.amount,
        transactionDate: values.transactionDate || undefined,
        counterparty: values.counterparty || null,
        paymentMethod: values.paymentMethod || null,
        proofUrl: values.proofUrl || null,
        budgetId: values.budgetId || null,
      };

      const response = await apiClient.post<Transaction>('/finance/transactions', payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: financeKeys.transactions() });
    },
  });
}

/**
 * Mutasi verifikasi transaksi kas oleh bendahara
 */
export function useVerifyTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<Transaction>(
        `/finance/transactions/${id}/verify`,
        {}
      );
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: financeKeys.transactions() });
    },
  });
}

/**
 * Mutasi pencatatan setoran iuran anggota
 */
export function useAddDuesPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      duesId,
      data,
    }: {
      duesId: string;
      data: AddDuesPaymentFormValues;
    }) => {
      const response = await apiClient.post(
        `/dues/${duesId}/payments`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: financeKeys.dues() });
    },
  });
}
